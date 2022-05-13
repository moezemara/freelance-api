import express from "express"
import https from "https"
import fs from "fs"
import path from "path"
import sessions from 'express-session'
import {createClient} from 'redis'
import connectRedis from 'connect-redis'
import config from "./config/config.js"
import database from "./connection/database.js"
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

// trusts apache2 proxy (first proxy)
app.set('trust proxy', 1)


const RedisStore = connectRedis(sessions)

//Configure redis client
const redisClient = createClient({
  port: config.redis.port,
  host: config.redis.host,
  legacyMode: true
})

await redisClient.connect();

// sessions config
app.use(sessions({
    secret: config.session.encryptkey,
    saveUninitialized: false,
    name: "SessionID",
    cookie: { 
      maxAge: config.session.expire, 
      secure: config.appmode == "DEVELOPMENT" ? false : true, 
      sameSite: true, 
      domain: config.session.domain,
      httpOnly: false
    },
    store: new RedisStore({client: redisClient}),
    resave: false 
}));

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


try {
  // certs options
  var options = {
    key: fs.readFileSync(path.join(path.resolve('.'), config.certificate.key)),
    cert: fs.readFileSync(path.join(path.resolve('.'), config.certificate.cert))
  };

  var server = https.createServer(options, app)
}catch{
  console.log('\x1b[31m%s\x1b[0m', "Couldn't find certs. starting without ssl")
  server = app;
}

// starts the app
server.listen(config.port, () => {
  console.log('\x1b[32m%s\x1b[0m', "server starting on port : " + config.port)
})
