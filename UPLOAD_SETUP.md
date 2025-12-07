# Upload de Imagens - Configuração

## Instalação de Dependências

```bash
npm install multer
npm install --save-dev @types/multer
```

## Variável de Ambiente

Adicione no seu `.env`:

```env
BASE_URL=http://localhost:3000
```

## Criar Migration

Execute o comando para criar a migration do modelo Image:

```bash
npx prisma migrate dev --name create_images_table
```

## Estrutura de Diretórios

O sistema criará automaticamente o diretório `uploads/` na raiz do projeto para armazenar as imagens.

## Servir Arquivos Estáticos

No seu arquivo principal do Express, adicione:

```typescript
import express from 'express';
import path from 'path';

const app = express();

// Servir arquivos estáticos do diretório uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

## Uso do Controller

### Configuração da Rota

```typescript
import UploadImageController, { uploadMiddleware } from './controllers/image/upload-image-controller';
import UploadImageUseCase from './usecases/image/upload-image-usecase';
import ImageRepositoryKysely from './database/kysely/image-repository-kysely';
import LocalFileStorage from './services/local-file-storage';

// Instanciar dependências
const imageRepository = new ImageRepositoryKysely(db);
const fileStorage = new LocalFileStorage('./uploads', process.env.BASE_URL);
const uploadImageUseCase = new UploadImageUseCase(imageRepository, fileStorage);
const uploadImageController = new UploadImageController(uploadImageUseCase);

// Rota
app.post('/api/images/upload', uploadMiddleware, (req, res) => {
  uploadImageController.handle(req, res);
});
```

### Exemplo de Request (usando curl)

```bash
curl -X POST http://localhost:3000/api/images/upload \
  -F "image=@/path/to/image.jpg" \
  -F "userId=1"
```

### Exemplo de Request (usando Postman/Insomnia)

- Método: POST
- URL: http://localhost:3000/api/images/upload
- Body: form-data
  - Key: `image` (type: File)
  - Key: `userId` (type: Text, value: 1)

## Segurança Implementada

1. **Validação de Tipo de Arquivo**: Apenas imagens (jpeg, jpg, png, gif, webp)
2. **Limite de Tamanho**: Máximo 5MB por arquivo
3. **Nome de Arquivo Único**: Gerado com timestamp + hash criptográfico
4. **Proteção contra Path Traversal**: Validação do nome do arquivo
5. **Armazenamento Seguro**: Arquivos salvos com nomes únicos
6. **Relação com Usuário**: Cada imagem vinculada a um usuário
7. **Índices no Banco**: Para otimização de queries
8. **Cascade Delete**: Imagens deletadas quando usuário é deletado

## Response Example

```json
{
  "id": 1,
  "url": "http://localhost:3000/uploads/1733598123456-a1b2c3d4e5f6g7h8.jpg",
  "fileName": "1733598123456-a1b2c3d4e5f6g7h8.jpg",
  "originalName": "minha-foto.jpg",
  "size": 245678,
  "mimeType": "image/jpeg",
  "createdAt": "2025-12-07T15:30:00.000Z"
}
```
