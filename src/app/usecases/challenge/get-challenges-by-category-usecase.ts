import ChallengeRepository from "@/domain/repositories/challenge-repository";
import Challenge from "@/domain/entities/challenge";

export default class GetChallengesByCategoryUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(categoryId: number): Promise<Challenge[]> {
    const challenges = await this.challengeRepository.findByCategoryId(categoryId);
    return challenges;
  }
}
