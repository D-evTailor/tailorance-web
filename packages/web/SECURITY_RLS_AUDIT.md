# Informe de auditoría de seguridad – RLS y acceso a datos

**Fecha:** 2026-02-17  
**Alcance:** Next.js (App Router) + Supabase – acceso a datos, RLS, service_role, formularios y endpoints.  
**Auditor:** Principal Security Engineer (auditoría automatizada).

---

## 1. Resumen ejecutivo

- El proyecto **no usa el cliente Supabase JS** (`createClient`/`createServerClient`): toda la integración con Supabase es vía **fetch** a la REST API con **SUPABASE_SERVICE_ROLE_KEY** en un único Route Handler.
- Existe **una sola superficie de escritura a Supabase**: `POST /api/talks/questionnaire`, que inserta en la tabla `talks_questionnaire_responses` sin comprobación de sesión ni de tenant. El diseño es de **formulario público** (cuestionario de charlas).
- **No hay migraciones Supabase en el repositorio**: el estado de RLS y políticas debe comprobarse en el Dashboard o con SQL (se incluye query en el informe).
- **No hay modelo multi-tenant en código**: no se encontraron `tenant_id`, `org_id` ni `academy_id`. Si en el futuro se añaden tenants, habrá que introducir filtros y políticas RLS.
- **Riesgos principales**: (1) uso de **service_role** en un endpoint público sin rate limiting (abuso/spam/DoS de datos); (2) **exposición de la service_role** solo en servidor (correcto), pero sin defensas adicionales; (3) **RLS desconocido** en `talks_questionnaire_responses` (si está desactivado, la service_role podría usarse para más de lo necesario).
- El formulario de **contacto** no toca Supabase; envía a `NEXT_PUBLIC_API_URL/api/email` (servicio externo).
- Un **script local** (`packages/web/scripts/generate-questionnaire-report.mjs`) usa service_role para **leer** todas las respuestas del cuestionario; está fuera del árbol versionado (scripts locales), por lo que no es superficie de ataque desplegada.
- **Recomendación prioritaria**: verificar RLS en `talks_questionnaire_responses`, restringir políticas al mínimo necesario, añadir rate limiting y (opcional) CAPTCHA en el endpoint público; documentar el uso de service_role y preparar un patrón para futuros endpoints con tenant/sesión.

---

## 2. Configuración y llaves (Tarea 0)

### 2.1 Archivos de configuración y variables de entorno

| Ubicación | Contenido relevante | Notas |
|-----------|---------------------|--------|
| `packages/web/.env.local.example` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | No aparece `NEXT_PUBLIC_SUPABASE_ANON_KEY` → no hay cliente anon en front. |
| `packages/web/.env.local` | (no leído; puede contener valores reales) | Debe estar en `.gitignore` (ya ignorado). |
| `packages/mail-service/.env.example` | `MAILERSEND_API_TOKEN` | Servicio de email; no Supabase. |
| `supabase/config.toml` | **No encontrado** en el repositorio. | Configuración de Supabase, si existe, está fuera del repo. |
| `supabase/migrations/**` | **No encontrado** en el repositorio. | No hay migraciones versionadas; RLS/políticas no auditable desde código. |

### 2.2 Dónde se crea el cliente Supabase y uso de keys

No se usa `@supabase/supabase-js` (no hay `createClient` ni `createServerClient`). La conexión a Supabase se hace con **fetch** y cabeceras:

| Lugar | Tipo de key | Runtime | Riesgo |
|-------|-------------|---------|--------|
| `packages/web/app/api/talks/questionnaire/route.ts` (líneas 36–37, 44–49) | `SUPABASE_SERVICE_ROLE_KEY` | Server (Route Handler) | Key solo en servidor (correcto). Riesgo: endpoint público sin auth ni rate limit. |
| `packages/web/scripts/generate-questionnaire-report.mjs` (líneas 476–478, 359–376) | `SUPABASE_SERVICE_ROLE_KEY` | Local (Node script, no desplegado) | Uso legítimo para informes; script no está en rutas desplegadas. |

- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: no referenciada en el código; no hay uso de anon en cliente.
- **Authorization: Bearer**: solo en el Route Handler, con `supabaseServiceRoleKey` (service_role).

---

## 3. Inventario de accesos a base de datos (Tarea 1)

