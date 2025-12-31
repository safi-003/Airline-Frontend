import React,{ useEffect, useState } from "react"

export function PassengerNameTabs({ infoType, passengers, currentPassenger, setCurrentPassenger }){

    let [empty, setEmpty] = useState("")
    let [value, setValue] = useState("")
 
    useEffect(() => {

        if(infoType == "baggage"){
            setEmpty("No baggage selected")
        }
    }, [])


    // useEffect(() => {

    //     setValue(info)

    // },[info])


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
        {p.extraBaggage ? p.extraBaggage + "kg" : empty}
      </span>

      {/* Selected underline */}
      {currentPassenger === i && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-b-md"></div>
      )}

    </div>
 
  ))}

  </div>

  )
    
}