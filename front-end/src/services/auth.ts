import api from "@/lib/axios";
import { User } from "@/types";

export async function login(params: { email: string; password: string }) {
  const respone = await api.post<{ token: string; user: User }>(
    "/login",
    params
  );

  return respone.data;
}

export async function logout() {
  await api.get("/logout");
}

export async function getProfile() {
  const respone = await api.get<{ user: User; message?: string }>("/profile");

  return respone.data;
}
