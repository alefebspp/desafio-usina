import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";
import MovieModal from "@/components/MovieModal";
import { getAllMovies } from "@/services/movie";
import ManageMovieModal from "@/components/ManageMovieModal";

export default function Home() {
  const [editMovieDialogIsOpen, setEditMovieDialogIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [toEditMovie, setToEditMovie] = useState<Movie>();
  const [movieDialogIsOpen, setMovieDialogIsOpen] = useState(false);
  const [search, setSearch] = useState<string>();
  const [debouncedSearch, setDebouncedSearch] = useState<string>();
  const [genre, setGenre] = useState<string>();

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useRef(null);

  function handleEditMovieClick(movie: Movie) {
    setEditMovieDialogIsOpen(true);
    setToEditMovie(movie);
  }

  function handleMovieCardClick(movie: Movie) {
    setSelectedMovie(movie);
    setMovieDialogIsOpen(true);
  }

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["movies", genre, debouncedSearch],
      queryFn: ({ pageParam }) =>
        getAllMovies({ pageParam, genre, title: debouncedSearch }),
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1;
        return nextPage <= lastPage.pages ? nextPage : undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "0px" }
    );

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current && observer.current) {
        observer.current.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Filmes</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Procurar filmes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400" />
          <Select defaultValue="all" onValueChange={(value) => setGenre(value)}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white">
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os gêneros</SelectItem>
              <SelectItem value="Action">Ação</SelectItem>
              <SelectItem value="Drama">Drama</SelectItem>
              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
              <SelectItem value="Crime">Crime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {data?.pages.map((page) =>
          page.data.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieCardClick(movie)}
              handleEditMovieClick={handleEditMovieClick}
            />
          ))
        )}
      </motion.section>

      {hasNextPage && (
        <div ref={loaderRef} className="text-center py-4">
          {isFetching && <p>Carregando...</p>}
        </div>
      )}

      {editMovieDialogIsOpen && (
        <ManageMovieModal
          open={editMovieDialogIsOpen}
          setOpen={setEditMovieDialogIsOpen}
          movie={toEditMovie}
        />
      )}
      {selectedMovie && (
        <MovieModal
          open={movieDialogIsOpen}
          setOpen={setMovieDialogIsOpen}
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
