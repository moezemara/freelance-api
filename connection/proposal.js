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
        WHERE job.client_profile_id = client.profile_id AND job.status = 'Active' AND job.job_id = ?
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

  selectpendingproposals (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT proposal.* FROM proposal, freelancer_profile as freelancer WHERE proposal.freelancer_profile_id = freelancer.profile_id AND
        proposal.status = "Pending" AND freelancer.account_id = ?
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

  selectproposal (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT proposal.* FROM proposal, client_profile WHERE proposal.client_profile_id = client_profile.profile_id
        AND proposal.status = 'Pending' AND client_profile.account_id = ? AND proposal.proposal_id = ?
        `,
        [
          data.account_id,
          data.proposal_id
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

  updateproposalstatus(data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE proposal SET status = ? WHERE proposal_id = ?
        `,
        [
          data.status,
          data.proposal_id
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

  selectjobproposals (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT proposal.* FROM proposal, job WHERE proposal.job_id = job.job_id
        AND proposal.status = ? AND job.job_id = ? AND job.client_profile_id IN 
        (SELECT profile_id FROM client_profile WHERE account_id = ?)
        `,
        [
          data.status,
          data.job_id,
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

  deleteproposal (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE proposal SET proposal.status = 'Archived' WHERE proposal.status = 'Pending' AND proposal.proposal_id = ? AND
        (SELECT SUM(CASE 
                        WHEN proposal.freelancer_profile_id IN 
                            (SELECT freelancer_profile.profile_id FROM freelancer_profile WHERE freelancer_profile.account_id = ?)
                        THEN 1
                        WHEN proposal.client_profile_id IN 
                            (SELECT client_profile.profile_id FROM client_profile WHERE client_profile.account_id = ?)
                        THEN 1
                        ELSE 0
                    END
                   )) > 0
        `,
        [
          data.proposal_id,
          data.account_id,
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


