import ChallengeRepository from "@/domain/repositories/challenge-repository";
import Challenge from "@/domain/entities/challenge";

export default class ListChallengesUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(): Promise<Challenge[]> {
    const challenges = await this.challengeRepository.findAll();
    return challenges;
  }
}
