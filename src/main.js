import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './assets/css/style.css'; // Globale CSS-Datei importieren


const script = document.createElement('script');
script.src = "https://www.google.com/recaptcha/enterprise.js";
script.async = true;
script.defer = true;
script.onload = () => {
  console.log("Google reCAPTCHA-Skript wurde geladen.");
};
document.head.appendChild(script);

createApp(App).use(router).mount('#app');
