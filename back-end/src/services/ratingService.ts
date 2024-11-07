import AppError from "@/errors/AppError";
import MovieRepository from "@/repositories/movieRepository";
import RatingRepository, {
  CreateRatingDTO,
  FindAllRatingsParams,
  UpdateRatingDTO,
} from "@/repositories/ratingRepository";
import UserRepository from "@/repositories/userRepository";

export default class RatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly userRepository: UserRepository,
    private readonly movieRepository: MovieRepository
  ) {}

  async create(data: CreateRatingDTO) {
    const { movie_id, user_id } = data;

    const userExists = await this.userRepository.findById(user_id);

    if (!userExists) {
      throw new AppError(400, "Usuário não encontrado");
    }

    const movieExists = await this.movieRepository.findById(movie_id);

    if (!movieExists) {
      throw new AppError(400, "Filme não encontrado");
    }

    const userReview = await this.ratingRepository.userHasAlreadyRatedMovie({
      user_id,
      movie_id,
    });

    if (userReview) {
      return await this.update({ id: userReview.id, data });
    }

    await this.ratingRepository.create(data);
  }

  async findById(id: string) {
    const rating = await this.ratingRepository.findById(id);

    if (!rating) {
      throw new AppError(400, "Avaliação não encontrada");
    }

    return rating;
  }

  async findAll(params: FindAllRatingsParams) {
    const data = await this.ratingRepository.findAll(params);

    return data;
  }

  async update({ id, data }: UpdateRatingDTO) {
    const rating = await this.ratingRepository.findById(id);

    if (!rating) {
      throw new AppError(400, "Avaliação não encontrada");
    }

    await this.ratingRepository.update({ id, data });
  }

  async delete(id: string) {
    const rating = await this.ratingRepository.findById(id);

    if (!rating) {
      throw new AppError(400, "Avaliação não encontrada");
    }

    await this.ratingRepository.delete(id);
  }
}
