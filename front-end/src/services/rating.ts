import api from "@/lib/axios";
import { Rating } from "@/types";

type CreateRatingParams = Omit<
  Rating,
  "created_at" | "updated_at" | "user" | "id"
>;

export async function createReview(data: CreateRatingParams) {
  const response = await api.post<{ message: string }>("/ratings", data);

  return response.data;
}

export async function listReviews({
  page,
  movie_id,
}: {
  page: number;
  movie_id: string;
}) {
  const url = "/ratings/" + `${movie_id}?page=${page}`;

  const response = await api.get<{ data: Rating[]; pages: number }>(url);

  return response.data;
}
