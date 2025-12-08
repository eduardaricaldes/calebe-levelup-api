import UserRepository from "@/domain/repositories/user-repository";
import User from "@/domain/entities/user";

export default class ApproveUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(externalId: string): Promise<User> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "WAITING_ACTIVATION") {
      throw new Error("User is not waiting for approval");
    }

    user.status = "ACTIVE";
    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.update(user);
    return updatedUser;
  }
}
