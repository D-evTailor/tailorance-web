# Demo 2 — Prompts para analisis de datos ORL

## Prompt 1: Gemini 3.1 Preview → Codigo R-Studio

Adjuntar el CSV `demo-amigdalectomias-orl.csv` y usar el siguiente prompt:

---

```
Soy otorrinolaringólogo en un hospital público. Adjunto un CSV con 50 amigdalectomías de nuestro servicio. Las variables son: id_paciente, edad, sexo, indicación (SAOS / Amigdalitis recurrente / Hipertrofia amigdalar), técnica quirúrgica (Bisturí eléctrico / Coblator), duración en minutos, sangrado en ml, dolor postoperatorio día 1 y día 7 (escala EVA 0-10), complicación (Ninguna / Hemorragia / Infección), días hasta dieta normal y satisfacción del paciente (1-5).

Genera un script completo y bien documentado en R que pueda ejecutar directamente en RStudio. El script debe incluir:

1. CARGA Y PREPARACIÓN DE DATOS
   - Leer el CSV
   - Convertir variables categóricas a factores con niveles adecuados
   - Resumen general del dataset (str, summary)

2. ESTADÍSTICA DESCRIPTIVA
   - Tabla resumen con media, mediana, DE, mín y máx de las variables numéricas (edad, duración, sangrado, dolor D1, dolor D7, días hasta dieta normal, satisfacción) estratificada por técnica quirúrgica
   - Frecuencias absolutas y relativas de indicación, complicaciones y sexo por técnica

3. ANÁLISIS INFERENCIAL — COMPARACIÓN POR TÉCNICA
   - Test de normalidad (Shapiro-Wilk) para decidir test paramétrico vs no paramétrico
   - Comparar sangrado, dolor D1, dolor D7 y duración entre Bisturí eléctrico vs Coblator (t-test o Mann-Whitney según normalidad)
   - Comparar tasa de complicaciones entre técnicas (Chi-cuadrado o test exacto de Fisher)
   - Intervalo de confianza al 95% para la diferencia de medias en dolor D7

4. ANÁLISIS INFERENCIAL — COMPARACIÓN POR INDICACIÓN
   - Comparar sangrado, dolor D7 y duración entre las 3 indicaciones (ANOVA o Kruskal-Wallis)
   - Post-hoc (Tukey o Dunn) si hay diferencias significativas

5. REGRESIÓN MÚLTIPLE
   - Modelo 1: Variable dependiente = dolor_post_d7. Predictores: edad, sexo, técnica, indicación, duración, sangrado
   - Modelo 2: Variable dependiente = dias_hasta_dieta_normal. Predictores: edad, sexo, técnica, indicación, dolor_post_d7, complicación
   - Para cada modelo: summary(), intervalos de confianza de los coeficientes, verificación de supuestos (normalidad de residuos, homocedasticidad con plots diagnósticos)
   - Regresión logística: Variable dependiente = complicación (binaria: Sí/No). Predictores: edad, sexo, técnica, indicación. Odds ratios con IC 95%.

6. VISUALIZACIONES (usar ggplot2)
   - Boxplot de dolor D1 y D7 por técnica (lado a lado, coloreado)
   - Boxplot de sangrado por técnica e indicación (facetado)
   - Gráfico de barras de complicaciones por técnica (con porcentajes)
   - Scatter plot de edad vs dolor D7, coloreado por técnica, con línea de regresión
   - Forest plot de los coeficientes de la regresión múltiple (Modelo 1) con IC 95%

7. INFORME RESUMEN
   - Al final del script, imprimir un bloque de texto con las conclusiones principales en formato que pueda copiar directamente para una sesión clínica

Requisitos técnicos del código:
- Usar tidyverse (dplyr, ggplot2, tidyr), además de car, broom y patchwork si es necesario
- Código limpio y bien comentado en español
- Cada sección con un encabezado claro (# ====== SECCIÓN ======)
- Los gráficos deben tener títulos, etiquetas de ejes en español y un theme_minimal()
- Incluir al inicio un bloque que instale los paquetes si no están instalados
```

---

## Prompt 2: Google AI Studio Built → Web App interactiva

Adjuntar el CSV `demo-amigdalectomias-orl.csv` y usar el siguiente prompt:

---

