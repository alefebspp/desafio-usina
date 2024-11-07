import PrismaUserRepository from "@/repositories/prisma/userRepository";
import AuthService from "@/services/authService";
import AuthController from "../authController";

export default function authControllerFactory() {
  const userRepository = new PrismaUserRepository();
  const authService = new AuthService(userRepository);

  return new AuthController(authService);
}
