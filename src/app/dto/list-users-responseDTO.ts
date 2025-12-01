export interface UserListItemDTO {
  externalId: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersResponseDTO {
  data: UserListItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
