export default class Freelancer {
  constructor(pool){
      this.pool = pool
  }

  selectuserprofiles (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT profile_id, title FROM freelancer_profile WHERE account_id = ? AND status = 'A'`,
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
        `SELECT account_id, profile_id, title, skills, pay_rate, rating, description FROM freelancer_profile WHERE profile_id = ? AND status = 'A'`,
        [
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

  selectactiveprofileid (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT active_profile_id AS profile_id FROM account WHERE account_id = ?`,
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
        WHERE account_id = ? AND profile_id = ? AND status = 'A'
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

  activateprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE account SET active_profile_id = ? WHERE account_id = ? 
        AND ? IN (SELECT profile_id FROM freelancer_profile WHERE account_id = ?)
        `,
        [
          data.profile_id,
          data.account_id,
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

  deleteprofile (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE freelancer_profile SET status = 'D' WHERE profile_id = ? AND account_id = ? AND status = 'A' AND ? != 
        (SELECT active_profile_id FROM account WHERE account_id = ?)`,
        [
          data.profile_id,
          data.account_id,
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

  selectusercontracts (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT contract_id FROM contract,  WHERE freelancer_profile_id IN
        (SELECT profile_id from freelancer_profile WHERE account_id = ?)
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

  selectusercontract (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT proposal_id, status, final_price, milestone_paid, client_profile_id freelancer_profile_id FROM contract
        WHERE account_id = ? AND contract_id = ?`,
        [
          data.account_id,
          data.contract_id
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
}


