export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export default class User {
  id: number | undefined;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    role: string,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}