export interface CreateUserResponseDTO {
  externalId: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}