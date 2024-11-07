import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import AppError from "@/errors/AppError";
import UserRepository from "@/repositories/userRepository";
import { env } from "@/env";

export default class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(400, "Email ou senha incorretos");
    }

    const passwordMatched = await compare(password, user.password_hash);

    if (!passwordMatched) {
      throw new AppError(400, "Email ou senha incorretos");
    }

    const token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1d",
    });

    return { token, user };
  }

  async profile(user_id: string) {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError(400, "Email ou senha incorretos");
    }

    return user;
  }
}
