export interface ListUsersRequestDTO {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  search?: string;
}
