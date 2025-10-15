// entities/user/model/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "admin" | "author" | "reader";
  createdAt: Date;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
