/**
 * Comentario persistido por pelicula y mostrado en orden cronologico descendente.
 */
export interface Comment {
  id: number;
  movieId: string;
  name: string;
  text: string;
  dateLabel: string;
  createdAt: string;
}

/**
 * Datos capturados desde el formulario de detalle antes de validarlos.
 */
export interface CommentFormData {
  name: string;
  text: string;
}

/**
 * Resultado de guardado con feedback para la vista de detalle.
 */
export interface CommentResult {
  success: boolean;
  message: string;
  comment?: Comment;
  comments: readonly Comment[];
}
