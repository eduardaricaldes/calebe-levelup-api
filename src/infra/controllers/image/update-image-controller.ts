import { Request, Response } from "express";
import UpdateImageUseCase from "@/app/usecases/image/update-image-usecase";
import multer from "multer";

// Configuração do multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed"));
    }
  },
});

export const updateImageMiddleware = upload.single("image");

export default class UpdateImageController {
  constructor(private readonly updateImageUseCase: UpdateImageUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "Image ID is required",
        });
      }

      // Verificar se o arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
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

      const image = await this.updateImageUseCase.execute({
        id: Number(id),
        file: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        requestingUserId,
        isAdmin,
      });

      return res.status(200).json({
        id: image.id,
        url: image.url,
        fileName: image.fileName,
        originalName: image.originalName,
        size: image.size,
        mimeType: image.mimeType,
        createdAt: image.createdAt,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "You don't have permission to update this image") {
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
