import FileStorage, { FileUploadResult } from "@/domain/services/file-storage";
import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";

export default class LocalFileStorage implements FileStorage {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(uploadDir: string = "./uploads", baseUrl: string = process.env.BASE_URL || "http://localhost:3000") {
    this.uploadDir = uploadDir;
    this.baseUrl = baseUrl;
  }

  async save(file: Buffer, originalFileName: string): Promise<FileUploadResult> {
    // Criar diretório se não existir
    await this.ensureUploadDirExists();

    // Gerar nome único e seguro para o arquivo
    const fileName = this.generateSecureFileName(originalFileName);
    const filePath = path.join(this.uploadDir, fileName);

    // Salvar arquivo
    await fs.writeFile(filePath, file);

    // Retornar resultado
    return {
      fileName,
      url: this.getUrl(fileName),
    };
  }

  async delete(fileName: string): Promise<void> {
    // Validar nome do arquivo para prevenir path traversal
    if (this.isPathTraversal(fileName)) {
      throw new Error("Invalid file name");
    }

    const filePath = path.join(this.uploadDir, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Arquivo não existe ou erro ao deletar
      console.error(`Error deleting file ${fileName}:`, error);
    }
  }

  getUrl(fileName: string): string {
    return `${this.baseUrl}/uploads/${fileName}`;
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private generateSecureFileName(originalFileName: string): string {
    // Extrair extensão do arquivo original
    const ext = path.extname(originalFileName).toLowerCase();
    
    // Gerar hash único
    const hash = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    
    // Retornar nome seguro
    return `${timestamp}-${hash}${ext}`;
  }

  private isPathTraversal(fileName: string): boolean {
    // Verificar se o nome do arquivo contém caracteres suspeitos
    const normalizedPath = path.normalize(fileName);
    return normalizedPath.includes("..") || normalizedPath.startsWith("/") || normalizedPath.includes("\\");
  }
}
