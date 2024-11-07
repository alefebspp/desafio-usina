import PrismaUserRepository from "@/repositories/prisma/userRepository";
import UserService from "@/services/userService";
import UserController from "../userController";

export default function userControllerFactory() {
  const userRepository = new PrismaUserRepository();
  const userService = new UserService(userRepository);

  return new UserController(userService);
}
