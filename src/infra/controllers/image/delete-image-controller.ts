import { Request, Response } from "express";
import DeleteImageUseCase from "@/app/usecases/image/delete-image-usecase";

export default class DeleteImageController {
  constructor(private readonly deleteImageUseCase: DeleteImageUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "Image ID is required",
        });
      }

      // Obter userId e role de um token JWT (auth middleware)
      const requestingUserId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      if (!requestingUserId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const isAdmin = userRole === "ADMIN";

      await this.deleteImageUseCase.execute(
        Number(id),
        requestingUserId,
        isAdmin
      );

      return res.status(200).json({
        message: "Image deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "You don't have permission to delete this image") {
        return res.status(403).json({
          error: error.message,
        });
      }

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
