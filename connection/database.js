import { createPool } from "mysql";
import config from '../config/config.js';
import Account from './account.js'

const pool = createPool({
  port: config.database.port,
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database
})
 
// import tables and export as single database connection

export default {
    account: new Account(pool)
}