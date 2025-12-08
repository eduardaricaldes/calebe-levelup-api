# Calebe Level Up API

API backend para sistema de gamificação e gerenciamento de usuários com autenticação JWT.

## 🏗️ Arquitetura

O projeto segue Clean Architecture com 3 camadas principais:

```
controller (infra) -> usecase (app) -> repository implementation (infra) -> database
```

### Estrutura de Pastas

- `src/domain/`: Entidades, interfaces de repositórios e serviços
- `src/app/`: Casos de uso (lógica de negócio)
- `src/infra/`: Implementações (controllers, repositories, services, middlewares)

## 🚀 Tecnologias

- **Express.js 5.1.0**: Framework web
- **TypeScript**: Tipagem estática
- **Kysely 0.28.8**: Query builder type-safe para PostgreSQL
- **Prisma**: Migrations e schema
- **Argon2**: Hash de senhas
- **JWT**: Autenticação
- **Nodemailer**: Envio de emails
- **Multer**: Upload de arquivos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Configurar o arquivo .env com suas credenciais
```

## ⚙️ Configuração

### Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/calebe_levelup

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_DIR=./uploads

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@calebe-levelup.com

# Frontend
FRONTEND_URL=http://localhost:3001
```

### Configuração do Gmail (SMTP)

Para usar o Gmail como servidor SMTP:

1. Ative a autenticação de 2 fatores na sua conta Google
2. Gere uma senha de aplicativo em: https://myaccount.google.com/apppasswords
3. Use a senha gerada no campo `SMTP_PASS`

## 🗄️ Database

```bash
# Executar migrations
npm run migration

# Gerar Prisma Client
npx prisma generate
```

## 🏃 Executar

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

## 📁 Criar Pasta de Uploads

```bash
mkdir uploads
```

## 📚 Funcionalidades

### Autenticação
- Login com JWT
- Recuperação de senha via email
- Middlewares de autenticação (admin e user)

### Gestão de Usuários
- CRUD completo
- Aprovação/reprovação de usuários (admin)
- Atualização de status
- Perfil do usuário autenticado

### Gamificação
- **Actions**: Ações que usuários podem realizar
- **Challenges**: Desafios do sistema
- **Categories**: Categorias de ações/desafios
- **User Activities**: Atividades dos usuários com status (pending/approved/rejected)

### Upload de Imagens
- Upload seguro com validação
- Armazenamento local
- Permissões (apenas admin ou dono pode modificar)

### Email
- Envio de email de recuperação de senha
- Template HTML personalizado
- Configuração SMTP flexível

## 🔐 Rotas

### Públicas
- `POST /api/users` - Criar usuário
- `POST /api/users/login` - Login
- `POST /api/users/send-recovery-email` - Solicitar recuperação de senha

### Autenticadas (User)
- `GET /api/users/me` - Dados do usuário logado
- `PUT /api/users/me` - Atualizar perfil
- `POST /api/users/update-password` - Atualizar senha
- `POST /api/user-activities` - Criar atividade
- `POST /api/images/upload` - Upload de imagem

### Autenticadas (Admin)
- `GET /api/admin/users` - Listar usuários
- `POST /api/admin/users` - Criar usuário
- `PUT /api/admin/users/:id` - Atualizar usuário
- `POST /api/admin/users/:id/approve` - Aprovar usuário
- `POST /api/admin/users/:id/reprove` - Reprovar usuário
- `DELETE /api/admin/users/:id` - Deletar usuário
- `PUT /api/user-activities/:id/status` - Atualizar status de atividade
- CRUD completo de Actions, Challenges e Categories

## ⚠️ Requisitos

- **Node.js**: >= 18.0.0
- **PostgreSQL**: >= 13
- **NPM**: >= 8

## 📝 Notas

- Atualize sua versão do Node.js para 18+ antes de deploy em produção
- Configure SMTP com credenciais reais antes de usar recuperação de senha
- Altere `JWT_SECRET` em produção para um valor seguro
- Configure CORS no arquivo `app.ts` para permitir apenas domínios confiáveis