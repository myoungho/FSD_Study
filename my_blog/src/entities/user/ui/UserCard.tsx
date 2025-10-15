// entities/user/ui/UserCard.tsx
import { Card, CardContent } from "@/shared/ui";
import { UserAvatar } from "./UserAvatar";
import type { User } from "../model/types";

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} avatar={user.avatar} size="lg" />

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>{user.postsCount} posts</span>
              <span>{user.followersCount} followers</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
