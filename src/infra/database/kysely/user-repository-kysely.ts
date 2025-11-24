import User from "@/domain/entities/user";
import UserRepository, { CreateUserDTO } from "@/domain/repositories/user-repository";

// comunica com o banco de dados
export class UserRepositoryKysely implements UserRepository {
  async findById(id: number): Promise<User | null> {
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