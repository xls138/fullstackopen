import { useDispatch, useSelector } from "react-redux";
import { voteAnecdoteAsync } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const vote = (id) => {
    const anecdote = anecdotes.find((a) => a.id === id);
    dispatch(voteAnecdoteAsync(id));
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5));
  };

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredAnecdotes.sort((a, b) => b.votes - a.votes) &&
        filteredAnecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
