import express from "express"
import config from "./config/config.js"
import database from "./Connection/database.js"
import * as response from './config/response.js'
import userRouter from './v1/user/user.router.js'

const app = express()

// global variables in app
app.set('database', database) // db connection

// sets default headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

// enables json mode
app.use(express.json())

// handles json errors
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return response.system(res, err)
  }
})

// app base routes
app.use("/v1/user", userRouter);

// handles all the unused links
app.all("/*", (req, res) => {
  return response.fail(res, "invalid request")
})

// starts the app
app.listen(config.port, () => {
  console.log('\x1b[32m%s\x1b[0m', "server starting on port : " + config.port)
})