# Calebe Level Up API - Setup & Run

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@localhost:5432/calebe_levelup

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

UPLOAD_DIR=./uploads
```

### 3. Executar migrations

```bash
npm run migration:generate
npm run migration
```

### 4. Criar diretório de uploads

```bash
mkdir uploads
```

## 🏃‍♂️ Executar o Servidor

### Desenvolvimento (com hot reload)

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## 📍 Endpoints Disponíveis

### Health Check
```
GET /health
```

### Autenticação (Público)
```
POST /api/auth/register       - Registrar novo usuário
POST /api/auth/login          - Login
POST /api/auth/recovery-email - Enviar email de recuperação
PUT  /api/auth/update-password - Atualizar senha
```

### Usuário (Autenticado)
```
GET /api/me                   - Ver perfil
PUT /api/me                   - Atualizar perfil
GET /api/users/:externalId    - Ver usuário por ID
```

### Atividades (USER apenas)
```
POST /api/user/activities     - Criar atividade (status PENDING)
```

### Admin - Usuários
```
POST   /api/admin/users                    - Criar usuário
POST   /api/admin/admins                   - Criar admin
GET    /api/admin/users                    - Listar usuários
GET    /api/admin/users/:externalId        - Ver usuário
PUT    /api/admin/users/:externalId        - Atualizar usuário
PUT    /api/admin/users/:externalId/approve - Aprovar usuário
PUT    /api/admin/users/:externalId/reprove - Reprovar usuário
PUT    /api/admin/users/:externalId/status  - Atualizar status
DELETE /api/admin/users/:externalId        - Deletar usuário
```

### Admin - Categorias
```
POST   /api/admin/categories     - Criar categoria
PUT    /api/admin/categories/:id - Atualizar categoria
DELETE /api/admin/categories/:id - Deletar categoria
```

### Admin - Actions
```
POST   /api/admin/actions     - Criar action
PUT    /api/admin/actions/:id - Atualizar action
DELETE /api/admin/actions/:id - Deletar action
```

### Admin - Challenges
```
POST   /api/admin/challenges     - Criar challenge
PUT    /api/admin/challenges/:id - Atualizar challenge
DELETE /api/admin/challenges/:id - Deletar challenge
```

### Admin - Atividades
```
PUT /api/admin/activities/:id/status - Aprovar/Rejeitar atividade
```

### Categorias (Autenticado)
```
GET /api/categories     - Listar categorias
GET /api/categories/:id - Ver categoria
```

### Actions (Autenticado)
```
GET /api/actions                      - Listar actions
GET /api/actions/:id                  - Ver action
GET /api/actions/category/:categoryId - Actions por categoria
GET /api/actions/user/:userId         - Actions por usuário
```

### Challenges (Autenticado)
```
GET /api/challenges                      - Listar challenges
GET /api/challenges/:id                  - Ver challenge
GET /api/challenges/category/:categoryId - Challenges por categoria
GET /api/challenges/user/:userId         - Challenges por usuário
```

### Imagens (Autenticado)
```
POST   /api/images     - Upload de imagem
GET    /api/images     - Listar minhas imagens
GET    /api/images/:id - Ver imagem
PUT    /api/images/:id - Atualizar imagem
DELETE /api/images/:id - Deletar imagem
```

### Arquivos Estáticos
```
GET /uploads/:filename - Acessar arquivo de upload
```

## 🔐 Autenticação

Todas as rotas (exceto `/auth/register`, `/auth/login`, `/auth/recovery-email`, `/auth/update-password`, e `/health`) requerem autenticação via JWT.

### Header de Autenticação
```
Authorization: Bearer {seu-token-jwt}
```

### Exemplo de Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "externalId": "uuid-123",
    "name": "Usuario",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Usar Token

```bash
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   └── usecases/          # Casos de uso (lógica de negócio)
│       ├── user/
│       ├── action/
│       ├── challenge/
│       ├── category/
│       ├── user-activity/
│       └── image/
├── domain/
│   ├── entities/          # Entidades de domínio
│   ├── repositories/      # Interfaces de repositórios
│   └── services/          # Interfaces de serviços
├── infra/
│   ├── controllers/       # Controllers HTTP
│   ├── database/
│   │   ├── kysely/       # Implementações Kysely
│   │   └── prisma/       # Schema Prisma
│   ├── middlewares/       # Middlewares Express
│   ├── services/          # Implementações de serviços
│   ├── app.ts            # Configuração Express
│   ├── container.ts      # Dependency Injection
│   └── routes.ts         # Definição de rotas
└── server.ts             # Entry point
```

## 📦 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm start                # Executar produção
npm run migration        # Executar migrations
npm run migration:prod   # Deploy migrations produção
npm run migration:generate # Gerar tipos Kysely
npm test                 # Executar testes
```

## 🛠️ Tecnologias

- **Express** - Framework web
- **TypeScript** - Linguagem
- **Kysely** - Query builder type-safe
- **Prisma** - ORM e migrations
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Argon2** - Hash de senhas
- **Multer** - Upload de arquivos
- **CORS** - Cross-origin resource sharing

## 🔒 Segurança

- Senhas hasheadas com Argon2
- JWT para autenticação
- Middleware de autorização (Admin/User)
- Validação de uploads de imagem
- Path traversal protection
- SQL injection protection (Kysely)

## 📝 Notas

- O token JWT contém `externalId` (UUID) e `role`
- Imagens são limitadas a 5MB
- Apenas imagens são aceitas (jpeg, jpg, png, gif, webp)
- Usuários devem estar com status ACTIVE para autenticar
- Admins têm acesso total, users têm acesso limitado
