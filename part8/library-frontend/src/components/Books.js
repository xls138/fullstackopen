import { useQuery } from '@apollo/client';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries';
import { useState } from 'react';

const Books = ({ show }) => {
  const [filter, setFilter] = useState("all genres");

  const { data, loading, error } = useQuery(
    filter === "all genres" ? ALL_BOOKS : BOOKS_BY_GENRE,
    { variables: filter !== "all genres" ? { genre: filter } : undefined }
    //果 filter 的值等于 "all genres"，那么表示用户没有选择特定的流派，这时不需要设置 genre 变量，因此整个 variables 对象被设置为 undefined。
  );

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = filter === "all genres" ? data?.allBooks : data?.booksByGenre || [];

  const genres = ["refactoring", "agile", "patterns", "design", "crime", "classic", "example", "test", "all genres"];

  return (
    <div>
      <h2>books</h2>
      {filter !== "all genres" && <p>in genre <strong>{filter}</strong></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}
    </div>
  );
};

export default Books;
