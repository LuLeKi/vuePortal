<template>
  <div id="app">
    <header>
      <div class="header-content">
        <h3 class="custom-title">VuePortal DHBW</h3>
        <img src="@/assets/images/logo.svg" alt="DHBW Logo" class="dhbw-logo" />
        <button @click="toggleTheme" class="theme-toggle">Toggle Theme</button>
      </div>
      <div class="login-info">
  <span>{{ username }}</span>&nbsp;|&nbsp;
  <router-link v-if="!loggedIn" to="/login">Einloggen</router-link>
  <a v-else @click.prevent="logout" class="logout-link">Ausloggen</a>&nbsp;|&nbsp;
  <span>
  reCAPTCHA
  <span v-if="recaptchaVerified" style="color: black;">✔</span>
  <span v-else style="color: black;">✖</span>
</span>

</div>

    </header>
    <nav>
      <router-link to="/home">Home</router-link> |
      <router-link to="/weather">Weather</router-link> |
      <router-link to="/wikisearch">WikiSearch</router-link>
    </nav>
    <router-view @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "Nicht eingeloggt",
      loggedIn: false,
      recaptchaVerified: false,
    };
  },
  methods: {
    checkAuthStatus() {
      axios
        .get("/auth-status")
        .then((response) => {
          this.loggedIn = response.data.loggedIn;
          this.username = response.data.username || "Nicht eingeloggt";
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen des Login-Status:", error);
        });
    },
    handleLoginSuccess(username) {
    this.loggedIn = true;
    this.username = username;
    this.recaptchaVerified = true; // reCAPTCHA erfolgreich bestanden
    this.$router.push("/home");
  },


    logout() {
      axios.post("/logout").then(() => {
        this.loggedIn = false;
        this.username = "Nicht eingeloggt";
        this.recaptchaVerified = false;
        this.$router.push("/login");
      });
    },
    toggleTheme() {
      const body = document.body;
      if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
      } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
      }
    },
    runRecaptchaVerification() {
      if (!window.grecaptcha) {
        console.error("reCAPTCHA konnte nicht geladen werden.");
        return;
      }
      window.grecaptcha.enterprise.ready(async () => {
        const siteKey = process.env.VUE_APP_RECAPTCHA_SITE_KEY;
        try {
          const token = await window.grecaptcha.enterprise.execute(siteKey, { action: "LOGIN" });
          console.log("reCAPTCHA-Token:", token);
          const response = await axios.post("/verify-recaptcha", { token });
          if (response.data.success) {
            this.recaptchaVerified = true;
          } else {
            this.recaptchaVerified = false;
          }
        } catch (error) {
          console.error("Fehler bei der reCAPTCHA-Verifizierung:", error);
          this.recaptchaVerified = false;
        }
      });
    },
  },
  created() {
    this.checkAuthStatus();
  },
};
</script>




<style>
/* Allgemeine Styles (Desktop) */
:root {
    /* Default Farben (Light Mode, jetzt umgekehrt) */
    --background-color: #1e1e1e; /* Dunkler Hintergrund für Light Mode */
    --text-color: #f4f4f4; /* Heller Text für Light Mode */
    --link-color: #7f7fff; /* Blaue Links für Light Mode */
    --hover-color: #afafff; /* Hellblaue Hover-Farbe für Light Mode */
    --section-background: #2c2c2c; /* Dunkler Sektionen-Hintergrund für Light Mode */
    --section-shadow: rgba(255, 255, 255, 0.1); /* Helle Schatten */
}

.dark-mode {
    /* Farben für Dark Mode, jetzt umgekehrt */
    --background-color: #f4f4f4; /* Heller Hintergrund für Dark Mode */
    --text-color: #333; /* Dunkler Text für Dark Mode */
    --link-color: #8A2BE2; /* Lila Links für Dark Mode */
    --hover-color: #5a1c91; /* Dunkellila Hover-Farbe für Dark Mode */
    --section-background: #fff; /* Heller Sektionen-Hintergrund für Dark Mode */
    --section-shadow: rgba(0, 0, 0, 0.1); /* Dunkler Schatten */
}

/* Header Styles */
header {
  background: linear-gradient(
    to bottom,
    var(--background-color),
    var(--section-background)
  ); /* Gradient für Header */
  color: var(--text-color);
  text-align: center;
  padding: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Schattierung */
  position: relative;
  z-index: 10;
}

/* Custom Title Styles */
.custom-title {
  font-family: 'Roboto', sans-serif; /* Einheitliche Schriftart */
  font-size: 2rem; /* Schriftgröße */
  font-weight: bold;
  color: var(--text-color); /* Abhängig vom Theme */
  margin: 0;
  text-align: center;
}

