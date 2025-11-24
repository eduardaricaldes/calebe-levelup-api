import User from "@/domain/entities/user";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export default interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  confirmUser(id: number): Promise<User>;
}