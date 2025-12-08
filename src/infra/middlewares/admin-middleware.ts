import { Request, Response, NextFunction } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void | Response {
  // Verificar se o usuário foi autenticado pelo auth-middleware
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verificar se o usuário é admin
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ 
      error: "Forbidden: Admin access required" 
    });
  }

  next();
}
