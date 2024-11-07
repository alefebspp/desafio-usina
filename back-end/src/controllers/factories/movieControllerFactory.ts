import PrismaMovieRepository from "@/repositories/prisma/movieRepository";
import MovieService from "@/services/movieService";
import MovieController from "../movieController";

export default function movieControllerFactory() {
  const movieRepository = new PrismaMovieRepository();
  const movieService = new MovieService(movieRepository);

  return new MovieController(movieService);
}
