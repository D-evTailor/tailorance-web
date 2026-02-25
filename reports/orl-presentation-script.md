# Guion de presentacion: IA para ORL — Hospital Virgen Macarena

**Duracion:** 20 minutos
**Audiencia:** 15 medicos ORL (40% residentes, 40% especialistas >15 anos, 20% otros)
**Dato clave:** 87% ya usa ChatGPT de forma habitual

---

## BLOQUE 1: Introduccion — "Vuestras necesidades" (0:00 – 2:00)

### Objetivo
Conectar con la audiencia mostrando que hemos escuchado sus respuestas. Generar curiosidad.

### Guion

> "Antes de arrancar, mil gracias a los que hicisteis hueco para rellenar el cuestionario. Vuestras respuestas nos han dado la radiografía exacta de lo que más duele hoy en el servicio."

**[SLIDE: Dashboard en vivo o captura]**

> "Fijaos en esta foto de vuestro día a día:"

Mostrar 3 datos clave (rapido, sin detenerse mucho):

1. **"El 87% ya usais ChatGPT de forma habitual"** — No partimos de cero. Esto no es una charla de "que es la IA", sino de como sacarle mas partido.
2. **"Vuestro mayor dolor: datos, estadistica y tablas (47%)"** — Casi la mitad teneis un problema con los numeros. Lo vamos a resolver hoy.
3. **"Lo que mas quereis aprender: como hablar con la IA para obtener resultados fiables (60%)"** — Perfecto, porque eso es exactamente la Demo 1.

> "En definitiva, no vengo a daros una clase teórica. Esta sesión está construida sobre vuestras respuestas, con el objetivo de aliviar vuestra carga de trabajo diaria. Vamos al grano."

### Notas tecnicas
- Abrir el dashboard real en `/talks/dashboard` (PIN: configurado en .env)
- Tener una captura de pantalla como backup por si falla la conexion
- Tiempo maximo: 2 minutos. Es una introduccion, no un analisis

---

## BLOQUE 2: Por que hay que usar IA (2:00 – 5:00)

### Objetivo
Dar contexto cientifico. No es una moda: hay evidencia de que mejora productividad y calidad.

### Guion

> "Sé que estamos todos saturados de escuchar que la IA va a revolucionar el mundo. Y no es verdad, la IA ya lo ha revolucionado y estamos en medio. Ahora os muestro datos reales de lo que está pasando en los hospitales. ¿Qué dice realmente la evidencia sobre nosotros, los médicos?"

**[SLIDE: Datos de impacto clínico]**

Presentar datos clave y contundentes de estudios médicos recientes:

1. **Redacción clínica ultrarrápida:** En servicios quirúrgicos intensivos (como ortopedia), la IA redujo el tiempo de las notas de evolución de **más de 2 minutos a solo 27 segundos**. Los informes de alta cayeron de **casi 8 minutos a menos de 2**. Y lo más fascinante: la calidad objetiva del documento aumentó.
2. **Resúmenes automáticos de historias clínicas:** Un estudio en Holanda demostró que lo que a un médico experimentado le llevaba **7 minutos** en resumir, el LLM integrado lo hacía en **15 segundos**, sin perder un ápice de precisión clínica.
3. **El matiz crítico (el riesgo real):** Pero cuidado, no es magia. En oncología se detectó que cerca del 7% de los borradores automáticos a pacientes podían implicar potenciales errores de seguridad si se enviaban sin leer. **La IA os ahorrará horas, pero si quitáis las manos del volante, habrá accidentes.**

> "El patrón está clarísimo: para todo lo que sea burocracia, recuento y repetición documental estructurada, la IA tritura los tiempos. Pero para el matiz clínico decisivo, vuestra revisión es innegociable. Y la IA no solo aumenta nuestra productividad, aumenta la calidad de nuestro trabajo."

**[SLIDE: Evolución en la adopción médica]**

4. **El contexto actual:** Hoy, 1 de cada 4 médicos en Europa ya la usa en consulta clínica real. Y como vimos en la encuesta, el 87% de vosotros ya integráis herramientas como ChatGPT en vuestro día a día.

> "Sabemos que muchos ya estáis usando IA habitualmente e incluso a un alto nivel. El objetivo de hoy no es enseñaros desde cero, sino compartir nuestra forma de aplicarlo como expertos, resolver vuestras dudas y mostraros flujos de trabajo avanzados para que le saquéis todavía más rendimiento."

