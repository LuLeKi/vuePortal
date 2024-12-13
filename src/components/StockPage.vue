<template>
  <div class="stock-page">
    <h1>Aktienkurse anzeigen</h1>

    <div>
      <input
        v-model="symbol"
        type="text"
        placeholder="Ticker-Symbol eingeben (z.B. AAPL, TSLA)"
        @keyup.enter="fetchStockData"
      />
      <button @click="fetchStockData">Daten abrufen</button>
    </div>

    <div v-if="stockData" class="stock-info">
      <h2>Aktueller Kurs von {{ symbol.toUpperCase() }}</h2>
      <p>
        <strong>Datum:</strong> {{ lastRefreshed }}<br />
        <strong>Schlusskurs:</strong> {{ closingPrice }} USD
      </p>
      <canvas id="stockCanvas"></canvas>
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <p>Bitte ein Ticker-Symbol eingeben und auf "Daten abrufen" klicken.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";
import { nextTick } from "vue"; // Importiere nextTick von Vue

export default {
  data() {
    return {
      symbol: "AAPL", // Standardwert
      stockData: null,
      error: "",
      lastRefreshed: "",
      closingPrice: "",
    };
  },
  methods: {
    async fetchStockData() {
      console.log("Datenabfrage gestartet für Symbol:", this.symbol); // Log bei Start der Datenabfrage
      this.error = "";
      this.stockData = null;
      const apiKey = process.env.VUE_APP_STOCK_KEY; // API-Key aus der .env-Datei
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.symbol}&apikey=${apiKey}`;

      console.log("Verwendete API URL:", url); // Log der URL, die für die API-Anfrage verwendet wird

      try {
        const response = await axios.get(url);
        console.log("API Antwort erhalten:", response.data); // Log für die Antwort der API

        const data = response.data;
        if (data["Time Series (Daily)"]) {
          console.log("Daten für Time Series gefunden:", data["Time Series (Daily)"]); // Log, wenn Daten vorhanden sind
          const timeSeries = data["Time Series (Daily)"];
          const dates = Object.keys(timeSeries).slice(0, 10).reverse(); // Letzte 10 Tage
          const closingPrices = dates.map((date) => timeSeries[date]["4. close"]);
          this.lastRefreshed = dates[0];
          this.closingPrice = closingPrices[0];
          this.stockData = { dates, closingPrices };
          console.log("Verarbeitete Daten:", this.stockData); // Log der verarbeiteten Daten

          nextTick(() => {
            this.renderChart(dates, closingPrices); // Stelle sicher, dass das DOM bereit ist
          });
        } else {
          this.error = "Keine Daten gefunden.";
          console.log("Keine Daten in der Antwort gefunden."); // Log, wenn keine Daten verfügbar sind
        }
      } catch (error) {
        this.error = "Fehler beim Abrufen der Daten.";
        console.error("Fehler bei der API-Anfrage:", error); // Log für den Fehler

        // Detaillierte Fehlerausgabe
        if (error.response) {
          console.error("Antwort der API im Fehlerfall:", error.response.data);
          console.error("Fehlerstatus der API:", error.response.status);
        } else if (error.request) {
          console.error("Keine Antwort von der API erhalten:", error.request);
        } else {
          console.error("Fehler bei der Anfrage:", error.message);
        }
      }
    },

    renderChart(dates, prices) {
      console.log("Rendering des Charts mit den folgenden Daten:", dates, prices); // Log der Daten vor dem Rendern des Diagramms

      // Überprüfen, ob das Canvas-Element vorhanden ist
      const ctx = document.getElementById("stockCanvas")?.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Schlusskurs",
                data: prices,
                borderColor: "#007bff", // Blau für die Linie
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
          },
        });
      } else {
        console.error("Canvas konnte nicht gefunden werden!"); // Wenn Canvas nicht gefunden wird
      }
    },
  },
};
</script>

<style scoped>
.stock-page {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px 40px;
  border-radius: 15px;
  background-color: #f4f4f9;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.stock-page input {
  padding: 10px;
  margin-right: 10px;
  border: 2px solid #007bff;
  border-radius: 5px;
  font-size: 16px;
  width: calc(100% - 40px);
  max-width: 400px;
  display: inline-block;
}

.stock-page button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.stock-page button:hover {
  background-color: #0056b3;
}

.stock-info {
  margin-top: 20px;
  text-align: center;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

/* Dark Mode für Stock */
.dark-mode .stock-page {
  background-color: #2c2c2c;
  color: #f4f4f4;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.dark-mode .stock-page input {
  background-color: #1e1e1e;
  color: #f4f4f4;
  border: 1px solid #8a2be2;
}

.dark-mode .stock-page button {
  background-color: #8a2be2;
  color: #ffffff;
}

.dark-mode .stock-page button:hover {
  background-color: #5a1c91;
}

.dark-mode .stock-page .error {
  color: #ff6b6b;
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .stock-page {
    margin: 20px 5%;
    padding: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  }

  .stock-page input {
    width: 90%;
    max-width: none;
  }

  .stock-page button {
    width: auto;
    margin-top: 10px;
  }
}
</style>
