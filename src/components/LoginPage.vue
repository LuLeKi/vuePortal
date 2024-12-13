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
/* global grecaptcha */
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY, // reCAPTCHA Site Key aus der .env-Datei
    };
  },
  methods: {
    async login() {
      try {
        // Überprüfen, ob reCAPTCHA verfügbar ist
        if (!window.grecaptcha) {
          this.errorMessage = "reCAPTCHA konnte nicht geladen werden.";
          return;
        }

        // reCAPTCHA ausführen und Token abrufen
        const token = await grecaptcha.enterprise.execute(this.siteKey, { action: "LOGIN" });
        console.log("reCAPTCHA-Token:", token);

        // Senden der Login-Daten zusammen mit dem reCAPTCHA-Token
        axios
          .post("/login", {
            username: this.username,
            password: this.password,
            recaptchaToken: token, // reCAPTCHA-Token wird mitgesendet
          })
          .then((response) => {
            console.log("Login erfolgreich mit Benutzer:", response.data.username);
            
            // Emit-Events auslösen
            this.$emit("login-success", response.data.username); // Login erfolgreich            
            this.$router.push("/home");
          })
          .catch((error) => {
            console.error("Login fehlgeschlagen:", error);
            this.errorMessage = "Ungültige Anmeldedaten oder reCAPTCHA-Validierung fehlgeschlagen.";
          });
      } catch (error) {
        console.error("Fehler beim Ausführen von reCAPTCHA:", error);
        this.errorMessage = "Fehler beim Ausführen von reCAPTCHA. Bitte versuchen Sie es später erneut.";
      }
    },
  },
  mounted() {
    // reCAPTCHA-Skript laden
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
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
