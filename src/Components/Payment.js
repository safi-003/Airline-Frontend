   export const createOrder = () => {

        return new Promise((resolve) => {

            let script = document.createElement('script')

            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)

            document.body.appendChild(script)
        })
    };

//    let options = {
        
//         "orderId": "order_xxx",
//         "amount": 10000,
//         "currency": "INR",
//         "key": "rzp_test_RsuNG5yyyY0EVG",
  
//     }
   
    export const openCheckout = (options) => {

        let razorpay = new window.Razorpay(options).open()
    }

    
