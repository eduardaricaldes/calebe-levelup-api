# Upload de Imagens - Configuração para VPS

## Estrutura de Diretórios no VPS

```bash
# Criar diretório de uploads com permissões adequadas
mkdir -p /var/www/calebe-levelup-api/uploads
chmod 755 /var/www/calebe-levelup-api/uploads
chown -R node:node /var/www/calebe-levelup-api/uploads
```

## Configuração do Nginx (Recomendado)

### Servir arquivos estáticos diretamente pelo Nginx

```nginx
server {
    listen 80;
    server_name seudominio.com;

    # Limite de tamanho do upload
    client_max_body_size 5M;

    # Servir arquivos estáticos de uploads
    location /uploads/ {
        alias /var/www/calebe-levelup-api/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Prevenir execução de scripts
        location ~ \.(php|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }

    # Proxy para a aplicação Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout para upload
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

### Com SSL (HTTPS) usando Let's Encrypt

```nginx
server {
    listen 443 ssl http2;
    server_name seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    client_max_body_size 5M;

    location /uploads/ {
        alias /var/www/calebe-levelup-api/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        location ~ \.(php|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name seudominio.com;
    return 301 https://$server_name$request_uri;
}
```

## Variáveis de Ambiente (.env)

```env
NODE_ENV=production
BASE_URL=https://seudominio.com
UPLOAD_DIR=/var/www/calebe-levelup-api/uploads
```

## Instanciar o LocalFileStorage

```typescript
import LocalFileStorage from './services/local-file-storage';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const fileStorage = new LocalFileStorage(uploadDir, baseUrl);
```

## Backup Automático (Cron Job)

### Script de Backup

```bash
#!/bin/bash
# /var/www/calebe-levelup-api/scripts/backup-uploads.sh

BACKUP_DIR="/var/backups/calebe-levelup-api"
UPLOAD_DIR="/var/www/calebe-levelup-api/uploads"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $UPLOAD_DIR .

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete
```

### Configurar Cron

```bash
# Editar crontab
crontab -e

# Adicionar linha para backup diário às 2h da manhã
0 2 * * * /var/www/calebe-levelup-api/scripts/backup-uploads.sh
```

## PM2 Configuration (Process Manager)

```json
{
  "apps": [{
    "name": "calebe-levelup-api",
    "script": "dist/server.js",
    "instances": 2,
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production",
      "BASE_URL": "https://seudominio.com",
      "UPLOAD_DIR": "/var/www/calebe-levelup-api/uploads"
    }
  }]
}
```

## Monitoramento de Espaço em Disco

### Script de Monitoramento

```bash
#!/bin/bash
# /var/www/calebe-levelup-api/scripts/check-disk-space.sh

THRESHOLD=80
CURRENT=$(df /var/www/calebe-levelup-api/uploads | tail -1 | awk '{print $5}' | sed 's/%//')

if [ $CURRENT -gt $THRESHOLD ]; then
    echo "Warning: Disk space usage is at ${CURRENT}%"
    # Enviar notificação ou email
fi
```

## Limpeza de Imagens Órfãs

### Script para deletar imagens não referenciadas

```typescript
// scripts/cleanup-orphan-images.ts
import { Kysely } from 'kysely';
import * as fs from 'fs/promises';
import * as path from 'path';

async function cleanupOrphanImages(db: Kysely<any>, uploadDir: string) {
  // Buscar todos os nomes de arquivos do banco
  const images = await db
    .selectFrom('images')
    .select('file_name')
    .execute();
  
  const dbFileNames = new Set(images.map(img => img.file_name));
  
  // Listar arquivos no diretório
  const files = await fs.readdir(uploadDir);
  
  // Deletar arquivos que não estão no banco
  for (const file of files) {
    if (!dbFileNames.has(file)) {
      const filePath = path.join(uploadDir, file);
      await fs.unlink(filePath);
      console.log(`Deleted orphan file: ${file}`);
    }
  }
}
```

## Segurança Adicional no VPS

### 1. Firewall (UFW)

```bash
# Permitir apenas SSH, HTTP e HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Fail2Ban para proteção contra brute force

```bash
apt-get install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Permissões de Arquivo

```bash
# Aplicação não deve ter permissão de execução em uploads
find /var/www/calebe-levelup-api/uploads -type f -exec chmod 644 {} \;
find /var/www/calebe-levelup-api/uploads -type d -exec chmod 755 {} \;
```

## Otimização de Imagens (Opcional)

### Instalar Sharp para otimizar imagens no upload

```bash
npm install sharp
```

### Modificar LocalFileStorage

```typescript
import * as sharp from 'sharp';

async save(file: Buffer, originalFileName: string): Promise<FileUploadResult> {
  await this.ensureUploadDirExists();
  
  const fileName = this.generateSecureFileName(originalFileName);
  const filePath = path.join(this.uploadDir, fileName);
  
  // Otimizar imagem antes de salvar
  await sharp(file)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filePath);
  
  return {
    fileName,
    url: this.getUrl(fileName),
  };
}
```

## Logs e Monitoramento

```typescript
// Adicionar logging no LocalFileStorage
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'uploads-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'uploads.log' }),
  ],
});

// No método save
logger.info('File uploaded', { fileName, size: file.length, userId });
```

## Checklist de Deploy

- [ ] Criar diretório de uploads com permissões corretas
- [ ] Configurar Nginx para servir arquivos estáticos
- [ ] Configurar SSL com Let's Encrypt
- [ ] Configurar variáveis de ambiente
- [ ] Configurar PM2 para gerenciar o processo
- [ ] Configurar backup automático
- [ ] Configurar firewall (UFW)
- [ ] Instalar e configurar Fail2Ban
- [ ] Testar upload e acesso às imagens
- [ ] Configurar monitoramento de disco
- [ ] Configurar logs de aplicação