### Fuente
- `reports/orl-GenAI-impact-productivity-and-quality-deep-research-report.md`

### Notas
- No leer los numeros: presentarlos en slides con graficos simples
- Enfatizar que los beneficios son mayores en perfiles junior y tareas repetitivas (conecta con los residentes)
- Maximo 3 minutos. No convertir esto en una clase magistral

---

## BLOQUE 3: Demo 1 — Prompting fiable (5:00 – 9:00)

### Objetivo
Demostrar que la calidad del prompt determina la calidad de la respuesta. Es la skill #1 que pidieron (60%).

### Setup
- Herramienta: **Google AI Studio** (Gemini) — ya probado
- Dos ventanas del navegador preparadas, una al lado de la otra
- Alternativa: tener los resultados en las capturas si no hay conexion

### Guion

> "6 de cada 10 nos dijisteis: 'Vale, todo muy bonito, pero ¿cómo le hablo a esto para que no se invente las cosas?'. Esa es la habilidad número uno de esta década. Vamos a verlo."

**[PANTALLA: Dos ventanas lado a lado]**

> "Vuestro día a día: varón de 45 años, otalgia unilateral izquierda de 3 semanas. Cero otorrea, cero fiebre, otoscopia limpia, pero se queja al masticar. Fijaos en la abismal diferencia entre tirarle el caso a la IA de cualquier forma, frente a darle órdenes precisas."

**Prompt pobre (ventana izquierda):**
```
Tengo un paciente varon de 45 anos que acude a consulta
con otalgia unilateral izquierda de 3 semanas de evolucion,
sin otorrea ni fiebre. Otoscopia normal, pero refiere dolor
al masticar. Sin antecedentes de interes.
```

> "En este primer ejemplo, disparo la duda sin contexto. Cero estructura y sin decirle quién soy."

**Resultado:** Texto correcto pero generico. Diagnistico diferencial basico sin estructura. Manejo tipo "libro de texto". Util pero no optimizado para la consulta.

**Prompt de calidad (ventana derecha):**
```
Soy otorrinolaringologo en un hospital publico. Tengo un
paciente varon de 45 anos que acude a consulta con otalgia
unilateral izquierda de 3 semanas de evolucion, sin otorrea
ni fiebre. Otoscopia normal, pero refiere dolor al masticar.
Sin antecedentes de interes.

Necesito:
1. Diagnostico diferencial estructurado (mas probable -> menos probable)
2. Pruebas complementarias que solicitarias para discriminar
3. Senales de alarma ("red flags") que descartarias antes de dar el alta

Formato: tabla con columnas [Diagnostico | A favor | En contra | Siguiente paso]
```

**Resultado:** Tabla estructurada con 6 diagnosticos ordenados por probabilidad (TTM, dental, salivar, neuralgia, neoplasia, arteritis). Cada uno con a favor / en contra / siguiente paso. Red flags detalladas. Conducta sugerida.

> "Misma herramienta, idéntico paciente. La distancia entre perder el tiempo leyendo un refrito inútil de texto o recibir una súper tabla de diagnósticos y 'red flags' lista para aplicar... ha sido simplemente vuestra manera de pedirlo. El famoso *prompt.*"

### Reglas de prompting para llevar a casa

**[SLIDE: 4 reglas de oro]**

1. **Contexto profesional:** "Soy otorrino en hospital publico" — la IA adapta el nivel y el lenguaje
2. **Estructura de la peticion:** Numera lo que necesitas (1, 2, 3...)
3. **Formato de salida:** Pide tabla, lista, checklist — lo que te sea mas util
4. **Restricciones:** "Maximo 1 pagina", "Solo guias SEORL 2024", "Tono para un R1"

> "Si nos os acordáis de nada más al salir por la puerta, que sea esto: dejad de hablar con la IA como si fuera Alexa. Habladle como a un residente listísimo pero que hoy es su primer día en vuestro servicio, y os hará maravillas."

**[SLIDE: El súper poder para los "prompts"]**

💡 **Pro Tip: Deja que la IA haga el trabajo por ti**
> "Y aquí va un truco experto: ¿No sabéis cómo sacar el prompt perfecto para vuestra duda? No os estanquéis. **Pedidle a la IA que lo invente por vosotros.** Podéis decirle: *'Actúa como experto en ingeniería de prompts. Hazme tú las preguntas que necesites para crear el prompt perfecto sobre un paciente con vértigo'.* La propia IA os guiará en el proceso."

