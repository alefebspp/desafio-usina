import User from "@/models/user";

export interface CreateUserDTO
  extends Omit<User, "created_at" | "updated_at" | "id"> {}

export default interface UserRepository {
  create: (data: CreateUserDTO) => Promise<User | null>;
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
}
