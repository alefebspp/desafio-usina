import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { createMovie, updateMovie } from "@/services/movie";
import { Movie } from "@/types";
import { useUserContext } from "@/contexts/userContext";

const formSchema = z.object({
  title: z
    .string({ message: "Campo obrigatório" })
    .min(1, { message: "Campo obrigatório" }),
  description: z
    .string({ message: "Campo obrigatório" })
    .min(1, { message: "Campo obrigatório" }),
  genre: z
    .string({ message: "Campo obrigatório" })
    .min(1, { message: "Campo obrigatório" }),
  duration: z
    .string({ message: "Campo obrigatório" })
    .min(1, { message: "Campo obrigatório" }),
  year: z.coerce
    .number({ message: "Campo obrigatório" })
    .min(1, { message: "Campo obrigatório" }),
  image_url: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
      {
        message: "Url inválida",
      }
    ),
});

type Props = PropsWithChildren & {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  movie?: Movie;
};

export default function ManageMovieModal({
  children,
  movie,
  open,
  setOpen,
}: Props) {
  const [error, setError] = useState<string>();

  const { user } = useUserContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: movie
      ? {
          ...movie,
          duration: movie.duration.replace("h ", ":").replace("min", ""),
          image_url: movie.image_url ?? undefined,
        }
      : {},
  });

  const { mutateAsync } = useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const { mutateAsync: updateMovieMutation } = useMutation({
    mutationFn: updateMovie,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { duration, ...data } = values;

      const formattedDuration = `${duration.replace(":", "h ")}min`;

      if (movie) {
        await updateMovieMutation({
          id: movie.id,
          data: {
            ...data,
            duration: formattedDuration,
          },
        });
      } else {
        await mutateAsync({
          ...data,
          duration: formattedDuration,
          user_id: user?.id || "",
        });
      }

      const resetKeys = Object.keys(values);

      const resetObject = {};

      resetKeys.forEach((key) => {
        const value = key === "year" ? null : "";

        Object.assign(resetObject, {
          [key]: value,
        });
      });

      reset(resetObject);

      toast({
        title: "Sucesso!",
        description: "Ação realizada com sucesso",
      });

      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      {!movie && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo filme</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex justify-between items-center mb-4"></div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL da imagem de capa{" "}
                      <span className="text-xs font-normal">(Opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ex: Ação, Drama..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Action">Ação</SelectItem>
                        <SelectItem value="Drama">Drama</SelectItem>
                        <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                        <SelectItem value="Crime">Crime</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1888"
                        max="2099"
                        step="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <FormControl>
                      <Input type="time" className="w-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              isLoading={isSubmitting}
              type="submit"
              className="w-full mt-6 bg-red-600 hover:bg-red-700"
            >
              {movie ? "Editar" : "Adicionar"}
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
