import { useState } from "react";
import { motion } from "framer-motion";
import { EllipsisVertical, Video } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Movie } from "@/types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserContext } from "@/contexts/userContext";
import { deleteMovie } from "@/services/movie";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

type MovieCardOptionsProps = {
  movie: Movie;
  handleEditMovieClick: (movie: Movie) => void;
};

function MovieCardActions({
  movie,
  handleEditMovieClick,
}: MovieCardOptionsProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteMovie,
    onSuccess: (data) => {
      toast({ title: "Sucesso", description: data.message });
      setOpen(false);
      return queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Foi impossível realizar a ação." });
    },
  });

  return (
    <Popover>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-8 h-8 flex items-center justify-center bg-gray-700 absolute top-2 right-2 rounded-full"
      >
        <EllipsisVertical className="w-5 h-5 text-white" />
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-gray-800 text-white border-0 flex flex-col gap-2 items-start w-fit px-0 py-0"
      >
        <button
          onClick={() => handleEditMovieClick(movie)}
          className="w-full px-4 pt-2 text-left appearence-none outline-none hover:underline"
        >
          Editar
        </button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            className="px-4 pb-2 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Remover
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação será irreversível.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>
                Cancelar
              </AlertDialogCancel>
              <Button
                onClick={async () => await mutateAsync(movie.id)}
                disabled={isPending}
              >
                Continuar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
}

type Props = {
  movie: Movie;
  onClick: () => void;
  handleEditMovieClick: (movie: Movie) => void;
};

export default function MovieCard({
  movie,
  onClick,
  handleEditMovieClick,
}: Props) {
  const { user } = useUserContext();

  const showOptions = !!user && user.id === movie.created_by.id;

  return (
    <motion.article
      className="bg-gray-800 rounded-lg shadow-lg cursor-pointer h-96 flex flex-col justify-between"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="h-48 flex items-center justify-center rounded-t-lg relative">
        {movie.image_url ? (
          <img
            src={movie.image_url}
            alt={movie.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <Video className="w-16 h-16 text-gray-700" />
        )}
        {showOptions && (
          <MovieCardActions
            handleEditMovieClick={handleEditMovieClick}
            movie={movie}
          />
        )}
      </div>
      <div className="px-4 pb-4 h-32">
        <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
        <p className="text-gray-400 text-sm mb-4 card-text">
          {movie.description}
        </p>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 px-4 pb-4">
        <span>{movie.genre}</span>
        <span>{movie.year}</span>
        <span>{movie.duration}</span>
      </div>
    </motion.article>
  );
}