### Archivos de referencia
- `reports/orl - Demo A - Caso paciente ORL - prompt calidad.md`
- `reports/orl - Demo A - Caso paciente ORL - prompt pobre.md`

---

## BLOQUE 4: Demo 2 — Analisis de datos/tablas con IA (9:00 – 13:00)

### Objetivo
Resolver el dolor #1 (47%): datos, estadistica y tablas. Mostrar que la IA puede hacer en 30 segundos lo que les lleva horas en Excel.

### Setup
- CSV preparado: `reports/demo-amigdalectomias-orl.csv` (50 filas, 25 bisturi electrico + 25 coblator)
- **Opcion A (perfil investigador):** Gemini 3.1 Preview → genera codigo R-Studio completo
- **Opcion B (impacto visual rapido):** Google AI Studio Built → genera web app interactiva
- Prompts completos en: `reports/orl-demo2-prompts.md`
- Tener precargado el resultado de una de las opciones como backup

### Guion

> "Llegamos a vuestro mayor quebradero de cabeza orgánico. Casi la mitad confesasteis que cruzar datos, tablas de Excel y estadística son vuestro agujero negro de productividad. Os voy a enseñar cómo finiquitar ese problema."

**[PANTALLA: CSV abierto — columnas visibles]**

> "Mirad este Excel. 50 amigdalectomías ficticias. Mitad operados con bisturí eléctrico, mitad con coblator. Las variables de siempre: edad, dolor, sangrado, tiempos, complicaciones..."

> "Si vais a un congreso y tenéis que exprimir esto, es rogarle tiempo a un compañero o pelearos durante semanas. Hoy, vamos a decirle a la IA que analice, cruce datos y genere estadística inferencial y de regresión completa. Lo que haríais en SPSS en tres días, lo tenemos en 30 segundos."

**Subir el CSV y ejecutar el prompt (elegir segun audiencia):**

**Opcion A — Generar codigo R (si hay investigadores/residentes):**

> "Para los perfiles investigadores: le exijo un script inmaculado de R directo para ejecutar."

(Usar prompt 1 de `orl-demo2-prompts.md`)

**Opcion B — Generar web app (si se busca impacto visual):**

> "Si sois de visual: le pido que pase este Excel aburrido a una web interactiva llena de gráficos lista para proyectar."

(Usar prompt 2 de `orl-demo2-prompts.md`)

**Mientras la IA trabaja, explicar:**

> "El truco sigue intacto: no le lanzo solo el Excel pidiendo 'analiza'. Le explico mi perfil profesional y le ordeno las regresiones y tests estadísticos concretos que quiero buscar, y cómo quiero mis gráficos."

**Mostrar resultados:**

> "¡Magia clínica! En medio minuto nos devuelve variables cruzadas, 'p-valores', intervalos de confianza y gráficos etiquetados. Mismo rigor, cero horas perdidas."

**Senalar los hallazgos clave que la IA va a encontrar:**

> "Incluso nos resalta verbalmente en conclusiones que con coblator se reduce significativamente el dolor, y que edad y técnica son los predictores determinantes a la semana postop. Todo esto se copia, se pega y nos vamos al congreso."

### Mensajes clave

> "Grabaos tres conceptos clave para que no os pillen:
>
> 1. **Cero datos reales en abierto.** Jamás subáis el número de historia de un paciente a estas web. Anonimizad siempre los Excel previamente.
> 2. **Supervisión de la estadística.** Los cálculos pueden patinar. En publicaciones de peso, aseguraos de que un metodólogo os corrobora las fórmulas finales.
> 3. **Potencial infinito.** Cualquier contabilidad tediosa, listado de pacientes o encuesta, podéis pedirle un dashboard o que aplique el test que consideréis. El límite de análisis es nulo."

### Material necesario
- CSV: `reports/demo-amigdalectomias-orl.csv`
- Prompts: `reports/orl-demo2-prompts.md`
- Tener precargado el resultado de uno de los prompts como backup por si falla la conexion

---

## BLOQUE 5: Demo 3 — Automatizar documentos (13:00 – 17:00)

### Objetivo
Mostrar que la IA puede generar documentos clinicos estructurados de alta calidad si le das contexto suficiente.

