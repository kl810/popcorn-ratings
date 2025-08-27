import { useState, useEffect } from "react";

import { useMovies } from "./custom-hooks/useMovies";
import { useLocalStorageState } from "./custom-hooks/useLocalStorageState";

import Navbar from "./components/Navbar.component";
import Main from "./components/Main.component";
import Box from "./components/Box.component";
import Loader from "./components/Loader.component";
import ErrorMessage from "./components/ErrorMessage.component";
import MovieList from "./components/SearchResultsBox/MovieList.component";
import WatchedSummary from "./components/WatchedBox/WatchedSummary.component";
import WatchedMoviesList from "./components/WatchedBox/WatchedMoviesList.component";
import MovieDetails from "./components/SearchResultsBox/MovieDetails.component";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(function () {
    document.addEventListener("keydown", function (e) {
      if (e.code === "Escape") {
        handleCloseMovie();
      }
    });
  }, []);

  return (
    <>
      <Navbar query={query} setQuery={setQuery} movies={movies} />
      <Main>
        <Box>
          {/* Avoid prop drilling using composition */}
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
