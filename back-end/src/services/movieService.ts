import AppError from "@/errors/AppError";
import MovieRepository, {
  CreateMovieDTO,
  FindAllMoviesParams,
  UpdateMovieDTO,
} from "@/repositories/movieRepository";

export default class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async create(data: CreateMovieDTO) {
    const movieAlreadyExists = await this.movieRepository.findByTitle(
      data.title
    );

    if (movieAlreadyExists) {
      throw new AppError(400, "Já existe um filme com o título informado");
    }

    await this.movieRepository.create(data);
  }

  async findById(id: string) {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new AppError(400, "Filme não encontrado");
    }

    return movie;
  }

  async findAll(params: FindAllMoviesParams) {
    const data = await this.movieRepository.findAll(params);

    return data;
  }

  async delete(id: string) {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new AppError(400, "Filme não encontrado");
    }

    await this.movieRepository.delete(id);
  }

  async update({ id, data }: UpdateMovieDTO) {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new AppError(400, "Filme não encontrado");
    }

    await this.movieRepository.update({ id, data });
  }
}
