export const UserStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    WAITING_ACTIVATION: "WAITING_ACTIVATION",
    RESET_PASSWORD: "RESET_PASSWORD"
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export const UserRole = {
    ADMIN: "ADMIN",
    USER: "USER"
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const UserActivityStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
} as const;
export type UserActivityStatus = (typeof UserActivityStatus)[keyof typeof UserActivityStatus];