### 3.1 Por archivo, tabla, operación y runtime

| Archivo | Tabla / Recurso | Operación | Runtime |
|---------|-----------------|-----------|---------|
| `packages/web/app/api/talks/questionnaire/route.ts` | `talks_questionnaire_responses` (REST `/rest/v1/talks_questionnaire_responses`) | **INSERT** (POST) | Route Handler (server) |
| `packages/web/scripts/generate-questionnaire-report.mjs` | `talks_questionnaire_responses` (REST con `select`, paginado) | **SELECT** (GET) | Script Node local (no desplegado) |

No se encontraron en el código:

- `.from(`, `.rpc(`, `.storage.`, `.channel(` (no se usa el SDK de Supabase).
- Otras tablas, RPC, Storage ni Realtime en el repo.

### 3.2 Resumen

- **Escritura a Supabase**: solo desde `POST /api/talks/questionnaire` → INSERT en `talks_questionnaire_responses` con service_role.
- **Lectura**: solo en el script local de informes (service_role); ningún endpoint de la app expone lectura de Supabase.

---

## 4. Formularios y endpoints de escritura (Tarea 2)

### 4.1 Formularios identificados

| Página / componente | Destino | Autenticación | Validación |
|--------------------|---------|---------------|------------|
| `packages/web/app/talks/cuestionario/otorrinolaringologia/page.tsx` | `POST /api/talks/questionnaire` | Ninguna (público) | Client: validación local + schema implícito; Server: Zod en route. |
| `packages/web/app/contacto/page.tsx` | `POST ${NEXT_PUBLIC_API_URL}/api/email` | Ninguna (público) | react-hook-form; no toca Supabase. |

### 4.2 Endpoint de escritura a Supabase: POST /api/talks/questionnaire

- **¿Puede ser llamado por usuario no autenticado?** Sí. No hay middleware ni comprobación de sesión.
- **Validación**: Zod (`requestSchema`) sobre body: `specialty` (enum otorrinolaringologia | hematologia), `answers` con campos obligatorios.
- **Key usada**: service_role (solo servidor).
- **¿Impone `tenant_id` en servidor?** No. No existe `tenant_id` en el payload ni en el esquema; el insert es `{ specialty, answers }`.
- **Hallazgos**:
  - **Escritura sin auth**: intencional (cuestionario público), pero sin rate limiting ni CAPTCHA → riesgo de spam/abuso y posible DoS por volumen de inserts.
  - **Sin tenant**: coherente con ausencia de multi-tenant en el modelo actual.
  - **Service_role sin autorización adicional**: el endpoint es “abierto” para quien conozca la URL; la única restricción es el esquema Zod. Si en el futuro se añaden más tablas o operaciones con la misma key, cualquier fuga de lógica podría escalar privilegios.

No se encontraron Server Actions (`"use server"`) en el repositorio que accedan a Supabase.

---

## 5. Riesgos específicos RLS (Tarea 3)

### 5.1 Tablas con RLS disabled / políticas (3.1)

- **Migraciones**: no hay `supabase/migrations` en el repo. No se puede afirmar desde código si RLS está activo ni qué políticas existen.
- **Acción recomendada**: ejecutar en Supabase (SQL o Dashboard) la siguiente consulta para listar estado de RLS y políticas:

```sql
SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       (SELECT count(*) FROM pg_policies p WHERE p.tablename = c.relname) AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;
```

Para la tabla en uso:

```sql
SELECT * FROM pg_policies WHERE tablename = 'talks_questionnaire_responses';
```

- **Tabla conocida**: `talks_questionnaire_responses`.
  - **RLS**: desconocido (no encontrado en repo). Debe verificarse en Dashboard.
  - **Políticas**: no encontradas en código. Si RLS está **disabled**, cualquier cliente con service_role puede leer/escribir toda la tabla (en la app solo se usa desde el Route Handler para INSERT y desde el script local para SELECT).
  - **Riesgo**: si en el futuro se expone un endpoint que use la misma key y no filtre por RLS o por tenant, podría haber fuga de datos. Hoy el riesgo es limitado porque la única escritura es este endpoint controlado y la lectura es solo script local.

### 5.2 Lecturas sin filtro tenant (3.2)

