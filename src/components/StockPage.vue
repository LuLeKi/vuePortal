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
      symbol: "AAPL", // Default ticker symbol
      stockData: null,
      error: "",
      lastRefreshed: "",
      closingPrice: "",
    };
  },
  methods: {
    async fetchStockData() {
      console.log("Fetching data for symbol:", this.symbol);
      this.error = "";
      this.stockData = null;
      const apiKey = process.env.VUE_APP_STOCK_KEY; // API key from .env file
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.symbol}&apikey=${apiKey}`;

      try {
        const response = await axios.get(url);
        const data = response.data;
        if (data["Time Series (Daily)"]) {
          const timeSeries = data["Time Series (Daily)"];
          const dates = Object.keys(timeSeries).slice(0, 10).reverse(); // Last 10 days
          const closingPrices = dates.map((date) => timeSeries[date]["4. close"]);
          this.lastRefreshed = dates[0];
          this.closingPrice = closingPrices[0];
          this.stockData = { dates, closingPrices };

          nextTick(() => {
            this.renderChart(dates, closingPrices);
          });
        } else {
          this.error = "No data found.";
        }
      } catch (error) {
        this.error = "Error fetching data.";
        console.error("Error with API request:", error);
      }
    },

    renderChart(dates, prices) {
      const ctx = document.getElementById("stockCanvas")?.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Closing Price",
                data: prices,
                borderColor: "#007bff",
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
        console.error("Canvas not found!");
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

/* Dark Mode styles */
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

/* Mobile adjustments */
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
