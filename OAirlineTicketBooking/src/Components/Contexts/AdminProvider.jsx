import React, { createContext, useState } from "react";

export const AdminProviderContext = createContext();

export function AdminProvider({children}){

        // Flight Model
        const [flight, setFlight] = useState({
            
            aircraftModel: "",
            departure: "",
            arrival: "",
            departureTime: "",
            arrivalTime: "",
            basePrice: "",
            totalSeats: "",
            vacant:"",
            airlines: "",
            stops: ""
        })
    
    
        // Flight Class (Economy, Bussiness etc)
        const [flightClass, setFlightClass] = useState([]);
      
        
        // Flight Tiers Template (Saver, Flex, FlexPlus)
        const [flightTierTemplate, setFlightTierTemplate] = useState([])

        const [flightTierData, setFlightTierData] = useState([]);

        const [fleetTemplate, setFleetTemplate] = useState(
        //     {"B777-300ER": {
        //     "capacity": 354,
        //     "first": { "seats": 8, seatsPerRow: 3,  "layout": [1, 1, 1] },
        //     "business": { "seats": 42, seatsPerRow: 4, "layout": [1, 2, 1] },
        //     "economy": { "seats": 304, seatsPerRow: 10, "layout": [3, 4, 3] }
        // },

        // "B777-200LR": {
        //     "capacity": 317,
        //     "first": { "seats": 8, "layout": [1, 1, 1] },
        //     "business": { "seats": 42, "layout": [1, 2, 1] },
        //     "economy": { "seats": 267, "layout": [3, 3, 3] }
        // }}
);

    return(

        <AdminProviderContext.Provider value={{flight, setFlight, flightClass, setFlightClass, flightTierTemplate
            ,setFlightTierTemplate, flightTierData, setFlightTierData, fleetTemplate, setFleetTemplate
        }}>

            {children}
        </AdminProviderContext.Provider>

    )
}