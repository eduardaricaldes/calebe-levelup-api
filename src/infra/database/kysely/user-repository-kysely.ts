import User from "@/domain/entities/user";
import UserRepository, { CreateUserDTO, ListUsersFilters, PaginatedResult } from "@/domain/repositories/user-repository";

// comunica com o banco de dados
export class UserRepositoryKysely implements UserRepository {
  async deleteByExternalId(externalId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async list(page: number, limit: number, filters?: ListUsersFilters): Promise<PaginatedResult<User>> {
    throw new Error("Method not implemented.");
  }
  async findById(id: number): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async findByExternalId(externalId: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async create(data: CreateUserDTO): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async update(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async confirmUser(id: number): Promise<User> {
    throw new Error("Method not implemented.");
  }
}