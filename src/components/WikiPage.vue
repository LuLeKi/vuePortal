<template>
  <div class="wiki-page">
    <h2>Wikipedia Suche</h2>
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Suchbegriff eingeben" 
      @keyup.enter="runWikiQuery" 
    />
    <button @click="runWikiQuery">Suche starten</button>

    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-if="results.length > 0" class="results-table">
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Beschreibung</th>
            <th>Auszug</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results" :key="result.pageid">
            <td>{{ result.title }}</td>
            <td>{{ result.description || '-' }}</td>
            <td>{{ result.extract || '-' }}</td>
            <td>
              <a :href="`https://de.wikipedia.org/?curid=${result.pageid}`" target="_blank">
                Wikipedia-Seite
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "", // Suchbegriff des Benutzers
      results: [], // Ergebnisse der Wikipedia-Suche
      errorMessage: "", // Fehlermeldung
    };
  },
  methods: {
    async runWikiQuery() {
      // Proxy-URL mit Wikipedia-API
      const baseURL = "http://localhost:6001/proxy/?url=https://de.wikipedia.org/w/api.php";
      const queryParams = `?action=query&generator=prefixsearch&format=json&gpslimit=4&prop=extracts%7Cdescription&exintro=1&explaintext=1&exsentences=3&gpssearch=${encodeURIComponent(this.searchQuery)}`;
      const fullURL = `${baseURL}${queryParams}`;

      try {
        const response = await fetch(fullURL);
        const data = await response.json();

        // Fehlerprüfung
        if (data.error) {
          this.errorMessage = `Fehler: ${data.error.message}`;
          this.results = [];
          return;
        }

        // Ergebnisse extrahieren
        const pages = data.response?.query?.pages || {};
        this.results = Object.values(pages).map((page) => ({
          pageid: page.pageid,
          title: page.title,
          description: page.description,
          extract: page.extract,
        }));
        this.errorMessage = ""; // Fehler zurücksetzen
      } catch (error) {
        this.errorMessage = "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
        console.error("Fehler bei der Wiki-Suche:", error);
      }
    },
  },
};
</script>

<style scoped>

.wiki-page {
  max-width: 800px; /* Gleiche maximale Breite wie bei der Wetter-Seite */
  margin: 30px auto; /* Zentrierte Position mit Abstand nach oben/unten */
  padding: 20px 40px; /* Gleiche Innenabstände */
  border-radius: 15px; /* Runde Ecken */
  background-color: #f4f4f9; /* Heller Hintergrund */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Schattierung */
  text-align: center; /* Zentrierte Textelemente */
}

.wiki-page input {
  padding: 10px; /* Gleiche Polsterung wie Wetter-Seite */
  margin-right: 10px; /* Abstand zwischen Input und Button */
  border: 2px solid #007bff; /* Blaue Rahmenfarbe */
  border-radius: 5px; /* Runde Ecken */
  font-size: 16px; /* Konsistente Schriftgröße */
  width: calc(100% - 40px); /* Gleiche Breitenregelung wie bei Wetter */
  max-width: 400px; /* Maximale Breite */
  display: inline-block; /* Gleiche Linie wie der Button */
}

.wiki-page button {
  padding: 10px 15px; /* Gleiche Größe wie Wetter-Button */
  border: none; /* Ohne Rahmen */
  border-radius: 5px; /* Runde Ecken */
  background-color: #007bff; /* Blaue Farbe */
  color: white; /* Weiße Schrift */
  font-size: 16px; /* Konsistente Schriftgröße */
  cursor: pointer; /* Mauszeiger auf Button */
  transition: background-color 0.3s ease; /* Sanfte Hover-Animation */
}

.wiki-page button:hover {
  background-color: #0056b3; /* Dunkleres Blau beim Hover */
}

.error {
  color: red;
  margin-top: 10px; /* Abstand zur Fehlermeldung */
}

/* Dark Mode für Wiki */
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

.dark-mode .wiki-page .error {
  color: #ff6b6b; /* Fehler in auffälligem Rot */
}

.results-table {
  margin-top: 20px;
  text-align: left;
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.results-table th {
  background-color: #007bff;
  color: white;
}

.results-table a {
  color: #007bff;
  text-decoration: none;
}

.results-table a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
}

/* Mobile Anpassungen für die Wikipedia-Seite */
@media (max-width: 768px) {
  .wiki-page {
    margin: 20px 5%; /* Größerer Abstand zu den Seiten */
    padding: 20px; /* Konsistenter Innenabstand */
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15); /* Leichterer Schatten */
  }

  .wiki-page input {
    width: 90%; /* Eingabefeld passt sich besser an die Breite an */
    margin-bottom: 10px; /* Abstand nach unten zum Button */
    margin-right: 0; /* Kein seitlicher Abstand notwendig */
    display: block; /* Eingabefeld unter den Button verschieben */
  }

  .wiki-page button {
    width: 100%; /* Button nimmt die gesamte Breite ein */
    margin-top: 10px; /* Abstand zum Eingabefeld */
  }

  .results-table table {
    width: 100%; /* Tabelle füllt die Breite */
  }

  .results-table th, .results-table td {
    font-size: 0.9rem; /* Kleinere Schriftgröße für Tabellenzellen */
  }
}

</style>
