export interface ListUsersRequestDTO {
  page?: number | undefined;
  limit?: number | undefined;
  status?: string | undefined;
  role?: string | undefined;
  search?: string | undefined;
}
