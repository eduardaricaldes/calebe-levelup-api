import UserActivityRepository from "@/domain/repositories/user-activity-repository";
import UserActivity, { UserActivityStatus } from "@/domain/entities/user-activity";

export default class UpdateUserActivityStatusUseCase {
  constructor(private readonly userActivityRepository: UserActivityRepository) {}

  async execute(
    id: number,
    status: UserActivityStatus,
    approverId: number,
    repprovedDescription?: string,
  ): Promise<UserActivity> {
    if (status !== UserActivityStatus.APPROVED && status !== UserActivityStatus.REJECTED) {
      throw new Error("Status must be APPROVED or REJECTED");
    }

    const userActivity = await this.userActivityRepository.findById(id);
    if (!userActivity) {
      throw new Error("User activity not found");
    }

    if (userActivity.status !== UserActivityStatus.PENDING) {
      throw new Error("User activity is not pending");
    }

    if (status === UserActivityStatus.REJECTED && !repprovedDescription) {
      throw new Error("Reproved description is required when rejecting an activity");
    }

    const updatedUserActivity = await this.userActivityRepository.updateStatus({
      id,
      status,
      approverId,
      repprovedDescription,
    });

    return updatedUserActivity;
  }
}
