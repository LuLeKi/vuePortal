<template>
  <div class="weather-page">
    <h1>Wetterdaten</h1>

    <div>
      <input
        v-model="city"
        type="text"
        placeholder="Stadt eingeben"
        @keyup.enter="fetchWeather"
      />
      <button @click="fetchWeather">Wetter anzeigen</button>
    </div>

    <div v-if="weatherData" class="weather-info">
      <h2>Wetter in {{ weatherData.name }}</h2>
      <p>
        <strong>Temperatur:</strong> {{ weatherData.main.temp }}°C<br />
        <strong>Gefühlte Temperatur:</strong> {{ weatherData.main.feels_like }}°C<br />
        <strong>Beschreibung:</strong> {{ weatherData.weather[0].description }}
      </p>
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

    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

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
      city: "Berlin", // Standardwert
      weatherData: null,
      errorMessage: "",
    };
  },
  methods: {
    async fetchWeather() {
      const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apiKey}&units=metric&lang=de`;

      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
        this.errorMessage = ""; // Fehler zurücksetzen
      } catch (error) {
        this.weatherData = null;
        if (error.response && error.response.status === 401) {
          this.errorMessage = "Ungültiger API-Key. Bitte prüfen Sie Ihre Einstellungen.";
        } else if (error.response && error.response.status === 404) {
          this.errorMessage = "Stadt nicht gefunden. Bitte überprüfen Sie die Eingabe.";
        } else {
          this.errorMessage = "Ein unerwarteter Fehler ist aufgetreten.";
        }
        console.error("Fehler beim Abrufen der Wetterdaten:", error);
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
  background-color: #87ceeb; /* Himmelblau */
  border-radius: 10px;
  border: 2px solid #007bff; /* Rahmen in Blau */
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
</style>
