// entities/comment/ui/CommentItem.tsx
import { Card, CardContent, Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { formatDate } from "@/shared/lib";
import type { Comment } from "../model/types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>
              {comment.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">
                {comment.author.name}
              </span>
              <time className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </time>
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            <p className="text-sm">{comment.content}</p>

            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <button className="hover:text-foreground">
                ❤️ {comment.likesCount}
              </button>
              <button className="hover:text-foreground">Reply</button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
