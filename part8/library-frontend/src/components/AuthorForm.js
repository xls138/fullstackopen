import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';
import { useState } from 'react';

const AuthorForm = ({ authors }) => {
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            console.log(error);
        },
    });

    const submit = async (event) => {
        event.preventDefault();
        editAuthor({ variables: { name, born: parseInt(born, 10) } });
        setName('');
        setBorn('');
    };

    return (
        <div>
            <h3>Set birthyear</h3>
            <form onSubmit={submit}>
                <select value={name} onChange={({ target }) => setName(target.value)}>
                    {authors.map((a) => (
                        <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                </select>
                <div>
                    born
                    <input
                        type="number"
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    );
};

export default AuthorForm;