```
Crea una aplicación web interactiva completa (single-page app en HTML/CSS/JavaScript) que analice y visualice este dataset de 50 amigdalectomías de un servicio de ORL.

CONTEXTO: Esta app se va a mostrar en una charla a médicos ORL como demo de lo que la IA puede generar automáticamente a partir de un CSV clínico. Tiene que ser visualmente impactante, profesional y funcional.

La app debe tener las siguientes secciones en un layout de dashboard:

1. RESUMEN EJECUTIVO (KPIs en tarjetas)
   - Total de pacientes
   - Edad media ± DE
   - Distribución por técnica (Bisturí eléctrico vs Coblator)
   - Tasa de complicaciones global (%)
   - Satisfacción media

2. ESTADÍSTICA DESCRIPTIVA
   - Tabla interactiva con media, mediana, DE de las variables numéricas, estratificada por técnica quirúrgica
   - Gráfico de distribución de indicaciones (donut o barras horizontales)
   - Histograma de edades coloreado por técnica

3. ANÁLISIS COMPARATIVO POR TÉCNICA
   - Boxplots interactivos de dolor D1 y D7 por técnica (lado a lado)
   - Boxplot de sangrado por técnica
   - Barras agrupadas de complicaciones por técnica con porcentajes
   - Para cada comparación mostrar el p-valor del test estadístico correspondiente (Mann-Whitney para continuas, Fisher para categóricas)
   - Destacar visualmente cuando el p-valor es < 0.05

4. ANÁLISIS COMPARATIVO POR INDICACIÓN
   - Boxplots de duración y sangrado por indicación (SAOS vs Amigdalitis recurrente vs Hipertrofia)
   - Tabla con p-valores de las comparaciones (Kruskal-Wallis)

5. REGRESIÓN MÚLTIPLE
   - Mostrar los resultados de dos modelos:
     a) dolor_post_d7 ~ edad + sexo + técnica + indicación + sangrado
     b) dias_hasta_dieta_normal ~ edad + técnica + indicación + dolor_post_d7
   - Para cada modelo: tabla de coeficientes con IC 95%, R², p-valor global
   - Forest plot interactivo de los coeficientes del Modelo A con intervalos de confianza
   - Destacar los predictores significativos (p < 0.05)

6. CONCLUSIONES CLÍNICAS
   - Generar automáticamente un bloque de texto con las 3-4 conclusiones principales derivadas de los análisis, en lenguaje clínico comprensible

REQUISITOS DE DISEÑO:
- Paleta profesional médica: fondo blanco, acentos en azul (#2563EB) y verde (#059669), rojo para alertas (#DC2626)
- Fuente: Inter o system-ui
- Layout responsive con CSS Grid
- Navegación por secciones con scroll suave o tabs
- Los gráficos deben usar Chart.js o Plotly.js (cargar desde CDN)
- La app debe parsear el CSV en el cliente (embeber los datos directamente en el JS)
- Debe funcionar como un archivo HTML standalone, sin backend
- Los tests estadísticos deben implementarse en JavaScript puro (no se puede usar R ni Python)
- Incluir un botón "Exportar resumen" que genere un texto plano con las conclusiones copiable al portapapeles
```

---

## Notas para la demo

### Flujo sugerido en la charla

1. **Mostrar el CSV** brevemente (30s) — "Esto es un registro de 50 amigdalectomías"
2. **Ejecutar uno de los dos prompts** en vivo (elegir según la audiencia):
   - Si hay más perfil investigador/residente → Prompt 1 (R-Studio)
   - Si quieres impacto visual rápido → Prompt 2 (Web App)
3. **Mientras genera**, explicar las reglas de prompting aplicadas
4. **Mostrar resultado** — "En 30 segundos tenemos análisis completo con regresión múltiple"

### Qué debería encontrar la IA en los datos

El dataset está diseñado para que los análisis revelen:

- **Coblator vs Bisturí eléctrico**: Coblator muestra significativamente menos dolor (D1 y D7) y menos sangrado. La tasa de complicaciones es similar entre ambas técnicas.
- **Por indicación**: Amigdalitis recurrente (pacientes adultos) tiene más sangrado, más dolor y más complicaciones que SAOS e Hipertrofia (pacientes pediátricos).
- **Regresión múltiple**: Los predictores significativos de dolor D7 deberían ser la técnica (Coblator = menos dolor) y la edad (mayor edad = más dolor). La indicación probablemente saldrá confundida con la edad.
- **Regresión logística**: La edad será el principal predictor de complicaciones.
