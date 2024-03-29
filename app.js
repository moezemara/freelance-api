import express from "express"
import https from "https"
import http from "http"
import fs from "fs"
import path from "path"
import helmet from "helmet"
import hpp from "hpp"
import csurf from "csurf"
import {Server} from "socket.io"
import {session, wrap} from './src/redis.js'
import config from "./config/config.js"
import database from "./connection/database.js"
import * as response from './src/response.js'
import userRouter from './v1/user/user.router.js'
import freelancerRouter from './v1/freelancer/freelancer.router.js'
import clientRouter from './v1/client/client.router.js'
import jobRouter from './v1/job/job.router.js'
import contractRouter from './v1/contract/contract.router.js'
import proposalRouter from './v1/proposal/proposal.router.js'
import globalRouter from './v1/global/global.router.js'
import paymentRouter from './v1/payment/payment.router.js'


const app = express()

try {
  // certs options
  var options = {
    key: fs.readFileSync(path.join(path.resolve('.'), config.certificate.key)),
    cert: fs.readFileSync(path.join(path.resolve('.'), config.certificate.cert))
  };

  var server = https.createServer(options, app)
}catch{
  console.log('\x1b[31m%s\x1b[0m', "Couldn't find certs. starting without ssl")
  server = http.createServer(app);
}

// chat part 
const io = new Server(server, { cors: {
  origin: "https://homielancer.com",
  methods: ["GET", "POST"],
  credentials: true
} });

io.use(wrap(session))

io.on("connect", socket => {
  console.log(socket.id)
  console.log(socket.request.session.account_id)

  socket.on('add', () => {
    console.log('adddd')
  })
})

// global variables in app
app.set('database', database) // db connection


// allow cross origin
app.use(function(req, res, next) {
  const origin = req.headers.origin
  if(config.alloweddomain.indexOf(origin) > -1){
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true)
  }
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

// sets default headers
app.use(helmet())
app.use(hpp())

// trusts apache2 proxy (first proxy)
app.set('trust proxy', 1)

// session config
app.use(session);

// csrf protection
//app.use(csurf())


// enables json mode
app.use(express.json())

// handles json errors
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return response.system(res, err)
  }
})


if(config.appmode == 'DEVELOPMENT'){
  app.use(function(req, res, next) {
    req.session.account_id = "7e81fbcc-ff88-4a97-96aa-bd4080cf8083"
    req.session.account_type = "C"
    req.session.verified = 0
    req.session.banned = 0
    next()
  })
}
// app base routes
app.use("/v1/global", globalRouter)
app.use("/v1/user", userRouter)
app.use("/v1/freelancer", freelancerRouter)
app.use("/v1/client", clientRouter)
app.use("/v1/job", jobRouter)
app.use("/v1/proposal", proposalRouter)
app.use("/v1/contract", contractRouter)
app.use("/v1/payment", paymentRouter)

// handles all the unused links
app.all("/*", (req, res) => {
  return response.fail(res, "invalid request")
})

// starts the app
server.listen(config.port, () => {
  console.log('\x1b[32m%s\x1b[0m', "server starting on port : " + config.port)
})
