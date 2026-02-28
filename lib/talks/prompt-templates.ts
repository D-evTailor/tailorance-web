// ---------------------------------------------------------------------------
// Prompt template definitions for the "Generador de Prompts" tool.
// Each template mirrors one of the live demos from the ORL talk and contains
// the field schema, example values, and the function that assembles the final
// prompt text from the user's input.
// ---------------------------------------------------------------------------

export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox-group";
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | string[];
  exampleValue?: string | string[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  fields: TemplateField[];
  buildPrompt: (values: Record<string, string | string[]>) => string;
  exampleOutput: string;
}

// ---------------------------------------------------------------------------
// Template A — Clinical case analysis (Demo A from the talk)
// ---------------------------------------------------------------------------

const clinicalCaseTemplate: PromptTemplate = {
  id: "caso-clinico",
  title: "Caso clínico",
  subtitle: "Diagnóstico diferencial y plan de acción",
  description:
    "Presenta un caso clínico y obtén un diagnóstico diferencial estructurado, pruebas complementarias y señales de alarma. Ideal para consulta diaria y sesiones clínicas.",
  icon: "stethoscope",
  color: "ainure",
  fields: [
    {
      id: "especialidad",
      label: "Tu especialidad y contexto",
      type: "text",
      placeholder: "Ej: Soy otorrinolaringólogo en un hospital público",
      helpText:
        "Dile a la IA quién eres. Adaptará el nivel técnico y las recomendaciones a tu perfil.",
      required: true,
      exampleValue: "Soy otorrinolaringólogo en un hospital público",
    },
    {
      id: "paciente",
      label: "Datos del paciente",
      type: "text",
      placeholder: "Ej: Varón de 45 años, sin antecedentes de interés",
      helpText: "Sexo, edad y antecedentes relevantes.",
      required: true,
      exampleValue: "Varón de 45 años, sin antecedentes de interés",
    },
    {
      id: "cuadro",
      label: "Cuadro clínico",
      type: "textarea",
      placeholder:
        "Ej: Otalgia unilateral izquierda de 3 semanas de evolución, sin otorrea ni fiebre. Otoscopia normal, pero refiere dolor al masticar.",
      helpText:
        "Describe el motivo de consulta, tiempo de evolución, exploración y hallazgos. Cuanto más contexto, mejor respuesta.",
      required: true,
      exampleValue:
        "Otalgia unilateral izquierda de 3 semanas de evolución, sin otorrea ni fiebre. Otoscopia normal, pero refiere dolor al masticar.",
    },
    {
      id: "peticiones",
      label: "¿Qué necesitas?",
      type: "checkbox-group",
      helpText:
        "Numerar lo que necesitas es clave: la IA estructura mejor su respuesta.",
      required: true,
      options: [
        {
          value: "ddx",
          label: "Diagnóstico diferencial (de más a menos probable)",
        },
        { value: "pruebas", label: "Pruebas complementarias para discriminar" },
        {
          value: "redflags",
          label: 'Señales de alarma ("red flags") antes de dar el alta',
        },
        { value: "conducta", label: "Conducta sugerida / plan de acción" },
        { value: "referencias", label: "Referencias bibliográficas de apoyo" },
      ],
      defaultValue: ["ddx", "pruebas", "redflags"],
      exampleValue: ["ddx", "pruebas", "redflags"],
    },
    {
      id: "formato",
      label: "Formato de salida",
      type: "select",
      helpText:
        "Pedir un formato concreto transforma una respuesta genérica en algo directamente utilizable.",
      options: [
        {
          value: "tabla",
          label:
            "Tabla: [Diagnóstico | A favor | En contra | Siguiente paso]",
        },
        { value: "lista", label: "Lista numerada por probabilidad" },
        { value: "checklist", label: "Checklist para consulta rápida" },
        { value: "libre", label: "Texto libre (sin formato específico)" },
      ],
      defaultValue: "tabla",
      exampleValue: "tabla",
    },
    {
      id: "restricciones",
      label: "Restricciones adicionales (opcional)",
      type: "text",
      placeholder:
        'Ej: Máximo 1 página, solo guías SEORL 2024, tono para un R1',
      helpText:
        "Acota la respuesta: extensión, fuentes, tono, idioma, nivel del destinatario…",
      exampleValue: "",
    },
  ],

  buildPrompt(v) {
    const especialidad = (v.especialidad as string).trim();
    const paciente = (v.paciente as string).trim();
    const cuadro = (v.cuadro as string).trim();
    const peticiones = (v.peticiones as string[]) || [];
    const restricciones = (v.restricciones as string)?.trim();

    const peticionMap: Record<string, string> = {
      ddx: "Diagnóstico diferencial completo, ordenado de más probable a menos probable. Para cada diagnóstico justifica por qué sube o baja en la lista con los datos concretos del caso (no con criterios genéricos de libro).",
      pruebas: "Pruebas complementarias escalonadas para discriminar entre los diagnósticos anteriores. Separa las que puedo hacer en consulta ahora mismo de las que requieren solicitud (imagen, laboratorio). Indica qué resultado esperarías en cada escenario diagnóstico.",
      redflags: 'Señales de alarma ("red flags") que debo buscar activamente y descartar antes de dar el alta. Para cada una, indica qué patología grave sugiere y qué hacer si la encuentro.',
      conducta: "Conducta sugerida y plan de acción paso a paso: tratamiento inicial, derivaciones necesarias, plazo de seguimiento y criterios para escalar.",
      referencias: "Referencias bibliográficas de apoyo: cita guías clínicas actualizadas o consensos de sociedades científicas relevantes. Solo cita documentos reales que conozcas con certeza; si no estás seguro de una referencia, indícalo.",
    };

    const formatoMap: Record<string, string> = {
      tabla: "Presenta el diagnóstico diferencial como tabla con columnas: [Diagnóstico | A favor (datos de ESTE paciente) | En contra | Siguiente paso concreto].",
      lista: "Presenta el diagnóstico diferencial como lista numerada por probabilidad, con justificación breve para cada entrada.",
      checklist: "Presenta la información como checklist accionable que pueda usar directamente en consulta.",
      libre: "",
    };

    const peticionesText = peticiones
      .map((p, i) => `${i + 1}. ${peticionMap[p] || p}`)
      .join("\n");

    const formato = formatoMap[(v.formato as string) || "tabla"];

    const lines = [
      `Actúa como un médico especialista experimentado. ${especialidad}. Tu objetivo es ayudarme a razonar sobre un caso clínico real de mi consulta con rigor, precisión y enfoque práctico.`,
      "",
      "## Caso clínico",
      "",
      `Paciente: ${paciente}.`,
      `Motivo de consulta: ${cuadro}`,
      "",
      "## Lo que necesito",
      "",
      peticionesText,
    ];

    if (formato) {
      lines.push("", "## Formato de salida", "", formato);
    }

    lines.push(
      "",
      "## Reglas obligatorias",
      "",
      "- Razona a partir de los datos concretos del paciente, no des respuestas genéricas de manual.",
      "- Si un diagnóstico es poco probable pero peligroso si se omite, inclúyelo igualmente y márcalo como \"no perder de vista\".",
      "- Si algún dato del caso es insuficiente para descartar algo, dímelo explícitamente y sugiere qué pregunta o exploración me falta.",
      "- NO inventes estadísticas, prevalencias ni referencias bibliográficas. Si citas un dato numérico, indica de dónde procede. Si no lo sabes con certeza, dilo.",
      "- Adapta las recomendaciones al contexto de un hospital público (disponibilidad de pruebas, tiempos de espera realistas).",
      "- Lenguaje clínico profesional entre colegas. Sin introducciones ni despedidas innecesarias. Ve directo al contenido útil.",
    );

    if (restricciones) {
      lines.push("", `## Restricciones adicionales`, "", restricciones);
    }

    return lines.join("\n");
  },

  exampleOutput: `Actúa como un médico especialista experimentado. Soy otorrinolaringólogo en un hospital público. Tu objetivo es ayudarme a razonar sobre un caso clínico real de mi consulta con rigor, precisión y enfoque práctico.

## Caso clínico

Paciente: Varón de 45 años, sin antecedentes de interés.
Motivo de consulta: Otalgia unilateral izquierda de 3 semanas de evolución, sin otorrea ni fiebre. Otoscopia normal, pero refiere dolor al masticar.

## Lo que necesito

1. Diagnóstico diferencial completo, ordenado de más probable a menos probable. Para cada diagnóstico justifica por qué sube o baja en la lista con los datos concretos del caso (no con criterios genéricos de libro).
2. Pruebas complementarias escalonadas para discriminar entre los diagnósticos anteriores. Separa las que puedo hacer en consulta ahora mismo de las que requieren solicitud (imagen, laboratorio). Indica qué resultado esperarías en cada escenario diagnóstico.
3. Señales de alarma ("red flags") que debo buscar activamente y descartar antes de dar el alta. Para cada una, indica qué patología grave sugiere y qué hacer si la encuentro.

## Formato de salida

Presenta el diagnóstico diferencial como tabla con columnas: [Diagnóstico | A favor (datos de ESTE paciente) | En contra | Siguiente paso concreto].

## Reglas obligatorias

- Razona a partir de los datos concretos del paciente, no des respuestas genéricas de manual.
- Si un diagnóstico es poco probable pero peligroso si se omite, inclúyelo igualmente y márcalo como "no perder de vista".
- Si algún dato del caso es insuficiente para descartar algo, dímelo explícitamente y sugiere qué pregunta o exploración me falta.
- NO inventes estadísticas, prevalencias ni referencias bibliográficas. Si citas un dato numérico, indica de dónde procede. Si no lo sabes con certeza, dilo.
- Adapta las recomendaciones al contexto de un hospital público (disponibilidad de pruebas, tiempos de espera realistas).
- Lenguaje clínico profesional entre colegas. Sin introducciones ni despedidas innecesarias. Ve directo al contenido útil.`,
};

