import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from "@/shared/ui";
import { formatDate, cn } from "@/shared/lib";
import type { PostPreview } from "../model/types";

interface PostCardProps {
  post: PostPreview;
  className?: string;
  onClick?: () => void;
}

export function PostCard({ post, className, onClick }: PostCardProps) {
  return (
    <Card
      className={cn("cursor-pointer transition-all hover:shadow-lg", className)}
      onClick={onClick}
    >
      {post.coverImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{post.category}</Badge>
          <time className="text-sm text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h3 className="text-2xl font-bold line-clamp-2 hover:text-primary">
          {post.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>❤️ {post.likesCount}</span>
            <span>💬 {post.commentsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
