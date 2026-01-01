import React, { useEffect } from "react";
import {createOrder, openCheckout} from "./Payment"
import { useApiRequest } from "./useApiRequest";
import { AppNotification } from "./AppNotification";
import { LoadingAnimation } from "./LoadAnimation";

export function Checkout(){

    let {ApiRequest} = useApiRequest();
    let gateway = import.meta.env.VITE_GATEWAY_URL;
    
    useEffect(() => {

        (async () => {

            console.log("In the checkout comp");

            if(await createOrder()){

                console.log("order created")

                let res = await ApiRequest("post", `${gateway}/flights/verifyFareDetails?amount=1000`);

                console.log(res)    
                openCheckout(res)
            }       
            
       
        })();

        console.log(gateway)
        
    }, [])

    return(
        <div>
            <AppNotification />
            <LoadingAnimation />
        </div>
    )

    
}