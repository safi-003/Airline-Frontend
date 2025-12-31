import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserInputContext } from "../Contexts/UserInputProvider";
import planeFront from "../images/Plane-front.png"
import planeBack from "../images/Plane-back.png"
import { AdminProviderContext } from "../Contexts/AdminProvider";
import { UserProviderContext } from "../Contexts/UserProvider";
import { FaRestroom } from "react-icons/fa";
import { MdTransitEnterexit } from "react-icons/md";
import { LuBaby } from "react-icons/lu";
import { GrCafeteria } from "react-icons/gr";
import { useApiRequest } from "../useApiRequest";
import { FormatPrice } from "../HelperFunctions/formatPrice";
import { FreeSeats } from "../HelperFunctions/freeSeats";
import { PassengersSeats } from "./PassengersSeats";

export function SeatMap({ selectSeat, SeatIds, PassengerInitials }){

    const CABIN_MAX_WIDTH = "max-w-[520px]"; 
    let {ApiRequest} = useApiRequest();
    let {userInput} = useContext(UserInputContext);
    let {fleetTemplate} = useContext(AdminProviderContext)
    let {AvailSeatsInFlight} = useContext(UserProviderContext)
    let [priceMods, setPriceMods] = useState({});
    let classObj = fleetTemplate[userInput.aircraft][userInput.ClassName.toLowerCase()]    
    let className = userInput.ClassName.toLowerCase();
    let totalSeats = classObj.seats;
    let cols = Math.ceil(classObj.seats/classObj.seatsPerRow)
    let layoutLen = classObj.layout.length - 1; 
    let seatsPerRow = classObj.seatsPerRow
    let seatsRendered = 0;
    let currCol = 0
    let [freeSeats, setFreeSeats] = useState([])
    // let temp = []
    
    let str = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ" // We place "_" because rowNum starts gets incremented to 1 when seats are rendered
    let charArr = [...str];
    const lavatory = classObj.lavatoryRows;
    const galley = classObj.galleyRows;
      console.log("lavatory" + lavatory)
      console.log("Galley" + galley)
      console.log(cols)
    let zone = ""

    let FORWARD_ZONE = Math.ceil(cols * 0.35)
    let MIDDLE_ZONE = Math.ceil(cols * 0.65);
    let REAR_ZONE = cols;
    

    let chosenSeat = (id, Type, labels, seatPrice) => {

      console.log(seatPrice)
      selectSeat({
        SeatId: id,
        SeatType: Type,
        Features: labels,
        Price: seatPrice

    })
      // setCurrentlyIn("bags")
      // nav("/user/Bags")
    }

    useEffect(() => {

      (async() => {
        let data = await ApiRequest("get", "http://localhost:8082/flights/getSeatPriceModifiers")
        console.log(data)
        setPriceMods({SeatTypeModifier: data.SeatTypeModifier,
                      ZoneModifier: data.ZoneModifier
        }) })();

        if(className == "economy" && (userInput.TierName == "BASIC" || userInput.TierName == "VALUE")){
          let temp = FreeSeats(classObj, AvailSeatsInFlight)
          console.log(temp)
          setFreeSeats(temp)
        }

    }, [])

    let calculateSeatPrice = (tierName, isBassinet, isExit, isXL) => {

      let baseFee = priceMods.SeatTypeModifier.STANDARD;
        
          if(tierName == "BASIC" || tierName == "VALUE"){
          
            if(isBassinet)return baseFee + priceMods.SeatTypeModifier.BASSINET
            
            if(isExit)return baseFee + priceMods.SeatTypeModifier.EXIT_ROW

            if(isXL)return baseFee + priceMods.SeatTypeModifier.EXTRA_LEGROOM

            return baseFee;

          } else if(tierName == "COMFORT"){

            if(isExit)return baseFee + priceMods.SeatTypeModifier.EXIT_ROW

            if(isXL)return baseFee + priceMods.SeatTypeModifier.EXTRA_LEGROOM

            return 0;
          
          } else {

            if(isExit)return baseFee + priceMods.SeatTypeModifier.EXIT_ROW

            return 0;

          }  
    }

    let calculateZonePrice = (tierName, zoneName, isBassiet, isExit, isXL) => {

      if(tierName == "BASIC" || tierName == "VALUE"){
        // console.log(priceMods.ZoneModifier[zoneName])
        return priceMods.ZoneModifier[zoneName]
      }

      if(tierName == "COMFORT"){

        if(isExit || (isXL && !isBassiet) )
        return priceMods.ZoneModifier[zoneName]

        return 0;
      }

      // ONLY DELUXE TIER EXISTS NOW

      if(isExit) return priceMods.ZoneModifier[zoneName]

      return 0;

    }

    let setPrice = (className, tierName, seatNum, isBassinet, isExit, isXL) =>  {

      // For all non economy classes, seats are free
      if(className != "economy") return 0;

      // console.log(FORWARD_ZONE)
      // console.log(MIDDLE_ZONE)
      // console.log(REAR_ZONE)

        let zonesArr = [{ limit: FORWARD_ZONE, name: "FORWARD_ZONE" },
                        { limit: MIDDLE_ZONE,  name: "MIDDLE_ZONE"  },
                        { limit: REAR_ZONE,    name: "REAR_ZONE"    }]

        let zone_name = zonesArr.find(z => seatNum <= z.limit)
        zone = zone_name.name

        if(priceMods.ZoneModifier && priceMods.SeatTypeModifier){
          
        let zonePrice = calculateZonePrice(tierName, zone_name.name, isBassinet, isExit, isXL)
        let seatTypePrice = calculateSeatPrice(tierName, isBassinet, isExit, isXL)        

        // console.log(zonePrice)
        // console.log(seatTypePrice)

        // let baseFee = priceMods.SeatTypeModifier.STANDARD;

        return seatTypePrice + zonePrice;
        
      }
    }
        
    console.log(userInput)
    useEffect(() => {
      console.log(AvailSeatsInFlight);
    }, [AvailSeatsInFlight])

    console.log(classObj)
    console.log(cols)
    console.log(seatsPerRow)

    useEffect(() => {
      console.log(seatsRendered)
    }, [seatsRendered])

     useEffect(() => {
      console.log(currCol)
    }, [currCol])
    

return (

  <div>

  <div className="w-[800px] h-[600px] overflow-y-scroll overflow-x-hidden mx-auto border rounded-xl shadow-lg bg-white">

    <div className="aircraft-wrapper pl-36 pr-16 bg-blue-300">
      
      {/* Front Image */}
      <img src={planeFront} className={`mx-auto ${CABIN_MAX_WIDTH} w-full block`} />

      {/* MIDDLE SECTION */}
      <div className= {`${CABIN_MAX_WIDTH} w-fit pt-5 bg-white mx-auto flex flex-col items-center border-x-2 border-gray-300`}>

        {/* SEAT MAP */}
        <div className="flex flex-col gap-4 my-4">

          {Array.from({ length: cols }).map((_, rowIndex) => {
          let rowNum = 0;
          currCol++;

          const isFirstRow = rowIndex === 0;

    // If any facilities(Galley or Lavatory) at the MID block, then render it
          
      let midBlock = "";

    // If both are present then, push both Galley and Lavatory
    if ((currCol > 1 && currCol < cols) && lavatory.includes(currCol) && galley.includes(currCol)) {
      midBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-between px-10 my-4 shadow-sm">
          <FaRestroom className="text-3xl text-gray-700" />
          <GrCafeteria className="text-2xl text-gray-700" />
        </div>
      );
    } 

    // If only Galley is present then, only push galley
    else if ((currCol > 1 && currCol < cols) && galley.includes(currCol)) {
      midBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-center px-10 my-4 shadow-sm">
          <GrCafeteria className="text-2xl text-gray-700" />
        </div>
      );
    } 

    // If only Lavatory is present, then only push Lavatory
    else if ((currCol > 1 && currCol < cols) && lavatory.includes(currCol)) {
      midBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-center px-10 my-4 shadow-sm">
          <FaRestroom className="text-3xl text-gray-700" />
        </div>
      );
    }

  // If any facilities at the FORWARD block, then render it

  let forwardBlock = ""

    if (currCol == 1 && lavatory.includes(currCol) && galley.includes(currCol)) {
    forwardBlock = (
    <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-between px-10 my-4 shadow-sm">
      <FaRestroom className="text-3xl text-gray-700" />
      <GrCafeteria className="text-2xl text-gray-700" />
    </div>
  );
} 
    else if (currCol == 1 && galley.includes(currCol)) {
      forwardBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-center px-10 my-4 shadow-sm">
          <GrCafeteria className="text-2xl text-gray-700" />
        </div>
      );
    } 
    else if (currCol == 1 && lavatory.includes(currCol)) {
      forwardBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-center px-10 my-4 shadow-sm">
          <FaRestroom className="text-3xl text-gray-700" />
        </div>
      );}


      // If any facilities at the REAR block, then render it
      let rearBlock = ""

     if (currCol == cols && (lavatory.includes(cols + 1) || lavatory.includes(cols)) && (galley.includes(cols + 1) || galley.includes(cols))) {
      rearBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-between px-10 my-4 shadow-sm">
          <FaRestroom className="text-3xl text-gray-700" />
          <GrCafeteria className="text-2xl text-gray-700" />
        </div>
      );
    } 
    else if (currCol == cols && (galley.includes(cols + 1) || galley.includes(cols))) {
      rearBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-center px-10 my-4 shadow-sm">
          <GrCafeteria className="text-2xl text-gray-700" />
        </div>
      );
    } 
    else if (currCol == cols && (lavatory.includes(cols + 1) || lavatory.includes(cols))) {
      rearBlock = (
        <div className="w-full bg-gray-200 py-3 rounded-md flex items-center justify-center px-10 my-4 shadow-sm">
          <FaRestroom className="text-3xl text-gray-700" />
        </div>
      );}


      return (
    <div>

     {/* Render lavatory if it is in the start */}
     {forwardBlock}

    <div key={rowIndex} className="w-full flex flex-col">

      {midBlock}

      {/* ROW CONTENT */}
      <div className="flex items-center gap-4">
      {/* LEFT ROW NUMBER */}
      <div className="w-6 flex items-center justify-center">
        <span className="text-xs text-gray-600">{currCol}</span>
      </div>

      {/* SEAT GROUPS */}
      <div className="flex-1">
        <div className="flex gap-6">

          {classObj.layout.map((groupSize, groupIndex) => (
            <div key={groupIndex} className="flex gap-2">
              
              {Array.from({ length: groupSize }).map((_, seatIndex) => {
                seatsRendered++;
                rowNum++;

                if (seatsRendered > totalSeats) return null;

                const seatId = `${currCol}${charArr[rowNum]}`;
                const isAvailable = AvailSeatsInFlight.includes(seatId);
                const isWindow = (groupIndex === 0 && seatIndex === 0) || 
                                 (groupIndex === layoutLen && seatIndex === groupSize - 1);
                const isBassinet = className == "economy" && classObj.bassinetRows.includes(currCol);
                const isXL = className === "economy" && classObj.extraLegroomRows.includes(currCol);
                const isExit = className === "economy" && classObj.exitRows.includes(currCol);
                const isNonReclining = className == "economy" && (isBassinet || isExit || classObj.exitRows.includes(currCol+1) || currCol == cols)
                const isAisle = groupIndex != 0 && seatIndex == 0 || groupSize == seatIndex + 1
                const seatType = isWindow ? "Window Seat" : isAisle ? "Aisle Seat" : "Standard";
                const seatPrice = (className === "economy" && (userInput.TierName == "BASIC" && userInput.TierName == "VALUE")) ? (freeSeats.includes(seatId) && 0) : setPrice(userInput.ClassName, userInput.TierName, currCol, isBassinet, isExit, isXL);
                
                const seatColor = className === "economy" && (userInput.TierName == "BASIC" || userInput.TierName == "VALUE") ? (zone == "FORWARD_ZONE" ? "bg-purple-500" : (freeSeats && freeSeats.includes(seatId) ? "bg-green-400" :  "bg-orange-400")) : (seatPrice == 0 ? "bg-green-400" : "bg-orange-400")
                // const seatColor = (className === "economy" ? (userInput.TierName == "BASIC" || userInput.TierName == "VALUE" ? freeSeats.includes(seatId) && "bg-green-400" : (zone == "FORWARD_ZONE" ? "bg-purple-500" : "bg-orange-400")) : (seatPrice == 0 ? "bg-green-400" : "bg-orange-400")) 
                const labels = [];
                const icons = [];
                let isSeatIdPresent = SeatIds.indexOf(seatId) 
                let intials = ""

                // Check if this specific Seat ID is present and if yes then get the initials
                if(isSeatIdPresent != -1 && PassengerInitials.length > 0){
                  intials = PassengerInitials[isSeatIdPresent].join("")
                }
                // console.log(freeSeats && freeSeats.at(-1));
                
                if (isBassinet) icons.push(<LuBaby key="baby" />), labels.push("Bassinet Facility");
                if (isExit) icons.push(<MdTransitEnterexit  key="exit" />), labels.push("Exit Row")
                if (isXL) icons.push("XL"), labels.push("Extra Legroom");
                if(isNonReclining) labels.push("Non Reclining")
                  
              
                return (
                  <div key={seatId} className="flex flex-col items-center relative group">

                    {/* Seat Letters on First Row Only */}
                    {isFirstRow && (
                      <span className="text-xs text-gray-600 mb-1">
                        {charArr[rowNum]}
                      </span>
                    )}

                    {/* Seat Box */}
                    <div
                      className={`w-8 h-8 rounded cursor-pointer transition
                        ${
                          (isAvailable
                          ? (intials ? "bg-blue-950 text-white font-mono w-8 h-8 flex items-center justify-center": seatColor)                          
                          : "bg-gray-400 cursor-not-allowed")}`}
                        onClick={() => {chosenSeat(seatId, seatType, labels, seatPrice)}}
                    >{intials ? intials :isAvailable && icons}</div>

                    {/* Tooltip */}
                     {isAvailable ? (
                    <div className="
                      absolute left-1/2 -translate-x-1/2 -top-12 hidden group-hover:flex flex-col items-start bg-gray-100 text-black text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
                      <span className="font-semibold">Seat {seatId}</span>
                      <span>{seatType}</span>
                      <span className="text-green-400">{labels.join(" | ")}</span>
                      <span>₹{seatPrice && FormatPrice(seatPrice)}</span>
                    </div>
                  ) : (
                    <div className="
                      absolute left-1/2 -translate-x-1/2 -top-12 hidden group-hover:flex flex-col items-start bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
                      <span className="font-semibold">This seat is taken</span>
                    </div>
                  )}

                  </div>
                  
                );
              })}

            </div>
          ))}

        </div>
      </div>

      {/* RIGHT ROW NUMBER */}
      <div className="w-6 flex items-center justify-center">
        <span className="text-xs text-gray-600">{currCol}</span>
      </div>

    </div>
    </div>

         {/* Render Lavatory if it is present at the end */}
         {rearBlock}

    </div>
  );
})}

        </div>
      </div>

      {/* Tail Image */}
      <img src={planeBack} className={`mx-auto ${CABIN_MAX_WIDTH} w-full block`} />

    </div>

  </div>

  </div>
);

}


  
