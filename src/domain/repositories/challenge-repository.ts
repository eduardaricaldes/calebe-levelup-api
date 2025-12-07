import Challenge from "@/domain/entities/challenge";

export interface CreateChallengeDTO {
  name: string;
  date: Date;
  description?: string;
  categoryId: number;
}

export default interface ChallengeRepository {
  create(data: CreateChallengeDTO): Promise<Challenge>;
  findById(id: number): Promise<Challenge | null>;
  findAll(): Promise<Challenge[]>;
  findByFilter(filter: Partial<CreateChallengeDTO>): Promise<Challenge[]>;
  findByCategoryId(categoryId: number): Promise<Challenge[]>;
  findChallengesByUserID(userId: number): Promise<Challenge[]>;
  update(challenge: Challenge): Promise<Challenge>;
  delete(id: number): Promise<void>;
}