### Setup
- Herramienta: **Google AI Studio** (Gemini) — ya probado
- Dos ventanas preparadas

### Guion

> "El 40% indicasteis que pelearos frente a la página en blanco generando informes recurrentes consume vuestra energía táctica por completo. Vamos a aniquilar el síndrome del papel en blanco."

**Caso: Protocolo de amigdalectomia**

> "Nos cae el marrón de la gerencia médica: redactad hoy mismo un protocolo completo para el servicio desde cero."

**Prompt pobre:**
```
Hazme un protocolo de amigdalectomia
```

**Resultado:** Protocolo generico, tipo Wikipedia. Correcto pero no adaptado al servicio. Sin criterios Paradise actualizados, sin checklist para R1, sin indicadores de calidad. Inutilizable tal cual.

**Prompt de calidad:**
```
Necesito redactar un protocolo clinico de amigdalectomia
para nuestro servicio de ORL. El documento debe seguir la
estructura estandar de protocolos de nuestro hospital:

Contexto: Hospital publico de nivel 3, servicio con 6
otorrinos y 6 residentes. Realizamos ~120 amigdalectomias/ano,
mayoritariamente pediatricas.

Estructura requerida:
1. Objetivo y alcance
2. Indicaciones (segun criterios Paradise + guias SEORL 2024)
3. Contraindicaciones
4. Evaluacion preoperatoria (checklist)
5. Tecnica quirurgica (describir las 2 tecnicas que usamos:
   diseccion fria y coblation)
6. Cuidados postoperatorios (incluir protocolo de dolor)
7. Criterios de alta y seguimiento
8. Indicadores de calidad

Tono: formal, conciso, orientado a que un R1 pueda
consultarlo como referencia rapida. Extension: max 3 paginas.
```

**Resultado:** Protocolo completo y profesional. Criterios Paradise con cifras, checklist preoperatorio con casillas, dos tecnicas descritas paso a paso, protocolo analgesico con alertas (codeina contraindicada en <12 anos), KPIs de calidad con objetivos numericos.

> "Ahí lo tenéis en vivo. Criterios Paradise, contraindicaciones bien matizadas, alertas por analgésico según edades e indicadores concretos de seguimiento. Hemos saltado del 0 al 80% del trabajo de un plumazo. Ahora ajustad vuestros matices, pero ya lo habéis resuelto."

### Archivos de referencia
- `reports/orl - Demo C - protocolo - prompt calidad.md`
- `reports/orl - Demo C - protocolo - prompt pobre.md`

### Bonus rapido (si queda tiempo): Demo B — Busqueda de articulos

> "Y una perla final para los que hagáis doctorados o papers: usad IA especializadas en busquedas tipo *Consensus* con citación científica directa o DOIs reales."

Mostrar brevemente la diferencia entre buscar "vertigo" vs. pedir una estrategia PubMed con MeSH terms para una revision sistematica de VPPB en >65 anos. Consensus devuelve articulos concretos con DOI y nivel de evidencia.

- `reports/orl - Demo B - Search articles - prompt calidad.md`
- `reports/orl - Demo B - Search articles - prompt pobre.md`

---

## BLOQUE 6: Kit de herramientas + recursos (17:00 – 19:00)

### Objetivo
Dejarles herramientas concretas que puedan usar manana. No abrumar: 5-6 herramientas clave.

### Guion

> "Mi objetivo hoy no era que pensaseis 'qué charla tan interesante', sino soltaros en vuestra mano las herramientas para que mañana lleguéis antes a casa a cenar. Aquí tenéis el atajo."

**[SLIDE: Tabla de herramientas o QR a landing page]**

| Herramienta | Para que | Gratis? | Datos de pacientes? |
|-------------|----------|---------|---------------------|
| **ChatGPT** | Prompting general, borradores, brainstorming | Freemium (GPT-4o gratis) | NO subir PHI |
| **Claude** | Analisis de datos, documentos largos, artifacts | Freemium | NO subir PHI |
| **Consensus** | Busqueda de papers con evidencia y DOI | Freemium | N/A (no usa datos clinicos) |
| **Google AI Studio** | Experimentar con Gemini, adjuntar PDFs | Gratis | NO subir PHI |
| **Gamma** | Crear presentaciones en minutos | Freemium | N/A |
| **NotebookLM** | Analizar multiples fuentes, generar resumenes | Gratis | NO subir PHI |

