# 🚀 Guía de Deployment - Chatbot DevTailor

## 📋 Requisitos Previos

### **Entorno de Desarrollo**
```bash
Node.js >= 18.0.0
npm >= 9.0.0 o pnpm >= 8.0.0
Git >= 2.30.0
```

### **Dependencias del Sistema**
```json
{
  "next": "^15.2.4",
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "@shadcn/ui": "latest",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.15.0",
  "lucide-react": "^0.469.0"
}
```

---

## 🔧 Configuración Local

### **1. Instalación de Dependencias**
```bash
# Clonar el repositorio
git clone https://github.com/devtailor/chatbot-system.git
cd chatbot-system

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
```

### **2. Variables de Entorno**
```bash
# .env.local
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CHATBOT_SESSION_TIMEOUT=1800000

# Analytics (opcional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# CRM Integration (futuro)
HUBSPOT_API_KEY=your_hubspot_key
SALESFORCE_CLIENT_ID=your_salesforce_id
```

### **3. Configuración de Base de Datos Local**
```bash
# Para persistencia local (desarrollo)
NEXT_PUBLIC_STORAGE_TYPE=localStorage

# Para base de datos (producción)
DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db
REDIS_URL=redis://localhost:6379
```

### **4. Comandos de Desarrollo**
```bash
# Modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start

# Linting y formato
pnpm lint
pnpm format

# Tests
pnpm test
pnpm test:e2e
```

---

## 🌐 Deployment en Vercel

### **1. Configuración Automática**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
vercel login
vercel --prod
```

### **2. Configuración vercel.json**
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_ENV": "production",
    "NEXT_PUBLIC_API_URL": "https://chatbot.devtailor.com/api"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/chatbot",
      "destination": "/chatbot"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### **3. Variables de Entorno en Vercel**
```bash
# Configurar a través de Vercel Dashboard o CLI
vercel env add NEXT_PUBLIC_APP_ENV production
vercel env add NEXT_PUBLIC_API_URL https://chatbot.devtailor.com/api
vercel env add HUBSPOT_API_KEY your_production_key
```

---

## 🐳 Deployment con Docker

### **1. Dockerfile**
```dockerfile
# Multi-stage build para optimización
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build la aplicación
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **2. Docker Compose**
```yaml
version: '3.8'

services:
  chatbot-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_ENV=production
    depends_on:
      - redis
      - postgres
    networks:
      - chatbot-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - chatbot-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: chatbot_db
      POSTGRES_USER: chatbot_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - chatbot-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - chatbot-app
    networks:
      - chatbot-network

volumes:
  redis_data:
  postgres_data:

networks:
  chatbot-network:
    driver: bridge
```

### **3. Comandos Docker**
```bash
# Build y run local
docker-compose up --build

# Producción con optimizaciones
docker-compose -f docker-compose.prod.yml up -d

# Logs y monitoring
docker-compose logs -f chatbot-app
docker-compose exec chatbot-app sh
```

---

## 🐳 Deployment en AWS

### **1. ECS con Fargate**
```yaml
# task-definition.json
{
  "family": "chatbot-devtailor",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "chatbot-app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/chatbot:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/chatbot",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### **2. CloudFormation Template**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ChatBot DevTailor Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [development, staging, production]

Resources:
  # VPC y Networking
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true

  # ECS Cluster
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub 'chatbot-${Environment}'

  # Application Load Balancer
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub 'chatbot-alb-${Environment}'
      Scheme: internet-facing
      Type: application
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2

  # RDS Database
  ChatbotDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub 'chatbot-db-${Environment}'
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 20
      DBName: chatbot
      MasterUsername: chatbot_user
      MasterUserPassword: !Ref DatabasePassword

  # ElastiCache Redis
  RedisCluster:
    Type: AWS::ElastiCache::CacheCluster
    Properties:
      CacheNodeType: cache.t3.micro
      Engine: redis
      NumCacheNodes: 1
```

