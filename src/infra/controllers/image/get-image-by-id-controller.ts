import { Request, Response } from "express";
import GetImageByIdUseCase from "@/app/usecases/image/get-image-by-id-usecase";

export default class GetImageByIdController {
  constructor(private readonly getImageByIdUseCase: GetImageByIdUseCase) {}

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

      const image = await this.getImageByIdUseCase.execute(
        Number(id),
        requestingUserId,
        isAdmin
      );

      return res.status(200).json(image);
    } catch (error) {
      if (error instanceof Error && error.message === "You don't have permission to access this image") {
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
