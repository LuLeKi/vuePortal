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
  max-width: 800px; /* Gleiche maximale Breite wie bei Wetter- und Wikipedia-Seite */
  margin: 30px auto; /* Zentrierte Position mit Abstand nach oben/unten */
  padding: 20px 40px; /* Gleiche Innenabstände */
  border-radius: 15px; /* Runde Ecken */
  background-color: #f4f4f9; /* Heller Hintergrund */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Schattierung */
  text-align: center; /* Zentrierte Textelemente */
}

.login-page input {
  padding: 10px; /* Gleiche Polsterung wie bei Wetter- und Wikipedia-Seite */
  margin-bottom: 15px; /* Abstand zwischen den Eingabefeldern */
  border: 2px solid #007bff; /* Blaue Rahmenfarbe */
  border-radius: 5px; /* Runde Ecken */
  font-size: 16px; /* Konsistente Schriftgröße */
  width: calc(100% - 40px); /* Gleiche Breitenregelung wie bei Wetter */
  max-width: 400px; /* Maximale Breite */
  display: block; /* Eingabefelder untereinander */
  margin-left: auto; /* Zentrierung */
  margin-right: auto; /* Zentrierung */
}

.login-page button {
  padding: 10px 15px; /* Gleiche Größe wie bei Wetter-Button */
  border: none; /* Ohne Rahmen */
  border-radius: 5px; /* Runde Ecken */
  background-color: #007bff; /* Blaue Farbe */
  color: white; /* Weiße Schrift */
  font-size: 16px; /* Konsistente Schriftgröße */
  cursor: pointer; /* Mauszeiger auf Button */
  transition: background-color 0.3s ease; /* Sanfte Hover-Animation */
  width: calc(100% - 40px); /* Gleiche Breitenregelung */
  max-width: 400px; /* Maximale Breite */
  margin-left: auto; /* Zentrierung */
  margin-right: auto; /* Zentrierung */
}

.login-page button:hover {
  background-color: #0056b3; /* Dunkleres Blau beim Hover */
}

.error {
  color: red;
  margin-top: 15px; /* Abstand zur Fehlermeldung */
  text-align: center; /* Zentrierte Fehlermeldung */
}

/* Dark Mode für Login */
.dark-mode .login-page {
  background-color: #2c2c2c; /* Dunkler Hintergrund */
  color: #f4f4f4; /* Heller Text */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Dezenter Rahmen */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Stärkere Schatten */
}

.dark-mode .login-page input {
  background-color: #1e1e1e; /* Dunkler Input-Hintergrund */
  color: #f4f4f4; /* Heller Text */
  border: 1px solid #8a2be2; /* Rahmen in Lila */
}

.dark-mode .login-page button {
  background-color: #8a2be2; /* Lila Hintergrund */
  color: #ffffff; /* Weiße Schrift */
  border: none; /* Kein Rahmen */
}

.dark-mode .login-page button:hover {
  background-color: #5a1c91; /* Dunkleres Lila beim Hover */
}

.dark-mode .login-page .error {
  color: #ff6b6b; /* Fehler in auffälligem Rot */
}

/* Mobile Anpassungen für die Login-Seite */
@media (max-width: 768px) {
  .login-page {
    margin: 20px 5%; /* Größerer Abstand zu den Seiten */
    padding: 20px; /* Konsistenter Innenabstand */
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15); /* Leichter Schatten für mobile Geräte */
  }

  .login-page input {
    width: 90%; /* Eingabefelder passen sich der Breite an */
    margin-bottom: 15px; /* Abstand zwischen den Feldern */
    padding: 10px; /* Angenehme Größe für mobile Eingaben */
    font-size: 16px; /* Schriftgröße für bessere Lesbarkeit */
    border-radius: 5px; /* Runde Ecken */
  }

  .login-page button {
    width: 100%; /* Button nimmt die gesamte Breite ein */
    padding: 10px; /* Konsistente Höhe des Buttons */
    font-size: 16px; /* Anpassung der Schriftgröße */
    margin-top: 10px; /* Abstand nach oben */
    border-radius: 5px; /* Runde Ecken */
  }

  .error {
    font-size: 0.9rem; /* Kleinere Schriftgröße für die Fehlermeldung */
    margin-top: 10px; /* Abstand zur Fehlermeldung */
    text-align: center; /* Zentrierte Fehlermeldung */
  }
}
</style>
