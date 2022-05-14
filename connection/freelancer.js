export default class Freelancer {
  constructor(pool){
      this.pool = pool
  }

  selectuserprofiles (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT profile_id, title FROM freelancer_profile WHERE account_id = ?`,
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

  selectuserprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT profile_id, title, skills, pay_rate, rating, description, account_id FROM freelancer_profile WHERE account_id = ? AND profile_id = ?`,
        [
          data.account_id,
          data.profile_id
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

  insertuserprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO freelancer_profile (profile_id, title, skills, pay_rate, description, account_id)
        VALUES(?,?,?,?,?,?)
        `,
        [
          data.profile_id,
          data.title,
          JSON.stringify(data.skills),
          data.pay_rate,
          data.description,
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

  updateuserprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE freelancer_profile SET title = ?, skills = ?, pay_rate = ?, description = ?
        WHERE account_id = ? AND profile_id = ?
        `,
        [
          data.title,
          JSON.stringify(data.skills),
          data.pay_rate,
          data.description,
          data.account_id,
          data.profile_id
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