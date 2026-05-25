import { Injectable, signal } from '@angular/core';

import { Comment, CommentFormData, CommentResult } from '../../models/comment.model';

type CommentsMap = Record<string, Comment[]>;

const STORAGE_KEY = 'mapaVideoClubComments';

@Injectable({
  providedIn: 'root',
})
/**
 * Persiste comentarios por pelicula en localStorage y los entrega del mas reciente al mas antiguo.
 */
export class CommentService {
  private readonly commentsMap = signal<CommentsMap>(this.readCommentsMap());

  /**
   * Obtiene comentarios de una pelicula sin mezclar datos entre ids.
   */
  getComments(movieId: number | string): readonly Comment[] {
    const movieKey = this.normalizeMovieId(movieId);

    return this.sortComments(this.commentsMap()[movieKey] ?? []);
  }

  getCommentsByMovie(movieId: string): readonly Comment[] {
    return this.getComments(movieId);
  }

  /**
   * Guarda una lista normalizada de comentarios para una pelicula concreta.
   */
  saveComments(movieId: number | string, comments: readonly Comment[]): boolean {
    const movieKey = this.normalizeMovieId(movieId);
    const nextComments = this.sortComments(
      comments.map((comment) => this.normalizeComment(movieKey, comment)),
    );
    const nextCommentsMap = {
      ...this.commentsMap(),
      [movieKey]: nextComments,
    };

    if (!this.writeCommentsMap(nextCommentsMap)) {
      return false;
    }

    this.commentsMap.set(nextCommentsMap);

    return true;
  }

  setComments(comments: readonly Comment[]): void {
    const groupedComments = comments.reduce<CommentsMap>((commentsMap, comment) => {
      const movieKey = this.normalizeMovieId(comment.movieId);

      commentsMap[movieKey] = [...(commentsMap[movieKey] ?? []), this.normalizeComment(movieKey, comment)];

      return commentsMap;
    }, {});

    this.writeCommentsMap(groupedComments);
    this.commentsMap.set(groupedComments);
  }

  /**
   * Agrega un comentario validando nombre y texto antes de persistirlo.
   */
  addComment(movieId: number | string, commentData: CommentFormData): CommentResult {
    const movieKey = this.normalizeMovieId(movieId);
    const name = String(commentData.name || '').trim();
    const text = String(commentData.text || '').trim();

    if (!name || !text) {
      return this.createResult(false, 'Debes completar tu nombre y el comentario.', movieKey);
    }

    const now = new Date();
    const comment: Comment = {
      id: Date.now(),
      movieId: movieKey,
      name,
      text,
      dateLabel: now.toLocaleString('es-CO'),
      createdAt: now.toISOString(),
    };
    const nextComments = [comment, ...this.getComments(movieKey)];

    if (!this.saveComments(movieKey, nextComments)) {
      return this.createResult(false, 'No fue posible guardar el comentario. Intenta nuevamente.', movieKey);
    }

    return {
      success: true,
      message: 'Comentario guardado correctamente.',
      comment,
      comments: this.getComments(movieKey),
    };
  }

  /**
   * Elimina un comentario especifico de la pelicula actual.
   */
  deleteComment(movieId: number | string, commentId: number | string): boolean {
    const movieKey = this.normalizeMovieId(movieId);
    const nextComments = this.getComments(movieKey).filter(
      (comment) => String(comment.id) !== String(commentId),
    );

    return this.saveComments(movieKey, nextComments);
  }

  getCommentCount(movieId: number | string): number {
    return this.getComments(movieId).length;
  }

  private createResult(success: boolean, message: string, movieId: string): CommentResult {
    return {
      success,
      message,
      comments: this.getComments(movieId),
    };
  }

  private normalizeMovieId(movieId: number | string): string {
    return String(movieId || '').trim();
  }

  private normalizeComment(movieId: string, comment: Comment): Comment {
    const createdAt = comment.createdAt || new Date(Number(comment.id) || Date.now()).toISOString();

    return {
      id: Number(comment.id) || Date.now(),
      movieId,
      name: String(comment.name || '').trim(),
      text: String(comment.text || '').trim(),
      dateLabel: comment.dateLabel || new Date(createdAt).toLocaleString('es-CO'),
      createdAt,
    };
  }

  private sortComments(comments: readonly Comment[]): Comment[] {
    return [...comments].sort(
      (commentA, commentB) =>
        new Date(commentB.createdAt).getTime() - new Date(commentA.createdAt).getTime() ||
        commentB.id - commentA.id,
    );
  }

  private readCommentsMap(): CommentsMap {
    const storage = this.getStorage();

    if (!storage) {
      return {};
    }

    try {
      const rawValue = storage.getItem(STORAGE_KEY);
      const parsedValue = rawValue ? (JSON.parse(rawValue) as CommentsMap) : {};

      if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
        return {};
      }

      return Object.entries(parsedValue).reduce<CommentsMap>((commentsMap, [movieId, comments]) => {
        commentsMap[movieId] = Array.isArray(comments)
          ? this.sortComments(comments.map((comment) => this.normalizeComment(movieId, comment)))
          : [];

        return commentsMap;
      }, {});
    } catch {
      return {};
    }
  }

  private writeCommentsMap(commentsMap: CommentsMap): boolean {
    const storage = this.getStorage();

    if (!storage) {
      return false;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(commentsMap));
      return true;
    } catch {
      return false;
    }
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
