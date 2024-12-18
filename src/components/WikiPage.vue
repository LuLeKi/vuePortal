<template>
  <div class="wiki-page">
    <h1>Wikipedia Suche</h1>
    <form @submit.prevent="fetchWikiData">
      <label for="search">Suchbegriff:</label>
      <input type="text" v-model="searchTerm" id="search" required />
      <button type="submit">Suchen</button>
    </form>

    <table v-if="wikiResults.length" border="1">
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
          <td><a :href="`https://de.wikipedia.org/?curid=${result.pageid}`" target="_blank">Link</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'WikiPage',
  data() {
    return {
      searchTerm: '',
      wikiResults: []
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
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        this.wikiResults = [];
      }
    }
  }
};
</script>

<style>
.wiki-page {
  font-family: Arial, sans-serif;
  margin: 20px;
}

form {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 10px;
  text-align: left;
}
</style>
