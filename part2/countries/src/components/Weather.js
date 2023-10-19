import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const params = {
      access_key: process.env.REACT_APP_API_KEY,
      query: capital,
    };

    axios
      .get("http://api.weatherstack.com/current", { params })
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [capital]);

  if (!weather.current) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>
        <strong>temperature:</strong> {weather.current.temperature} Celsius
      </div>
      <img src={weather.current.weather_icons[0]} alt="weather icon" />
      <div>
        <strong>wind:</strong> {weather.current.wind_speed} mph direction{" "}
        {weather.current.wind_dir}
      </div>
    </div>
  );
};

export default Weather;
