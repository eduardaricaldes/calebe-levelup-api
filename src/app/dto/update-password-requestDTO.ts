export interface UpdatePasswordRequestDTO {
  externalId: string;
  currentPassword: string;
  newPassword: string;
}
