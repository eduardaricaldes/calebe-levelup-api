import ChallengeRepository from "@/domain/repositories/challenge-repository";
import Challenge from "@/domain/entities/challenge";

export default class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(
    id: number,
    name?: string,
    date?: Date,
    description?: string,
    categoryId?: number
  ): Promise<Challenge> {
    const challenge = await this.challengeRepository.findById(id);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (name) challenge.name = name;
    if (date) challenge.date = date;
    if (description !== undefined) challenge.description = description;
    if (categoryId) challenge.categoryId = categoryId;

    challenge.updatedAt = new Date();

    const updatedChallenge = await this.challengeRepository.update(challenge);
    return updatedChallenge;
  }
}
