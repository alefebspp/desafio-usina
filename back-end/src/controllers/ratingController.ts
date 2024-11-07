import { Request, Response } from "express";
import z from "zod";
import RatingService from "@/services/ratingService";

const ratingBody = z.object({
  value: z.number().min(1).max(5),
  comment: z.string().optional(),
  movie_id: z.string().min(1),
  user_id: z.string().min(1),
});

const ratingParam = z.object({
  ratingId: z.string().min(1),
});

const findAllRatingsQueries = z.object({
  page: z.coerce.number().optional().default(1),
});

const movieParam = z.object({
  movieId: z.string().min(1),
});

export default class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  async create(request: Request, response: Response) {
    const body = ratingBody.parse(request.body);

    await this.ratingService.create(body);

    return response
      .status(201)
      .send({ message: "Avaliação criada com sucesso" });
  }

  async findAll(request: Request, response: Response) {
    const { page } = findAllRatingsQueries.parse(request.query);
    const { movieId } = movieParam.parse(request.params);

    const data = await this.ratingService.findAll({ movie_id: movieId, page });

    return response.status(200).send({ ...data });
  }

  async update(request: Request, response: Response) {
    const { ratingId } = ratingParam.parse(request.params);
    const body = ratingBody.partial().parse(request.body);

    await this.ratingService.update({ id: ratingId, data: body });

    return response
      .status(200)
      .send({ message: "Avaliação atualizada com sucesso" });
  }

  async delete(request: Request, response: Response) {
    const { ratingId } = ratingParam.parse(request.params);

    await this.ratingService.delete(ratingId);

    return response
      .status(200)
      .send({ message: "Avaliação excluída com sucesso" });
  }
}
