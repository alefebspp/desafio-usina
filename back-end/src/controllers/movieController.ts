import { Request, Response } from "express";
import z from "zod";
import MovieService from "@/services/movieService";

const movieBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  genre: z.string().min(1),
  duration: z.string().min(1),
  year: z.coerce.number().min(1),
  image_url: z.string().optional(),
  user_id: z.string().min(1),
});

const movieParam = z.object({
  movieId: z.string().min(1),
});

const findAllMoviesParams = z.object({
  page: z.coerce.number().optional().default(1),
  title: z.string().optional(),
  genre: z.string().optional(),
  year: z.number().optional(),
});

export function create(req: Request, res: Response) {}

export default class MovieController {
  constructor(private readonly movieService: MovieService) {}

  async create(request: Request, response: Response) {
    const body = movieBody.parse(request.body);

    await this.movieService.create(body);

    return response.status(201).send({ message: "Filme criado com sucesso" });
  }

  async find(request: Request, response: Response) {
    const { movieId } = movieParam.parse(request.params);

    const movie = await this.movieService.findById(movieId);

    return response.status(200).send({ movie });
  }

  async findAll(request: Request, response: Response) {
    const params = findAllMoviesParams.parse(request.query);

    const data = await this.movieService.findAll(params);

    return response.status(200).send({ ...data });
  }

  async delete(request: Request, response: Response) {
    const { movieId } = movieParam.parse(request.params);

    await this.movieService.delete(movieId);

    return response.status(200).send({ message: "Filme excluído com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { movieId } = movieParam.parse(request.params);
    const body = movieBody.partial().parse(request.body);

    await this.movieService.update({ id: movieId, data: body });

    return response
      .status(200)
      .send({ message: "Filme atualizado com sucesso" });
  }
}
