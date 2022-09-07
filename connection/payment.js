export default class Payment {
  constructor(pool){
      this.pool = pool
  }

  insertorder (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO orders (account_id, order_id, status, amount)
        VALUES(?,?,?,?)
        `,
        [
          data.account_id,
          data.order_id,
          data.status,
          data.amount
        ],
        (error, results, fields) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        }
      );
    })
  }

  selectorder (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT * FROM orders WHERE order_id = ? AND account_id = ?`,
        [
          data.order_id,
          data.account_id
        ],
        (error, results, fields) => {
          if (error) {
            reject(error)
          }else{
            resolve(results[0])
          }
        }
      );
    })
  }

  updateorder (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE orders SET status = ? WHERE order_id = ? AND account_id = ?`,
        [
          data.status,
          data.order_id,
          data.account_id
        ],
        (error, results, fields) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        }
      );
    })
  }

  inserttransaction (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO transaction (transaction_id, order_id, status, amount, currency_code)
        VALUES(?,?,?,?,?)
        `,
        [
          data.transaction_id,
          data.order_id,
          data.status,
          data.amount,
          data.currency_code
        ],
        (error, results, fields) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        }
      );
    })
  }

  selecttransaction (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT * FROM transaction WHERE transaction_id = ? AND order_id = ?`,
        [
          data.transaction_id,
          data.order_id
        ],
        (error, results, fields) => {
          if (error) {
            reject(error)
          }else{
            resolve(results[0])
          }
        }
      );
    })
  }

  updatetransaction (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE transaction SET status = ? WHERE transaction_id = ? AND order_id = ?`,
        [
          data.status,
          data.transaction_id,
          data.order_id
        ],
        (error, results, fields) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        }
      );
    })
  }
}