# 🔍 Cursor Review – DevTailor Project Bootstrap

## 🎯 Objetivo

Analiza el proyecto DevTailor ya generado por Vercel para validar que la estructura inicial cumple con los requisitos y está lista para construir la web final.

## ✅ Puntos a verificar

1. **Estructura de carpetas**
   - Verifica que existen `/app`, `/components`, `/styles`, `/lib`, `/docs`, `/public`.

2. **Dependencias clave**
   - Asegura que están correctamente instaladas:
     - Tailwind CSS
     - shadcn/ui
     - Lucide-react
     - Framer Motion
     - React Hook Form

3. **Diseño básico**
   - Comprobar si `layout.tsx` importa correctamente `Manrope`
   - Si hay un `Header` y `Footer` aunque sea en esqueleto

4. **Páginas creadas**
   - Comprobar existencia de las siguientes rutas:
     - `/`
     - `/servicios`
     - `/metodologia`
     - `/valores`
     - `/contacto`

5. **Componente de formulario**
   - En `/contacto/page.tsx`, verifica si hay un `form` aunque esté incompleto.
   - Debe estar listo para integrar con EmailJS o Formspree.

6. **/docs estructurado**
   Asegúrate de que dentro de `/docs` se haya creado la siguiente estructura inicial:

```
/docs
  /estructura.md         → Explicación de carpetas y convenciones
  /estilo-visual.md      → Paleta, tipografías, estilo UI/UX
  /roadmap.md            → Próximos pasos una vez aprobado el esqueleto
  /stack.md              → Tecnologías y por qué se han elegido
  /dev-notes.md          → Apuntes internos o decisiones clave de diseño
```

## 🧭 A continuación

Cuando todo esté listo, generarás una hoja de ruta en `docs/roadmap.md` con los pasos siguientes para desarrollar la web completa.
