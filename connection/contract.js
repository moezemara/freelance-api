export default class Contract {
  constructor(pool){
      this.pool = pool
  }


  selectcontracts_viewer (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT job.id, job.title, proposal.expected_date FROM contract, proposal, job 
        WHERE contract.proposal_id = proposal.proposal_id AND proposal.job_id = job.job_id 
        AND contract.status = ? AND (contract.client_profile_id = ? OR contract.freelancer_profile_id = ?)`,
        [
          data.status,
          data.profile_id,
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