- En el **Route Handler** no hay lecturas; solo INSERT con `specialty` y `answers`. No hay `tenant_id` en el modelo actual.
- El **script local** hace SELECT con filtro opcional por `specialty` (query param); no hay tenant en el esquema. Para un modelo futuro multi-tenant, ese script debería filtrar por tenant si se añade la columna.
- **Conclusión**: no hay lecturas expuestas en la app; no hay filtro tenant porque no hay tenant en el diseño actual. Cuando se introduzca multi-tenant, todas las lecturas (y el script) deben filtrar por tenant en servidor.

### 5.3 Service role bypass (3.3)

- **Uso de service_role**:
  - **Route Handler** `POST /api/talks/questionnaire`: usa service_role para INSERT. No hay comprobación de sesión ni de tenant; el diseño es “cualquiera puede enviar un cuestionario”.
  - **Script local**: usa service_role para SELECT; no es superficie de ataque desplegada.
- **¿Auth previa?** No en el endpoint.
- **¿Check de pertenencia tenant?** No aplica (sin tenant).
- **¿Se limita a la operación necesaria?** Sí: solo INSERT en una tabla. El riesgo es abuso (spam/DoS), no bypass de RLS por otro endpoint.

---

## 6. Storage, Realtime y RPC (Tarea 4)

- **Storage**: no se encontraron referencias a `storage` ni buckets en el código.
- **Realtime**: no se encontraron `.channel(`, suscripciones ni canales.
- **RPC**: no se encontraron llamadas a `.rpc(` ni funciones Postgres invocadas desde la app.

Si se añaden más adelante, aplicar: buckets con políticas por tenant/rol, Realtime con filtros por `tenant_id`/auth, y revisar funciones SECURITY DEFINER y permisos.

---

## 7. Matriz de severidad y ranking (Tarea 5)

| # | Hallazgo | Severidad | Impacto | Probabilidad | Archivo / ruta | Fix recomendado |
|---|----------|-----------|---------|--------------|----------------|------------------|
| 1 | Endpoint público de escritura sin rate limiting | **HIGH** | DoS/spam, intoxicación de datos | Alta | `app/api/talks/questionnaire/route.ts` | Rate limit por IP y/o por fingerprint; opcional CAPTCHA. |
| 2 | RLS y políticas de `talks_questionnaire_responses` no verificables en repo | **MED** | Posible sobreexposición si RLS está off o políticas son amplias | Media | Supabase Dashboard / SQL | Verificar RLS habilitado; política INSERT solo para service_role o anon restringido; SELECT solo service_role o roles admin. |
| 3 | Uso de service_role en endpoint público sin auth | **MED** | Diseño actual aceptable para “solo INSERT”; riesgo si se reutiliza patrón para más tablas | Media | `app/api/talks/questionnaire/route.ts` | Mantener uso de service_role solo en servidor; no exponer más operaciones sin auth/tenant; documentar patrón. |
| 4 | No hay migraciones Supabase en repo | **LOW** | RLS y esquema no versionados; difícil auditoría y rollback | Baja | N/A | Añadir `supabase/migrations` y versionar RLS y políticas. |
| 5 | Posible exposición de detalles de error (Supabase) en 500 | **LOW** | Fuga de detalles internos | Baja | `route.ts` líneas 55–59 | No devolver `details` de Supabase al cliente; loguear en servidor. |

---

## 8. Ejemplos de explotación (solo descriptivos)

- **Abuso del cuestionario**: Un atacante podría enviar muchas peticiones `POST /api/talks/questionnaire` con payloads válidos (p. ej. con scripts). Sin rate limiting, esto llenaría la tabla, degradaría rendimiento y podría intoxicar análisis (ej. informes locales). No hay cross-tenant ni PII de otros usuarios en el diseño actual; el impacto es disponibilidad e integridad de datos del cuestionario.
- **Comprobación de RLS**: Si RLS estuviera desactivado en `talks_questionnaire_responses` y en el futuro se expusiera un endpoint que use la misma service_role para hacer SELECT (p. ej. por error), se podrían listar todas las respuestas. Hoy no existe ese endpoint en la app; el único SELECT es el script local.

---

## 9. Parches propuestos (Tarea 6)

### 9.1 Rate limiting en el Route Handler (recomendado)

Ejemplo con límite por IP (adaptar a tu stack; p. ej. Upstash Redis o en-memory para una instancia):

