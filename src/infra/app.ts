import express, { Application } from 'express';
import cors from 'cors';
import { createDatabase } from './database/kysely/database';
import { Container } from './container';
import { setupRoutes } from './routes';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Application {
  const app = express();

  // Middlewares básicos
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Servir arquivos estáticos de uploads
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

  // Inicializar banco de dados
  const db = createDatabase();

  // Inicializar container de dependências
  const container = new Container(db);

  // Configurar rotas
  const router = setupRoutes(container);
  app.use('/api', router);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Rota 404
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Route not found',
      path: req.path,
    });
  });

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  return app;
}
