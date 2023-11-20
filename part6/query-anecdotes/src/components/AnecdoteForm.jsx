import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";

import NotificationContext from "../NotificationContext";
import React, { useContext } from "react";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(NotificationContext);

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: (error) => {
      dispatch({
        type: "SET_MESSAGE",
        message: error.response.data.error,
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_MESSAGE" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
