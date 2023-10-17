import React from "react";
import Country from "./Country";

const Content = ({ countries, setCountries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />;
  } else {
    return countries.map((country) => (
      <div key={country.name.common}>
        {country.name.common}
        <button onClick={()=>setCountries([country])}>Show</button>
      </div>
    ));
  }
};

export default Content;
