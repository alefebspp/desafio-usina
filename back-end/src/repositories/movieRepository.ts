import Movie from "@/models/movie";

export interface CreateMovieDTO
  extends Omit<Movie, "updated_at" | "created_at" | "id"> {}
export interface UpdateMovieDTO {
  data: Partial<CreateMovieDTO>;
  id: string;
}
export interface FindAllMoviesParams {
  page: number;
  title?: string;
  genre?: string;
  year?: number;
}

export default interface MovieRepository {
  create: (data: CreateMovieDTO) => Promise<void>;
  findById: (id: string) => Promise<Movie | null>;
  findAll: (
    params: FindAllMoviesParams
  ) => Promise<{ data: Movie[]; pages: number; page: number }>;
  findByTitle: (title: string) => Promise<Movie | null>;
  delete: (id: string) => Promise<void>;
  update: (data: UpdateMovieDTO) => Promise<void>;
}
