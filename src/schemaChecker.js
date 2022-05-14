import * as response from './response.js'

export function checkbody(schema){
    return (req, res, next) => {
        const validate = schema.validate(req.body)
        if (validate.error){
          return response.fail(res, validate.error.details[0].message)
        }
        next()
    }
}

export function checkparams(schema){
    return (req, res, next) => {
        const validate = schema.validate(req.params)
        if (validate.error){
          return response.fail(res, validate.error.details[0].message)
        }
        next()
    }
}




