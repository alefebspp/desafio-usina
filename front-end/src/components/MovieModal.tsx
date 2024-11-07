import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";
import { Star, Video } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createReview, listReviews } from "@/services/rating";
import { useUserContext } from "@/contexts/userContext";
import { Movie, Rating } from "@/types";

const formSchema = z.object({
  value: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type UserReviewProps = {
  rating: Rating;
};

function UserReview({ rating }: UserReviewProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <span className="text-xl font-semibold text-white">
        {rating.user.name}
      </span>
      {rating.comment && (
        <p className="text-muted-foreground mb-2">{rating.comment}</p>
      )}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating.value ? "text-yellow-400" : "text-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  movie: Movie;
  onClose: () => void;
};

export default function MovieModal({ open, setOpen, movie, onClose }: Props) {
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(1);

  const { user } = useUserContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    formState: { isSubmitting, errors },
    setValue,
    watch,
    reset,
  } = form;

  const { data } = useQuery({
    queryKey: ["ratings", movie.id],
    queryFn: async () => {
      const data = await listReviews({ page, movie_id: movie.id });
      return data;
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["ratings", movie.id] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante a ação",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutateAsync({
        ...values,
        movie_id: movie.id,
        user_id: user?.id || "",
      });

      toast({
        title: "Sucesso!",
        description: "Avaliação realizada com sucesso",
      });

      reset({
        comment: "",
        value: 0,
      });
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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{movie.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="h-64 md:h-80 flex items-center justify-center mb-4">
          {movie.image_url ? (
            <img
              src={movie.image_url}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg md:rounded-none"
            />
          ) : (
            <Video className="w-16 h-16 md:w-24 md:h-24 text-gray-700" />
          )}
        </div>

        <p className="text-gray-300 mb-4">{movie.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-white">
          <div>
            <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
            <p>
              <span className="text-gray-400">Usuário: </span>{" "}
              {movie.created_by.name}
            </p>
            <p>
              <span className="text-gray-400">Gênero: </span> {movie.genre}
            </p>
            <p>
              <span className="text-gray-400">Ano: </span> {movie.year}
            </p>
            <p>
              <span className="text-gray-400">Duração: </span> {movie.duration}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Comentários e avaliações
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL da imagem de capa{" "}
                      <span className="text-xs font-normal">(Opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deixe um comentário..."
                        className="bg-gray-800 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2 my-4">
                <span className="text-gray-400">Avaliação:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer ${
                      star <= watch("value")
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                    onClick={() => setValue("value", star)}
                  />
                ))}
              </div>

              <Button
                isLoading={isSubmitting}
                type="submit"
                className="bg-red-600 hover:bg-red-700"
              >
                Enviar avaliação
              </Button>
              {errors.value?.message && (
                <div className="w-full text-left mt-2">
                  <span className="text-sm italic text-red-500 font-semibold text-center">
                    Selecione uma ou mais estralas
                  </span>
                </div>
              )}
            </form>
          </Form>
          <div className="space-y-4">
            {data?.data.map((rating, index) => (
              <UserReview key={index} rating={rating} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
