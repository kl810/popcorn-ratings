import Movie from "./Movie.component";

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}

export default MovieList;