// ---------------------------------------------------------------------------
// Template B — Literature search / systematic review (Demo B)
// ---------------------------------------------------------------------------

const literatureSearchTemplate: PromptTemplate = {
  id: "busqueda-literatura",
  title: "Búsqueda de literatura",
  subtitle: "Revisión bibliográfica estructurada",
  description:
    "Genera un prompt para obtener estrategias de búsqueda PubMed, criterios PRISMA y resúmenes de estudios relevantes. Perfecto para revisiones, sesiones y tesis.",
  icon: "book-open",
  color: "blue",
  fields: [
    {
      id: "tipo_trabajo",
      label: "Tipo de trabajo",
      type: "select",
      helpText: "Indica qué estás preparando para que la IA ajuste el enfoque.",
      required: true,
      options: [
        { value: "revision_sistematica", label: "Revisión sistemática" },
        { value: "revision_narrativa", label: "Revisión narrativa" },
        { value: "sesion_clinica", label: "Sesión clínica / bibliográfica" },
        { value: "tesis", label: "Tesis doctoral / TFM" },
        { value: "articulo", label: "Artículo original" },
      ],
      defaultValue: "revision_sistematica",
      exampleValue: "revision_sistematica",
    },
    {
      id: "tema",
      label: "Tema o condición clínica",
      type: "text",
      placeholder:
        "Ej: Manejo del vértigo posicional paroxístico benigno (VPPB)",
      helpText: "Sé específico: no es lo mismo 'vértigo' que 'VPPB en mayores de 65'.",
      required: true,
      exampleValue:
        "Management of benign paroxysmal positional vertigo (BPPV)",
    },
    {
      id: "poblacion",
      label: "Población de estudio",
      type: "text",
      placeholder: "Ej: Pacientes mayores de 65 años",
      helpText: "Grupo de edad, sexo, comorbilidades, setting (ambulatorio, hospitalario)…",
      required: true,
      exampleValue: "Patients over 65 years of age",
    },
    {
      id: "intervenciones",
      label: "Intervenciones o comparaciones de interés",
      type: "text",
      placeholder: "Ej: Maniobras de reposicionamiento canalicular",
      helpText: "Tratamientos, técnicas, fármacos o comparaciones que quieres buscar.",
      exampleValue: "Repositioning maneuvers in this population",
    },
    {
      id: "rango_anos",
      label: "Rango de años",
      type: "text",
      placeholder: "Ej: 2020-2026",
      helpText: "Periodo de publicación de los estudios.",
      defaultValue: "2020-2026",
      exampleValue: "2020-2026",
    },
    {
      id: "num_estudios",
      label: "Número de estudios a resumir",
      type: "select",
      options: [
        { value: "3", label: "3 estudios" },
        { value: "5", label: "5 estudios" },
        { value: "10", label: "10 estudios" },
        { value: "15", label: "15 estudios" },
      ],
      defaultValue: "5",
      exampleValue: "5",
    },
    {
      id: "peticiones",
      label: "¿Qué necesitas?",
      type: "checkbox-group",
      required: true,
      options: [
        {
          value: "estrategia",
          label: "Estrategia de búsqueda PubMed (MeSH + operadores booleanos)",
        },
        {
          value: "criterios",
          label: "Criterios de inclusión/exclusión (basados en PRISMA)",
        },
        {
          value: "resumen",
          label: "Resumen de los estudios más relevantes",
        },
        {
          value: "tabla_evidencia",
          label: "Tabla de evidencia (autor, año, n, intervención, resultado, nivel)",
        },
      ],
      defaultValue: ["estrategia", "criterios", "resumen", "tabla_evidencia"],
      exampleValue: ["estrategia", "criterios", "resumen", "tabla_evidencia"],
    },
    {
      id: "idioma",
      label: "Idioma del prompt",
      type: "select",
      helpText:
        "Para búsquedas PubMed es mejor usar inglés. El resultado puede pedirse en español.",
      options: [
        { value: "en", label: "Inglés (recomendado para PubMed)" },
        { value: "es", label: "Español" },
      ],
      defaultValue: "en",
      exampleValue: "en",
    },
  ],

  buildPrompt(v) {
    const isSpanish = (v.idioma as string) === "es";
    const tema = (v.tema as string).trim();
    const poblacion = (v.poblacion as string).trim();
    const intervenciones = (v.intervenciones as string)?.trim();
    const rango = (v.rango_anos as string) || "2020-2026";
    const nEstudios = (v.num_estudios as string) || "5";
    const peticiones = (v.peticiones as string[]) || [];

    const tipoMapEN: Record<string, string> = {
      revision_sistematica: "a systematic review",
      revision_narrativa: "a narrative review",
      sesion_clinica: "a clinical/bibliographic session",
      tesis: "a doctoral thesis / master's thesis",
      articulo: "an original research article",
    };
    const tipoMapES: Record<string, string> = {
      revision_sistematica: "una revisión sistemática",
      revision_narrativa: "una revisión narrativa",
      sesion_clinica: "una sesión clínica/bibliográfica",
      tesis: "una tesis doctoral / TFM",
      articulo: "un artículo original de investigación",
    };

    const tipo = isSpanish
      ? tipoMapES[(v.tipo_trabajo as string)] || "una revisión"
      : tipoMapEN[(v.tipo_trabajo as string)] || "a review";

    if (isSpanish) {
      const peticionMap: Record<string, string> = {
        estrategia: `Estrategia de búsqueda para PubMed: proporciona la query exacta lista para copiar y pegar, usando términos MeSH, sinónimos en texto libre y operadores booleanos (AND, OR, NOT). Incluye filtros recomendados (fechas: ${rango}, tipo de estudio, idioma). Explica brevemente la lógica de cada bloque de la búsqueda.`,
        criterios: "Criterios de inclusión y exclusión basados en las guías PRISMA. Presenta cada criterio de forma operativa (no genérica) y adaptada al tema específico. Justifica brevemente cada uno.",
        resumen: `Resumen estructurado de los ${nEstudios} ensayos clínicos o estudios de mayor impacto publicados entre ${rango}${intervenciones ? ` sobre ${intervenciones}` : ""}. Para cada estudio incluye: primer autor, año, revista, diseño del estudio, n (tamaño muestral), intervención vs. comparador, desenlace primario, resultado principal con IC 95% o p-valor si están disponibles, y nivel de evidencia (Oxford/GRADE).`,
        tabla_evidencia: `Presenta los ${nEstudios} estudios en una tabla con columnas: [Autor (año) | Revista | Diseño | n | Intervención vs. Control | Desenlace primario | Resultado (IC 95% / p) | Nivel de evidencia].`,
      };
      const petText = peticiones
        .map((p, i) => `${i + 1}. ${peticionMap[p] || p}`)
        .join("\n");

      return [
        `Actúa como un investigador clínico con experiencia en revisiones sistemáticas y metodología de investigación. Necesito tu ayuda para preparar ${tipo} sobre: ${tema}, en la población: ${poblacion}.`,
        "",
        "## Lo que necesito",
        "",
        petText,
        "",
        "## Reglas obligatorias",
        "",
        "- Cita SOLO estudios reales que existan. Incluye el DOI siempre que sea posible para que pueda verificarlos.",
        "- Si no encuentras suficientes estudios de alta calidad, dímelo y sugiere ampliar los criterios. NO inventes referencias.",
        "- Prioriza ensayos clínicos aleatorizados (RCT) y metaanálisis. Si incluyes estudios observacionales, justifica por qué.",
        "- Los términos MeSH deben ser los oficiales de la NLM. Si no estás seguro de un término, indícalo.",
        "- Distingue claramente entre lo que es evidencia sólida y lo que es opinión de experto o evidencia débil.",
        "- Si hay controversia o resultados contradictorios entre estudios, señálalo explícitamente.",
      ].join("\n");
    }

    const peticionMap: Record<string, string> = {
      estrategia: `PubMed search strategy: provide the exact query ready to copy-paste, using MeSH terms, free-text synonyms, and Boolean operators (AND, OR, NOT). Include recommended filters (dates: ${rango}, study type, language). Briefly explain the logic behind each search block.`,
      criterios: "Inclusion and exclusion criteria based on PRISMA guidelines. Make each criterion specific and operationally defined for this topic (not generic). Briefly justify each one.",
      resumen: `Structured summary of the ${nEstudios} highest-impact clinical trials or studies published between ${rango}${intervenciones ? ` on ${intervenciones}` : ""}. For each study include: first author, year, journal, study design, n (sample size), intervention vs. comparator, primary outcome, main result with 95% CI or p-value when available, and level of evidence (Oxford/GRADE).`,
      tabla_evidencia: `Present the ${nEstudios} studies in a table with columns: [Author (year) | Journal | Design | n | Intervention vs. Control | Primary outcome | Result (95% CI / p) | Level of evidence].`,
    };
    const petText = peticiones
      .map((p, i) => `${i + 1}. ${peticionMap[p] || p}`)
      .join("\n");

    return [
      `Act as an experienced clinical researcher with expertise in systematic reviews and research methodology. I need your help to prepare ${tipo} on: ${tema}, in the population: ${poblacion}.`,
      "",
      "## What I need",
      "",
      petText,
      "",
      "## Mandatory rules",
      "",
      "- ONLY cite real, published studies. Include the DOI whenever possible so I can verify them.",
      "- If you cannot find enough high-quality studies, tell me and suggest broadening the criteria. Do NOT fabricate references.",
      "- Prioritize randomized controlled trials (RCTs) and meta-analyses. If you include observational studies, justify why.",
      "- MeSH terms must be official NLM terms. If you are unsure about a term, flag it.",
      "- Clearly distinguish between strong evidence and expert opinion or weak evidence.",
      "- If there is controversy or contradictory results between studies, explicitly highlight it.",
    ].join("\n");
  },

  exampleOutput: `Act as an experienced clinical researcher with expertise in systematic reviews and research methodology. I need your help to prepare a systematic review on: Management of benign paroxysmal positional vertigo (BPPV), in the population: Patients over 65 years of age.

## What I need

1. PubMed search strategy: provide the exact query ready to copy-paste, using MeSH terms, free-text synonyms, and Boolean operators (AND, OR, NOT). Include recommended filters (dates: 2020-2026, study type, language). Briefly explain the logic behind each search block.
2. Inclusion and exclusion criteria based on PRISMA guidelines. Make each criterion specific and operationally defined for this topic (not generic). Briefly justify each one.
3. Structured summary of the 5 highest-impact clinical trials or studies published between 2020-2026 on Repositioning maneuvers in this population. For each study include: first author, year, journal, study design, n (sample size), intervention vs. comparator, primary outcome, main result with 95% CI or p-value when available, and level of evidence (Oxford/GRADE).
4. Present the 5 studies in a table with columns: [Author (year) | Journal | Design | n | Intervention vs. Control | Primary outcome | Result (95% CI / p) | Level of evidence].

## Mandatory rules

- ONLY cite real, published studies. Include the DOI whenever possible so I can verify them.
- If you cannot find enough high-quality studies, tell me and suggest broadening the criteria. Do NOT fabricate references.
- Prioritize randomized controlled trials (RCTs) and meta-analyses. If you include observational studies, justify why.
- MeSH terms must be official NLM terms. If you are unsure about a term, flag it.
- Clearly distinguish between strong evidence and expert opinion or weak evidence.
- If there is controversy or contradictory results between studies, explicitly highlight it.`,
};

