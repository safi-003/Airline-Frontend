import React, { useEffect, useContext } from "react";
import { useApiRequest } from "./useApiRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { UserInputContext } from "./Contexts/UserInputProvider";

export function PaymentProcessing () {

  console.log("IN payment processing comp")
  let gateway = import.meta.env.VITE_GATEWAY_URL
  let {ApiRequest} = useApiRequest();
  let location = useLocation();
  let orderId = location.state?.orderId;
  let {userInput, userProfile} = useContext(UserInputContext)
  let nav = useNavigate();

  useEffect(() => {

    console.log("In the useEffect of payment processingg");
    console.log(orderId)
    
    void (async () => {

      let userId = "";
      let emailid = ""

      if(userInput.loggedIn) {

        console.log("User is logged in")

        userId = userProfile.id,
        emailid = userProfile.email
      
      }

      else{

      console.log("Guest user");

      // CREATE GUEST USER
      let guestObj = {
        
        emailId: userInput.email
      }

      let res = await ApiRequest("post", `${gateway}/Users/createGuestUser`, guestObj)

      console.log(res)

      userId = res.id
      emailid = userInput.email

      }

        let obj = {
          userId: userId,
          emailId: emailid,
          flightId: userInput.flightId,
          seats: userInput.adultcount + userInput.childcount + userInput.infantcount,
          orderId: orderId
        }

        console.log(obj)

        let res = await ApiRequest("post", `${gateway}/payments/PaymentStatus`, obj)

        console.log(res)

        nav("/user/BookingSuccess" , {
          state: {pnr: res.PNR}
        })

    })()


  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-12 text-center max-w-md w-full">
        
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Payment is being processed
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Please wait while we confirm your payment.
          <br />
          Do not refresh or close this page.
        </p>
      </div>
    </div>
  );
};

