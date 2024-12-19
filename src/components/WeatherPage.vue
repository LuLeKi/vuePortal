<template>
  <div class="weather-page">
    <h1>Wetterdaten</h1>

    <!-- Input field for city name and button to fetch weather data -->
    <div>
      <input
        v-model="city"
        type="text"
        placeholder="Stadt eingeben"
        @keyup.enter="fetchWeather"
      />
      <button @click="fetchWeather">Wetter anzeigen</button>
    </div>

    <!-- Display weather data if available -->
    <div v-if="weatherData" class="weather-info">
      <h2>Wetter in {{ weatherData.name }}</h2>
      <p>
        <strong>Temperatur:</strong> {{ weatherData.main.temp }}°C<br />
        <strong>Gefühlte Temperatur:</strong> {{ weatherData.main.feels_like }}°C<br />
        <strong>Beschreibung:</strong> {{ weatherData.weather[0].description }}
      </p>

      <!-- Weather icon -->
      <div class="icon-container">
        <img
          :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`"
          :alt="weatherData.weather[0].description"
        />
      </div>

      <p>
        <strong>Windgeschwindigkeit:</strong> {{ weatherData.wind.speed }} m/s<br />
        <strong>Luftfeuchtigkeit:</strong> {{ weatherData.main.humidity }}%
      </p>
    </div>

    <!-- Display error message if there is an error -->
    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <!-- Prompt user to enter a city name if no data or error -->
    <div v-else>
      <p>Bitte eine Stadt eingeben und auf "Wetter anzeigen" klicken.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      city: "Berlin", // Default city value
      weatherData: null, // Stores weather data fetched from the API
      errorMessage: "", // Error message for user feedback
    };
  },
  methods: {
    // Fetches weather data for the given city
    async fetchWeather() {
      const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY; // API key from environment variables
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apiKey}&units=metric&lang=de`;

      try {
        // Perform API request
        const response = await axios.get(url);
        this.weatherData = response.data; // Store weather data
        this.errorMessage = ""; // Reset error message
      } catch (error) {
        // Handle errors
        this.weatherData = null; // Clear previous weather data
        if (error.response && error.response.status === 401) {
          this.errorMessage = "Ungültiger API-Key. Bitte prüfen Sie Ihre Einstellungen.";
        } else if (error.response && error.response.status === 404) {
          this.errorMessage = "Stadt nicht gefunden. Bitte überprüfen Sie die Eingabe.";
        } else {
          this.errorMessage = "Ein unerwarteter Fehler ist aufgetreten.";
        }
        console.error("Fehler beim Abrufen der Wetterdaten:", error); // Log error details
      }
    },
  },
};
</script>

<style scoped>
.weather-page {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px 40px;
  border-radius: 15px;
  background-color: #f4f4f9;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.weather-page input {
  padding: 10px;
  margin-right: 10px;
  border: 2px solid #007bff;
  border-radius: 5px;
  font-size: 16px;
  width: calc(100% - 40px);
  max-width: 400px;
  display: inline-block;
}

.weather-page button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.weather-page button:hover {
  background-color: #0056b3;
}

.weather-info {
  margin-top: 20px;
  text-align: center;
}

.icon-container {
  margin-top: 10px;
  display: inline-block;
  padding: 10px;
  background-color: #87ceeb; /* Light blue background */
  border-radius: 10px;
  border: 2px solid #007bff; /* Blue border */
}

.icon-container img {
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

/* Dark mode styles */
.dark-mode .weather-page {
  background-color: #2c2c2c; /* Dark background */
  color: #f4f4f4; /* Light text */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.dark-mode .weather-page input {
  background-color: #1e1e1e; /* Dark input background */
  color: #f4f4f4; /* Light text */
  border: 1px solid #8a2be2; /* Purple border */
}

.dark-mode .weather-page button {
  background-color: #8a2be2; /* Purple background */
  color: #ffffff; /* White text */
  border: none; /* No border */
}

.dark-mode .weather-page button:hover {
  background-color: #5a1c91; /* Darker purple on hover */
}

.dark-mode .weather-page .error {
  color: #ff6b6b; /* Bright red for errors */
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .weather-page {
    margin: 20px 5%;
    padding: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  }

  .weather-page input {
    width: 90%;
    max-width: none;
  }

  .weather-page button {
    width: auto;
    margin-top: 10px;
  }
}
</style>
