export default class Account {
  constructor(pool){
      this.pool = pool
  }

  selectuserbyusername (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT account_id, password, account_type, verified, banned 
        FROM account WHERE username = ?`,
        [
          data.username
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

  selectuserbyaccountid (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT first_name, last_name, country, sex, profile_picture FROM account WHERE account_id = ?`,
        [
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


  insertuser (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO account 
        (account_id, first_name, last_name, username, password, email, account_type, phone, address, country, sex)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.account_id,
          data.fname,
          data.lname,
          data.username,
          data.password,
          data.email,
          data.type,
          data.phone,
          data.address,
          data.country,
          data.sex
        ],
        async (error, results, fields) => {
          if (error) {
            if(error.code == 'ER_DUP_ENTRY'){
              try{
                var dup_count = await this.checkregisterduplicates(data)
                error.code = 'INTERNAL_DUP'
                if(dup_count.usercount != 0){
                  error.customMessage = "username already exists"
                }else if (dup_count.emailcount != 0){
                  error.customMessage = "email already exists"
                }else if (dup_count.phonecount !=0){
                  error.customMessage = "phone number already exists"
                }
              }catch(error) {reject(error)}
            }
            reject(error)
          }else{
            resolve("success")
          }
        }
      );
    })
  }

  checkregisterduplicates (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT 
        SUM(CASE WHEN username = ? THEN 1 ELSE 0 END) AS usercount, 
        SUM(CASE WHEN email = ? THEN 1 ELSE 0 END) AS emailcount,
        SUM(CASE WHEN phone = ? THEN 1 ELSE 0 END) AS phonecount 
        FROM account`,
        [
          data.username,
          data.email,
          data.phone
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

  deleteuseraccount (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `DELETE FROM account WHERE account_id = ?
        `,
        [
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
}