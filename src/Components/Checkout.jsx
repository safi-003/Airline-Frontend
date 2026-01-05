import React, { useEffect, useState } from "react";
import {createOrder, openCheckout} from "./Payment"
import { useApiRequest } from "./useApiRequest";
import { AppNotification } from "./AppNotification";
import { LoadingAnimation } from "./LoadAnimation";
import { useNavigate } from "react-router-dom";
import { PaymentProcessing } from "./PaymentProcessing";

export function Checkout(){

    let {ApiRequest} = useApiRequest();
    let gateway = import.meta.env.VITE_GATEWAY_URL;
    let nav = useNavigate();
    
    const goToProcessing = (orderId) => {
        console.log("Navigating to PaymentProcessing");
        console.log(orderId)

        nav("/user/PaymentProcessing", {
          state: { orderId: orderId }
        });
      };

    useEffect(() => {

        (async () => {

            console.log("In the checkout comp");

            if(await createOrder()){

                console.log("order created")

                let res = await ApiRequest("post", `${gateway}/flights/verifyFareDetails?amount=1000`);

                console.log(res)    
                openCheckout(res,  goToProcessing)
            
       
        }})();

        console.log(gateway)
        
    }, [])

    


    return(
        <div>
            <AppNotification />
            <LoadingAnimation />
        </div>
    )

    
}