> "Repetimos mandato de supervivencia: Si algo es gratis, tú eres el producto empresarial. Las plataformas públicas no están ahí para blindaros, **bajo ningún concepto subáis datos reales e identificativos** a una caja del buscador general de la IA sin supervisión."

**[SLIDE: QR code]**

> "Aqui teneis un QR con todos los recursos, los prompts de hoy y enlaces a las herramientas."

### Notas
- El QR puede apuntar a una landing page del proyecto o a un documento compartido
- La tabla de herramientas completa esta en `reports/orl - Herramientas de IA para Medicos y Especialistas Hospitalarios.xlsx`
- Seleccionar solo las 5-6 mas relevantes para no abrumar

---

## BLOQUE 7: Q&A (19:00 – 20:00)

### Guion

> "Abrimos micrófonos para alguna duda urgente por la sala. Me quedaré por aquí con vosotros para comentar dudas clínicas de integración."

### Preguntas frecuentes preparadas (por si no preguntan)

> "Por supuesto. Se olvida de detalles, se lía negando síntomas y a veces, alucina un cuadro que no tiene pies ni cabeza. El copiloto prepara todo fácil, rápido y estructurado, pero sois vosotos los que agarráis los mandos y dais viabilidad clínica."

**"Puedo usar esto para mi tesis?"**
> "Para explorar datos, generar borradores y buscar papers: si. Para el texto final publicado: revisad todo y no copieis literalmente. Las revistas estan empezando a pedir declaracion de uso de IA."

**"Que pasa con la privacidad?"**
> "Regla simple: nunca datos reales de pacientes en herramientas comerciales. Anonimizad primero. Si el hospital implementa una solucion integrada en el EHR con cumplimiento RGPD, eso cambia — pero hoy por hoy, la responsabilidad es vuestra."

---

## MATERIAL DE APOYO

### Archivos generados

| Archivo | Contenido |
|---------|-----------|
| `orl-report.md` | Informe completo del cuestionario (15 respuestas ORL) |
| `orl-GenAI-impact-productivity-and-quality-deep-research-report.md` | Deep Research: estudios IA + productividad |
| `orl - Herramientas de IA para Medicos y Especialistas Hospitalarios.xlsx` | Tabla completa de herramientas IA |
| `orl - Demo A - Caso paciente ORL - prompt calidad.md` | Demo A: prompt de calidad (caso clinico) |
| `orl - Demo A - Caso paciente ORL - prompt pobre.md` | Demo A: prompt pobre (caso clinico) |
| `orl - Demo B - Search articles - prompt calidad.md` | Demo B: prompt de calidad (investigacion) |
| `orl - Demo B - Search articles - prompt pobre.md` | Demo B: prompt pobre (investigacion) |
| `orl - Demo C - protocolo - prompt calidad.md` | Demo C: prompt de calidad (protocolo) |
| `orl - Demo C - protocolo - prompt pobre.md` | Demo C: prompt pobre (protocolo) |
| `demo-amigdalectomias-orl.csv` | CSV ficticio 50 amigdalectomias para Demo 2 |

### Pendiente de generar

- [x] CSV ficticio de amigdalectomias (50 filas) para Demo 2 → `demo-amigdalectomias-orl.csv`
- [ ] Landing page o documento con QR para el kit de herramientas
- [ ] Slides de la presentacion

---

## TIMING RESUMEN

| Min | Bloque | Duracion |
|-----|--------|----------|
| 0:00 – 2:00 | Introduccion: "Vuestras necesidades" | 2 min |
| 2:00 – 5:00 | Por que usar IA: datos y estudios | 3 min |
| 5:00 – 9:00 | Demo 1: Prompting (pobre vs calidad) | 4 min |
| 9:00 – 13:00 | Demo 2: Analisis de datos/tablas | 4 min |
| 13:00 – 17:00 | Demo 3: Automatizar documentos | 4 min |
| 17:00 – 19:00 | Kit de herramientas + QR | 2 min |
| 19:00 – 20:00 | Q&A rapido | 1 min |
| **Total** | | **20 min** |

### Consejos de timing
- Si una demo se alarga, acortar Demo 3 (tener el resultado precargado)
- Demo 1 (prompting) es la mas demandada: protegerla
- Demo 2 (datos) es el mayor dolor: no saltarla
- Demo B (investigacion/Consensus) es bonus: solo si queda tiempo en Demo 3
