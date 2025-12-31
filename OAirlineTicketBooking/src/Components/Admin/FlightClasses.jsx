import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useContext } from "react";
import { AdminProviderContext } from "../Contexts/AdminProvider";
import { UserProviderContext } from "../Contexts/UserProvider";
import { EmptyInput } from "../InputValidation/EmptyInput";
import { useApiRequest } from "../useApiRequest";

export const FlightClasses = forwardRef((prop, ref) => {

  let {flight, flightClass, setFlightClass, setFlightTierTemplate } 
    = useContext(AdminProviderContext)

    let {setNotification, setIsErr } = useContext(UserProviderContext)
    let {ApiRequest} = useApiRequest();

    let [selectedClasses, setSelectedClasses] = useState(["economy", "business", "first"]);
    

  let handleChange = (e, index) => {
  let { name, value } = e.target;

  console.log(name)
  console.log(value)

  setFlightClass(prev => prev.map((obj, i) => 
      i == index ? {...obj, [name]: value}
                 : obj))

};

    let inputRefs = useRef([]);

    let validate = async function(){

      console.log("Validating the flight class data");

      console.log(flightClass)
      console.log(inputRefs)

      for (let index = 0; index < flightClass.length; index++) {

      const flight = flightClass[index];
      const refs = inputRefs.current[index];

      if(flight.priceMultiplier == "" || flight.priceMultiplier == undefined){
        refs.style.border = "2px solid red";
        refs.style.backgroundColor = "#ffe6e6";
      }
    }
    
      try{

        for(let v of selectedClasses){
           
          console.log(v);
           let tier = await ApiRequest("post", `http://localhost:8082/flights/getTiers?className=${v.toUpperCase()}`)
           setFlightTierTemplate(prev => [...prev, {[v]: tier}])
        }

      }catch(e){
        setIsErr(true)
        setNotification("Some error occured in fetching the tiers! Please try again");
        console.log(e)
      }
       
      return true

    }

  useImperativeHandle(ref, () => ({

    validate

  }))


  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

    {flightClass && flightClass.map((clsObj, index) => (
      
      <div
        key={clsObj.className}
        className="p-5 rounded-xl shadow-md border bg-white hover:shadow-lg transition duration-200 flex flex-col"
      >

        {/* Class Name */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
          {clsObj.className}
        </h2>

        {/* Seat Count */}
        <p className="text-sm text-gray-500 mb-4">
          Seats Available: <span className="font-medium text-gray-700">{clsObj.seatCount}</span>
        </p>

        {/* Price Multiplier Label */}
        <label className="text-sm text-gray-600 font-medium mb-1">
          Price Multiplier
        </label>

        {/* Input */}
        <input
        name="priceMultiplier"
          ref={(el) => {
            if (!inputRefs.current) inputRefs.current = [];
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleChange(e, index)}
          placeholder="Enter multiplier (ex: 1.2)"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
        />
      </div>

    ))}

  </div>
);

})



 