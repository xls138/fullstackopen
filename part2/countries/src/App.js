import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import Content from "./components/Content";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  const hook = () => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  };

  useEffect(hook, []);

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
    const regex = new RegExp(newFilter, "i");
    const filteredCountries = countries.filter((country) =>
      country.name.common.match(regex)
    );
    setFilteredCountries(filteredCountries);
  };

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <Content countries={filteredCountries} setCountries={setFilteredCountries}/>
    </div>
  );
};

export default App;
