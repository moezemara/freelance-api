export default class Proposal {
  constructor(pool){
      this.pool = pool
  }


  insertproposal (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO proposal 
        (proposal_id, cover_letter, price, expected_date, 
          job_id, client_profile_id, freelancer_profile_id)
        VALUES(?,?,?,?,?,?,?)
        `,
        [
          data.proposal_id,
          data.cover_letter,
          data.price,
          data.expected_date,
          data.job_id,
          data.client_profile_id,
          data.freelancer_profile_id
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

  selectclientprofileid (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT client.profile_id FROM job, client_profile AS client 
        WHERE job.client_profile_id = client.profile_id AND job.status = 'active' AND job.job_id = ?
        `,
        [
          data.job_id
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


