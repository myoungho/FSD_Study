// shared/types/common.ts
export type ID = string | number;

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}

export type Status = "idle" | "loading" | "success" | "error";

export interface LoadingState {
  status: Status;
  error?: string;
}
