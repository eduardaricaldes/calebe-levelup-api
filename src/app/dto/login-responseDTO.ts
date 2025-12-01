export interface LoginResponseDTO {
  token: string;
  user: {
    externalId: string;
    name: string;
    email: string;
    status: string;
    role: string;
  };
}
