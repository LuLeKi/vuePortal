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
      siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY, // reCAPTCHA Site Key from .env file
    };
  },
  methods: {
    async login() {
      try {
        // Ensure reCAPTCHA is available
        if (!window.grecaptcha) {
          this.errorMessage = "reCAPTCHA could not be loaded.";
          return;
        }

        // Execute reCAPTCHA and fetch token
        const token = await grecaptcha.enterprise.execute(this.siteKey, { action: "LOGIN" });
        console.log("reCAPTCHA token:", token);

        // Send login data with reCAPTCHA token
        axios
          .post("/login", {
            username: this.username,
            password: this.password,
            recaptchaToken: token, // Send reCAPTCHA token
          })
          .then((response) => {
            console.log("Login successful for user:", response.data.username);

            // Emit event for successful login
            this.$emit("login-success", response.data.username);
            this.$router.push("/home");
          })
          .catch((error) => {
            console.error("Login failed:", error);
            this.errorMessage = "Invalid credentials or reCAPTCHA validation failed.";
          });
      } catch (error) {
        console.error("Error executing reCAPTCHA:", error);
        this.errorMessage = "Error executing reCAPTCHA. Please try again later.";
      }
    },
  },
  mounted() {
    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  },
};
</script>

<style scoped>
/* Styling for the login page */
.login-page {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px 40px;
  border-radius: 15px;
  background-color: #f4f4f9;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.login-page input {
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid #007bff;
  border-radius: 5px;
  font-size: 16px;
  width: calc(100% - 40px);
  max-width: 400px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.login-page button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: calc(100% - 40px);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.login-page button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 15px;
  text-align: center;
}

/* Dark mode styles */
.dark-mode .login-page {
  background-color: #2c2c2c;
  color: #f4f4f4;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.dark-mode .login-page input {
  background-color: #1e1e1e;
  color: #f4f4f4;
  border: 1px solid #8a2be2;
}

.dark-mode .login-page button {
  background-color: #8a2be2;
  color: #ffffff;
  border: none;
}

.dark-mode .login-page button:hover {
  background-color: #5a1c91;
}

.dark-mode .login-page .error {
  color: #ff6b6b;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .login-page {
    margin: 20px 5%;
    padding: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  }

  .login-page input {
    width: 90%;
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
  }

  .login-page button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-top: 10px;
    border-radius: 5px;
  }

  .error {
    font-size: 0.9rem;
    margin-top: 10px;
    text-align: center;
  }
}
</style>
