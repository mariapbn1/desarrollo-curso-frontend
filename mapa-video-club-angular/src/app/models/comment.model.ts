export interface Comment {
  id: number;
  movieId: string;
  name: string;
  text: string;
  dateLabel: string;
  createdAt: string;
}

export interface CommentFormData {
  name: string;
  text: string;
}

export interface CommentResult {
  success: boolean;
  message: string;
  comment?: Comment;
  comments: readonly Comment[];
}
