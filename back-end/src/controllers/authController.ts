import { Request, Response } from "express";
import { z } from "zod";

import AuthService from "@/services/authService";

const loginBody = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  async profile(request: Request, response: Response) {
    const user = await this.authService.profile(request.user);

    return response.status(200).send({ user });
  }

  async logout(request: Request, response: Response) {
    response.cookie("token", "", {
      maxAge: -1,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return response.status(200).send();
  }

  async login(request: Request, response: Response) {
    const body = loginBody.parse(request.body);

    const { token, user } = await this.authService.login(body);

    const { password_hash, ...userInfos } = user;

    response.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return response.status(200).send({ token, user: userInfos });
  }
}
