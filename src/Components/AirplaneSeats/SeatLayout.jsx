import React, { useState, useContext } from "react";
import { PassengersSeats } from "./PassengersSeats";
import { SeatMap } from "./SeatMap";
import { UserInputContext } from "../Contexts/UserInputProvider";
import { useNavigate } from "react-router-dom";

export function SeatLayout(){
    
    let [seatInfo, setSeatInfo] = useState()
    let [currentPassenger, setCurrentPassenger] = useState(0)
    let [passengers, setPassengers] = useState([])
    let [SeatIds, setSeatIds] = useState([]);
    let [PassengerInitials, setPassengerInitials] = useState([])

    let {setUserInput} = useContext(UserInputContext);
    let nav = useNavigate();

    let confirm = () => {

        // console.log("Confirm clicked")
        // console.log(SeatIds)
        // console.log(passengers)
        // console.log(currentPassenger)

        setUserInput(prev => {
            let updated = {...prev}
            
            updated.passengers = {...prev.passengers}

            passengers.forEach((p) => {

                updated.passengers[p.Type] = [...updated.passengers[p.Type]]
                updated.passengers[p.Type][p.idx] = {...updated.passengers[p.Type][p.idx], 
                    SeatId: p.SeatId,
                    Price: p.Price,
                    Features: p.Features.map(f => f)
                }
            })

            return updated;
            
        })

        nav("/user/Bags")
    }

    return(
        <>
        <PassengersSeats updateSeat={seatInfo} updateSeatIds={setSeatIds} passengers={passengers} setPassengers={setPassengers} currentPassenger={currentPassenger} setCurrentPassenger={setCurrentPassenger} setPassengerInitials={setPassengerInitials}/>
        <SeatMap selectSeat={setSeatInfo} SeatIds={SeatIds} PassengerInitials={PassengerInitials}/>

    <button
    disabled={passengers.length != SeatIds.length}  
    onClick={confirm}
    className={`mt-6 mr-6 rounded-2xl px-6 py-3 font-semibold shadow-md
        ${passengers.length != SeatIds.length
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"}
    `}
    >
    Update Seats
    </button>
        
        </>
    )

}