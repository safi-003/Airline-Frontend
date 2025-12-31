import React, { useContext, useEffect, useState } from "react";
import { UserInputContext } from "../Contexts/UserInputProvider";
import { FormatPrice } from "../HelperFunctions/formatPrice";

export function PassengersSeats({ updateSeat, updateSeatIds, passengers, setPassengers, currentPassenger, setCurrentPassenger, setPassengerInitials }){

    let {userInput} = useContext(UserInputContext);
    // let [currentPassenger, setCurrentPassenger] = useState(0)
    // let [passengers, setPassengers] = useState([])
    let [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    // Loading all the passengers in a USESTATE VARIABLE
    useEffect(() => {

        if(passengers.length > 0) return;

        // We are loading passengers from the userInput to make it sync with the currentPassenger index
        setPassengers([
            
            // Adult
            ...userInput.passengers.adults.map((adult, i) => ({Type: "adults", idx : i, Name: `${adult.FirstName} ${adult.LastName}`, SeatId: "", Price: "", Features: ""})),

            // Child
            ...(userInput.childcount > 0 ? userInput.passengers.childs.map((c,i) => ({Type: "childs", idx: i, Name: `${c.FirstName} ${c.LastName}`, SeatId: "", Price: "", Features: ""})) : []),
        
            // Infant
            ...(userInput.infantcount > 0 ? userInput.passengers.infants.map((i, idx) => ({Type: "infants", idx: idx, Name: `${i.FirstName} ${i.LastName}`, SeatId: "", Price: "", Features: ""})) : [])
        ])

    }, [])     
        
    useEffect(() => {

        console.log(updateSeat)
       
        // This only opens up a confirmation box which when confirmed maps the seat to the current passenger      
        setIsConfirmModalVisible(true)
  
    },[updateSeat])

    let handleConfirm = (seatDetails) => {

        setIsConfirmModalVisible(false)
        
        // Update the SeatId in the passengers
        setPassengers(prev => {
            
            let updated = [...prev];

            updated[currentPassenger] = {
                ...updated[currentPassenger],
                SeatId: seatDetails.SeatId,
                Price: seatDetails.Price,
                Features: seatDetails.Features.map(f => f)

            }
            
            return updated;
        })

        // Add the seatID for the current passenger in the SeatId useState array
        updateSeatIds(prev => {
            let updated = [...prev]

            updated[currentPassenger] = seatDetails.SeatId

            return updated;
        })

        console.log(currentPassenger)
        console.log(passengers.length-1)

      // Get the Full Name of the passengers and then the initials
      let fullName = passengers[currentPassenger].Name.split(" ")
      let temp = fullName.map((name) => name.at(0))

      // Initials state array is same as SeatIds, on the specific index(which is the current passenger)
      // there is the initials(in Initals array)

      // Set the Current Passenger's Initials in the PassengerInitials useState array
      setPassengerInitials(prev => {
        let updated = [...prev]

        updated[currentPassenger] = temp
        
        return updated;
      })

      // Moving the current passenger to the next one 
      setCurrentPassenger(prev => Math.min(prev+1, passengers.length-1))

    }
    
    
    console.log(passengers)

    return (

  <div className="ml-72 mb-6 mt-6 flex flex-row gap-2">
  
  {passengers.map((p, i) => (
    <div
      key={i}
      onClick={() => {setCurrentPassenger(i)}}
      className={`
        relative px-3 py-2 rounded-md text-sm
        flex flex-col items-center bg-gray-50 cursor-pointer
        ${currentPassenger === i ? "border-blue-700" : ""}
      `}
      style={{ minWidth: "90px" }}  // optionally limit width so boxes stay small
    >
      {/* Name */}
      <span className="font-semibold text-gray-800 text-sm">{p.Name}</span>

      {/* Seat */}
      <span className="text-gray-500 text-xs">
        {p.SeatId ? p.SeatId : "No seat"}
      </span>

      {/* Selected underline */}
      {currentPassenger === i && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-b-md"></div>
      )}

    </div>
  ))}

  {/* 1. CONDITIONAL RENDERING */}
    {(isConfirmModalVisible && updateSeat) && (
        <div className="fixed inset-0 bg-opacity-75 z-50 flex items-center justify-center">
            
            {/* Modal Backdrop/Overlay - Click to close (optional) */}
            <div 
                className="absolute inset-0" 
                onClick={() => setIsConfirmModalVisible(false)}
            ></div>

            {/* 2. DIALOG CONTENT CONTAINER */}
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative transform transition-all duration-300 scale-100">

                {/* Close Button (X) */}
                <button
                    onClick={() => setIsConfirmModalVisible(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl font-bold"
                >
                </button>

                {/* 3. HEADING & SEPARATOR */}
                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-1">
                    {passengers[currentPassenger].Name}
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Seat Selection Summary
                </p>
                <hr className="mb-6"/>


                {/* 4. SEAT DETAILS SECTION */}
                <div className="space-y-4 text-sm text-gray-700">
                    
                    {/* Seat Type */}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Seat Type:</span>
                        <span className="text-right">{updateSeat.SeatType}</span>
                    </div>

                    {/* Features */}
                    {updateSeat.Features && (
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Features:</span>
                            <span className="text-right text-green-600 font-medium">
                                {/* Map over features and join them with "|" as requested */}
                                {updateSeat.Features.map((f, index) => (

                                    // We do the below check that if index and length of the map are same, then don't put |
                                    <span key={index}>{f}{index < updateSeat.Features.length - 1 ? " | " : ""}</span>
                                ))}
                            </span>
                        </div>
                    )}
                    
                    {/* Seat Number */}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Seat Number:</span>
                        <span className="text-right text-blue-600 font-bold">{updateSeat.SeatId}</span>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-lg font-bold">Price:</span>
                        <span className="text-xl font-bold text-yellow-600">
                            ₹{FormatPrice(updateSeat.Price)}
                        </span>
                    </div>

                </div>
                
                <hr className="my-6"/>

                {/* 5. CONFIRM SEAT BUTTON */}
                <button
                    onClick={() => handleConfirm(updateSeat)}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition duration-200 shadow-md"
                >
                    Confirm Seat
                </button>
                
            </div>
        </div>
    )}

   

 </div>


);

}