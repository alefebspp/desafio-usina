import RatingRepository, {
  CreateRatingDTO,
  FindAllRatingsParams,
  UpdateRatingDTO,
} from "../ratingRepository";
import prisma from "@/database/prisma";

export default class PrismaRatingRepository implements RatingRepository {
  async userHasAlreadyRatedMovie({
    user_id,
    movie_id,
  }: {
    user_id: string;
    movie_id: string;
  }) {
    const userReview = await prisma.rating.findFirst({
      where: {
        user_id,
        movie_id,
      },
    });

    return userReview;
  }

  async create(data: CreateRatingDTO) {
    await prisma.rating.create({ data });
  }

  async findById(id: string) {
    const rating = await prisma.rating.findUnique({ where: { id } });

    return rating;
  }

  async findAll({ movie_id, page }: FindAllRatingsParams) {
    const ratings = await prisma.rating.findMany({
      where: { movie_id },
      skip: (page - 1) * 10,
      take: 10,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const count = await prisma.rating.count({ where: { movie_id } });

    return {
      data: ratings,
      page: count,
    };
  }

  async delete(id: string) {
    await prisma.rating.delete({ where: { id } });
  }

  async update({ id, data }: UpdateRatingDTO) {
    await prisma.rating.update({ where: { id }, data });
  }
}
