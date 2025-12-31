import React from "react";
import { useState, createContext, useEffect } from "react";

export const UserInputContext = createContext();

export function UserInputProvider({children}){

    let [userInput, setUserInput] = useState({
        from: "",
        to: "",
        aircraft:"",
        flightId: "",
        fareSummary: "",
        OutboundDate: new Date(Date.now() + (1000*60*60*24)).toISOString().split("T")[0],
        returnDate: "",
        adultcount: 1,
        childcount: 0,
        infantcount: 0,
        totalCount: 1,
        ClassName: "",
        TierName: "",
        passengers: {
            adults: [],
            childs: [],
            infants:[]
        },
        mobileNo: "",
        email: "",
        loggedIn: false
    })

    let [userProfile, setUserProfile] = useState({
        email: "",
        fullName: ""
    })

     useEffect(() => {
     console.log("🧠 UserInputProvider mounted");
    }, []);
    

    return(

        <UserInputContext.Provider value={{userInput, setUserInput, userProfile, setUserProfile}}>
            {children}
        </UserInputContext.Provider>
    )
}