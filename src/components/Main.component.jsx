import SearchResultsBox from "./SearchResultsBox/SearchResultsBox.component";
import WatchedBox from "./WatchedBox/WatchedBox.component";

function Main({ movies }) {
  return (
    <main className="main">
      <SearchResultsBox movies={movies} />
      <WatchedBox />
    </main>
  );
}

export default Main;
