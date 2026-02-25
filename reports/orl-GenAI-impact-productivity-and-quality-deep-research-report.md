# Impacto de la IA generativa en productividad y calidad del trabajo profesional y del trabajo clínico médico

## Metodología y marco de interpretación

Este informe sintetiza evidencia publicada (o disponible como “author manuscript” en repositorios biomédicos) entre 2024 y febrero de 2026, priorizando estudios revisados por pares y revisiones sistemáticas/scoping reviews, y añadiendo algunos trabajos “landmark” (frecuentemente citados en sanidad) aunque sean anteriores o estén en formato working paper cuando el propio campo los usa como referencia conceptual. citeturn19view0turn10view0turn10view1

Para “productividad” y “calidad” en tareas clínicas, los estudios recientes tienden a operacionalizar (a) **tiempo** (p. ej., *time-in-note* en EHR, tiempo de redacción por nota, o métricas de auditoría/acciones en bandejas de mensajes) y (b) **calidad textual/clinico-documental** mediante escalas validadas o rúbricas ad hoc (p. ej., PDQI-9; o escalas Likert para completitud, corrección, concisión y utilidad clínica). citeturn8view0turn3view1turn12view3

Al interpretar resultados, es importante distinguir:  
- **“AI draft”** (borrador generado) vs **“AI-assisted”** (borrador editado por clínico), porque varios estudios muestran que el paso de edición humana puede mejorar aspectos como concisión/estilo, pero también puede recortar información (pérdidas de completitud), y porque el borrador sin supervisión puede contener riesgos clínicos. citeturn12view3turn15view0  
- **Integración e implementación** (integrado en EHR, uso “ambient” con audio, modelo on-premise vs nube, entrenamiento/guías internas), que condicionan tanto el ahorro de tiempo como el perfil de riesgos. citeturn12view1turn12view4turn7view0

## Evidencia fuera de la medicina: productividad, heterogeneidad y “trade-offs” de calidad

La literatura “generalista” en trabajos de oficina/conocimiento es relevante para sanidad porque anticipa un patrón que aparece también en medicina: **ganancias medias** con **heterogeneidad** (beneficia más a perfiles menos experimentados) y posibilidad de **degradación puntual de calidad** en tareas fuera del “frente” donde el modelo rinde bien.

En un estudio a gran escala en atención al cliente publicado en entity["organization","The Quarterly Journal of Economics","economics journal"] (2025), el despliegue de un asistente conversacional basado en GPT-3 (de entity["company","OpenAI","ai company, san francisco"]) aumentó la productividad media medida como incidencias resueltas por hora en **~15%**, con fuertes diferencias: los trabajadores menos experimentados/mejorables ganaron más y mejoraron tanto velocidad como calidad, mientras que los trabajadores de mayor desempeño mostraron **pequeñas caídas de calidad** pese a mejoras mínimas de velocidad. citeturn10view0

Un “landmark” muy citado sobre escritura profesional (estudio preregistrado con profesionales universitarios) halló que el acceso a un LLM redujo el tiempo medio de ejecución en **~40%** y elevó la calidad en **~18%** en tareas de redacción profesional de nivel medio. citeturn10view1

Estos resultados suelen enmarcarse en la idea de “frontera tecnológica irregular” (las mejoras dependen del tipo de tarea) y en la advertencia de que la colaboración humano‑IA puede fallar si se usa fuera de su zona de competencia. Esto se discute explícitamente en la revisión del propio estudio del QJE, que cita evidencias en consultoría donde la IA mejora respuestas en algunas tareas pero puede empeorar en otras fuera de sus capacidades. citeturn10view0

Para sanidad, la traslación más útil no es “cuánto ahorra siempre”, sino **qué tareas** (p. ej., síntesis estructurada, borradores, normalización de estilo) y **qué perfiles** (p. ej., residentes o clínicos con más carga documental) capturan más beneficio. Ese mismo gradiente (beneficio mayor con uso más intensivo y en ciertos subgrupos) aparece en ensayos clínicos recientes con “AI scribes” y documentación asistida. citeturn8view0turn3view3

