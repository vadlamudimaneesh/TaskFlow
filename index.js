require('./config/config');
const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT 

// Middlewares
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Default route to check server status
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to Task Management Application !!!' });
});

// Load routes dynamically from the routes folder
const routesPath = './routes';
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(`${routesPath}/${file}`);
    route.setRouter(app);
  }
});

// Catch-all route if no matching routes are found
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Error handler for server issues
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
