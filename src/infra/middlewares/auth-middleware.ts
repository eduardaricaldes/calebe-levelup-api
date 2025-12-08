import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserRepository from "@/domain/repositories/user-repository";

interface JWTPayload {
  externalId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        externalId: string;
        role: string;
        email: string;
        name: string;
      };
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: "JWT secret not configured" });
      }

      // Verificar token
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

      // Buscar usuário pelo externalId
      const user = await this.userRepository.findByExternalId(decoded.externalId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Verificar se o usuário está ativo
      if (user.status !== "ACTIVE") {
        return res.status(403).json({ error: "User account is not active" });
      }

      // Adicionar informações do usuário no request
      req.user = {
        id: user.id!,
        externalId: user.externalId!,
        role: user.role,
        email: user.email,
        name: user.name,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
