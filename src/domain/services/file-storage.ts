export interface FileUploadResult {
  fileName: string;
  url: string;
}

export default interface FileStorage {
  save(file: Buffer, fileName: string): Promise<FileUploadResult>;
  delete(fileName: string): Promise<void>;
  getUrl(fileName: string): string;
}
