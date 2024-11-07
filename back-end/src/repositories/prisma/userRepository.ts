import UserRepository, { CreateUserDTO } from "../userRepository";
import prisma from "@/database/prisma";

export default class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserDTO) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
