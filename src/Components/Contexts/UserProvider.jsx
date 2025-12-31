import { createContext, useState } from "react";
import React from "react";

export const UserProviderContext = createContext();

export function UserProvider({children}){

    const [Modal, setModal] = useState(false);
    const [message, showMessage] = useState("");
    const [datesObj, setDatesObj] = useState([]);
    const [flightDates, setFlightDates] = useState([]);     // whole set    
    const [availflights, setAvailflights]  = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState("")
    const [isErr, setIsErr] = useState();
    const [currentlyIn, setCurrentlyIn] = useState("");
    let [AvailSeatsInFlight, setAvailSeatsInFlight] = useState([]);


    return(

        <UserProviderContext.Provider value={{

            Modal, setModal,
            message, showMessage,
            datesObj, setDatesObj,
            flightDates, setFlightDates,
            availflights, setAvailflights,
            loading, setLoading,
            notification, setNotification, 
            isErr, setIsErr,
            currentlyIn, setCurrentlyIn,
            AvailSeatsInFlight, setAvailSeatsInFlight

        }}>
            {children}
            </UserProviderContext.Provider>
    )
}