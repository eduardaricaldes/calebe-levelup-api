# Middlewares de Autenticação e Autorização

## Estrutura

### 1. AuthMiddleware (Base)
Valida o token JWT e busca o usuário pelo `externalId` contido no token.

### 2. AdminMiddleware
Valida que o usuário autenticado tem role `ADMIN`.

### 3. UserMiddleware
Valida que o usuário autenticado tem role `USER`.

## Configuração

### Instanciar o AuthMiddleware

```typescript
import { AuthMiddleware } from './middlewares/auth-middleware';
import { adminMiddleware } from './middlewares/admin-middleware';
import { userMiddleware } from './middlewares/user-middleware';
import UserRepositoryKysely from './database/kysely/user-repository-kysely';

// Instanciar repositório
const userRepository = new UserRepositoryKysely(db);

// Instanciar middleware de autenticação
const authMiddleware = new AuthMiddleware(userRepository);

// Criar função bound para usar nas rotas
const authenticate = authMiddleware.authenticate.bind(authMiddleware);
```

## Uso nas Rotas

### Rotas Públicas (sem autenticação)
```typescript
router.post('/auth/login', (req, res) => {
  loginController.handle(req, res);
});

router.post('/auth/register', (req, res) => {
  createUserController.handle(req, res);
});
```

### Rotas que requerem autenticação (qualquer usuário logado)
```typescript
router.get('/me', authenticate, (req, res) => {
  meController.handle(req, res);
});

router.put('/me', authenticate, (req, res) => {
  updateUserController.handle(req, res);
});
```

### Rotas apenas para ADMIN
```typescript
router.post('/admin/users', authenticate, adminMiddleware, (req, res) => {
  createUserByAdminController.handle(req, res);
});

router.get('/admin/users', authenticate, adminMiddleware, (req, res) => {
  listUsersController.handle(req, res);
});

router.put('/admin/users/:externalId/approve', authenticate, adminMiddleware, (req, res) => {
  approveUserController.handle(req, res);
});

router.delete('/admin/users/:externalId', authenticate, adminMiddleware, (req, res) => {
  deleteUserController.handle(req, res);
});
```

### Rotas apenas para USER
```typescript
router.post('/user/activities', authenticate, userMiddleware, (req, res) => {
  createUserActivityController.handle(req, res);
});

router.get('/user/activities', authenticate, userMiddleware, (req, res) => {
  listUserActivitiesController.handle(req, res);
});
```

### Rotas com lógica condicional (admin ou dono do recurso)
```typescript
// Não usa userMiddleware nem adminMiddleware
// A lógica de permissão fica no controller/use case
router.get('/images/:id', authenticate, (req, res) => {
  getImageByIdController.handle(req, res);
});

router.delete('/images/:id', authenticate, (req, res) => {
  deleteImageController.handle(req, res);
});
```

## Acessar dados do usuário no Controller

```typescript
import { Request, Response } from "express";

export default class MeController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // req.user está disponível após passar pelo authenticate
      const userId = req.user!.id;
      const userExternalId = req.user!.externalId;
      const userRole = req.user!.role;
      const userEmail = req.user!.email;
      const userName = req.user!.name;

      // Usar os dados...
      return res.status(200).json({
        id: userId,
        externalId: userExternalId,
        role: userRole,
        email: userEmail,
        name: userName,
      });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
```

## Token JWT - Payload

O token deve conter:

```typescript
{
  externalId: "uuid-do-usuario",
  role: "ADMIN" | "USER"
}
```

### Gerar token no login

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    externalId: user.externalId,
    role: user.role,
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  }
);
```

## Exemplo de Request

```bash
# Login para obter token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'

# Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "externalId": "uuid-123",
    "role": "USER"
  }
}

# Usar token em requisições autenticadas
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Respostas de Erro

### 401 Unauthorized
- Token não fornecido
- Token inválido
- Token expirado
- Usuário não encontrado

### 403 Forbidden
- Conta de usuário não está ativa
- Usuário não tem permissão (tentou acessar rota admin sendo user)

### 500 Internal Server Error
- JWT_SECRET não configurado
- Erro inesperado no servidor

## Variáveis de Ambiente

```env
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
JWT_EXPIRES_IN=7d
```

## Ordem dos Middlewares

**Importante**: A ordem correta é:

1. `authenticate` (sempre primeiro)
2. `adminMiddleware` ou `userMiddleware` (depois do authenticate)
3. Controller

```typescript
// ✅ Correto
router.post('/admin/users', authenticate, adminMiddleware, controller);

// ❌ Errado - adminMiddleware não terá req.user
router.post('/admin/users', adminMiddleware, authenticate, controller);
```

## Benefícios

1. **Centralizado**: Lógica de autenticação em um único lugar
2. **Reutilizável**: Use os middlewares em qualquer rota
3. **Type-safe**: TypeScript sabe que `req.user` existe após authenticate
4. **Seguro**: Valida token, busca usuário, verifica status
5. **Flexível**: Combine middlewares conforme necessário
6. **Separação de responsabilidades**: Auth separado de autorização
