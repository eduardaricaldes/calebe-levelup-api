import { Request, Response } from "express";
import UploadImageUseCase from "@/app/usecases/image/upload-image-usecase";
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

export const uploadMiddleware = upload.single("image");

export default class UploadImageController {
  constructor(private readonly uploadImageUseCase: UploadImageUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se o arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      // Obter userId do body ou de um token JWT (auth middleware)
      const userId = req.body.userId || (req as any).user?.id;

      if (!userId) {
        return res.status(400).json({
          error: "userId is required",
        });
      }

      const image = await this.uploadImageUseCase.execute({
        file: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        userId: Number(userId),
      });

      return res.status(201).json({
        id: image.id,
        url: image.url,
        fileName: image.fileName,
        originalName: image.originalName,
        size: image.size,
        mimeType: image.mimeType,
        createdAt: image.createdAt,
      });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
