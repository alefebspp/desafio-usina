import { PropsWithChildren, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { login } from "@/services/auth";
import { useUserContext } from "@/contexts/userContext";

const formSchema = z.object({
  email: z
    .string({ message: "Campo obrigatório" })
    .email({ message: "E-mail inválido" })
    .min(1, { message: "Campo obrigatório" }),
  password: z
    .string({ message: "Campo obrigatório" })
    .min(1, { message: "Campo obrigatório" }),
});

type Props = PropsWithChildren;

export default function SignInModal({ children }: Props) {
  const [error, setError] = useState<string>();
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { token, user } = await login(values);

      if (token && user) {
        setUser(user);
        navigate("/home");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          return setError(error.response.data.message);
        }
      }
      setError("Erro no servidor. Por favor, tente novamente.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fazer login</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="exemplo@hotmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*****" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              isLoading={isSubmitting}
              type="submit"
              className="w-full mt-6 bg-red-600 hover:bg-red-700"
            >
              Entrar
            </Button>
            {error && (
              <div className="w-full text-center">
                <span className="text-sm italic text-red-500 font-semibold text-center">
                  {error}
                </span>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
