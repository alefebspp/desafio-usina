import Rating from "@/models/rating";

export interface CreateRatingDTO
  extends Omit<Rating, "created_at" | "updated_at" | "id"> {}
export interface UpdateRatingDTO {
  data: Partial<CreateRatingDTO>;
  id: string;
}
export interface FindAllRatingsParams {
  movie_id: string;
  page: number;
}

export default interface RatingRepository {
  create: (data: CreateRatingDTO) => Promise<void>;
  findById: (id: string) => Promise<Rating | null>;
  findAll: (
    params: FindAllRatingsParams
  ) => Promise<{ data: Rating[]; page: number }>;
  delete: (id: string) => Promise<void>;
  update: (data: UpdateRatingDTO) => Promise<void>;
  userHasAlreadyRatedMovie: ({
    user_id,
    movie_id,
  }: {
    user_id: string;
    movie_id: string;
  }) => Promise<Rating | null>;
}
