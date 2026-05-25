import { Injectable, signal } from '@angular/core';

import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly comments = signal<Comment[]>([]);

  getCommentsByMovie(movieId: string): readonly Comment[] {
    return this.comments().filter((comment) => comment.movieId === movieId);
  }

  setComments(comments: readonly Comment[]): void {
    this.comments.set([...comments]);
  }
}
