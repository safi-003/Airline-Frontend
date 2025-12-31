import React, { useContext, useEffect } from "react";
import { AppNotification } from "../AppNotification";
import { AdminProviderContext } from "../Contexts/AdminProvider";
import { UserProviderContext } from "../Contexts/UserProvider";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { CalculatePrice } from "../HelperFunctions/calculatePrice";

export function FlightTier(){

    let {flightTierTemplate, flightClass, flight, flightTierData, setFlightTierData} = useContext(AdminProviderContext)

    // let {setNotification, setIsErr} = useContext(UserProviderContext)
    
    let addTiers = (ClassName, TierName, tierPrice) => {
    
      console.log(ClassName)
      console.log(TierName)
      console.log(tierPrice)
      
      setFlightTierData(prev => [
        ...prev, {
            tierName: TierName,
            price: tierPrice,
            className: ClassName
        } ])
      
      }

useEffect(() => {
console.log(flightTierData)
}, [flightTierData])

// Adding the template when comp renders 
useEffect(() => {
  let initialTiers = [];

  flightTierTemplate.forEach(classObj => {
    Object.entries(classObj).forEach(([cn, cd]) => {
      Object.entries(cd).forEach(([TierObj, TierData], index) => {
        if (index === 0) {
          const price = CalculatePrice(flight, TierObj, cn, flightClass);
          initialTiers.push({
            tierName: TierObj,
            price: price,
            className: cn
          });
        }
      });
    });
  });

  setFlightTierData(initialTiers);
}, []);


    return(

    <div className="flex flex-wrap gap-6 justify-center p-6 bg-gray-50 min-h-screen">
      {flightTierTemplate.map((classObj, i) => (
        <div
          key={i}
          className="bg-white shadow-lg rounded-2xl p-6 w-[350px] border border-gray-200 hover:shadow-xl transition-all duration-300"
        >
          {/* Class Objects {Economy: ...}, {Business: ....}, {First: ...} */} 
          <h3 className="text-2xl font-bold text-indigo-600 mb-4 text-center uppercase tracking-wide">
            {Object.keys(classObj)}
          </h3>

          {/* Loop through Class Objects */}
          {Object.entries(classObj).map(([cn, cd]) => (
            
            <div
              key={cn}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 mb-4 shadow-sm"
            >
              {/* Tier name + checkbox */}
              <div className="flex justify-between items-center mb-2">
                
                <h4 className="font-semibold text-lg text-gray-800">
                  {cn}
                </h4>
                
              </div>

              {/* Tier list {Value: {}, Basic: {}, } */}
              <ul className="space-y-2">    
                {Object.entries(cd).map(([TierObj, TierData], index) => {
                  const price = CalculatePrice(flight, TierObj, cn, flightClass)
                  console.log(price)

                  return (
                  
                  <li key={TierObj} className="text-gray-700">

                    {index !== 0 && (<input type="checkbox" onClick={() => {addTiers(cn, TierObj, price)}} 
                    className="accent-indigo-500" />)}

                    <span className="font-medium">{TierObj}</span>
                    <p className="text-sm text-gray-600">{price}</p>
                    
                    {/* Now we have Feature with array of values Baggage: [ true, "1×7Kg Cabin Baggage Only" ] */}
                    {Object.values(TierData).map((value, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 ml-4 text-sm text-gray-600">
                        
                        {value != null ? (

                        value.map((feature) => (

                          <div>
                          
                          {typeof feature === "boolean" ? (
                          feature === true ? (
                            <FaCheck className="text-green-600"/>
                          ) : (
                            <FaTimes className="text-red-500"/>
                          )
                        ) : (
                          <span>{value}</span>
                        )}

                            </div> 

                        ))) : null}
                        
                      </div>
                    ))}
                  </li>
)})}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}



    

    
