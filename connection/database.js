import { createPool } from "mysql";
import config from '../config/config.js';
import Account from './account.js'
import Freelancer from './freelancer.js'
import Client from './client.js'

const pool = createPool({
  port: config.database.port,
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database
})
 
// export as single database connection
export default {
    account: new Account(pool),
    freelancer: new Freelancer(pool),
    client: new Client(pool)
}