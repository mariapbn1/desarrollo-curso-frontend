import { TestBed } from '@angular/core/testing';

import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty comments by default', () => {
    expect(service.getComments(1)).toEqual([]);
  });

  it('should add a comment', () => {
    const result = service.addComment(1, {
      name: 'Laura',
      text: 'Gran pelicula para volver a rentar.',
    });

    expect(result.success).toBe(true);
    expect(service.getComments(1)).toEqual([
      expect.objectContaining({
        name: 'Laura',
        text: 'Gran pelicula para volver a rentar.',
      }),
    ]);
  });

  it('should delete a comment', () => {
    const result = service.addComment(1, {
      name: 'Laura',
      text: 'Gran pelicula.',
    });

    service.deleteComment(1, result.comment?.id ?? 0);

    expect(service.getComments(1)).toEqual([]);
  });

  it('should not mix comments between movies', () => {
    service.addComment(1, {
      name: 'Laura',
      text: 'Comentario pelicula uno.',
    });
    service.addComment(2, {
      name: 'Diego',
      text: 'Comentario pelicula dos.',
    });

    expect(service.getComments(1)).toEqual([
      expect.objectContaining({ text: 'Comentario pelicula uno.' }),
    ]);
    expect(service.getComments(2)).toEqual([
      expect.objectContaining({ text: 'Comentario pelicula dos.' }),
    ]);
  });
});
