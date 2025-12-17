export interface LoginResponseDTO {
  token: string;
  refreshToken: string;
  user: {
    externalId: string;
    name: string;
    email: string;
    status: string;
    role: string;
  };
}
