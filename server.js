const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());

// Mock-Daten für Benutzer
const users = {
  richuser: { password: 'richpass', role: 'rich' },
  pooruser: { password: 'poorpass', role: 'poor' },
};

/**
 * Middleware zur Überprüfung des Login-Status
 */
app.use((req, res, next) => {
  const login = req.cookies.login;
  if (login) {
    try {
      req.user = JSON.parse(login);
    } catch (error) {
      console.error("Fehler beim Parsen des Cookies:", error);
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

/**
 * Funktion zur Validierung des reCAPTCHA-Tokens
 */
async function validateRecaptchaToken(token, action) {
  const projectID = "vueportal-1734084918960"; // Deine Google Cloud-Projekt-ID
  const siteKey = "6Lf_b5oqAAAAACmMfNjvRLtuj01SDuHfs3K5UPBw"; // Dein Site Key

  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  const request = {
    parent: projectPath,
    assessment: {
      event: {
        token: token,
        siteKey: siteKey,
      },
    },
  };

  const [response] = await client.createAssessment(request);

  if (!response.tokenProperties.valid) {
    console.error("Ungültiges Token:", response.tokenProperties.invalidReason);
    return false;
  }

  if (response.tokenProperties.action !== action) {
    console.error("Unerwartete Aktion:", response.tokenProperties.action);
    return false;
  }

  console.log("Risikowert:", response.riskAnalysis.score);
  return response.riskAnalysis.score >= 0.5;
}

/**
 * Routen
 */

// Login-Endpunkt
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    res.cookie('login', JSON.stringify({ username, role: user.role }), {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Login successful', role: user.role, username: username });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Logout-Endpunkt
app.post('/logout', (req, res) => {
  res.clearCookie('login');
  res.status(200).json({ message: 'Logout successful' });
});

// Auth-Status prüfen
app.get('/auth-status', (req, res) => {
  if (req.user) {
    res.status(200).json({
      loggedIn: true,
      username: req.user.username,
      role: req.user.role,
    });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

// Recaptcha-Überprüfung mit RecaptchaEnterpriseServiceClient
app.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body; // Nur das Token extrahieren
  console.log("Empfangenes Token:", token); // Logge das Token

  // Konfiguration
  const projectID = "vueprojekt-1734094555213"; // Deine Google Cloud-Projekt-ID
  const recaptchaKey = process.env.VUE_APP_RECAPTCHA_SITE_KEY; // Hole den API-Schlüssel aus der .env-Datei
  const recaptchaAction = "VALIDATE"; // Gleiche Aktion wie im Frontend

  try {
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    // Anfrage zur Bewertung
    console.log("Sende Anfrage an RecaptchaEnterpriseServiceClient...");
    const request = {
      parent: projectPath,
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
    };

    const [response] = await client.createAssessment(request);
    console.log("Antwort von RecaptchaEnterpriseServiceClient erhalten:", response);

    // Überprüfen, ob das Token gültig ist
    if (!response.tokenProperties.valid) {
      console.error("Ungültiges Token:", response.tokenProperties.invalidReason);
      return res.status(400).json({ success: false, message: "Ungültiges Token" });
    }

    // Überprüfen, ob die Aktion korrekt ist
    if (response.tokenProperties.action !== recaptchaAction) {
      console.error("Unerwartete Aktion:", response.tokenProperties.action);
      return res.status(400).json({ success: false, message: "Falsche Aktion" });
    }

    // Risikowert ausgeben
    console.log("reCAPTCHA-Score:", response.riskAnalysis.score);
    response.riskAnalysis.reasons.forEach((reason) => console.log("Grund:", reason));

    // Validierung erfolgreich, wenn der Score hoch genug ist
    if (response.riskAnalysis.score >= 0.5) {
      return res.status(200).json({ success: true, message: "Validierung erfolgreich" });
    } else {
      return res.status(400).json({ success: false, message: "Niedriger Risikowert" });
    }
  } catch (error) {
    console.error("Fehler bei der Recaptcha-Validierung:", error.message);
    return res.status(500).json({ success: false, message: "Serverfehler" });
  }
});




// Handle SPA (fallback to index.html for unmatched routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Server starten
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
