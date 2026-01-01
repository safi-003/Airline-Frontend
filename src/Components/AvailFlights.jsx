import React, { useContext, useEffect, useState } from "react";
import {DateGenerator} from "./DateGenerator"
import { UserProviderContext } from "./Contexts/UserProvider";
import { AdminProviderContext } from "./Contexts/AdminProvider";
import { useApiRequest } from "./useApiRequest";
import { FaTimes, FaCheck } from "react-icons/fa";
import { ProgressBar } from "./ProgressBar";
import { UserInputContext } from "./Contexts/UserInputProvider";
import { useNavigate } from "react-router-dom";
import { FormatPrice } from "./HelperFunctions/formatPrice";
import { pricing } from "./pricing";

export function AvailFlights() {

    let {ApiRequest} = useApiRequest();
    let gateway = import.meta.env.VITE_GATEWAY_URL;
    let {availflights, setCurrentlyIn, setAvailSeatsInFlight} = useContext(UserProviderContext);
    // let {flightTierTemplate} = useContext(AdminProviderContext)
    let {userInput, setUserInput} = useContext(UserInputContext);
    let [tierTemplate, setTierTemplate] = useState({});

    console.log(gateway)
    let TimeDiff = (arrival, dep) => {


      let arr = arrival.split("T")[1]
      let departure = dep.split("T")[1] 

      let hour = arr.split(":")[0] - departure.split(":")[0]
      let mins = arr.split(":")[1] - departure.split(":")[1]
     
        return `${hour} hours ${mins>0 ? `${mins}` : `` }`

    }
    
    useEffect(() => {

      console.log(availflights)

    }, [availflights])
    

    useEffect(() => {

      let fetchTemplate = async () => {

        let classes = ["ECONOMY", "BUSINESS", "FIRST"]
        
        for(let cls of classes){
          
          let data = await ApiRequest("post", `${gateway}/flights/getTiers?className=${cls}`)

          console.log(data)

          setTierTemplate(prev => ({

            ...prev,
            [cls] : data

          }))
        }
      }

      fetchTemplate();
                
    }, [])

  useEffect(() => {
      console.log(tierTemplate)
    },[tierTemplate])

    /* --- Helpers & state (put above the return in your component) --- */

    let [tierBoard, setTierBoard] = useState({flightId: null, className: null});

      useEffect(() => {
    console.log(tierBoard)
  }, [tierBoard])

    // Toggle TierBoard for a flight (id can be index or a stable flight id)
    const toggleTierBoard = (flightId, className) => {

      setTierBoard(prev => {

        console.log(prev.className)
        console.log(className)
        // Already opened so collapse
        if(prev.flightId == flightId && prev.className == className){
          return {flightId: null, className: null}
        }

        // Open the tierboard
        return {flightId, className}

      })
    
    };

    // Safe numeric helpers
    const parseNum = (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };

    // Price formatting
    const formatPrice = (n) => {
     
      return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    };

   let nav = useNavigate();

   let modifyFlight = () => {

   nav("/user/search"); 

   }
 
   let chooseOptions = async (flightListing, className, tierName, tierPrice) => {

    console.log(flightListing)
    console.log(className)
    console.log(tierName)
    console.log(tierPrice)
    console.log(tierPrice.replace(/[^\d.-]/g, ""))

    let seats = await ApiRequest("post", `${gateway}/flights/getAvailSeats?flightId=${flightListing.id}&className=${className}&status=AVAILABLE`)

    let classPrice = Number(pricing(flightListing, className).replace(/[^\d.-]/g, ""))

    setUserInput((prev) => ({
      ...prev,
      flightId: flightListing.id,
      aircraft: flightListing.aircraftModel,
      ClassName: className,
      TierName: tierName,
      baseFare: Number(flightListing.basePrice),
      classFare: Number(classPrice),
      TierFare: Number(classPrice) + Number(tierPrice.replace(/[^\d.-]/g, ""))
    }))

    console.log(seats)
    setAvailSeatsInFlight(seats);
    
   }

   let Confirm = () => {

    setCurrentlyIn("guests")
    nav("/user/PassengerDetails")

   }


return (
  <div className="min-h-screen bg-gradient-to-br from-[#f7f3ef] to-[#ece8e2] pb-20 font-sans">

  {/* /* MODIFY FLIGHT DATA */ }
  <div className="w-full flex justify-center mt-6">
  <div className="flex items-center gap-6 bg-[#0f6b41] text-white px-8 py-3 rounded-full shadow-md">

    {/* FROM → TO */}
    <span className="text-sm font-light tracking-wide">
      {userInput.from.toUpperCase()} → {userInput.to.toUpperCase()}
    </span>

    {/* Divider */}
    <span className="opacity-70">|</span>

    {/* OUTBOUND DATE */}
    <span className="text-sm font-light tracking-wide">
      {new Date(userInput.OutboundDate).toLocaleDateString("en-IN", {weekday: "short", day: "numeric", month: "short"})}
    </span>

    {/* Divider */}
    <span className="opacity-70">|</span>

    {/* PASSENGERS */}
    <span className="text-sm font-light tracking-wide">
      Guests: {userInput.totalCount}
    </span>

    {/* Divider */}
    <span className="opacity-70">|</span>

    {/* MODIFY BUTTON */}
    <button
      className="
        bg-white text-[#0f6b41] font-medium text-sm 
        px-4 py-1.5 rounded-full shadow-sm
        hover:bg-[#d9f5e7] transition" onClick={modifyFlight}
    >
      Modify
    </button>

  </div>
  </div>
  
   <DateGenerator />

    {availflights && availflights.length === 0 ? (
      <h2 className="text-center mt-12 text-gray-700 font-semibold text-xl">
        No flights available
      </h2>
    ) : availflights ? (
      <div className="w-full max-w-[1000px] mx-auto mt-10 space-y-10">

        {availflights.map((e, idx) => {

          const flightId = e.id ?? idx;
          const classes = Array.isArray(e.flightClassList) ? e.flightClassList : [];
          const departTime = (e.departureTime || "").split("T")[1]?.slice(0,5) ?? "";
          const arriveTime = (e.arrivalTime || "").split("T")[1]?.slice(0,5) ?? "";
          const duration = TimeDiff(e.arrivalTime, e.departureTime);
    

          return (
            <div key={flightId} className="relative">

              {/* ------------------- FLIGHT CARD ------------------- */}
              <div className="bg-white rounded-2xl shadow-lg border p-5 transition">

                {/* TOP: SUMMARY + CLASS COLUMNS */}
                <div className="flex">

                  {/* LEFT SUMMARY (55%) */}
                  <div className="w-[55%] pr-6 flex flex-col justify-between">

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-extrabold text-gray-900">{e.airlines}</h3>
                        <span className="text-sm text-gray-500">{e.stops}</span>
                      </div>

                      {/* Times */}
                      <div className="flex items-center gap-6">

                        {/* Departure */}
                        <div className="flex flex-col items-start">
                          <span className="text-2xl font-bold text-gray-900">{departTime}</span>
                          <span className="text-sm text-gray-600 mt-1">{e.departure}</span>
                        </div>

                        {/* Arrow & Duration */}
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full relative">
                            <div className="h-[2px] bg-gray-300 w-full" />
                            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2">
                              <svg className="w-10 h-10 text-[#bfa14a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M2 12h18" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 mt-2">{duration}</span>
                        </div>

                        {/* Arrival */}
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-900">{arriveTime}</span>
                          <span className="text-sm text-gray-600 mt-1">{e.arrival}</span>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* RIGHT: CLASS COLUMNS (45%) */}
                  <div className="w-[45%] flex gap-3">

                    {["economy", "business", "first"].map((fc) => {

                      const cls = classes.find(c => (c.className?.toUpperCase?.() ?? "") === fc.toUpperCase()) || {};
                      let clsName = cls.className;
                      const clstierArr = cls.tiers || [];
                      const vacant = parseNum(cls.vacant || cls.seatCount);
                      // const multiplier = parseNum(cls.priceMultiplier || 1);
                      // const base = parseNum(e.basePrice || e.price || 0);
                      // const priceValue = vacant > 0 ? base * multiplier : null;
                      const priceValue = vacant > 0 ? pricing(e, clsName) : null
                      const isLow = vacant > 0 && vacant < 10;

                      console.log(clsName)
                      console.log(clstierArr)

                      return (
                        <div key={fc} className="flex-1 bg-gray-50 rounded-xl p-3 flex flex-col justify-between">

                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-800">
                              {fc.charAt(0) + fc.slice(1).toLowerCase()}
                            </h4>

                            {vacant === 0 ? (
                              <span className="text-xs text-red-600 font-semibold">Sold Out</span>
                            ) : isLow ? (
                              <span className="text-xs text-red-600 font-semibold">Only {vacant} left</span>
                            ) : (
                              <span className="text-xs text-green-700"></span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="mt-3 text-right">
                            {vacant > 0 ? (
                              <div className="text-2xl font-extrabold text-[#bfa14a]">
                                {formatPrice(priceValue)}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">—</div>
                            )}
                          </div>

                          {/* View Button */}
                          <div className="mt-3 flex items-center justify-center">
                            {vacant != 0 ? (<button
                              onClick={() => toggleTierBoard(flightId, fc)}
                              className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-white border hover:bg-gray-100 transition shadow-sm"
                            >
                              <span>{flightId == tierBoard.flightId && fc === tierBoard.className ? "Collapse" : "View"}</span>
                              <svg className={`w-4 h-4 transform transition-transform ${flightId == tierBoard.flightId && fc === tierBoard.className ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                <path d="M5 8l5 5 5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>) : ""}
                          </div>

                        </div>
                      );
                    })}

                  </div>
                </div>
              </div>

              {/* ------------------- TIERBOARD (SEPARATE SECTION) ------------------- */}
              
              {flightId == tierBoard.flightId && (
                <div className={`transition-all duration-500 overflow-hidden ${flightId == tierBoard.flightId ? "max-h-[1500px] mt-4" : "max-h-0"}`}>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">

                    {(() => {
                      const classTiers = tierTemplate?.[tierBoard.className.toUpperCase()] || {};
                      
                      // Object containg all the tiers(BASIC, VALUE, COMFORT, DELUXE) in a CLASS (Template)
                      const tierObjs = Object.entries(classTiers);

                      console.log(tierObjs)

                      // get the correct flight-class tiers
                      const fcObj = classes.find(c => c.className === tierBoard.className);

                      console.log(fcObj)
                      console.log(classes)
                      
                      // All the available tiers (BASIC, VALUE, COMFORT etc) for the specific 
                      // class(ECONOMY or BUSINESS etc) of this specific flight
                      const flightTiers = fcObj?.tiers || [];

                      // console.log(tierBoard.className)
                      console.log(flightTiers)

                      return (
                        <div className="grid grid-cols-4 gap-6">

                          {flightTiers.map((tier) => {
                            const match = tierObjs.find(
                              ([tierName]) => tierName === tier.tierName);

                            if (!match) return null;

                            const [tierName, tierData] = match;
                            console.log(tierName)

                            return (

                              // The Tierbox rendered for each class
                              <div key={tierName} className={`rounded-xl p-6 border cursor-pointer transition-all duration-300 ease-out
                              ${userInput.ClassName.toUpperCase() == tierBoard.className.toUpperCase() && userInput.TierName.toUpperCase() == tierName.toUpperCase() 
                              ? "bg-blue-100 border-blue-600 shadow-[0_16px_35px_rgba(37,99,235,0.35)] scale-[1.05]" 
                              : "bg-white border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.03]"}`}
                              
                              onClick={() => {chooseOptions(e, tierBoard.className, tierName, tier.price)}}
                              >
                                
                                {/* i === 0 */}
                                {/* userInput.ClassName.toUpperCase() == tierBoard.className.toUpperCase() && userInput.TierName.toUpperCase() == tierName() */}
                                
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-semibold text-gray-800">{tierName}</h3>
                                  <span className="text-lg font-bold text-[#bfa14a]">
                                    {FormatPrice(tier.price)}
                                  </span>
                                </div>

                                {/* 🔹 FEATURES in SINGLE COLUMN */}
                                <div className="flex flex-col gap-3">
                                  {Object.entries(tierData).map(([feature, value]) => {
                               
                                    let [bool, string] = value

                                    return (
                                      <div key={feature} className="flex items-start gap-3">
                                        
                                        {bool == true ? 
                                          (<FaCheck className="text-green-600 mt-1" />
                                        ) : (
                                          <FaTimes className="text-red-500 mt-1" />

                                        )}  
                                        <h2>{string}</h2>
                                        </div>
                                    );
                                  })}

                                </div>

                              {/* <div className="flex justify-end mt-4">
                              <button className={`
                                ${String(tier.price)[0] === "+" ? "bg-[#c0971c] text-[#0b0a08] border-[#bfa14a] px-4 py-2 rounded-lg hover:bg-[#5a4f2e] hover:text-white transition" 
                                  : "text-[#0118c7] font-light" }  
                                font-semibold `} >
                                {String(tier.price)[0] === "+" ? "Add" : "Continue >"}
                              </button>
                            </div> */}

                              </div>
                            );
                          })}

                        </div>
                      );

                      
                    })()}

                    {/* ------------------- CONTINUE BUTTON ------------------- */}
                    <div className="flex justify-end mt-8 pr-6">
                      <button disabled={!(userInput.ClassName && userInput.TierName)} onClick={Confirm}
                        className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-200
                                    ${userInput.ClassName && userInput.TierName
                                      ? "bg-[#bfa14a] text-white shadow-lg hover:bg-[#a88c3d] hover:shadow-xl cursor-pointer"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                                  `} >
                                  Continue
                                </button>
                              </div>
                    
                  </div>

                </div>
              )}


            </div>
          );
        })}

      </div>

      
    ) : (
      <h2 className="text-center mt-12 text-gray-700 font-semibold text-xl">
        No flights available
      </h2>
    )}
  </div>
);

}
