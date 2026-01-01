import React from "react";
import { useState } from "react";
import { useApiRequest } from "../../useApiRequest";
import { LoadingAnimation } from "../../LoadAnimation";
import { AppNotification } from "../../AppNotification";

export function Otp({ email, goToNewPassword}){

    const [otp, setOtp] = useState("")
    const {ApiRequest} = useApiRequest();
    let gateway = import.meta.env.VITE_GATEWAY_URL;

    const handleValidateOtp = async () => {

    let res = await ApiRequest("Post", `${gateway}/Users/VerifyOTP?email=${email.toLowerCase()}&otp=${otp}`)
    
    if(res && res.status == 200){
      
      goToNewPassword()
    }
  ;
}

    return(

        <div>

        {/* OTP FIELD + VALIDATE BUTTON */}
     <div className="flex gap-2 mt-4">

      <LoadingAnimation />
          <AppNotification />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={`flex-1 border rounded-lg px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        <button
          type="button"
          onClick={handleValidateOtp}
          className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          Validate
        </button>
      </div> 

      </div>
    )
}