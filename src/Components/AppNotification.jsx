import { useContext, useEffect } from "react";
import {  UserProviderContext } from "./Contexts/UserProvider";
import React from "react";

export function AppNotification(){

    let {notification, setNotification, isErr} = useContext(UserProviderContext);

    useEffect(() => {

        setTimeout(() => {
            setNotification("")
        }, 10000)
    }, [notification])

    if(!notification) return null

    const bgColor = isErr ? "bg-red-500" : "bg-green-500";
    
    return(
        
          <div className="fixed inset-x-0 top-10 flex justify-center z-70">
          <h2 className= {`${bgColor} text-white px-6 py-3 rounded-lg shadow-md animate-slide-fade-in`}>
         {notification}
         </h2>
         </div>  

    )
}