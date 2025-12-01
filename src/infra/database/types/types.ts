import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { UserStatus, UserRole, UserActivityStatus } from "./enums";

export type Action = {
    id: Generated<number>;
    name: string;
    date: Date;
    description: string | null;
    category_id: number;
    created_at: Generated<Date>;
    updated_at: Date;
};
export type Category = {
    id: Generated<number>;
    name: string;
    points: number;
    description: string | null;
    created_at: Generated<Date>;
    updated_at: Date;
};
export type Challenge = {
    id: Generated<number>;
    name: string;
    date: Date;
    description: string | null;
    category_id: number;
    created_at: Generated<Date>;
    updated_at: Date;
};
export type Ranking = {
    id: Generated<number>;
    user_id: number;
    points: number;
    created_at: Generated<Date>;
    updated_at: Date;
};
export type User = {
    id: Generated<number>;
    external_id: string | null;
    name: string;
    email: string;
    password: string;
    avatar_url: string | null;
    status: Generated<UserStatus>;
    role: Generated<UserRole>;
    created_at: Generated<Date>;
    updated_at: Date;
};
export type UserActivity = {
    id: Generated<number>;
    user_id: number;
    action_id: number | null;
    challenge_id: number | null;
    photo_url: string | null;
    status: Generated<UserActivityStatus>;
    approver_id: number | null;
    approved_at: Date | null;
    repproved_description: string | null;
    date: Date;
    created_at: Generated<Date>;
    updated_at: Date;
};
export type DB = {
    action: Action;
    category: Category;
    challenge: Challenge;
    ranking: Ranking;
    user_activities: UserActivity;
    users: User;
};
