import * as response from '../../src/response.js'
import * as paypal from "./src/paypal-api.js";


export async function createorder(req, res) {
    const database = req.app.get('database');
    
    try {
        const order = await paypal.createOrder(req.body.amount);

        await database.payment.insertorder({
            account_id: req.session.account_id,
            order_id: order.id,
            status: order.status,
            amount: req.body.amount
        })

        return response.success(res, order);
    } catch (err) {
        return response.system(res, err)
    }
}

export async function capturepayment(req, res) {
    const database = req.app.get('database');
    const { orderID } = req.params;
    
    try {

        const order = await database.payment.selectorder({
            order_id: orderID, account_id: req.session.account_id
        });

        if(!order){
            return response.fail(res, "order not found");
        }
        //console.log(order);
        if(order.status === "COMPLETED"){
            return response.success(res, "order already completed");
        }

        if(order.status !== "CREATED"){
            return response.fail(res, "order status is not valid");
        }
        
        const captureData = await paypal.capturePayment(orderID);

        if(captureData.error){
            if(captureData.details[0].issue === "ORDER_NOT_APPROVED"){
                return response.fail(res, "order not completed");
            }

            await database.payment.updateorder({
                status: captureData.details[0].issue,
                order_id: orderID,
                account_id: req.session.account_id
            })
            return response.fail(res, "payment failed");
        }

        console.log(captureData);
        if(captureData.status === "AlreadyCaptured"){
            await database.payment.updateorder({
                status: "COMPLETED",
                order_id: orderID,
                account_id: req.session.account_id
            })
            return response.fail(res, "payment already captured");
        }

        if(captureData.status === "COMPLETED"){
            const transaction = captureData.purchase_units[0].payments.captures[0];
            await database.payment.updateorder({
                status: "COMPLETED",
                order_id: orderID,
                account_id: req.session.account_id
            })

            await database.payment.inserttransaction({
                account_id: req.session.account_id,
                order_id: order.id,
                transaction_id: transaction.id,
                status: transaction.status,
                amount: transaction.amount.value,
                currency_code: transaction.amount.currency_code
            })

            const account = await database.account.selectuserbyaccountid({
                account_id: req.session.account_id
            })
    
            await database.account.updateaccountdata({
                attribute: "balance", 
                data: parseFloat(account.balance) + parseFloat(transaction.amount.value),
                account_id: req.session.account_id
            })

        }else{
            await database.payment.updateorder({
                status: captureData.status,
                order_id: orderID,
                account_id: req.session.account_id
            })
            return response.fail(res, "payment failed");
        }
        
        return response.success(res, "payment completed");
    } catch (err) {
        return response.success(res, err)
    }
}