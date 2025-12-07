import UserActivityRepository from "@/domain/repositories/user-activity-repository";
import UserActivity from "@/domain/entities/user-activity";
import ActionRepository from "@/domain/repositories/action-repository";
import ChallengeRepository from "@/domain/repositories/challenge-repository";

export default class CreateUserActivityUseCase {
  constructor(
    private readonly userActivityRepository: UserActivityRepository,
    private readonly actionRepository: ActionRepository,
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(
    userId: number,
    actionId: number | undefined,
    challengeId: number | undefined,
    photoUrl: string | undefined,
    date: Date,
  ): Promise<UserActivity> {

    if (!actionId && !challengeId) {
      throw new Error("Either actionId or challengeId must be provided");
    }


    if (actionId && challengeId) {
      throw new Error("Cannot provide both actionId and challengeId");
    }


    if (actionId) {
      const action = await this.actionRepository.findById(actionId);
      if (!action) {
        throw new Error("Action not found");
      }
    }

    if (challengeId) {
      const challenge = await this.challengeRepository.findById(challengeId);
      if (!challenge) {
        throw new Error("Challenge not found");
      }
    }

    const userActivity = await this.userActivityRepository.create({
      userId,
      actionId,
      challengeId,
      photoUrl,
      date,
    });

    return userActivity;
  }
}
