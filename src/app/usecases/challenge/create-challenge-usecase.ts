import ChallengeRepository from "@/domain/repositories/challenge-repository";
import Challenge from "@/domain/entities/challenge";

export default class CreateChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(name: string, date: Date, description: string | null, categoryId: number): Promise<Challenge> {
    const challenge = await this.challengeRepository.create({
      name,
      date,
      description,
      categoryId,
    });

    return challenge;
  }
}
