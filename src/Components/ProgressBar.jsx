import React, { useContext, useEffect } from "react";
import  {FaPlane, FaUser, FaChair, FaShoppingBag, FaTh, FaCreditCard } from "react-icons/fa";
import { UserProviderContext } from "./Contexts/UserProvider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LuBaggageClaim } from "react-icons/lu";

export function ProgressBar(){

    let {currentlyIn} = useContext(UserProviderContext);
    let {pathname } = useLocation();

    let hideThis = pathname  == "/user/search"
    let nav = useNavigate();
    let currentIndex = "";

    useEffect(() => {
      currentIndex = ""
    },[currentlyIn])

    return (
    
    <>
    {!hideThis && (

    <div className="w-full flex justify-center mt-0"> 
    {/* mt-0 keeps it visually attached to modify bar */}

    <div className="flex items-center gap-10 
        bg-[#eef7f3]        /* Lighter soft greenish background */
        py-4 px-10 
        rounded-full 
        shadow-sm 
        border border-[#d5e7df]">

      {[
        {  id: 1, key: "flight", url: "searchResults", label: "Flight", icon: <FaPlane /> },
        {  id: 2, key: "guests", url: "PassengerDetails", label: "Guests", icon: <FaUser /> },
        {  id: 3, key: "seats", url: "SeatMap",  label: "Seats", icon: <FaChair /> },
        {  id: 4, key: "baggage", url: "Bags",  label: "Baggage", icon: <LuBaggageClaim /> },
        {  id: 5, key: "payment", url: "",  label: "Payment", icon: <FaCreditCard />},
      ].map((step, index, arr) => (
        <div key={step.key} className="flex items-center">

          {/* ---- ICON + LABEL ---- */}
          <div 
            className={`
              flex flex-col items-center relative group cursor-pointer transition
              ${currentlyIn === step.key 
                ? "text-[#0d5b4c]"             /* Selected text color */
                : "text-gray-700"}
              hover:text-[#0d5b4c]
            `}
          >

            {/* ICON */}
            <div 
              className={`
                text-xl relative transition 
                ${currentlyIn === step.key ? "text-[#0d5b4c]" : "text-gray-700"} 
                group-hover:text-[#0d5b4c]
              `}
              onClick={() => {nav(`/user/${step.url}`)}}
            >
              {step.icon}

              {/* Small green circle around icon for ACTIVE step */}
              {currentlyIn === step.key && (
                <div className="absolute inset-2 rounded-full border-2 border-[#0d5b4c]"></div>
              )}

              {/* Small green tick badge (optional for completed steps) */}
              {/* 
              {isDone[step.key] && (
                <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  ✓
                </div>
              )} 
              */}
            </div>

            {/* LABEL */}
            <span className="text-[12px] font-light mt-1 transition group-hover:text-[#0d5b4c]">
              {step.label}
            </span>
          </div>

          {/* ---- Dots ---- */}
          {index !== arr.length - 1 && (
            <div className="flex flex-col items-center ml-6">
              <div className="text-[#b8c9c1] text-xl tracking-widest select-none">
                •••••
              </div>
            </div>
          )}

        </div>
      ))}

    </div>
  </div>
    )}

    <Outlet />
    </>
);

}