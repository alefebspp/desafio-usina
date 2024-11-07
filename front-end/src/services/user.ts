import api from "@/lib/axios";

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

export async function register(data: RegisterParams) {
  const response = await api.post<{ message: string }>("/users/registry", data);

  return response.data;
}
