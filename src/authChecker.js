import * as response from './response.js'

export function basic(req, res, next) {
    if(!req.session.account_id){
        return response.fail(res, 'session expired')
    }
    next()
}

export function client(req, res, next) {
    if (req.session.account_type != "C") {
        return response.fail(res, "only clients allowed")
    }
    next()
}

export function freelancer(req, res, next) {
    if (req.session.account_type != "F") {
        return response.fail(res, "only freelancers allowed")
    }
    next()
}