## Productividad en documentación clínica: ensayos y estudios comparativos médicos

La evidencia 2024–2026 en médicos se concentra en tres zonas: (a) **scribes “ambient”** (captura de conversación y generación automática del borrador), (b) **asistentes para notas/altas** (borradores de notas de alta y documentación de urgencias), y (c) **resúmenes/síntesis EHR** (resúmenes para consulta o continuidad asistencial).

En un ensayo pragmático aleatorizado de 3 brazos en entity["local_business","UCLA Health","Los Angeles, CA, US"] (nov 2024–ene 2025), se compararon dos “ambient AI scribes” frente a control. El brazo con Nabla mostró una reducción relativa de **9,5%** en *time-in-note* frente a control (y diferencias también frente a la otra herramienta), mientras que el otro scribe no mostró una reducción significativa frente a control. En términos absolutos, el *time-in-note* bajó más en el brazo Nabla que en control. Además, se observaron mejoras modestas en escalas asociadas a entorno de trabajo/estrés. citeturn8view0

image_group{"layout":"carousel","aspect_ratio":"16:9","query":["ambient AI scribe doctor patient conversation recording","physician electronic health record documentation typing","medical dictation speech recognition clinician note"],"num_per_query":1}

En un entorno **simulado** de planta hospitalaria (ortopedia) con médicos junior, un estudio cuantificó reducciones muy marcadas de tiempo: las notas de evolución pasaron de una mediana de **128 s** (manual) a **27 s** (con scribe ambient), y los informes de alta de **459 s** a **114 s**. Además, la calidad documental medida con PDQI-9 mejoró (notas más completas/útiles, y altas mejor organizadas/sintetizadas) sin evidencia de empeora de precisión en esa simulación. citeturn3view1

Para documentación de urgencias, un estudio de efectividad comparativa en un hospital terciario de Corea del Sur evaluó un asistente de notas de alta: las notas **LLM‑assisted** (médico editando el borrador) tuvieron mejores puntuaciones en completitud, corrección, concisión y utilidad clínica que las manuales, y el tiempo mediano de escritura descendió de **69,5 s** a **32,0 s** por nota. El mismo trabajo aporta un matiz importante: los borradores automáticos (LLM drafts) podían puntuar incluso más alto en completitud/corrección que la versión editada, sugiriendo que la edición humana puede “recortar” información (a cambio, típicamente, de concisión/adecuación). citeturn12view3

En síntesis EHR para preparación clínica, un estudio de no‑inferioridad en un gran hospital académico neerlandés comparó resúmenes escritos por médicos vs resúmenes generados por un LLM integrado en EHR. Los resúmenes del LLM fueron **no inferiores** en completitud y corrección, aunque menos concisos, y se reportó un salto de eficiencia muy grande: médicos emplearon alrededor de **7 min** por resumen, mientras que el LLM generó el resumen en **~15,7 s**; además, se informó preferencia por el resumen LLM en una mayoría de evaluaciones y confianza comparable. citeturn6search0

En perioperatorio, un ensayo cruzado aleatorizado (residentes en clínica preoperatoria) evaluó un sistema basado en LLM para soporte y estandarización. El resultado principal no mostró reducción significativa de tiempo total de documentación, pero sí **ahorro** en subgrupos (pacientes de complejidad moderada y médicos más experimentados), y preferencia de evaluadores por documentación asistida en más de la mitad de casos; el estudio también modeló ahorro institucional anual bajo ciertos supuestos. Esto es clave porque muestra que **no siempre** hay ahorro inmediato, incluso cuando hay señales de mejora de contenido o estandarización. citeturn3view3

