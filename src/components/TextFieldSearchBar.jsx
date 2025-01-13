import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, List, ListItem, CircularProgress } from '@mui/material';
import axios from 'axios';

const TextFieldSearchBar = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (query.trim() === '') {
      setCities([]);
      return; // Don't fetch if the query is empty
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
          {
            headers: {
              'X-RapidAPI-Key': 'ea31cface7mshdfb94990896d20ep117de4jsn7df51c018206', // Replace with your actual API key
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
            },
          }
        );
        setCities(response.data.data); // Update cities based on API response
        setError(null);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Could not fetch cities. Please try again.');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCities();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=2758a471c0864ecdbf91380bfef991d3
`
      );
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Could not fetch weather. Please try again.');
      setWeather(null);
    }
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setCities([]); // Clear cities list
    setQuery(''); // Clear query  
    fetchWeather(city.latitude, city.longitude); // Fetch weather using city coordinates
  };

  return (
    <Box>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        label="Enter the city"
        variant="outlined"
        fullWidth
      />

      {loading && <CircularProgress size={24} />}

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <List>
        {cities.map((city) => (
          <ListItem
            key={city.id}
            button
            onClick={() => handleCityClick(city)}
          >
            {city.city}, {city.country}
          </ListItem>
        ))}
      </List>

      {selectedCity && weather && (
        <Box mt={4}>
          <Typography className="text-center" variant="h5">
            {selectedCity.city}, {selectedCity.country}
          </Typography>
          <Typography variant="body1">
            Temperature: {weather.main.temp}°C
          </Typography>
          <Typography variant="body1">
            Weather: {weather.weather[0].description}
          </Typography>
          <Typography variant="body1">
            Humidity: {weather.main.humidity}%
          </Typography>
          <Typography variant="body1">
            Wind Speed: {weather.wind.speed} m/s
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TextFieldSearchBar;
