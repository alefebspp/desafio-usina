import MovieRepository, {
  CreateMovieDTO,
  FindAllMoviesParams,
  UpdateMovieDTO,
} from "../movieRepository";
import prisma from "@/database/prisma";

export default class PrismaMovieRepository implements MovieRepository {
  async create(data: CreateMovieDTO) {
    await prisma.movie.create({ data });
  }

  async findById(id: string) {
    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    return movie;
  }

  async findByTitle(title: string) {
    const movie = await prisma.movie.findFirst({
      where: {
        title: {
          equals: title,
        },
      },
    });

    return movie;
  }

  async findAll(params: FindAllMoviesParams) {
    const { page, title, year, genre } = params;

    const where = {};

    if (title) {
      Object.assign(where, {
        title: {
          contains: title,
          mode: "insensitive",
        },
      });
    }

    if (year) {
      Object.assign(where, {
        year,
      });
    }

    if (genre && genre !== "all") {
      Object.assign(where, {
        genre,
      });
    }

    const paramsObject = {
      skip: (page - 1) * 8,
      take: 8,
      where,
    };

    const movies = await prisma.movie.findMany({
      ...paramsObject,
      include: {
        created_by: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const count = await prisma.movie.count({ where });

    return { data: movies, page, pages: Math.ceil(count / 10) };
  }

  async delete(id: string) {
    await prisma.movie.delete({ where: { id } });
  }

  async update({ id, data }: UpdateMovieDTO) {
    await prisma.movie.update({
      where: {
        id,
      },
      data,
    });
  }
}