En conjunto, una scoping review (2026) sobre LLMs en documentación clínica (41 estudios, hasta agosto 2025) concluye que la evidencia se concentra en generación de notas, altas y documentación de encuentro, con informes de mejoras de eficiencia y legibilidad; algunos trabajos reportan hasta **~40%** de ahorro de tiempo, pero con preocupaciones recurrentes sobre inexactitudes/hallucinations y rendimiento peor en casos complejos. citeturn19view0

## Tareas administrativas y comunicación: bandeja de entrada, portal de paciente y gestión de mensajes

La carga administrativa no es solo “nota clínica”: una parte creciente es mensajería asíncrona (EHR inbox/patient portal). Aquí, la evidencia 2024–2025 es especialmente rica y muestra una realidad menos “lineal”: **adopción y alivio percibido** pueden aparecer sin reducción inmediata de tiempo.

En un estudio de mejora de calidad (5 semanas) en entity["local_business","Stanford Health Care","Stanford, CA, US"], se desplegó un LLM integrado en EHR para redactar borradores de respuesta a mensajes de pacientes. La tasa media de uso del borrador fue **20%**. Hubo mejoras significativas en medidas derivadas de carga y agotamiento, pero **no** se observó cambio en tiempos de acción/escritura/lectura del periodo piloto frente al periodo previo. citeturn12view1

En otro estudio prospectivo observacional en hospital académico no anglófono (14 especialidades), se evaluaron 919 mensajes respondidos por 100 médicos: la adopción del borrador fue **58%**, y en una parte sustancial de respuestas se reutilizó una gran fracción del texto sugerido; aun así, el tiempo total por respuesta no fue significativamente diferente entre usar borrador vs empezar en blanco (en las condiciones medidas), lo que sugiere curva de aprendizaje/edición y límites de la automatización “solo texto”. citeturn12view4turn12view5

Un análisis más “conductual” de trazas de uso (audit logs) en mensajería clínica encontró que, comparando mensajes similares, los mensajes completados **sin** usar borrador requerían **~6,76%** más tiempo, sugiriendo que, una vez superada cierta fase de adopción y ajuste, puede aparecer un ahorro medible aunque sea moderado. citeturn12view2

Un punto crítico de seguridad emerge cuando se mide el borrador sin editar. En un estudio en oncología (mensajes simulados, radioterapia) en entity["local_business","Brigham and Women's Hospital","Boston, MA, US"] y el entity["local_business","Dana-Farber Cancer Institute","Boston, MA, US"], los clínicos percibieron que los borradores del LLM podían implicar riesgo de daño severo en **~7,1%** de evaluaciones y riesgo de muerte en **~0,6%** si se enviaran sin corrección; a la vez, informaron mejora de “eficiencia subjetiva” en **~76,9%** de casos al editar sobre un borrador. El estudio también documenta cambios en el contenido: los borradores tendían a aportar más educación/autocuidado/planes de contingencia y menos instrucciones directas de acción clínica (p. ej., acudir urgentemente), y discute el riesgo de sesgo de automatización/“anchoring” cuando el clínico edita sobre el marco propuesto por el modelo. citeturn15view0

## Calidad, errores y “hallucination risk” en flujos clínicos con LLMs

La pregunta central no es solo “si ahorra tiempo”, sino **qué pasa con la calidad clínica** y cómo se manifiestan los errores.

En el ensayo aleatorizado de scribes en UCLA, los participantes reportaron inexactitudes clínicamente significativas de forma “ocasional” y sesgo “raro”. En el análisis cualitativo, los problemas más reportados fueron **omisiones**, problemas estructurales/formato, errores de pronombres (p. ej., género), y errores de afirmación/negación (un tipo de fallo especialmente relevante clínicamente). Esta evidencia es importante porque, aunque el impacto medio en *time-in-note* fue modesto, el estudio ya captura que los fallos dominantes no son “fantasía creativa”, sino **omisiones y errores semánticos finos** con potencial de riesgo. citeturn8view3turn8view2

