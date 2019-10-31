require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { Connection } = require("./mongo_config/Connection");

/**
 * Routers
 */

 // const usuarios_route = require("./routes/usuarios");
 const login_route = require("../server/routes/index.js");

var app = express();
const PORT = normalizePort(process.env.PORT || "5000");

app
  .use(express.json())
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())

/**
 * Routes
 */

// app.use("/api/usuarios", usuarios_route);
app.use("/login", login_route);
app.use("/registrar", login_route);


/**
 * Front React
 */
app
  .use(express.static(path.join(__dirname, "../client/build")))
  .get("/", (req, res) => res.sendFile(path.join(__dirname,'../client/build/index.html')));



/**
 * Listen
 */
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
  Connection.connectToMongo();
});

/**
 * Get port from environment and store in Express.
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // pipe
  }
  if (port >= 0) {
    return port; // port
  }
  return false;
}



