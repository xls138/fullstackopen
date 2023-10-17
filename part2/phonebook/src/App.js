import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);

  const hook = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }

  useEffect(hook, []);

  const addPerson = (event) => {
    event.preventDefault();
    //check if name already exists
    const person = persons.find((person) => person.name === newName);
    if (person) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    setPersons(
      persons.concat({
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      })
    );
    setNewName("");
    setNewNumber("");
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

  return (
    <div>
      <h2>Phonebook</h2>
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
        <Persons personsToShow={personsToShow} />
      </ul>
    </div>
  );
};

export default App;
