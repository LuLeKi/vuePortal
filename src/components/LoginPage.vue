<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      /*
      axios
        .post("/login", { username: this.username, password: this.password }) // Proxy-Pfad verwendet
        .then(() => {
          this.$router.push("/home"); // Weiterleitung zur Startseite

        })
        .catch(() => {
          this.errorMessage = "Ungültige Anmeldedaten. Bitte erneut versuchen.";
        });
        */
      axios
        .post("/login", { username: this.username, password: this.password })
        .then((response) => { // Add 'response' here
          console.log("response.data.username:", response.data.username); // Verify the username is now defined
          this.$emit("login-success", response.data.username); // Use 'response.data'
          console.log("Login success emitted with username:", response.data.username);
          this.$router.push("/home");
        })
        .catch(() => {
          this.errorMessage = "Ungültige Anmeldedaten. Bitte erneut versuchen.";
        });


    },
  },
};
</script>

<style scoped>
/* Simple styles for the login page */
.login-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
}
.error {
  color: red;
}
</style>
