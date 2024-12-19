
# Matrikelnummer: 7492409
# VuePortal website setup and deployment

## Introduction
This guide provides instructions for setting up and running the VuePortal website locally.

## Prerequisites

### If Node.js is not installed:
Download and install Node.js from the official site:  
[Node.js Download](https://nodejs.org/en/download/prebuilt-installer/current)

## Get the Project

1. Clone the project repository:
   ```bash
   git clone https://github.com/LuLeKi/vuePortal.git
   ```

3. Move into the project folder:
   ```bash
   cd pathToProject/VuePortal
   ```
2. Place the `.env` file from the provided ZIP archive into the project folder  
   **OR**  
   Unzip the entire ZIP archive into the project folder.

## Project Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server and Compiling the Website

### Open two command line terminals (in VS Code: `Ctrl + Shift + ö`)

#### Terminal 1: Run the Server
1. Start the server:
   ```bash
   node server.js
   ```

#### Terminal 2: Compile the Website
1. Compile the development website:
   ```bash
   npm run serve
   ```

2. Open the link in your browser:  
   [http://localhost:3002/](http://localhost:3002/)

## Quick Install and Server Run Command

To quickly set up and run the server:
```bash
npm install
node server.js
npm run serve
```



