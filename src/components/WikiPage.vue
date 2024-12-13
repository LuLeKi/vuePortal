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
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.wiki-page input {
  padding: 10px;
  font-size: 16px;
  width: 60%;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.wiki-page button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.wiki-page button:hover {
  background-color: #0056b3;
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
</style>
