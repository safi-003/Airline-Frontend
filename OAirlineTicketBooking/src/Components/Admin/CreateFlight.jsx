import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { AppNotification } from "../AppNotification";
import { UserProviderContext } from "../Contexts/UserProvider";
import { FlightTier } from "./FlightTiers";
import { FlightDetails } from "./FlightDetails";
import { FlightClasses } from "./FlightClasses";
import { LoadingAnimation } from "../LoadAnimation";
import { AdminProviderContext } from "../Contexts/AdminProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useApiRequest } from "../useApiRequest";

export function CreateFlights(){

    let {setNotification, setLoading, setIsErr } = useContext(UserProviderContext);
    let {flight, flightClass, flightTierData} = useContext(AdminProviderContext);
    let [showModal, setShowModal] = useState(false);
    let [display, setDisplay] = useState();
    let {ApiRequest} = useApiRequest();

    let confirmInfo = () => {
  
      setDisplay("flight");
      setShowModal(true)

    }

    let createFlight = async function(){
      
      console.log(flight)
      
      await ApiRequest("post", "http://localhost:8082/flights/create",{
            
              flightModel: flight,
              flightClassList: flightClass,
              flightTierList: flightTierData
            })            
      }    

    const pages = ["flightdetails", "flightclass", "flighttier"]
    let [pageNo, setPageNo] = useState(0);

    let flightDetailsRef = useRef();
    let flightClassesRef = useRef();
    let flightTiersRef = useRef();

    const next = async () => {

    const currentPage = pages[pageNo];

      // call child's validate() synchronously
      if (currentPage === "flightdetails") {
        const ok = await flightDetailsRef.current?.validate();
        if (!ok) return; // stop here if invalid
      }

      if (currentPage === "flightclass") {
        const ok = await flightClassesRef.current?.validate();
        if (!ok) return;
      }

      // only after validation passed:
      setPageNo(pageNo + 1);
      };

    let previous = () => {

      setPageNo(prev => {
        
        let page = prev-1;
        return page;
    
    })}

  let change = (stateVariable) => {

    setDisplay(stateVariable)

  }

  let editDetails = () => {

    if(display == "flight"){
      setPageNo(0)
    } else if(display == "class"){
      setPageNo(1)
    } else setPageNo(2)

    setShowModal(false)

  }


  return (

   <div className="p-6">

  {pageNo == 0 && <FlightDetails ref={flightDetailsRef}/>}
  {pageNo == 1 && <FlightClasses ref={flightClassesRef}/>}
  {pageNo == 2 && <FlightTier ref={flightTiersRef}/>}

  <button
  type="button"
  className={`w-full mt-4 py-2 rounded-md transition ${
    pageNo < 1
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-black text-white hover:bg-gray-800"
  }`}
  onClick={previous}
  disabled={pageNo < 1}
>
  Previous
</button>

<button
  type="button"
  className={`w-full mt-4 py-2 rounded-md transition ${
    pageNo > 1
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-black text-white hover:bg-gray-800"
  }`}
  onClick={next}
  disabled={pageNo > 1}
>
  Next
</button>

        {/* Submit Button */}
        <button
          type="button"
          className="w-full mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          onClick={confirmInfo}
        >
          Save Flight
        </button>
  

      {/* Loading animation */}

      <LoadingAnimation />

      {/* Error Message */}
      <AppNotification />

  {/* MODAL SECTION */}
  <AnimatePresence>
  {showModal && (
    <motion.div
      className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-5xl h-[85vh] p-8 relative overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Close & Edit Icons */}
        <div className="absolute top-4 right-4 flex items-center gap-4"
        onClick={editDetails}>
          {/* Edit Button */}
          <button
            onClick={() => editDetails()}           // ⬅️ edit handler
            className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Edit
          </button>

          {/* Close Icon */}
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>


        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center tracking-wide">
          Review Flight Details
        </h2>

        {/* View Toggle Buttons */}
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-inner mb-4">
          {["flight", "class", "tier"].map((tab) => (
            <button
              key={tab}
              onClick={() => change(tab)}
              className={`flex-1 mx-2 py-2 font-medium rounded-md transition ${
                display === tab
                  ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-2">

          {/* --- FLIGHT DETAILS SECTION --- */}
          {display === "flight" && (
            <div className="space-y-3">
              {Object.entries(flight).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center border-b border-gray-200 py-2">

                  <p className="text-gray-600 font-medium capitalize">{key}</p>
                  <p className="text-gray-900 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* --- FLIGHT CLASSES SECTION --- */}
          {display === "class" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flightClass.map((cls, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 shadow-md border border-indigo-200"
                >
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                    {cls.className}
                  </h3>
                  <div className="space-y-1">
                    {Object.entries(cls).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-gray-100 py-1"
                      >
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="text-gray-800 font-medium">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}


{/* Flight Tier Data */}
<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-6">
  <div className="max-w-6xl w-full">
   {display === "tier" && (() => {
  // Group tiers by class name
  const grouped = flightTierData.reduce((acc, obj) => {
    if (!acc[obj.className]) {
      acc[obj.className] = [];
    }
    acc[obj.className].push(obj);
    return acc;
  }, {});

  // Render grouped classes and tiers
  return Object.entries(grouped).map(([className, tiers]) => (
    <div
      key={className}
      className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl shadow-lg mb-12 p-8"
    >
      {/* --- CLASS HEADER --- */}
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center uppercase tracking-wide">
        {className}
      </h2>

      {/* --- TIERS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-[320px] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* --- TIER HEADER --- */}
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4 tracking-wide">
              {tier.tierName}
            </h3>

            <div className="h-[2px] bg-indigo-200 w-3/4 mb-4"></div>

            {/* --- FEATURE LIST --- */}
            <div className="space-y-3 w-full">
              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-lg py-2 shadow-sm hover:bg-gray-100 transition">
                <span className="text-gray-600 font-medium capitalize">Price</span>
                <span className="text-gray-900 font-semibold text-lg mt-1">
                  {tier.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ));
})()}

  </div>
</div>


        {/* Footer Buttons */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={createFlight}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Confirm
          </button>
        </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


  </div>
);

}