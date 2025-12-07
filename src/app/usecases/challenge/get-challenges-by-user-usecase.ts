import ChallengeRepository from "@/domain/repositories/challenge-repository";
import Challenge from "@/domain/entities/challenge";

export default class GetChallengesByUserUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(userId: number): Promise<Challenge[]> {
    const challenges = await this.challengeRepository.findChallengesByUserID(userId);
    return challenges;
  }
}
