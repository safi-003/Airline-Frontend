import React, { useEffect, useState, useContext } from "react";
import { useApiRequest } from "./useApiRequest";
import { UserInputContext } from "./Contexts/UserInputProvider";
import { BsSuitcaseLg } from "react-icons/bs";
import { BsSuitcase } from "react-icons/bs";
import baggage from "./images/baggage.png"
import { PassengerNameTabs } from "./PassengerNameTabs";
import { useNavigate } from "react-router-dom";
import { UserProviderContext } from "./Contexts/UserProvider";

export function Bags(){

    let {ApiRequest} = useApiRequest();
    let gateway = import.meta.env.VITE_GATEWAY_URL;
    let [baggageTemplate, setBaggageTemplate] = useState()
    let [perSlab, setPerSlab] = useState(0);   
    let [pricePerSlab, setPricePerSlab] = useState(0);
    
    let {userInput, setUserInput} = useContext(UserInputContext);
    let [currentPassenger, setCurrentPassenger] = useState(0)
    let [passengers, setPassengers] = useState([])
    let nav = useNavigate();
    let {setCurrentlyIn} = useContext(UserProviderContext);
    
    useEffect(() => {

        (async () => {

            let res = await ApiRequest("get", `${gateway}/flights/getBaggageDetails`);

            setPricePerSlab(res.extraBaggage.pricePerSlab)
            setPerSlab(res.extraBaggage.perSlab)
          

            setBaggageTemplate(res)
        })();

         setPassengers([
                
                // Adult
                ...userInput.passengers.adults.map((adult, i) => ({Type: "adults", idx : i, Name: `${adult.FirstName} ${adult.LastName}`, extraBaggage: 0, extraBaggagePrice: 0})),
    
                // Child
                ...(userInput.childcount > 0 ? userInput.passengers.childs.map((c,i) => ({Type: "childs", idx: i, Name: `${c.FirstName} ${c.LastName}`, extraBaggage: 0, extraBaggagePrice: 0})) : []),
            
                // Infant
                ...(userInput.infantcount > 0 ? userInput.passengers.infants.map((i, idx) => ({Type: "infants", idx: idx, Name: `${i.FirstName} ${i.LastName}`, extraBaggage: 0, extraBaggagePrice: 0})) : [])
            ])

    }, [])


    useEffect(() => {
      console.log(userInput)
    }, [userInput])


   let confirm = () => {
    
    setUserInput(prev => {

      let updated = {...prev}
      updated.passengers = {...prev.passengers}
      
      passengers.forEach(p => {

        console.log(p.FirstName)
        
        // Adults or Childs
        updated.passengers[p.Type] = [...updated.passengers[p.Type]]

        updated.passengers[p.Type][p.idx] = {...updated.passengers[p.Type][p.idx],
          extraBaggage: p.extraBaggage+"kg",
          extraBaggagePrice: p.extraBaggagePrice
        }
      })

       return updated;
    })

    nav("/user/Checkout")
    setCurrentlyIn("payment")

   }
    
   // IF NOTHING IS RENDERED
    if(!baggageTemplate || passengers.length == 0 ){
      console.log(passengers)
      console.log(baggageTemplate)
        return(
            <div className="p-6 text-gray-500">
                Loading baggage details…
            </div>
        )
    }


    return(
    
    <div>

    <PassengerNameTabs infoType={"baggage"} passengers={passengers} currentPassenger={currentPassenger} setCurrentPassenger={setCurrentPassenger}/>

    <div className="max-w-3xl mx-auto mt-10 mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
            Extra baggage
        </h2>

        <img
            src={baggage}
            alt="Baggage"
            className="h-28 w-auto"
        />
    </div>


    {/* -------- EXTRA BAGGAGE TITLE -------- */}
  {passengers[currentPassenger].Type != "infants" && 
  <div className="max-w-3xl mx-auto">
  <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden">

    {/* GOLDEN STRIP */}
    <div className="w-2 bg-[#bfa14a]" />

    {/* CONTENT */}
    <div className="flex w-full px-6 py-5 items-center justify-between">

      {/* LEFT SECTION */}
      <div className="flex flex-col gap-2">

        {/* Tier Name */}
        <h3 className="text-2xl font-bold text-gray-900">
          {userInput.TierName}
        </h3>

        {/* Checked Baggage */}
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <BsSuitcaseLg />
          {
            baggageTemplate.checkedBaggage[
              userInput.ClassName.toLowerCase()
            ][userInput.TierName.toLowerCase()]
          }{" "}
          kg checked baggage
        </p>

        {/* Cabin Baggage */}
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <BsSuitcase />
          {baggageTemplate.cabinBaggage} kg cabin baggage
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* EXTRA BAGGAGE TEXT */}
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            Extra Baggage
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Max upto {baggageTemplate.extraBaggage.maxCapacityPerBag} kg per bag. {(passengers[currentPassenger].extraBaggage) > baggageTemplate.extraBaggage.maxCapacityPerBag
            ? "Carry additional bags" 
            : ""}
          </p>
        </div>

        {/* SLAB CONTROLS */}
        <div className="flex flex-col items-end gap-2">

          <div className="flex items-center gap-2">

            {/* KG BOX */}
            <div className="w-20 h-10 rounded-md bg-gray-100 flex items-center justify-center font-semibold text-gray-900">
              {passengers[currentPassenger].extraBaggage}kg
            </div>


            {/* - BUTTON */}
            {passengers[currentPassenger].extraBaggage > 0 && <button
              onClick={() => setPassengers(prev => {
                let updated = [...prev]
                updated[currentPassenger].extraBaggage -= perSlab
                updated[currentPassenger].extraBaggagePrice -= pricePerSlab

                return updated
              
              })}
              className={`
                w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold transition
                ${
                  passengers[currentPassenger].extraBaggage === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-950 text-white hover:bg-blue-950"
                }
              `}
            >
              -
            </button>}


            {/* + BUTTON */}
            <button
              onClick={() => setPassengers(prev => {
               
                let updated = [...prev]
                updated[currentPassenger].extraBaggage += perSlab
                updated[currentPassenger].extraBaggagePrice += pricePerSlab
                
                return updated
                
                // prev + 1
              
              })}
              disabled={
                passengers[currentPassenger].extraBaggage ===
                baggageTemplate.extraBaggage.maxExtraBaggage
              }
              className={`
                w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold transition
                ${
                  passengers[currentPassenger].extraBaggage ===
                  baggageTemplate.extraBaggage.maxExtraBaggage
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-950 text-white hover:bg-blue-950"
                }
              `}
            >
              +
            </button>

           
          </div>

          {/* PRICE */}
          <p className="text-sm font-semibold text-red-600">
            {passengers[currentPassenger].extraBaggagePrice > 0 && `₹${passengers[currentPassenger].extraBaggagePrice.toLocaleString("en-IN")}`}
          </p>
        </div>
      </div>

    </div>
  </div>
</div>}
    
    <button
    onClick={confirm}
    className={"mt-6 mr-6 rounded-2xl px-6 py-3 font-semibold shadow-md bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"}
    >
    Continue
    </button>

</div>

    )
}