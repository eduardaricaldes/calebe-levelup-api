export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export default class User {
  id: number | undefined;
  externalId: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    externalId: string,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.externalId = externalId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}