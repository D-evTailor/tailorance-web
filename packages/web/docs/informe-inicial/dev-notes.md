# 📝 Notas de Desarrollo y Decisiones Clave

Este documento es una bitácora de decisiones importantes tomadas durante el desarrollo del proyecto DevTailor.

## 2024-07-29

### Decisión: Elección de `shadcn/ui` sobre librerías de componentes tradicionales

- **Contexto**: Se necesitaba una librería de componentes para acelerar el desarrollo de la UI.
- **Decisión**: Se optó por `shadcn/ui` en lugar de librerías como Material-UI o Chakra-UI.
- **Motivo**: `shadcn/ui` no es una librería de componentes en sí, sino una colección de componentes reutilizables que se copian directamente en el proyecto. Esto nos da control total sobre el código, el estilo y el comportamiento de los componentes sin tener que lidiar con las abstracciones o el "peso" de una librería externa. Facilita la personalización extrema con Tailwind CSS.

### Decisión: Uso de `pnpm` como gestor de paquetes

- **Contexto**: Se necesitaba elegir un gestor de paquetes para manejar las dependencias de Node.js.
- **Decisión**: Se eligió `pnpm`.
- **Motivo**: `pnpm` es significativamente más rápido y eficiente en el uso del espacio en disco que `npm` o `yarn` clásicos. Su sistema de `node_modules` no plano evita problemas de acceso a dependencias no declaradas explícitamente, lo que lleva a un proyecto más robusto.

---

_(Este archivo se actualizará a medida que se tomen nuevas decisiones importantes)_
