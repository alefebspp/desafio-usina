import { Request, Response } from "express";
import z from "zod";

import UserService from "@/services/userService";

const userBody = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export default class UserController {
  constructor(private readonly userService: UserService) {}

  async registry(request: Request, response: Response) {
    const body = userBody.parse(request.body);

    await this.userService.create(body);

    return response
      .status(201)
      .send({ message: "Usuário criado com sucesso!" });
  }
}
