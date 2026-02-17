# Plan de hardening – RLS y acceso a datos

**Fecha:** 2026-02-17  
**Referencia:** SECURITY_RLS_AUDIT.md  

Este documento es un checklist por fases para aplicar las recomendaciones de la auditoría. Cada ítem puede asociarse a un PR o a una tarea en tu gestor de proyectos.

---

## Fase 1: Hotfix (hoy / esta semana)

Objetivo: reducir riesgo de abuso del endpoint público y no filtrar detalles internos en respuestas de error.

| # | Tarea | Responsable | Estado |
|---|--------|-------------|--------|
| 1.1 | Implementar rate limiting en `POST /api/talks/questionnaire` (por IP o por header identificador; p. ej. 10 req/min por IP). | Dev | ☐ |
| 1.2 | Devolver en 500 solo mensaje genérico ("No se pudo guardar el cuestionario"); loguear el cuerpo de error de Supabase solo en servidor. | Dev | ☐ |
| 1.3 | (Opcional) Añadir cabecera `X-Content-Type-Options: nosniff` y revisar que no se expongan stack traces en producción. | Dev | ☐ |

**Entregable:** PR-1 (Hotfix) con los cambios anteriores; revisión y merge; desplegar.

---

## Fase 2: Verificación RLS y políticas (refactor)

Objetivo: conocer y documentar el estado de RLS en Supabase y dejar preparado el repo para versionar políticas.

| # | Tarea | Responsable | Estado |
|---|--------|-------------|--------|
| 2.1 | Ejecutar en el proyecto Supabase la query de listado de RLS (ver SECURITY_RLS_AUDIT.md § 5.1) y guardar resultado (p. ej. en docs o en comentario del PR). | Dev / Ops | ☐ |
| 2.2 | Para `talks_questionnaire_responses`: confirmar que RLS está **ENABLED**; si no, habilitarlo y definir política mínima (p. ej. INSERT permitido solo vía service_role; anon sin SELECT/UPDATE/DELETE). | Dev / Ops | ☐ |
| 2.3 | Documentar en el repo (README o docs) qué tablas usan Supabase, si RLS está activo y qué políticas se aplican (o enlace al Dashboard). | Dev | ☐ |
| 2.4 | Si el equipo decide versionar esquema: crear carpeta `supabase/migrations` y una migración inicial que refleje RLS y políticas actuales (o las deseadas). | Dev | ☐ |

**Entregable:** PR-2 (Refactor) con documentación y, si aplica, migración inicial.

---

## Fase 3: Hardening y preparación multi-tenant

Objetivo: endurecer defensas y preparar el código para un posible modelo multi-tenant sin inventar requisitos que aún no existan.

| # | Tarea | Responsable | Estado |
|---|--------|-------------|--------|
| 3.1 | Añadir a la documentación interna (o ADR) el patrón de uso de **service_role**: solo en Route Handlers/Server Actions, nunca en cliente; solo para operaciones concretas y documentadas. | Dev | ☐ |
| 3.2 | (Opcional) Añadir CAPTCHA o honeypot al formulario del cuestionario para mitigar bots. | Dev | ☐ |
| 3.3 | Cuando se introduzca multi-tenant: crear utilidad `requireSessionAndTenant` (o equivalente) y usarla en todos los endpoints que lean/escriban datos por tenant; **nunca** confiar en `tenant_id` llegado desde el cliente. | Dev | ☐ |
| 3.4 | Cuando existan más tablas con tenant: definir políticas RLS por tenant (p. ej. `tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'`) y documentar en migraciones. | Dev | ☐ |
| 3.5 | Revisar que las variables `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_URL` no se expongan en builds de cliente (Next.js las trata como server-only si no llevan `NEXT_PUBLIC_`). | Dev | ☐ |

**Entregable:** PR-3 (Hardening) con documentación y, si aplica, cambios en formulario y preparación de utilidades para tenant.

---

## Checklist rápido por PR

### PR-1: Hotfix
- [ ] Rate limit en `app/api/talks/questionnaire/route.ts`
- [ ] Respuesta 500 sin detalles de Supabase; log en servidor
- [ ] Tests o comprobación manual del límite (p. ej. 11ª petición → 429)

### PR-2: Refactor RLS
- [ ] Query RLS ejecutada y resultado documentado
- [ ] RLS habilitado en `talks_questionnaire_responses` (si no lo estaba)
- [ ] Políticas mínimas documentadas o en migración
- [ ] README/docs actualizados con estado de RLS

### PR-3: Hardening
- [ ] Documentación del patrón service_role
- [ ] (Opcional) CAPTCHA/honeypot en formulario cuestionario
- [ ] (Cuando exista tenant) Utilidad `requireSessionAndTenant` y uso en endpoints afectados

---

## Lista de PRs sugeridas (resumen)

| PR | Título sugerido | Alcance |
|----|------------------|---------|
| PR-1 | fix(security): rate limit y ocultar detalles de error en POST /api/talks/questionnaire | Fase 1 – Hotfix |
| PR-2 | chore(security): verificar y documentar RLS en talks_questionnaire_responses | Fase 2 – Refactor |
| PR-3 | docs(security): hardening service_role y preparación multi-tenant | Fase 3 – Hardening |

---

*Actualizar este plan cuando se cierren ítems o se añadan nuevas fases.*
