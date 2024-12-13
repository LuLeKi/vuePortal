<template>
  <div>
    <h1>reCAPTCHA Test</h1>
    <button @click="onClick">Ich bin kein Roboter</button>
  </div>
</template>

<script>
/* global grecaptcha */
export default {
  data() {
    return {
      siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY, // Hole den API-Schlüssel aus der .env-Datei
    };
  },
  methods: {
    async onClick() {
      try {
        if (!window.grecaptcha) {
          alert("reCAPTCHA konnte nicht geladen werden.");
          return;
        }

        await grecaptcha.enterprise.ready(() => {
          grecaptcha.enterprise
            .execute(this.siteKey, { action: "VALIDATE" })
            .then((token) => {
              console.log("reCAPTCHA-Token:", token);
              alert("reCAPTCHA erfolgreich ausgeführt! Token wurde generiert.");
            });
        });
      } catch (error) {
        console.error("Fehler bei der reCAPTCHA-Validierung:", error);
        alert("Fehler beim Ausführen von reCAPTCHA.");
      }
    },
  },
  mounted() {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>