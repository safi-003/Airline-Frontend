import React, { useContext } from "react";
import { UserProviderContext } from "./Contexts/UserProvider";
import Airplane from "./Airplane.json"
import Lottie from "lottie-react"


export function LoadingAnimation(){

    let {loading} = useContext(UserProviderContext)
    
    return(

        <>
        
        {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[60]">
        <div className="w-40 h-40">
          <Lottie loop={true} animationData={Airplane} />
        </div>
        </div>
)}

        </>
)
}