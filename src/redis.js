import sessions from 'express-session'
import {createClient} from 'redis'
import connectRedis from 'connect-redis'
import config from '../config/config.js'

const RedisStore = connectRedis(sessions)

//Configure redis client
const redisClient = createClient({
  port: config.redis.port,
  host: config.redis.host,
  legacyMode: true
})

await redisClient.connect();

export default sessions({
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
})