En documentación de urgencias, el estudio del asistente de nota de alta aporta dos señales: (a) mejora global de calidad de la nota editada por médico frente a manual, pero (b) el hecho de que los borradores automáticos puntuaran más alto en completitud/corrección que la versión final editada, lo que sugiere un **trade-off** real entre “capturar todo” vs “dejar solo lo esencial” y pone el foco en diseñar interfaces/guardrails para que la edición humana no elimine información crítica. citeturn12view3

La mensajería a pacientes muestra un perfil de riesgo diferente: el texto está más cerca de “consejo” y manejo de expectativas/acuidad, y el estudio en oncología encontró que el daño potencial se asociaba más a **no reconocer o comunicar bien la urgencia** que a errores de conocimiento biomédico “de examen”. Esto implica que las evaluaciones basadas en preguntas tipo test o benchmarks académicos son insuficientes como proxy de seguridad en producción. citeturn15view0

En escritura científica/biomédica (manuscritos), los riesgos se materializan como **calidad de reporte** y **alucinación factual**. Un estudio (2024) evaluó abstracts generados por modelos (y comparó con abstracts originales siguiendo CONSORT‑A): los abstracts originales superaron de forma clara a los generados, aunque algunos outputs fueron percibidos como más “legibles”. Además, se reportaron tasas de alucinación distintas por versión del modelo y casos en que el modelo generó abstracts de un estudio no relacionado. citeturn18view2

En un estudio experimental con investigadores que preparaban abstracts para un congreso (2025), el texto generado por el modelo no fue el mejor en calidad por sí mismo, pero ayudó a producir una versión final mejor cuando el equipo humano incorporó sugerencias; aun así, los participantes identificaron errores menores y mayores en los textos generados por el modelo, reforzando la necesidad de verificación humana. citeturn18view3

## Adopción en médicos, barreras y condiciones de implementación

Las cifras de adopción dependen mucho de país, especialidad, acceso institucional y de si se mide “uso semanal”, “uso en práctica clínica” o “uso de una herramienta específica”. Aun así, 2024–2025 aportan señales coherentes: **uso creciente**, **pocas guías** y **brecha de formación**.

En una encuesta a médicos de atención primaria del entity["country","United Kingdom","country"] (enero 2025), **25%** reportó usar IA generativa en práctica clínica; entre quienes la usan para tareas clínicas, se describen usos en documentación post‑consulta, diagnóstico diferencial, opciones de tratamiento y derivaciones, y la mayoría percibió reducción de carga laboral. Pero, simultáneamente, **95%** reportó no tener formación profesional en el uso de estas herramientas, y la mayoría indicó que su empleador no lo fomentaba explícitamente (sin prohibirlo). citeturn3view7

En una encuesta nacional a clínicos en entity["country","Switzerland","country"] (2025), **32,8%** reportó uso frecuente (al menos semanal) de LLMs, pero solo **6%** indicó que existían guías internas en el lugar de trabajo y solo **3,6%** dijo haber usado un “medical LLM” específico. El análisis cualitativo identificó oportunidades (soporte administrativo, ayuda analítica, acceso a información) y riesgos (degradación de habilidades clínicas, baja calidad de salida, preocupaciones legales/éticas). citeturn7view0

A nivel organizativo, un estudio en entity["organization","JAMA Network Open","medical journal"] (2025) reportó que más de la mitad de los hospitales de entity["country","United States","country"] indicarían que implementarían IA generativa integrada en el EHR a finales de 2025, señalando una ola de adopción institucional más allá del “shadow use” individual. citeturn2search1

En paralelo, medidas de “uso de IA” a nivel sectorial/empresarial muestran que sanidad puede ir por detrás de otros sectores productivos, lo que encaja con barreras regulatorias, riesgos de privacidad e integración con sistemas legacy. citeturn2search5

Los estudios cualitativos ayudan a entender por qué la adopción real no es automática: en entrevistas a médicos que probaron scribes “ambient”, se identificaron facilitadores como facilidad de uso/edición y una valoración positiva del impacto en carga cognitiva y conciliación; pero también barreras prácticas (pacientes no angloparlantes, ausencia de dispositivos compatibles) y críticas sobre longitud de las notas y necesidad de edición. citeturn3view6

