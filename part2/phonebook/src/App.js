import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personsService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [message, setMessage] = useState(null);

  const hook = () => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  };

  useEffect(hook, []);

  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find((person) => person.name === newName);
    const updatedPerson = { ...person, number: newNumber };
    //if person exists, ask if user wants to update the number
    if (person) {
      const result = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (result) {
        personsService
          .update(person.id, updatedPerson)
          .then((returnedPerson) => {
            //update the state of persons
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setMessage(`Updated ${returnedPerson.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setMessage(
              `ERROR: Information of ${updatedPerson.name} has already been removed from server`
            );
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setPersons(persons.filter((person) => person.id !== updatedPerson.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };
    personsService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");

      setMessage(`Added ${returnedPerson.name}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setNewFilter(newFilter);
    //regex is a regular expression, i is for case insensitive
    const regex = new RegExp(newFilter, "i");
    const filteredPersons = persons.filter((person) =>
      person.name.match(regex)
    );
    setFilteredPersons(filteredPersons);
  };

  //if newFilter is empty, show all persons, else show filteredPersons
  const personsToShow = newFilter === "" ? persons : filteredPersons;

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    const result = window.confirm(`Delete ${person.name} ?`);
    if (result) {
      personsService.deletePerson(id).then((response) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <ul>
        <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
      </ul>
    </div>
  );
};

export default App;
