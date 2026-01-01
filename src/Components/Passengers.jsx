import React, { useContext, useEffect, useState, useRef } from "react";
import { UserInputContext } from "./Contexts/UserInputProvider";
import { EmptyInput } from "./InputValidation/EmptyInput";
import { UserProviderContext } from "./Contexts/UserProvider";
import { AppNotification } from "./AppNotification";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "./useApiRequest";
import { AdminProviderContext } from "./Contexts/AdminProvider";

export function Passengers(){

    let {userInput, setUserInput} = useContext(UserInputContext);
    let [adultGenders, setAdultGenders] = useState([])
    let [childGenders, setChildGenders] = useState([])
    let [infantGenders, setInfantGenders] = useState([])
    let {setNotification, setIsErr, setCurrentlyIn} = useContext(UserProviderContext);
    let {ApiRequest} = useApiRequest();
    let gateway = import.meta.env.VITE_GATEWAY_URL;
    let {setFleetTemplate} = useContext(AdminProviderContext)

    let genderRefs  = {adults: [], childs: [], infants: []}

    console.log(gateway)

    let generateId = () => {

        return Math.random().toString().slice(6,10)
    }

    useEffect(() => {

        let adults = [];
        let childs = [];
        let infants = [];


        // Creating adult passenger objects
        for(let i=1; i<=userInput.adultcount; i++){
           
            adults.push({
                id: generateId(),
                Title: "",
                FirstName: "",
                LastName: ""
            })

        }

        // Creating child passenger objects

        for(let i=1; i<=userInput.childcount; i++){

            childs.push({
                id: generateId(),
                Title: "",
                FirstName: "",
                LastName: ""
            })
 
        }
    
        // Creating infant passenger objects

        for(let i=1; i<=userInput.infantcount; i++){

            infants.push({
                id:generateId(),
                FirstName: "",
                LastName: "",
                // Gender: infantGenders[i],
                dob: ""
            })
        }

        setUserInput(prev => ({
            ...prev,
            passengers:{
                adults: adults,
                childs: childs,
                infants: infants
            }
        }))

         console.log(userInput)
        
    }, [])

    // let inputRefs = useRef([]);
    let adultInputRefs = useRef([]);
    let childInputRefs = useRef([]);
    let infantInputRefs = useRef([])

    let handleChange = (e, index, passengerType) => {

        let {name, value} = e.target;

        let input;

        if(passengerType == "adults") input=adultInputRefs
        else if(passengerType == "childs") input=childInputRefs
        else input = infantInputRefs,

        console.log(input);
        
        input.current[index][name].style.border = "",
        input.current[index][name].style.backgroundColor = ""

        setUserInput(prev => {
           
            let updated = [...prev.passengers[passengerType]]

            updated[index] = {
                ...updated[index],
                [name] : value.trim()
            }

            return{
                ...prev,
                passengers: {
                    ...prev.passengers,
                    [passengerType]: updated
                }
            }
        })
    }

    let handleGenders = (setOp, index, type, value) => {

       genderRefs[type][index].style.border = ""
       genderRefs[type][index].style.backgroundColor = ""

       setOp(prev => {
        
        let updated = [...prev]
        updated[index] = value
        
        return updated;
  
    })}


    let isGenderSelected = () => {

      console.log(adultGenders)
      console.log(childGenders)
      console.log(infantGenders)

      // CHECKING IF ADULT GENDERS ARE EMPTY
      if(adultGenders.length < 1){

        genderRefs.adults.forEach((g, i) => {

          let element = genderRefs.adults[i]

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6"; 

        })
            setIsErr(true)
            setNotification("Input Fields cannot be empty")
      } 

      adultGenders.map((g, i) => {

          // GENDER IS EMPTY
          if(g == ""){
            let element = genderRefs.adults[i]

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6"; 

            setIsErr(true)
            setNotification("Input Fields cannot be empty")
          }
      })


      // CHECKING IF CHILD GENDERS ARE EMPTY
      if(childGenders.length < 1){

        genderRefs.childs.forEach((g, i) => {

          let element = genderRefs.childs[i]

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6"; 

        })
            setIsErr(true)
            setNotification("Input Fields cannot be empty")
      } 
      childGenders.forEach((g, i) => {

          // GENDER IS EMPTY
          if(g == ""){
            let element = genderRefs.childs[i]

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6"; 

            setIsErr(true)
            setNotification("Input Fields cannot be empty")
          }
      })


      // CHECKING IF INFANT GENDERS ARE EMPTY
      if(infantGenders.length < 1){

        genderRefs.infants.forEach((g, i) => {

          let element = genderRefs.infants[i]

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6"; 

        })
            setIsErr(true)
            setNotification("Input Fields cannot be empty")
      } 

      infantGenders.forEach((g, i) => {

          // GENDER IS EMPTY
          if(g == ""){
            let element = genderRefs.infants[i]

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6"; 

            setIsErr(true)
            setNotification("Input Fields cannot be empty")
          }
      })
    }

    let highlightEmail = (err, message) => {

      if(err){

        adultInputRefs.email.style.border = "2px solid red";
        adultInputRefs.email.style.backgroundColor = "#ffe6e6";  
      } else{
        adultInputRefs.email.style.border = "";
      adultInputRefs.email.style.backgroundColor = ""
      }
      

      setIsErr(true)
      setNotification(message)
    }

    let nav = useNavigate();

    let submit = async () => {

      console.log(adultInputRefs)
      console.log(childInputRefs)
      console.log(infantInputRefs)

      adultInputRefs.current.map((ref, i) => {

        if(EmptyInput(userInput.passengers.adults[i], adultInputRefs.current[i])){

          setIsErr(true)
          setNotification("Input Fields cannot be empty")
        }
      })

      childInputRefs.current.map((ref, i) => {

        if(EmptyInput(userInput.passengers.childs[i], childInputRefs.current[i])){

          setIsErr(true)
          setNotification("Input Fields cannot be empty")
        }
      })

      infantInputRefs.current.map((ref, i) => {

        if(EmptyInput(userInput.passengers.infants[i], infantInputRefs.current[i])){

          setIsErr(true)
          setNotification("Input Fields cannot be empty")
        }
      })

      // CHECK IF GENDERS ARE EMPTY
      isGenderSelected()

      // VALIDATE EMAIL
      if(userInput.email.includes("@") && userInput.email.includes(".") && userInput.email.includes(" ")){

        let [mail, domain] = userInput.email.split("@")

        if(mail.length <5 || !domain.includes(".") || mail.includes(".")){
          highlightEmail(true, "Please enter a valid mail ID first") 
          return;
        }

        if(domain.split(".")[1].length < 2){
          highlightEmail(true, "Please enter a valid domain for the mail ID")
          return;
        }
      } 

      let fleetData = await ApiRequest("get", `${gateway}/flights/getFleetTemplate`)

      console.log(fleetData)
      
      // else {
      //   highlightEmail(true, "Please enter a valid mail ID else")
      //   return;
      // }
      setFleetTemplate(fleetData);
      setCurrentlyIn("seats");
      nav("/user/SeatLayout")
    }


    // Updating the Genders for Adults
    useEffect(() => {

      adultGenders.map((g, i) => {
        setUserInput(prev => {
          let updated = [...prev.passengers.adults]

          updated[i] = {
            ...updated[i],
            Gender: g
          }

          return{
            ...prev,
            passengers: {
              ...prev.passengers,
              adults: updated
            }
          }
        })
      })

      console.log(adultGenders)

    }, [adultGenders])


    // Updating the Genders for Childs
    useEffect(() => {

      childGenders.map((g, i) => {

        setUserInput(prev => {

          let updated = [...prev.passengers.childs]
          updated[i] = {
            ...updated[i],
            Gender: g
          }

          return{
            ...prev,
            passengers: {
              ...prev.passengers,
              childs: updated
            }
          }

        })
      })

    },[childGenders])

    // Updating the Genders for Infants
    useEffect(() => {

    infantGenders.map((g, i) => {

      setUserInput(prev => {

        let updated = [...prev.passengers.infants]
        updated[i] = {
          ...updated[i],
          Gender: g
        }

        return{

          ...prev,
          passengers: {
            ...prev.passengers,
            infants: updated
          }
        }

      })

    })  
      

    }, [infantGenders])


    useEffect(() => {
        console.log(userInput)
    }, [userInput])

  let [emailDomains, setEmailDomains] = useState([]);


    useEffect(() => {
         console.log(emailDomains)
    }, [emailDomains])
  const genderBtnClass = (selected, value) =>
    selected === value
      ? "px-3 py-2 border border-black bg-blue-50 text-gray-700 font-bold rounded-md relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-blue-500 transition-all"
      : "px-3 py-2 border border-black text-gray-700 font-light rounded-md hover:bg-gray-100 transition-all"

  let [resultsFiltered, setResultsFiltered] = useState(false)
  let domains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "rediffmail.com", "icloud.com"]

 return (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#c5d9d7] to-[#e6f0ef] font-sans py-12">

    <div className="bg-white p-10 rounded-3xl w-full max-w-5xl shadow-2xl border border-gray-200 flex flex-col gap-6">

      {/* Advisory Warning */}
      <div className="w-full bg-yellow-100 border border-yellow-300 text-yellow-900 px-6 py-4 rounded-xl shadow-sm">
        <p className="text-sm font-bold">Important:</p>
        <p className="text-sm font-semibold mt-1">
          Enter names exactly as mentioned on Passport / Govt. IDs.
        </p>
        <p className="text-sm font-semibold mt-1">
          Please provide accurate traveler information for a smooth journey.
        </p>
      </div>

      <AppNotification />

      {/* --------------------------- PASSENGER DETAILS SECTION --------------------------- */}
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-4 mb-2 text-center">
        Passenger Details
      </h1>

      {/* ====================== ADULTS ====================== */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Adult (12 yrs+)</h2>

        {userInput.passengers.adults?.map((adult, i) => (
          <div key={adult.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all mb-6">

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Adult {i + 1}
            </h3>

            <div className="grid grid-cols-4 gap-6">

              {/* TITLE */}
              <select
                name="Title"
                value={adult.Title}
                onChange={(e) => handleChange(e, i, "adults", "Title")}
                ref={(e) => { if (!adultInputRefs.current[i]) adultInputRefs.current[i] = {}; adultInputRefs.current[i].Title = e }}
                className="border border-gray-400 rounded-xl px-4 py-3 bg-white font-medium text-gray-700 focus:ring-2 focus:ring-[#007b83]"
              >
                <option value="" disabled hidden>Select a Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
              </select>

              {/* FIRST NAME */}
              <input
                type="text"
                placeholder="First Name"
                value={adult.FirstName}
                name="FirstName"
                ref={(e) => { if (!adultInputRefs.current[i]) adultInputRefs.current[i] = {}; adultInputRefs.current[i].FirstName = e }}
                onChange={(e) => handleChange(e, i, "adults", "FirstName")}
                className="border border-gray-400 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
              />

              {/* LAST NAME */}
              <input
                type="text"
                placeholder="Last Name"
                value={adult.LastName}
                name="LastName"
                ref={(e)=>{ if(!adultInputRefs.current[i]) adultInputRefs.current[i] = {}; adultInputRefs.current[i].LastName = e }}
                onChange={(e)=>handleChange(e,i,"adults","LastName")}
                className="border border-gray-400 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
              />

              {/* GENDER */}
              <div className="flex gap-3 items-center" ref={(e)=>{ genderRefs.adults[i] = e }}>
                <button
                  className={genderBtnClass(adultGenders[i], "MALE") + " rounded-full px-5 py-2 font-semibold shadow-sm"}
                  onClick={() => handleGenders(setAdultGenders, i, "adults", "MALE")}
                >
                  MALE
                </button>
                <button
                  className={genderBtnClass(adultGenders[i], "FEMALE") + " rounded-full px-5 py-2 font-semibold shadow-sm"}
                  onClick={() => handleGenders(setAdultGenders, i, "adults", "FEMALE")}
                >
                  FEMALE
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ====================== CHILDREN ====================== */}
      {userInput.passengers.childs?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Child (Below 12 yrs)</h2>

          {userInput.passengers.childs.map((child, i) => (
            <div key={child.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all mb-6">

              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Child {i + 1}
              </h3>

              <div className="grid grid-cols-4 gap-6">

                {/* TITLE */}
                <select
                  name="Title"
                  value={child.Title}
                  ref={(e)=>{ if(!childInputRefs.current[i]) childInputRefs.current[i]={}; childInputRefs.current[i].Title=e }}
                  onChange={(e)=>handleChange(e,i,"childs","Title")}
                  className="border border-gray-400 rounded-xl px-4 py-3 bg-white font-medium text-gray-700 focus:ring-2 focus:ring-[#007b83]"
                >
                  <option value="" disabled hidden>Select a Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>

                {/* FIRST NAME */}
                <input
                  type="text"
                  placeholder="First Name"
                  value={child.FirstName}
                  name="FirstName"
                  ref={(e)=>{ if(!childInputRefs.current[i]) childInputRefs.current[i]={}; childInputRefs.current[i].FirstName=e }}
                  onChange={(e)=>handleChange(e,i,"childs")}
                  className="border border-gray-400 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
                />

                {/* LAST NAME */}
                <input
                  type="text"
                  placeholder="Last Name"
                  name="LastName"
                  value={child.LastName}
                  ref={(e)=>{ if(!childInputRefs.current[i]) childInputRefs.current[i]={}; childInputRefs.current[i].LastName=e }}
                  onChange={(e)=>handleChange(e,i,"childs")}
                  className="border border-gray-400 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
                />

                {/* GENDER */}
                <div className="flex gap-3 items-center" ref={(e)=>{ genderRefs.childs[i] = e }}>
                  <button
                    className={genderBtnClass(childGenders[i], "MALE") + " rounded-full px-5 py-2 font-semibold shadow-sm"}
                    onClick={() => handleGenders(setChildGenders, i, "childs", "MALE")}
                  >
                    MALE
                  </button>
                  <button
                    className={genderBtnClass(childGenders[i], "FEMALE") + " rounded-full px-5 py-2 font-semibold shadow-sm"}
                    onClick={() => handleGenders(setChildGenders, i, "childs", "FEMALE")}
                  >
                    FEMALE
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================== INFANTS ====================== */}
      {userInput.passengers.infants?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Infant (Below 2 yrs)</h2>

          {userInput.passengers.infants.map((infant, i) => (
            <div key={infant.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all mb-6">

              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Infant {i + 1}
              </h3>

              <div className="grid grid-cols-4 gap-6">

                {/* FIRST NAME */}
                <input
                  type="text"
                  name="FirstName"
                  placeholder="First Name"
                  ref={(e)=>{ if(!infantInputRefs.current[i]) 
                    infantInputRefs.current[i]={}; 
                    infantInputRefs.current[i].FirstName=e 
                  }}
                  value={infant.FirstName}
                  onChange={(e)=>handleChange(e,i,"infants")}
                  className="border border-gray-400 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
                />

                {/* LAST NAME */}
                <input
                  type="text"
                  name="LastName"
                  placeholder="LastName"
                  ref={(e)=>{ if(!infantInputRefs.current[i]) 
                    infantInputRefs.current[i]={}; 
                    infantInputRefs.current[i].LastName=e 
                  }}
                  value={infant.LastName}
                  onChange={(e)=>handleChange(e,i,"infants")}
                  className="border border-gray-400 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
                />

                {/* GENDER */}
                <div className="flex gap-3 items-center" ref={(e)=>{ genderRefs.infants[i] = e }}>
                  <button
                    className={genderBtnClass(infantGenders[i], "MALE") + " rounded-full px-5 py-2 font-semibold shadow-sm"}
                    onClick={() => handleGenders(setInfantGenders, i, "infants", "MALE")}
                  >
                    MALE
                  </button>
                  <button
                    className={genderBtnClass(infantGenders[i], "FEMALE") + " rounded-full px-5 py-2 font-semibold shadow-sm"}
                    onClick={() => handleGenders(setInfantGenders, i, "infants", "FEMALE")}
                  >
                    FEMALE
                  </button>
                </div>

                {/* DATE OF BIRTH */}
                <input
                  type="date"
                  name="dob"
                  value={infant.dob}
                  ref={(e)=>{ if(!infantInputRefs.current[i]) 
                    infantInputRefs.current[i]={}; 
                    infantInputRefs.current[i].dob=e 
                  }}
                  onChange={(e)=>handleChange(e,i,"infants","dob")}
                  className="border border-gray-400 rounded-xl px-4 py-3 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-[#007b83]"
                />

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================== BOOKING DETAILS ====================== */}
      <div className="bg-[#f3f7f7] border border-gray-300 rounded-2xl p-8 shadow-lg mt-4">

        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
          Booking Details Will Be Sent To
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* COUNTRY */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-2">Country</label>
            <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 bg-white">
              <span className="font-bold text-gray-700">India (+91)</span>
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-2">Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              ref={(e)=>{ adultInputRefs.mobileNo = e }}
              value={userInput.mobileNo}
              onChange={(e) => {

                let val = e.target.value 
                adultInputRefs.mobileNo.style.border = ""; 
                adultInputRefs.mobileNo.style.backgroundColor = ""; 
                
                if(val == ""){ 
                  setIsErr(true) 
                  setNotification("Phone Number cannot be empty") 
                  adultInputRefs.mobileNo.style.border = "2px solid red"; 
                  adultInputRefs.mobileNo.style.backgroundColor = "#ffe6e6"; 
                  return; 
                 }

                 // CHECKING IF PHONE NUMBER EXCEEDS 10 DIGITS 
                 if(val.length > 10){ 
                  setIsErr(true) 
                  setNotification("Phone Number should only be 10 digits") 
                  adultInputRefs.mobileNo.style.border = "2px solid red"; 
                  adultInputRefs.mobileNo.style.backgroundColor = "#ffe6e6"; 
                  return; 
                 }

                 // CHECKING IF PHONE NUMBER CONTAINS NON NUMBERS 
                 if (Number.isNaN(Number(val))) { 
                  setIsErr(true) 
                  setNotification("Only numbers are allowed") 
                  adultInputRefs.mobileNo.style.border = "2px solid red"; 
                  adultInputRefs.mobileNo.style.backgroundColor = "#ffe6e6"; 
                  return; 
                 }

                setUserInput(prev => ({ ...prev, mobileNo: e.target.value })); }}                 
              
              className="border border-gray-400 rounded-xl px-4 py-3 bg-white font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col relative">
            <label className="font-semibold text-gray-800 mb-2">Email</label>

            <input
              type="email"
              placeholder="Enter Email Address"
              ref={(e)=>{ adultInputRefs.email = e }}
              value={userInput.email}
              onChange={(e) => {

                setResultsFiltered(false) 
                let val = e.target.value 
                highlightEmail(false)

                // Always update email first 
                setUserInput(prev => ({ ...prev, email: e.target.value }))

                // // Case 1: Too short → hide suggestions 
                if(val.length < 3){ 
                  setEmailDomains([]) 
                  return; 
                }

                // Case 2: Email contains "@" 
                if(val.includes("@")){ 
                  
                  let [mail, domain] = val.split("@") 
                  
                // User input has domain "Syed@gmail..." 
                if(domain.length > 0){ 
                  let filtered = domains.filter(c => c.startsWith(domain.toLowerCase())) 
                  setResultsFiltered(true); 
                  setEmailDomains(filtered) 
                  return; 
                
                } } 
                  setEmailDomains(domains) 
                } }
              className="border border-gray-400 rounded-xl px-4 py-3 bg-white font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#007b83]"
            />

            {/* EMAIL DOMAINS LIST */}
            {emailDomains.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-xl shadow-lg mt-1 z-30">
                {emailDomains.map((d, idx) => (
                  <p
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium"
                    onClick={() => {
                      setUserInput(prev => ({
                        ...prev,
                        email: prev.email.split("@")[0] + "@" + d
                      }));
                      setEmailDomains([]);
                    }}
                  >
                    {userInput.email.includes("@")
                      ? userInput.email.split("@")[0] + "@" + d
                      : userInput.email + "@" + d}
                  </p>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end pt-4">
        <button
          onClick={submit}
          className="bg-[#007b83] hover:bg-[#016b73] text-white px-10 py-3 rounded-full font-semibold shadow-md text-lg transition-all duration-300"
        >
          Submit Details
        </button>
      </div>

    </div>
  </div>
);


}

