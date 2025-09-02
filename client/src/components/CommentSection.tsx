import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CommentSectionProps {
  videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['/api/videos', videoId, 'comments'],
    enabled: !!videoId,
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/videos/${videoId}/comments`, { content });
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      setShowCommentInput(false);
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'comments'] });
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    if (newComment.trim()) {
      commentMutation.mutate(newComment.trim());
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-6" data-testid="comments-title">
          Comments ({comments?.length || 0})
        </h3>
        
        {/* Comment Input */}
        <div className="mb-8">
          {user ? (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profileImageUrl} />
                  <AvatarFallback>
                    {user.firstName?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onFocus={() => setShowCommentInput(true)}
                    className="resize-none border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={showCommentInput ? 3 : 1}
                    data-testid="comment-input"
                  />
                </div>
              </div>
              
              {showCommentInput && (
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowCommentInput(false);
                      setNewComment("");
                    }}
                    data-testid="cancel-comment-button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || commentMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="submit-comment-button"
                  >
                    {commentMutation.isPending ? 'Posting...' : 'Comment'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted rounded-lg">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="sign-in-to-comment-button"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments?.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">No comments yet</h4>
            <p className="text-muted-foreground">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments?.map((comment: any) => (
              <div key={comment.id} className="flex space-x-4" data-testid={`comment-${comment.id}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.user?.profileImageUrl} />
                  <AvatarFallback>
                    {comment.user?.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-card-foreground text-sm" data-testid="comment-author">
                      {comment.user?.firstName && comment.user?.lastName
                        ? `${comment.user.firstName} ${comment.user.lastName}`
                        : 'Unknown User'
                      }
                    </span>
                    <span className="text-muted-foreground text-xs" data-testid="comment-timestamp">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-card-foreground mb-3 whitespace-pre-wrap" data-testid="comment-content">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-foreground p-0 h-auto"
                      data-testid="comment-like-button"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {comment.likes || 0}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-foreground p-0 h-auto"
                      data-testid="comment-dislike-button"
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {comment.dislikes || 0}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-foreground p-0 h-auto"
                      data-testid="comment-reply-button"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
