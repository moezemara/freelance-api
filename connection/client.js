export default class Client {
  constructor(pool){
      this.pool = pool
  }

  selectprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT profile_id, total_spent, rating FROM client_profile WHERE account_id = ?`,
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

  insertprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO client_profile (profile_id, account_id)
        VALUES(?,?)
        `,
        [
          data.profile_id,
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