## Evidencia en especialidades quirúrgicas y en ORL

En especialidades quirúrgicas, la evidencia reciente es especialmente pertinente porque combina (a) entornos con alta carga documental (perioperatorio, altas, rondas) y (b) riesgo clínico alto si se documenta mal.

En perioperatorio, el ensayo cruzado del asistente basado en LLM (PEACH) sugiere que el beneficio puede ser **selectivo**: no reduce tiempo global, pero puede ayudar en pacientes de complejidad moderada o con clínicos más experimentados y mejorar elementos específicos del contenido (p. ej., listas de problemas), además de ofrecer una lógica económica potencial. citeturn3view3

En ortopedia hospitalaria, el estudio simulado de scribe “ambient” muestra grandes reducciones de tiempo y mejora de calidad (PDQI‑9) tanto en notas de evolución como en altas, lo que es muy relevante para servicios quirúrgicos con rondas intensivas. citeturn3view1

Más cerca de “cirugía documental”, un trabajo de 2026 sobre generación de notas de alta con modelos afinados en datos de cirugía de mama y tiroides afirma mejoras en métricas de calidad (p. ej., BERTScore/ROUGE‑L) y reducción de tiempo de creación, presentado como prueba de concepto dentro de un dominio quirúrgico acotado. citeturn3view5

En ORL (otorrinolaringología), la mayor parte de la literatura 2024–2026 que aparece con fuerza es de **evaluación de capacidad diagnóstica/razonamiento** más que de medición de productividad en EHR. Por ejemplo, un estudio en *Laryngoscope* (2024) se presenta como la primera comparación de LLMs populares en capacidad diagnóstica en otorrinolaringología. citeturn0search29 La línea 2026 incluye también trabajos que comparan rendimiento de LLMs con médicos en escenarios ORL comunes y de alta agudeza (diagnóstico, manejo y derivación). citeturn0search11

Otro subcampo frecuente en ORL es el rendimiento en preguntas de examen o conocimiento especializado, útil para entender límites cognitivos del modelo pero indirecto para productividad real de consulta. citeturn0search22

La “laguna” práctica, por tanto, es que todavía hay poca evidencia publicada que mida, específicamente en ORL, **minutos ahorrados** en documentación real (informes quirúrgicos, notas postoperatorias, cartas de alta) con comparación IA vs no‑IA; en cambio, sí hay señales sólidas (desde urgencias, perioperatorio y entornos hospitalarios quirúrgicos) de que los mayores beneficios aparecen donde hay estructura, repetición y alto volumen documental. citeturn12view3turn3view3turn3view1

## Conclusiones integradas: “qué funciona”, “cuándo” y “a qué coste”

La mejor evidencia 2024–2026 sugiere que los LLMs pueden generar **ahorros de tiempo reales** en documentación clínica (desde reducciones modestas en *time-in-note* hasta recortes sustanciales en tareas muy estructuradas como notas de alta o resúmenes), pero con una alta dependencia de integración y del tipo de tarea. citeturn8view0turn12view3turn6search0turn19view0

En calidad, el patrón dominante es que la IA puede aumentar completitud/estructura y producir borradores “ricos”, pero el sistema humano‑máquina introduce nuevos riesgos: **omisiones**, errores semánticos finos (negación), sesgo de automatización/“anchoring” y, en mensajería al paciente, fallos de “acuidad” que pueden ser clínicamente peligrosos si el borrador no se corrige. citeturn8view3turn15view0turn12view3

La adopción está creciendo, pero se observa una brecha recurrente de **formación y guías internas**, lo que es especialmente relevante porque los beneficios dependen de uso competente, revisión crítica y límites claros (qué tareas sí, cuáles no, y cómo documentar/atribuir). citeturn3view7turn7view0turn12view1
map