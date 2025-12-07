import ChallengeRepository from "@/domain/repositories/challenge-repository";
import Challenge from "@/domain/entities/challenge";

export default class GetChallengeByIdUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: number): Promise<Challenge | null> {
    const challenge = await this.challengeRepository.findById(id);
    return challenge;
  }
}