### **3. Deployment Scripts**
```bash
#!/bin/bash
# deploy-aws.sh

set -e

ENVIRONMENT=${1:-production}
REGION=${2:-us-east-1}
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Deploying ChatBot to AWS Environment: $ENVIRONMENT"

# Build y push Docker image
docker build -t chatbot:latest .
docker tag chatbot:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/chatbot:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/chatbot:latest

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yml \
  --stack-name chatbot-$ENVIRONMENT \
  --parameter-overrides Environment=$ENVIRONMENT \
  --capabilities CAPABILITY_IAM \
  --region $REGION

# Update ECS service
aws ecs update-service \
  --cluster chatbot-$ENVIRONMENT \
  --service chatbot-service \
  --force-new-deployment \
  --region $REGION

echo "Deployment completed successfully!"
```

---

## 📊 Monitoring y Logging

### **1. Application Performance Monitoring**
```typescript
// lib/monitoring.ts
interface MonitoringConfig {
  enableAPM: boolean;
  enableErrorTracking: boolean;
  enablePerformanceMetrics: boolean;
  enableUserAnalytics: boolean;
}

class MonitoringService {
  constructor(private config: MonitoringConfig) {}
  
  trackError(error: Error, context: ErrorContext): void {
    if (this.config.enableErrorTracking) {
      // Sentry, DataDog, etc.
      console.error('Error tracked:', error, context);
    }
  }
  
  trackPerformance(metric: PerformanceMetric): void {
    if (this.config.enablePerformanceMetrics) {
      // New Relic, DataDog, etc.
      console.log('Performance metric:', metric);
    }
  }
  
  trackUserEvent(event: UserEvent): void {
    if (this.config.enableUserAnalytics) {
      // Google Analytics, Mixpanel, etc.
      console.log('User event:', event);
    }
  }
}
```

### **2. Health Checks**
```typescript
// app/api/health/route.ts
export async function GET() {
  const healthChecks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalAPIs: await checkExternalAPIs()
    },
    metrics: {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    }
  };
  
  const isHealthy = Object.values(healthChecks.services).every(
    service => service.status === 'ok'
  );
  
  return Response.json(healthChecks, {
    status: isHealthy ? 200 : 503
  });
}
```

### **3. Logging Configuration**
```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: {
    service: 'chatbot-devtailor',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

export default logger;
```

---

## 🔒 Seguridad y Performance

### **1. Configuración de Seguridad**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || 'anonymous';
  if (isRateLimited(ip)) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }
  
  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/chatbot/:path*']
};
```

### **2. Performance Optimizations**
```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 's-maxage=60, stale-while-revalidate'
        }
      ]
    }
  ]
};

export default nextConfig;
```

---

## 🔄 CI/CD Pipeline

### **1. GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy ChatBot

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: |
          vercel --token ${{ secrets.VERCEL_TOKEN }} --scope devtailor

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }} --scope devtailor
```

### **2. Quality Gates**
```yaml
# .github/workflows/quality.yml
name: Quality Gates

on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Code quality
      - name: ESLint
        run: pnpm lint
      
      # Security audit
      - name: Audit dependencies
        run: pnpm audit
      
      # Performance budget
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.js'
      
      # Bundle analysis
      - name: Bundle analyzer
        run: pnpm analyze
```

---

## 📈 Escalabilidad

### **1. Horizontal Scaling**
```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatbot-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chatbot
  template:
    metadata:
      labels:
        app: chatbot
    spec:
      containers:
      - name: chatbot
        image: chatbot:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: chatbot-service
spec:
  selector:
    app: chatbot
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### **2. Auto-scaling Configuration**
```yaml
# kubernetes/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: chatbot-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: chatbot-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 🛠️ Troubleshooting

### **Problemas Comunes**

#### **1. Error de Build**
```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
pnpm install
pnpm build
```

#### **2. Problemas de Performance**
```bash
# Analizar bundle
pnpm analyze

# Profiling en desarrollo
NODE_OPTIONS='--inspect' pnpm dev
```

#### **3. Issues de Memoria**
```bash
# Aumentar heap size
NODE_OPTIONS='--max-old-space-size=4096' pnpm build
```

### **Logs Útiles**
```bash
# Logs de aplicación
docker-compose logs -f chatbot-app

# Logs de base de datos
docker-compose logs postgres

# Métricas del sistema
docker stats
```

---

*Guía actualizada: Diciembre 2024* 