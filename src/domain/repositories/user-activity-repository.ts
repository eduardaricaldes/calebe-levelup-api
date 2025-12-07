import UserActivity, { UserActivityStatus } from "@/domain/entities/user-activity";

export interface CreateUserActivityDTO {
  userId: number;
  actionId?: number;
  challengeId?: number;
  photoUrl?: string;
  date: Date;
}

export interface UpdateUserActivityStatusDTO {
  id: number;
  status: UserActivityStatus;
  approverId: number;
  repprovedDescription?: string | undefined;
}

export default interface UserActivityRepository {
  create(data: CreateUserActivityDTO): Promise<UserActivity>;
  findById(id: number): Promise<UserActivity | null>;
  findAll(): Promise<UserActivity[]>;
  findByUserId(userId: number): Promise<UserActivity[]>;
  findByStatus(status: UserActivityStatus): Promise<UserActivity[]>;
  findPendingActivities(): Promise<UserActivity[]>;
  updateStatus(data: UpdateUserActivityStatusDTO): Promise<UserActivity>;
  update(userActivity: UserActivity): Promise<UserActivity>;
  delete(id: number): Promise<void>;
}
