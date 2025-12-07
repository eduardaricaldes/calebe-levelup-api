export default class Image {
  id: number | null;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  userId: number;
  createdAt: Date;

  constructor(
    originalName: string,
    fileName: string,
    mimeType: string,
    size: number,
    url: string,
    userId: number,
    createdAt: Date,
  ) {
    this.id = null;
    this.originalName = originalName;
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.size = size;
    this.url = url;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
