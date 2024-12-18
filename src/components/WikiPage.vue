<template>
  <div class="wiki-page">
    <h1>Wikipedia Suche</h1>

    <div>
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Suchbegriff eingeben"
        @keyup.enter="fetchWikiData"
      />
      <button @click="fetchWikiData">Suche starten</button>
    </div>

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

    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

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
      searchTerm: '',
      wikiResults: [],
      errorMessage: ''
    };
  },
  methods: {
    async fetchWikiData() {
      const proxyBase = 'http://localhost:3001/proxy';
      const wikiUrl = `https://de.wikipedia.org/w/api.php?action=query&generator=prefixsearch&format=json&gpslimit=4&prop=extracts%7Cdescription&exintro=1&explaintext=1&exsentences=3&gpssearch=${encodeURIComponent(this.searchTerm)}`;

      try {
        const response = await axios.get(`${proxyBase}?url=${encodeURIComponent(wikiUrl)}`);
        const wikiResponse = response.data.response;
        if (wikiResponse && wikiResponse.query && wikiResponse.query.pages) {
          this.wikiResults = Object.values(wikiResponse.query.pages);
        } else {
          this.wikiResults = [];
        }
        this.errorMessage = '';
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        this.errorMessage = 'Fehler beim Abrufen der Daten. Bitte erneut versuchen.';
        this.wikiResults = [];
      }
    }
  }
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

/* Dark Mode für Wiki-Seite */
.dark-mode .wiki-page {
  background-color: #2c2c2c; /* Dunkler Hintergrund */
  color: #f4f4f4; /* Heller Text */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Dezenter Rahmen */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Stärkere Schatten */
}

.dark-mode .wiki-page input {
  background-color: #1e1e1e; /* Dunkler Input-Hintergrund */
  color: #f4f4f4; /* Heller Text */
  border: 1px solid #8a2be2; /* Rahmen in Lila */
}

.dark-mode .wiki-page button {
  background-color: #8a2be2; /* Lila Hintergrund */
  color: #ffffff; /* Weiße Schrift */
  border: none; /* Kein Rahmen */
}

.dark-mode .wiki-page button:hover {
  background-color: #5a1c91; /* Dunkleres Lila beim Hover */
}

.dark-mode .wiki-info th {
  background-color: #8a2be2; /* Dunkles Lila */
}

.dark-mode .wiki-info td {
  color: #f4f4f4; /* Heller Text */
}

.dark-mode .wiki-info a {
  color: #8a2be2; /* Lila Links */
}

.dark-mode .wiki-info a:hover {
  color: #5a1c91; /* Dunkleres Lila beim Hover */
}

/* Mobile Optimierung für die Wiki-Seite */
@media (max-width: 768px) {
  .wiki-page {
    margin: 20px 5%; /* Anpassung an mobile Seitenränder */
    padding: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15); /* Leichterer Schatten */
  }

  .wiki-page input {
    width: 90%; /* Eingabefeld passt sich mobiler Breite an */
    max-width: none;
  }

  .wiki-page button {
    width: auto; /* Flexibler Button */
    margin-top: 10px; /* Abstand zum Eingabefeld */
  }

  .wiki-info table {
    font-size: 14px; /* Kleinere Schrift für mobile Tabellen */
    overflow-x: auto; /* Scrollen bei zu breiten Tabellen */
    display: block; /* Blockdarstellung für bessere Mobilansicht */
  }

  .wiki-info th,
  .wiki-info td {
    padding: 8px; /* Weniger Polsterung für Platzersparnis */
  }
}
</style>


.wiki-info table {
  display: block; /* Ermöglicht Scrollbarkeit */
  overflow-x: auto; /* Horizontales Scrollen bei Bedarf */
  white-space: nowrap; /* Verhindert den Zeilenumbruch in Zellen */
}

.wiki-info th,
.wiki-info td {
  font-size: 0.85em; /* Kleinere Schriftgröße für bessere Lesbarkeit */
  padding: 5px; /* Reduzierter Innenabstand */
}
*/