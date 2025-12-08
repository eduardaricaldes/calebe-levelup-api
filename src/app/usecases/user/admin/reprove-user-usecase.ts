import UserRepository from "@/domain/repositories/user-repository";
import User from "@/domain/entities/user";

export default class ReproveUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(externalId: string, reason?: string): Promise<User> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "WAITING_ACTIVATION") {
      throw new Error("User is not waiting for approval");
    }

    user.status = "INACTIVE";
    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.update(user);
    return updatedUser;
  }
}
