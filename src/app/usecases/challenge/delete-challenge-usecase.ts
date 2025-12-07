import ChallengeRepository from "@/domain/repositories/challenge-repository";

export default class DeleteChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: number): Promise<void> {
    const challenge = await this.challengeRepository.findById(id);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    await this.challengeRepository.delete(id);
  }
}
