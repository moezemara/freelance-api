import config from '../config/config.js';
import fetch from "node-fetch";

async function request(url){
    try {
        const response = await fetch(url);
        return await response.json();
    }catch(error){
        console.log(error);
    }
}


export async function verify(token, ip) {
    if (token === undefined || token === '' || token === null) {
        return false;
    }
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + config.recaptcha.secretkey + "&response=" + token + "&remoteip=" + ip;
    const body = await request(verificationUrl);
    if (body.success == undefined || body.success == false) {
        return false;
    }
    return true;
}
