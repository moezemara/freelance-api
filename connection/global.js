export default class Global {
    constructor(pool){
        this.pool = pool
    }
  
    selectstats (){
      return new Promise((resolve, reject) =>{
        this.pool.query(
          `CALL stats
          `,
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