// ---------------------------------------------------------------------------
// Template C — Clinical protocol drafting (Demo C)
// ---------------------------------------------------------------------------

const clinicalProtocolTemplate: PromptTemplate = {
  id: "protocolo-clinico",
  title: "Protocolo clínico",
  subtitle: "Documentos y protocolos del servicio",
  description:
    "Genera un prompt para que la IA redacte un protocolo clínico completo con la estructura de tu hospital. Útil para estandarizar procedimientos y formar residentes.",
  icon: "file-text",
  color: "emerald",
  fields: [
    {
      id: "procedimiento",
      label: "Procedimiento o tema del protocolo",
      type: "text",
      placeholder: "Ej: Amigdalectomía",
      helpText: "El procedimiento quirúrgico, técnica o vía clínica que quieres protocolizar.",
      required: true,
      exampleValue: "Amigdalectomía",
    },
    {
      id: "contexto",
      label: "Contexto de tu servicio",
      type: "textarea",
      placeholder:
        "Ej: Hospital público de nivel 3, servicio con 6 otorrinos y 6 residentes. Realizamos ~120 amigdalectomías/año, mayoritariamente pediátricas.",
      helpText:
        "Tipo de hospital, tamaño del servicio, volumen anual, perfil de pacientes. Cuanto más específico, más útil el protocolo.",
      required: true,
      exampleValue:
        "Hospital público de nivel 3, servicio con 6 otorrinos y 6 residentes. Realizamos ~120 amigdalectomías/año, mayoritariamente pediátricas.",
    },
    {
      id: "secciones",
      label: "Secciones del protocolo",
      type: "checkbox-group",
      helpText:
        "Selecciona las secciones que debe incluir. Puedes personalizarlas luego.",
      required: true,
      options: [
        { value: "objetivo", label: "Objetivo y alcance" },
        { value: "indicaciones", label: "Indicaciones" },
        { value: "contraindicaciones", label: "Contraindicaciones" },
        { value: "preop", label: "Evaluación preoperatoria (checklist)" },
        { value: "tecnica", label: "Técnica quirúrgica" },
        { value: "postop", label: "Cuidados postoperatorios" },
        { value: "alta", label: "Criterios de alta y seguimiento" },
        { value: "calidad", label: "Indicadores de calidad" },
      ],
      defaultValue: [
        "objetivo",
        "indicaciones",
        "contraindicaciones",
        "preop",
        "tecnica",
        "postop",
        "alta",
        "calidad",
      ],
      exampleValue: [
        "objetivo",
        "indicaciones",
        "contraindicaciones",
        "preop",
        "tecnica",
        "postop",
        "alta",
        "calidad",
      ],
    },
    {
      id: "detalles_tecnica",
      label: "Detalles de técnica (opcional)",
      type: "text",
      placeholder:
        "Ej: Describir las 2 técnicas que usamos: disección fría y coblation",
      helpText:
        "Técnicas concretas, variantes, equipamiento disponible en tu centro.",
      exampleValue:
        "Describir las 2 técnicas que usamos: disección fría y coblation",
    },
    {
      id: "guias",
      label: "Guías de referencia (opcional)",
      type: "text",
      placeholder: "Ej: Criterios Paradise + guías SEORL 2024",
      helpText: "Guías clínicas, consensos o estándares que debe seguir el protocolo.",
      exampleValue: "Criterios Paradise + guías SEORL 2024",
    },
    {
      id: "tono",
      label: "Tono y destinatario",
      type: "select",
      helpText: "Adapta el nivel del documento a quien va a leerlo.",
      options: [
        {
          value: "r1",
          label: "Conciso, referencia rápida para R1",
        },
        {
          value: "servicio",
          label: "Formal, documento oficial del servicio",
        },
        {
          value: "docencia",
          label: "Didáctico, orientado a docencia/formación",
        },
      ],
      defaultValue: "r1",
      exampleValue: "r1",
    },
  ],

  buildPrompt(v) {
    const procedimiento = (v.procedimiento as string).trim();
    const contexto = (v.contexto as string).trim();
    const secciones = (v.secciones as string[]) || [];
    const detalles = (v.detalles_tecnica as string)?.trim();
    const guias = (v.guias as string)?.trim();

    const seccionMap: Record<string, string> = {
      objetivo: "Objetivo y alcance del protocolo",
      indicaciones: "Indicaciones (con criterios explícitos y clasificación por nivel de evidencia)",
      contraindicaciones: "Contraindicaciones absolutas y relativas (con matices prácticos para el clínico)",
      preop: "Evaluación preoperatoria: checklist operativa que un residente pueda seguir punto por punto",
      tecnica: "Técnica quirúrgica: descripción paso a paso de cada técnica, con notas prácticas del tipo \"Atención R1: ...\" para los puntos críticos",
      postop: "Cuidados postoperatorios: incluir protocolo analgésico detallado con fármacos, dosis, vías y pautas. Incluir alertas de seguridad farmacológica",
      alta: "Criterios de alta (ambulatoria e ingreso), instrucciones al paciente/familia, signos de alarma para acudir a urgencias, y plan de seguimiento",
      calidad: "Indicadores de calidad medibles (KPIs) con valores objetivo para auditoría del servicio",
    };

    const tonoMap: Record<string, string> = {
      r1: "Formal pero pragmático. Orientado a que un R1 de primer año pueda consultarlo como referencia rápida en quirófano o en consulta. Usa viñetas, tablas y checklists siempre que sea posible. Evita párrafos largos.",
      servicio: "Formal y exhaustivo. Listo para revisión y aprobación por jefatura de servicio. Incluir campo de firma, fecha de revisión y vigencia del protocolo.",
      docencia: "Didáctico y formativo. Incluir notas explicativas tipo \"Nota R1: ...\" en los puntos clave para que sirva como material docente además de protocolo.",
    };

    const secText = secciones
      .map((s, i) => `${i + 1}. ${seccionMap[s] || s}`)
      .join("\n");

    const tono = tonoMap[(v.tono as string)] || tonoMap.r1;

    const lines = [
      `Actúa como un especialista sénior con experiencia en redacción de protocolos hospitalarios. Necesito que redactes un protocolo clínico completo de ${procedimiento} para nuestro servicio.`,
      "",
      "## Contexto del servicio",
      "",
      contexto,
      "",
      "## Estructura requerida",
      "",
      "El protocolo debe contener las siguientes secciones, en este orden:",
      "",
      secText,
    ];

    if (detalles) {
      lines.push("", "## Detalles específicos de nuestro centro", "", detalles);
    }

    if (guias) {
      lines.push(
        "",
        "## Fuentes y guías de referencia",
        "",
        `Basa las indicaciones, contraindicaciones y recomendaciones en: ${guias}. Si utilizas otros consensos o guías internacionales, cítalos explícitamente.`,
      );
    }

    lines.push(
      "",
      "## Tono y formato",
      "",
      tono,
      "",
      "## Reglas obligatorias",
      "",
      "- Las dosis farmacológicas deben ser exactas (mg/kg, intervalos, vías, duración). No uses rangos vagos.",
      "- Si hay alertas de seguridad farmacológica (contraindicaciones por edad, interacciones), destácalas con formato visible (negrita, recuadro o prefijo \"ALERTA:\").",
      "- Las indicaciones deben tener criterios operativos concretos (números, frecuencias, grados), no frases genéricas.",
      "- Para la evaluación preoperatoria, usa formato checklist con casillas (- [ ]).",
      "- NO inventes cifras de incidencia, porcentajes ni cites estudios que no puedas confirmar. Si un dato es aproximado, indícalo.",
      "- Si alguna recomendación varía según la edad del paciente (pediátrico vs. adulto), sepáralo claramente.",
      "- Incluye al final: fecha de elaboración, fecha prevista de revisión y campo de firma de aprobación.",
    );

    return lines.join("\n");
  },

  exampleOutput: `Actúa como un especialista sénior con experiencia en redacción de protocolos hospitalarios. Necesito que redactes un protocolo clínico completo de Amigdalectomía para nuestro servicio.

## Contexto del servicio

Hospital público de nivel 3, servicio con 6 otorrinos y 6 residentes. Realizamos ~120 amigdalectomías/año, mayoritariamente pediátricas.

## Estructura requerida

El protocolo debe contener las siguientes secciones, en este orden:

1. Objetivo y alcance del protocolo
2. Indicaciones (con criterios explícitos y clasificación por nivel de evidencia)
3. Contraindicaciones absolutas y relativas (con matices prácticos para el clínico)
4. Evaluación preoperatoria: checklist operativa que un residente pueda seguir punto por punto
5. Técnica quirúrgica: descripción paso a paso de cada técnica, con notas prácticas del tipo "Atención R1: ..." para los puntos críticos
6. Cuidados postoperatorios: incluir protocolo analgésico detallado con fármacos, dosis, vías y pautas. Incluir alertas de seguridad farmacológica
7. Criterios de alta (ambulatoria e ingreso), instrucciones al paciente/familia, signos de alarma para acudir a urgencias, y plan de seguimiento
8. Indicadores de calidad medibles (KPIs) con valores objetivo para auditoría del servicio

## Detalles específicos de nuestro centro

Describir las 2 técnicas que usamos: disección fría y coblation

## Fuentes y guías de referencia

Basa las indicaciones, contraindicaciones y recomendaciones en: Criterios Paradise + guías SEORL 2024. Si utilizas otros consensos o guías internacionales, cítalos explícitamente.

## Tono y formato

Formal pero pragmático. Orientado a que un R1 de primer año pueda consultarlo como referencia rápida en quirófano o en consulta. Usa viñetas, tablas y checklists siempre que sea posible. Evita párrafos largos.

## Reglas obligatorias

- Las dosis farmacológicas deben ser exactas (mg/kg, intervalos, vías, duración). No uses rangos vagos.
- Si hay alertas de seguridad farmacológica (contraindicaciones por edad, interacciones), destácalas con formato visible (negrita, recuadro o prefijo "ALERTA:").
- Las indicaciones deben tener criterios operativos concretos (números, frecuencias, grados), no frases genéricas.
- Para la evaluación preoperatoria, usa formato checklist con casillas (- [ ]).
- NO inventes cifras de incidencia, porcentajes ni cites estudios que no puedas confirmar. Si un dato es aproximado, indícalo.
- Si alguna recomendación varía según la edad del paciente (pediátrico vs. adulto), sepáralo claramente.
- Incluye al final: fecha de elaboración, fecha prevista de revisión y campo de firma de aprobación.`,
};

// ---------------------------------------------------------------------------
// Export all templates
// ---------------------------------------------------------------------------

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  clinicalCaseTemplate,
  literatureSearchTemplate,
  clinicalProtocolTemplate,
];

export function getTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.id === id);
}

/** Build a values map pre-filled with example data for a template. */
export function getExampleValues(
  template: PromptTemplate,
): Record<string, string | string[]> {
  const values: Record<string, string | string[]> = {};
  for (const field of template.fields) {
    if (field.exampleValue !== undefined) {
      values[field.id] = field.exampleValue;
    } else if (field.defaultValue !== undefined) {
      values[field.id] = field.defaultValue;
    } else {
      values[field.id] = field.type === "checkbox-group" ? [] : "";
    }
  }
  return values;
}

/** Build a values map with default (empty-ish) data. */
export function getDefaultValues(
  template: PromptTemplate,
): Record<string, string | string[]> {
  const values: Record<string, string | string[]> = {};
  for (const field of template.fields) {
    if (field.defaultValue !== undefined) {
      values[field.id] = field.defaultValue;
    } else {
      values[field.id] = field.type === "checkbox-group" ? [] : "";
    }
  }
  return values;
}