/* Login Info Styles */
.login-info {
  padding: 10px 20px;
  border: 2px solid var(--link-color); /* Rahmen um den Benutzerbereich */
  border-radius: 0px; /* Ecken nicht mehr rund */
  font-size: 1.1rem;
  font-weight: 500;
  background: var(--section-background);
  color: var(--text-color);
  display: inline-block;
  margin-top: 10px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.login-info a, .router-link {
  color: var(--link-color); /* Link-Farbe */
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.login-info:hover {
  background: var(--hover-color); /* Heller Hover im Dark Mode */
  color: var(--text-color);
  transform: scale(1.05); /* Leichtes Vergrößern beim Hover */
}

/* Navigation Styles */
nav {
  margin-top: 10px;
  padding: 10px 0;
  background-color: var(--section-background);
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  border-top: 2px solid var(--link-color); /* Farbige Linie als Akzent */
}

.theme-toggle {
  position: absolute;
  top: 2%; /* Abstand nach oben */
  right: 2%; /* Abstand nach rechts */
  padding: 1% 2%; /* Kompaktere Innenabstände */
  border: 1px solid var(--hover-color); /* Dünnerer Rahmen */
  background: var(--link-color);
  color: var(--text-color);
  border-radius: 25px;
  font-size: 0.9rem; /* Kleinere Schriftgröße */
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Dezenter Schatten */
}

.theme-toggle:hover {
  background: var(--hover-color);
  transform: scale(1.05); /* Leichtes Vergrößern beim Hover */
}

/* Header Content */
.header-content {
  display: flex;
  justify-content: center; /* Zentriere Inhalte horizontal */
  align-items: center; /* Zentriere Inhalte vertikal */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px; /* Abstand zwischen Logo, Titel und Toggle-Button */
}

/* Logo Styles */
.dhbw-logo {
  height: 50px;
  width: auto;
}

/* Navigation Link Styles */
nav a {
  padding: 10px 15px;
  color: var(--link-color);
  font-weight: 600;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

nav a:hover {
  background-color: var(--hover-color); /* Dezenter Hover-Effekt */
  color: var(--text-color);
}
/* Mobile Anpassungen */

@media (max-width: 768px) {
  .header-content {
    flex-direction: column; /* Vertikale Anordnung */
    align-items: center; /* Zentriert */
    gap: 3%; /* Weniger Abstand */
    width: 100%; /* Nutzt die volle Breite */
    display: flex;
  flex-direction: column; /* Vertikale Anordnung */
  align-items: center; /* Zentrierte Inhalte */
  gap: 2%; /* Abstand zwischen Logo, Titel und Button */
  margin-top: 5%; /* Verschiebt den gesamten Header weiter nach unten */
  }

  .custom-title {
    font-size: 1.5rem; /* Kleinere Schriftgröße */
    text-align: center;
    width: 100%; /* Titel über die gesamte Breite */
    font-size: 1.5rem; /* Leicht reduzierte Schriftgröße */
  font-weight: bold;
  color: var(--text-color);
  margin: 2% 0; /* Abstand nach oben und unten */
  text-align: center;
  }

  .dhbw-logo {
  height: auto; /* Automatische Höhe */
  width: 15%; /* Proportionale Breite */
  max-width: 60px; /* Maximale Breite */
  object-fit: contain; /* Verhindert Verzerrungen */
  margin-bottom: 1%; /* Etwas Abstand unter dem Logo */
}
.login-info {
  padding: 1% 2%; /* Reduzierte Abstände */
  border: 1px solid var(--link-color); /* Dünnerer Rahmen */
  border-radius: 5px; /* Leicht abgerundete Ecken */
  font-size: 0.9rem; /* Kleinere Schriftgröße */
  font-weight: 400; /* Weniger fett */
  background: var(--section-background);
  color: var(--text-color);
  display: inline-block;
  margin-top: 2%; /* Etwas Abstand nach oben */
  text-align: center; /* Zentrierte Inhalte */
  width: auto; /* Dynamische Breite */
  max-width: 90%; /* Begrenzte maximale Breite */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Leichter Schatten */
}

.login-info a, .router-link {
  color: var(--link-color); /* Link-Farbe */
  text-decoration: none;
  font-size: 0.85rem; /* Kleinere Schriftgröße */
}

.login-info span {
  font-size: 0.85rem; /* Konsistente Schriftgröße für Text */
}

  .theme-toggle {
    top: 1%; /* Abstand nach oben */
    right: 1%; /* Abstand nach rechts */
    padding: 5%; /* Relativer Abstand innerhalb des Buttons */
    font-size: 0.9rem; /* Kleinere Schriftgröße */
    width: auto; /* Breite anpassen */
    padding: 0.5% 1%; /* Kleinere Abstände für mobile Geräte */
    font-size: 0.8rem; /* Reduzierte Schriftgröße */

    border: 1px solid var(--hover-color); /* Rahmen bleibt proportional */
  }

  nav {
    text-align: center; /* Links in die Mitte */
    padding: 2% 0; /* Vertikale und horizontale Abstände in Prozent */
  }

  nav a {
    font-size: 0.9rem; /* Kleinere Schriftgröße für Links */
    padding: 1% 2%; /* Kompakte Abstände */
  }
}
</style>

