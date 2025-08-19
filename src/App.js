import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.component";
import Main from "./components/Main.component";
import Box from "./components/Box.component";
import Loader from "./components/Loader.component";
import ErrorMessage from "./components/ErrorMessage.component";
import MovieList from "./components/SearchResultsBox/MovieList.component";
import WatchedSummary from "./components/WatchedBox/WatchedSummary.component";
import WatchedMoviesList from "./components/WatchedBox/WatchedMoviesList.component";

const apiKEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const query = "interstellar";

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKEY}&s=${query}`
        );

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies");
        }

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  return (
    <>
      <Navbar movies={movies} />
      <Main>
        <Box>
          {/* Avoid prop drilling using composition */}
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
