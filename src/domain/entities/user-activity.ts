export enum UserActivityStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export default class UserActivity {
  id: number | null;
  userId: number;
  actionId: number | null;
  challengeId: number | null;
  photoUrl: string | null;
  status: UserActivityStatus;
  approverId: number | null;
  approvedAt: Date | null;
  repprovedDescription: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    userId: number,
    actionId: number | null,
    challengeId: number | null,
    photoUrl: string | null,
    date: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = null;
    this.userId = userId;
    this.actionId = actionId;
    this.challengeId = challengeId;
    this.photoUrl = photoUrl;
    this.status = UserActivityStatus.PENDING;
    this.approverId = null;
    this.approvedAt = null;
    this.repprovedDescription = null;
    this.date = date;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
