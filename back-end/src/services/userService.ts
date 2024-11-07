import AppError from "@/errors/AppError";
import UserRepository, { CreateUserDTO } from "@/repositories/userRepository";
import { hash } from "bcrypt";

interface CreateUser extends Omit<CreateUserDTO, "password_hash"> {
  password: string;
}

export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({ password, ...data }: CreateUser) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError(400, "E-mail já registrado");
    }

    const password_hash = await hash(password, 10);

    await this.userRepository.create({ ...data, password_hash });
  }

  async find(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(400, "Usuário não existe");
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(400, "Usuário não existe");
    }

    return user;
  }
}
