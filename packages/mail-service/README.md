# 📧 Mail Service

Este es un microservicio para gestionar el envío de correos transaccionales utilizando MailerSend.

## 🚀 Cómo empezar

### 1. Requisitos

- Node.js (v20 LTS)
- pnpm

### 2. Instalación

Desde la raíz del monorepo, instala todas las dependencias:

```bash
pnpm install
```

### 3. Configuración

Crea un archivo `.env` en la raíz de este paquete (`packages/mail-service`) basado en `.env.example` y añade tus credenciales de MailerSend.

### 4. Ejecutar en desarrollo

Para iniciar el servidor en modo de desarrollo con recarga automática:

```bash
pnpm --filter @devtailor/mail-service dev
```

### 5. Probar el servicio

Para ejecutar los tests unitarios:

```bash
pnpm --filter @devtailor/mail-service test
```

## 🐳 Docker

Para construir y ejecutar la imagen de Docker:

```bash
# Construir la imagen
docker build -t devtailor/mail-service .

# Levantar con Docker Compose
docker-compose up -d
```

## 🔗 Endpoints

- `POST /send`: Envía un correo transaccional.
  - **Body**: `{ "to": "...", "template": "...", "vars": {...} }`
