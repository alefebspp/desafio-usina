import api from "@/lib/axios";
import { Movie } from "@/types";

type CreateMovieParams = Omit<
  Movie,
  "created_at" | "updated_at" | "created_by" | "id"
> & {
  user_id: string;
};

type UpdateMovieParams = {
  data: Partial<CreateMovieParams>;
  id: string;
};

type FindAllMoviesParams = {
  pageParam: number;
  title?: string;
  genre?: string;
};

export async function createMovie(data: CreateMovieParams) {
  const response = await api.post<{ message: string }>("/movies", data);

  return response.data;
}

export async function updateMovie({ data, id }: UpdateMovieParams) {
  const response = await api.patch<{ message: string }>("/movies/" + id, data);

  return response.data;
}

export async function getAllMovies({
  pageParam,
  title,
  genre,
}: FindAllMoviesParams) {
  let url = `/movies?page=${pageParam}`;

  if (title) {
    url = url + `&title=${title}`;
  }

  if (genre) {
    url = url + `&genre=${genre}`;
  }

  const response = await api.get<{
    data: Movie[];
    pages: number;
    page: number;
  }>(url);

  return response.data;
}

export async function deleteMovie(id: string) {
  const response = await api.delete<{ message: string }>("/movies/" + id);

  return response.data;
}
