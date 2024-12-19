<template>
  <div class="wiki-page">
    <h1>Wikipedia Suche</h1>

    <!-- Input field for search term and button to initiate search -->
    <div>
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Suchbegriff eingeben"
        @keyup.enter="fetchWikiData"
      />
      <button @click="fetchWikiData">Suche starten</button>
    </div>

    <!-- Display results if available -->
    <div v-if="wikiResults.length" class="wiki-info">
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Beschreibung</th>
            <th>Auszug</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in wikiResults" :key="result.pageid">
            <td>{{ result.title }}</td>
            <td>{{ result.description }}</td>
            <td>{{ result.extract }}</td>
            <td>
              <a :href="`https://de.wikipedia.org/?curid=${result.pageid}`" target="_blank">Link</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Display error message if there is an error -->
    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <!-- Prompt user to enter a search term if no results or error -->
    <div v-else>
      <p>Bitte einen Suchbegriff eingeben und auf "Suche starten" klicken.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchTerm: '', // Stores the user's search term
      wikiResults: [], // Array to hold Wikipedia search results
      errorMessage: '', // Error message to display if the search fails
    };
  },
  methods: {
    // Fetch Wikipedia data based on the search term
    async fetchWikiData() {
      const proxyBase = 'http://localhost:3001/proxy'; // Proxy server for handling CORS
      const wikiUrl = `https://de.wikipedia.org/w/api.php?action=query&generator=prefixsearch&format=json&gpslimit=4&prop=extracts%7Cdescription&exintro=1&explaintext=1&exsentences=3&gpssearch=${encodeURIComponent(this.searchTerm)}`;

      try {
        // Make a GET request to the Wikipedia API via the proxy
        const response = await axios.get(`${proxyBase}?url=${encodeURIComponent(wikiUrl)}`);
        const wikiResponse = response.data.response;
        if (wikiResponse && wikiResponse.query && wikiResponse.query.pages) {
          this.wikiResults = Object.values(wikiResponse.query.pages); // Extract results
        } else {
          this.wikiResults = []; // No results found
        }
        this.errorMessage = ''; // Clear any previous error messages
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error); // Log the error
        this.errorMessage = 'Fehler beim Abrufen der Daten. Bitte erneut versuchen.'; // Display error message
        this.wikiResults = []; // Clear previous results
      }
    },
  },
};
</script>

<style scoped>
.wiki-page {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px 40px;
  border-radius: 15px;
  background-color: #f4f4f9;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.wiki-page input {
  padding: 10px;
  margin-right: 10px;
  border: 2px solid #007bff;
  border-radius: 5px;
  font-size: 16px;
  width: calc(100% - 40px);
  max-width: 400px;
  display: inline-block;
}

.wiki-page button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px; /* Abstand zwischen Buttons */
}

.wiki-page button:hover {
  background-color: #0056b3;
}

.wiki-info {
  margin-top: 20px;
  text-align: center;
}

.wiki-info table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed; /* Gleichmäßige Spaltenbreite */
  word-wrap: break-word; /* Zeilenumbruch für lange Texte */
}

.wiki-info th,
.wiki-info td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  word-wrap: break-word; /* Zeilenumbruch innerhalb der Zelle */
}

.wiki-info th {
  background-color: #007bff;
  color: white;
}

.wiki-info a {
  color: #007bff;
  text-decoration: none;
}

.wiki-info a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

/* Dark Mode styles */
.dark-mode .wiki-page {
  background-color: #2c2c2c; /* Dark background */
  color: #f4f4f4; /* Light text */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Deeper shadow */
}

.dark-mode .wiki-page input {
  background-color: #1e1e1e; /* Dark input background */
  color: #f4f4f4; /* Light text */
  border: 1px solid #8a2be2; /* Purple border */
}

.dark-mode .wiki-page button {
  background-color: #8a2be2; /* Purple background */
  color: #ffffff; /* White text */
}

.dark-mode .wiki-page button:hover {
  background-color: #5a1c91; /* Darker purple on hover */
}

.dark-mode .wiki-info th {
  background-color: #8a2be2; /* Dark purple */
}

.dark-mode .wiki-info td {
  color: #f4f4f4; /* Light text */
}

.dark-mode .wiki-info a {
  color: #8a2be2; /* Purple links */
}

.dark-mode .wiki-info a:hover {
  color: #5a1c91; /* Darker purple on hover */
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .wiki-page {
    margin: 20px 5%; /* Adjust margins for smaller screens */
    padding: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15); /* Softer shadow for mobile */
  }

  .wiki-page input {
    width: 90%; /* Input field adapts to mobile width */
    max-width: none;
  }

  .wiki-page button {
    width: auto; /* Flexible button width */
    margin-top: 10px; /* Spacing above button */
  }

  .wiki-info table {
    font-size: 14px; /* Smaller font for mobile tables */
    overflow-x: auto; /* Horizontal scrolling for wide tables */
    display: block; /* Block layout for better responsiveness */
  }

  .wiki-info th,
  .wiki-info td {
    padding: 8px; /* Reduced padding for space saving */
  }
}
</style>
