import PrismaRatingRepository from "@/repositories/prisma/ratingRepository";
import RatingService from "@/services/ratingService";
import RatingController from "../ratingController";
import PrismaUserRepository from "@/repositories/prisma/userRepository";
import PrismaMovieRepository from "@/repositories/prisma/movieRepository";

export default function ratingControllerFactory() {
  const ratingRepository = new PrismaRatingRepository();
  const userRepository = new PrismaUserRepository();
  const movieRepository = new PrismaMovieRepository();
  const ratingService = new RatingService(
    ratingRepository,
    userRepository,
    movieRepository
  );

  return new RatingController(ratingService);
}
