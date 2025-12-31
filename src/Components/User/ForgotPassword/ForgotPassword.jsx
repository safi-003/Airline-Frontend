import React, { useState } from "react";
import { Email } from "./Email";
import { NewPassword } from "./NewPassword";
import { Otp } from "./Otp";

export function ForgotPassoword(){

    let [CurrentComp, setCurrentComp] = useState((() => Email))
    const [email, setEmail] = useState("");

    return(

        <div>

            <CurrentComp 
            goToOtp={() => {setCurrentComp(() => Otp)}}
            goToNewPassword={() => {setCurrentComp(() => NewPassword)}}
            email={email}
            setEmail={setEmail}
            />

        </div>


    )
    
}