const { defineConfig } = require('@vue/cli-service');
const path = require('path');
// process.env.VUE_APP_OPENWEATHER_API_KEY = "e8a00027606a96e7ee6894957343fb33";


module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port : 3002,
    historyApiFallback: true, // Ensures the server falls back to index.html for SPA routes
    proxy: {
      '/': {
        target: 'http://localhost:3001', // Backend-Adresse
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      }
    }
  }
});