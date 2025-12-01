import User from "@/domain/entities/user";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface ListUsersFilters {
  status?: string;
  role?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export default interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByExternalId(externalId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  deleteByExternalId(externalId: string): Promise<void>;
  confirmUser(id: number): Promise<User>;
  list(page: number, limit: number, filters?: ListUsersFilters): Promise<PaginatedResult<User>>;
}