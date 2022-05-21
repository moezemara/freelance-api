export default class Job {
  constructor(pool){
      this.pool = pool
  }

  insertjob (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `INSERT INTO job (job_id, title, category, experience_level, skills, description, expected_price, estimated_time, client_profile_id)
        VALUES(?,?,?,?,?,?,?,?,?)
        `,
        [
          data.job_id,
          data.title,
          data.category,
          data.experience,
          JSON.stringify(data.skills),
          data.description,
          data.price,
          data.time,
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

  selectclientjobs (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT job.* FROM job, client_profile as client WHERE client.profile_id = job.client_profile_id AND client.account_id = ? AND job.status = ?`,
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

  selectjobswithskill (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT * FROM job WHERE ? MEMBER OF(skills) AND status = 'Active'`,
        [
          data.skill
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

  
  selectjob (data){
    return new Promise((resolve, reject) =>{
      this.pool.query(
        `SELECT * FROM job WHERE job_id = ?`,
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