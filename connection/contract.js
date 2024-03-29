export default class Contract {
  constructor(pool){
      this.pool = pool
  }

  selectcontract (data){
    return new Promise((resolve, reject) =>{
      if(data.account_type == "F"){
        var query = 
        `SELECT contract.* FROM contract, freelancer_profile AS freelancer 
        WHERE contract.freelancer_profile_id = freelancer.profile_id 
        AND freelancer.account_id = ? AND contract.proposal_id = ?`
      }else if (data.account_type == "C"){
        var query = 
        `SELECT contract.* FROM contract, client_profile AS client 
        WHERE contract.client_profile_id = client.profile_id 
        AND client.account_id = ? AND contract.proposal_id = ?
        `
      }

      this.pool.query(
        query,
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

  selectcontracts (data){
    return new Promise((resolve, reject) =>{
      if(data.account_type == "F"){
        var query = 
        `SELECT contract.* FROM contract, freelancer_profile AS freelancer 
        WHERE contract.freelancer_profile_id = freelancer.profile_id 
        AND freelancer.account_id = ? AND contract.status = ?`
      }else if (data.account_type == "C"){
        var query = 
        `SELECT contract.* FROM contract, client_profile AS client 
        WHERE contract.client_profile_id = client.profile_id 
        AND client.account_id = ? AND contract.status = ?
        `
      }

      this.pool.query(
        query,
        [
          data.account_id,
          data.status
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

  insertcontract (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO contract (proposal_id, final_price, client_profile_id, freelancer_profile_id)
        VALUES(?,?,?,?)`,
        [
          data.proposal_id,
          data.final_price,
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

  updatepeerstatus (data){
    return new Promise((resolve, reject) =>{

      if(data.account_type == "F"){
        var query = 
        `UPDATE contract SET freelancer_acceptance = ?, status = ? WHERE contract.proposal_id = ?`
      }else if (data.account_type == "C"){
        var query = 
        `
        UPDATE contract SET client_acceptance = ?, status = ?  WHERE contract.proposal_id = ?
        `
      }

      this.pool.query(
        query,
        [
          data.input,
          data.status,
          data.proposal_id
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

  updatecontractfinalprice (data){
    return new Promise((resolve, reject) =>{

      this.pool.query(
        `UPDATE contract SET final_price = (SELECT SUM(amount) FROM milestone WHERE proposal_id = ?) WHERE proposal_id = ?`,
        [
          data.proposal_id,
          data.proposal_id
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

  cancelcontract (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE contract SET status = 'Canceled' WHERE status = 'Interview' AND proposal_id = ?`,
        [
          data.proposal_id
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

  selectinternalmilestones (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT * FROM milestone WHERE proposal_id = ?`,
        [
          data.proposal_id
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

  selectmilestone (data){
    return new Promise((resolve, reject) =>{
      if(data.account_type == "F"){
        var query = 
        `SELECT milestone.* FROM milestone, contract, freelancer_profile AS freelancer WHERE 
        milestone.proposal_id = contract.proposal_id AND contract.freelancer_profile_id = freelancer.profile_id
        AND milestone_id = ? AND freelancer.account_id = ? and contract.proposal_id = ? AND milestone.status = 'Pending'`
      }else if (data.account_type == "C"){
        var query = 
        `SELECT * FROM milestone, contract, client_profile AS client WHERE 
        milestone.proposal_id = contract.proposal_id AND contract.client_profile_id = client.profile_id
        AND milestone_id = ? AND client.account_id = ? and contract.proposal_id = ? AND milestone.status = 'Pending'
        `
      }

      this.pool.query(
        query,
        [
          data.milestone_id,
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

  selectmilestones (data){
    return new Promise((resolve, reject) =>{
      if(data.account_type == "F"){
        var query = 
        `SELECT milestone.* FROM milestone, contract, freelancer_profile AS freelancer WHERE 
        milestone.proposal_id = contract.proposal_id AND contract.freelancer_profile_id = freelancer.profile_id
        AND freelancer.account_id = ? AND contract.proposal_id = ? AND milestone.status = 'Pending'` 
      }else if (data.account_type == "C"){
        var query = 
        `SELECT * FROM milestone, contract, client_profile AS client WHERE 
        milestone.proposal_id = contract.proposal_id AND contract.client_profile_id = client.profile_id
        AND client.account_id = ? AND contract.proposal_id = ? AND milestone.status = 'Pending'
        `
      }

      this.pool.query(
        query,
        [
          data.account_id,
          data.proposal_id
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

  insertmilestone (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO milestone (milestone_id, proposal_id, amount, description, date)
        VALUES(?,?,?,?,?)`,
        [
          data.milestone_id,
          data.proposal_id,
          data.amount,
          data.description,
          data.date
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

  deletemilestone (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE milestone SET status = 'Deleted' AND status = 'Pending' WHERE milestone_id = ? AND proposal_id = ?`,
        [
          data.milestone_id,
          data.proposal_id
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

  endmilestone (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE milestone SET status = 'Finished' WHERE status = 'Pending' AND milestone_id = ? AND proposal_id = ?`,
        [
          data.milestone_id,
          data.proposal_id
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

  endcontract (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `UPDATE contract SET status = 'Archived' WHERE status = 'Active' AND proposal_id = ?`,
        [
          data.proposal_id
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

  selectcontractaccountnames (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT 
        (SELECT CONCAT(account.first_name, ' ', account.last_name) FROM contract, freelancer_profile AS profile, account WHERE contract.freelancer_profile_id = profile.profile_id AND profile.account_id = account.account_id AND contract.proposal_id = ?) 
        AS freelancer_name, 
        (SELECT CONCAT(account.first_name, ' ', account.last_name) FROM contract, client_profile AS profile, account WHERE contract.client_profile_id = profile.profile_id AND profile.account_id = account.account_id AND contract.proposal_id = ?)
        AS client_name
        `,
        [
          data.proposal_id,
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
}