```ts
// app/api/talks/questionnaire/route.ts - ejemplo conceptual
import { NextResponse } from "next/server";
// import { rateLimit } from "@/lib/rate-limit"; // implementar o usar librería

const LIMIT = 10; // p. ej. 10 envíos por IP por ventana
const WINDOW_MS = 60_000;

// En POST: antes de llamar a Supabase
// const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
// const { success } = await rateLimit(ip, LIMIT, WINDOW_MS);
// if (!success) return NextResponse.json({ error: "Demasiados envíos" }, { status: 429 });
```

### 9.2 No exponer detalles de Supabase en errores

```ts
// En el catch de response.ok (líneas 54-60)
if (!response.ok) {
  const details = await response.text();
  // Log interno únicamente
  console.error("[questionnaire] Supabase error:", details);
  return NextResponse.json(
    { error: "No se pudo guardar el cuestionario." },
    { status: 500 },
  );
}
```

### 9.3 Políticas RLS sugeridas para `talks_questionnaire_responses`

Comprobar primero en Dashboard si RLS está habilitado. Si no:

```sql
ALTER TABLE talks_questionnaire_responses ENABLE ROW LEVEL SECURITY;
```

Ejemplo de políticas (ajustar roles si usas anon para algo):

- Permitir INSERT solo desde backend (service_role no está afectado por RLS; esto restringe a anon si en el futuro se usa):

```sql
-- Si en el futuro se usa anon para este insert:
-- CREATE POLICY "allow_anon_insert_questionnaire"
--   ON talks_questionnaire_responses FOR INSERT
--   TO anon
--   WITH CHECK (true);  -- restringir más si hay columnas sensibles
```

- Asegurar que SELECT/UPDATE/DELETE no estén permitidos para `anon`:

```sql
-- No crear política de SELECT/UPDATE/DELETE para anon.
-- Solo service_role (o roles admin) deben poder leer/modificar.
```

Para un futuro modelo **multi-tenant** con `tenant_id`:

```sql
-- Ejemplo cuando exista tenant_id:
-- CREATE POLICY "tenant_isolation"
--   ON talks_questionnaire_responses
--   USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');
```

### 9.4 Patrón “requireSessionAndTenant” (para futuros endpoints)

Cuando haya sesión y tenant (p. ej. Supabase Auth + claim `tenant_id`):

```ts
// lib/auth.ts - ejemplo
export async function requireSessionAndTenant(request: Request) {
  const session = await getServerSession(); // implementar con createServerClient
  if (!session) return { error: "Unauthorized", status: 401 } as const;
  const tenantId = session.user?.user_metadata?.tenant_id;
  if (!tenantId) return { error: "Forbidden", status: 403 } as const;
  return { session, tenantId };
}
// En route: const auth = await requireSessionAndTenant(request); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
```

Y en todas las queries que lean o escriban datos por tenant, usar siempre `tenantId` del servidor, nunca del body ni de query params.

---

## 10. Entregables y apéndice

### 10.1 Inventario de tablas/endpoints/queries

- **Tabla**: `talks_questionnaire_responses`.  
  - Operaciones en app: INSERT vía `POST /api/talks/questionnaire`.  
  - Lectura: solo script local `generate-questionnaire-report.mjs`.

- **Endpoints**:
  - `POST /api/talks/questionnaire`: único punto que escribe en Supabase; body validado con Zod; service_role en servidor; sin auth ni rate limit.

- **Queries**: ninguna SELECT en la aplicación desplegada; una INSERT vía REST en el Route Handler.

### 10.2 Documentos generados

1. **SECURITY_RLS_AUDIT.md** (este documento): informe completo de auditoría.
2. **SECURITY_FIX_PLAN.md**: plan de hardening por fases y checklist.

### 10.3 PRs sugeridas

- **PR-1 (Hotfix)**: Rate limiting en `POST /api/talks/questionnaire` + no devolver detalles de error de Supabase al cliente.
- **PR-2 (Refactor)**: Verificar y documentar RLS en `talks_questionnaire_responses`; si aplica, añadir migraciones al repo con políticas mínimas.
- **PR-3 (Hardening)**: Añadir `supabase/migrations` al repo, documentar uso de service_role, y (opcional) CAPTCHA o honeypot en el formulario del cuestionario; preparar patrón `requireSessionAndTenant` para futuros endpoints con tenant.

---

*Fin del informe de auditoría.*
