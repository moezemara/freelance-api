export default class Account {
    constructor(pool){
        this.pool = pool
    }

    getuserbyusername (data){
        return new Promise((resolve, reject) =>{
          this.pool.query(
            `select * from account where username = ?`,
            [data.username],
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
}