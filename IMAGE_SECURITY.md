# Segurança de Imagens - Controle de Acesso

## Regras de Permissão

### Upload
- ✅ Apenas usuários **autenticados** podem fazer upload
- ✅ O upload é vinculado automaticamente ao usuário logado
- ✅ Não é possível fazer upload para outro usuário

### Visualização
- ✅ Apenas o **dono** da imagem ou **admin** podem ver detalhes completos
- ✅ URLs públicas podem ser acessadas diretamente (se necessário, adicione validação no Nginx)

### Atualização
- ✅ Apenas o **dono** da imagem ou **admin** podem atualizar
- ✅ Mantém o userId original ao atualizar

### Deleção
- ✅ Apenas o **dono** da imagem ou **admin** podem deletar
- ✅ Remove arquivo do disco e registro do banco

### Listagem
- ✅ Usuários comuns veem apenas suas próprias imagens
- ✅ Admins podem listar imagens de qualquer usuário via query param

## Middleware de Autenticação

Você precisará criar um middleware de autenticação JWT:

```typescript
// src/infra/middlewares/auth-middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: number;
  role: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Adicionar informações do usuário no request
    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

## Configuração das Rotas

```typescript
import express from "express";
import { authMiddleware } from "./middlewares/auth-middleware";

// Controllers
import UploadImageController, { uploadMiddleware } from "./controllers/image/upload-image-controller";
import GetImageByIdController from "./controllers/image/get-image-by-id-controller";
import UpdateImageController, { updateImageMiddleware } from "./controllers/image/update-image-controller";
import DeleteImageController from "./controllers/image/delete-image-controller";
import ListUserImagesController from "./controllers/image/list-user-images-controller";

// Use cases e repositories...
const imageRepository = new ImageRepositoryKysely(db);
const fileStorage = new LocalFileStorage('./uploads', process.env.BASE_URL);

const uploadImageUseCase = new UploadImageUseCase(imageRepository, fileStorage);
const getImageByIdUseCase = new GetImageByIdUseCase(imageRepository);
const updateImageUseCase = new UpdateImageUseCase(imageRepository, fileStorage);
const deleteImageUseCase = new DeleteImageUseCase(imageRepository, fileStorage);

const uploadImageController = new UploadImageController(uploadImageUseCase);
const getImageByIdController = new GetImageByIdController(getImageByIdUseCase);
const updateImageController = new UpdateImageController(updateImageUseCase);
const deleteImageController = new DeleteImageController(deleteImageUseCase);
const listUserImagesController = new ListUserImagesController(imageRepository);

const router = express.Router();

// Todas as rotas de imagens requerem autenticação
router.post('/images/upload', authMiddleware, uploadMiddleware, (req, res) => {
  uploadImageController.handle(req, res);
});

router.get('/images/:id', authMiddleware, (req, res) => {
  getImageByIdController.handle(req, res);
});

router.put('/images/:id', authMiddleware, updateImageMiddleware, (req, res) => {
  updateImageController.handle(req, res);
});

router.delete('/images/:id', authMiddleware, (req, res) => {
  deleteImageController.handle(req, res);
});

router.get('/images', authMiddleware, (req, res) => {
  listUserImagesController.handle(req, res);
});

app.use('/api', router);
```

## Exemplos de Uso

### Upload (Usuário Autenticado)
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -F "image=@/path/to/image.jpg"
```

### Listar Minhas Imagens
```bash
curl -X GET http://localhost:3000/api/images \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### Listar Imagens de Outro Usuário (Admin)
```bash
curl -X GET http://localhost:3000/api/images?userId=123 \
  -H "Authorization: Bearer ADMIN_TOKEN_JWT"
```

### Atualizar Imagem
```bash
curl -X PUT http://localhost:3000/api/images/1 \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -F "image=@/path/to/new-image.jpg"
```

### Deletar Imagem
```bash
curl -X DELETE http://localhost:3000/api/images/1 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## Respostas HTTP

### 200 OK
Operação bem-sucedida

### 201 Created
Imagem criada com sucesso

### 400 Bad Request
Dados inválidos ou arquivo com problema

### 401 Unauthorized
Token não fornecido ou inválido

### 403 Forbidden
Usuário não tem permissão para acessar o recurso

### 404 Not Found
Imagem não encontrada

## Segurança Adicional no Nginx

Para proteger as URLs públicas dos arquivos:

```nginx
location /uploads/ {
    alias /var/www/calebe-levelup-api/uploads/;
    
    # Apenas permitir acesso de requisições internas
    internal;
    
    # Ou validar token via auth_request
    # auth_request /api/auth/validate-image-access;
}

# Rota para validar acesso (Express)
location = /api/auth/validate-image-access {
    internal;
    proxy_pass http://localhost:3000;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

## Auditoria

Considere adicionar logs para rastrear acessos:

```typescript
// No use case
logger.info('Image access', {
  imageId: id,
  userId: requestingUserId,
  action: 'view|update|delete',
  timestamp: new Date(),
});
```
