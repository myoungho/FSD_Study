// shared/config/constants.ts
export const APP_NAME = "FSD Blog";

export const ROUTES = {
  HOME: "/",
  POST_DETAIL: "/posts/:id",
  POST_CREATE: "/posts/create",
  POST_EDIT: "/posts/:id/edit",
  PROFILE: "/profile/:id",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const CATEGORIES = [
  "Architecture",
  "React",
  "TypeScript",
  "JavaScript",
  "CSS",
  "Backend",
  "DevOps",
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const VALIDATION = {
  POST_TITLE_MIN_LENGTH: 5,
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MIN_LENGTH: 100,
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 500,
} as const;
