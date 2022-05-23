import * as response from '../../../src/response.js'


export function checkstatus(contract){
    const allowed = {
        freelancer: {
            accept: false,
            cancel: false,
            edit: false
        },
        client: {
            accept: false,
            cancel: false,
            edit: false
        },
        status: 'Interview',
        special_status: false
    }

    if(contract.freelancer_acceptance == '1' && contract.client_acceptance == '0'){
        allowed.freelancer.cancel = true;
        allowed.client.accept = true;
        allowed.special_status = 'Pending Client';
    }else if(contract.freelancer_acceptance == '0' && contract.client_acceptance == '1'){
        allowed.freelancer.accept = true;
        allowed.client.cancel = true;
        allowed.special_status = 'Pending Freelancer';
    }else if(contract.freelancer_acceptance == '0' && contract.client_acceptance == '0'){
        allowed.freelancer.accept = true;
        allowed.client.accept = true;
        allowed.freelancer.edit = true;
        allowed.client.edit = true;
        allowed.special_status = 'NAN'
    }else if(contract.freelancer_acceptance == '1' && contract.client_acceptance == '1'){
        allowed.status = 'Active';
        allowed.special_status = 'Active';
    }

    return allowed;
}

export function handlepermissions(res, status, account_type, input){
    if(status.special_status == 'Pending Client'){
        if(account_type == "C" && input == 0){
          return response.fail(res, "you can not cancel")
        }
  
        if(account_type == "F" && input == 1){
          return response.fail(res, "you can not accept")
        }
    }
    else if(status.special_status == 'Pending Freelancer'){
        if(account_type == "C" && input == 1){
          return response.fail(res, "you can not accept")
        }
  
        if(account_type == "F" && input == 0){
          return response.fail(res, "you can not cancel")
        }
    }
    else if(status.special_status == 'NAN'){
        if (input == 0){
          return response.fail(res, "you can not cancel")   
        }
    }
    return false
}