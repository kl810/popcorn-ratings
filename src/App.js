import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.component";
import Main from "./components/Main.component";
import Box from "./components/Box.component";
import Loader from "./components/Loader.component";
import ErrorMessage from "./components/ErrorMessage.component";
import MovieList from "./components/SearchResultsBox/MovieList.component";
import WatchedSummary from "./components/WatchedBox/WatchedSummary.component";
import WatchedMoviesList from "./components/WatchedBox/WatchedMoviesList.component";
import MovieDetails from "./components/SearchResultsBox/MovieDetails.component";

const apiKEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
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

  useEffect(() => {
    const controller = new AbortController(); //Clean up after data fetching

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(""); //reset error if error was found previously

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies");
        }

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

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
