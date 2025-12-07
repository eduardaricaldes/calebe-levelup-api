import { Request, Response } from "express";
import ImageRepository from "@/domain/repositories/image-repository";

export default class ListUserImagesController {
  constructor(private readonly imageRepository: ImageRepository) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Obter userId e role de um token JWT (auth middleware)
      const requestingUserId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      if (!requestingUserId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const isAdmin = userRole === "ADMIN";

      // Se for admin, pode ver userId via query param, senão apenas suas próprias imagens
      const targetUserId = isAdmin && req.query.userId 
        ? Number(req.query.userId) 
        : requestingUserId;

      const images = await this.imageRepository.findByUserId(targetUserId);

      return res.status(200).json(images);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
