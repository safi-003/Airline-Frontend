import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaArrowRight, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserProviderContext } from "./Contexts/UserProvider";
import { LoadingAnimation } from "./LoadAnimation";
import { AppNotification } from "./AppNotification";
import { useSearchInDB } from "./useSearchInDB";
import { useApiRequest } from "./useApiRequest";
import { UserInputContext } from "./Contexts/UserInputProvider";

export function Search() {

  let {ApiRequest} = useApiRequest();
  let {search} = useSearchInDB()
  let [from, setFrom] = useState("")
  let [to, setTo] = useState("");
  let [query, setQuery] = useState("");
  let [value, setValue] = useState("");
  let [isFromFocused, setIsFromFocused] = useState(false)
  let [isToFocused, setIsToFocused] = useState(false);
  let [suggestionList, setSuggestionList] = useState([]);

  let {
            Modal, setModal,
            setCurrentlyIn,
            message, showMessage,
            setFlightDates, setAvailflights,
            setLoading, setNotification, setIsErr
 
          } = useContext(UserProviderContext);

    let {userInput, setUserInput  } = useContext(UserInputContext)

  // const incrementCount = (setOperation) => {
  //   if (totalCount < 9) {
  //     setOperation((prev) => prev + 1);
  //     setTotalCount((prev) => prev + 1);
  //     showMessage("");
  //   } else showMessage("Only 9 Passengers can be booked at a time");
  // };

  // const decrementCount = (setOperation) => {
  //   if (setOperation === setAdultcount) {
  //     setOperation((prev) => Math.max(1, prev - 1));
  //   } else {
  //     setOperation((prev) => Math.max(0, prev - 1));
  //   }
  //   setTotalCount((prev) => prev - 1);
  //   showMessage("");
  // };

   const incrementCount = (field) => {
    
      setUserInput((prev) => {

        if (userInput.totalCount >= 9) {

          showMessage("Only 9 Passengers can be booked at a time");
          return prev;

      }
      
      return {
        ...prev, 
        [field]: prev[field] + 1,
        totalCount: prev.totalCount + 1
      }
      
    })
    
    showMessage("");
  };

  const decrementCount = (field) => {

    setUserInput(prev => {

    let current = prev[field]  

       // For adultcount: min = 1
    if (field === "adultcount" && current <= 1) {
      return prev;
    }

    // For others: min = 0
    if (field !== "adultcount" && current <= 0) {
      return prev;
    }

    return {
      ...prev,
      [field]: current - 1,                  // decrement correct field
      totalCount: prev.totalCount - 1,       // decrement total
    }} )

    showMessage("");
  };

  const toggleModal = () => setModal(!Modal);

  const navigate = useNavigate();

  // let searchAirports = async (type) => {

  //   let timer = setTimeout(async () => {

  //     let res = await ApiRequest("post", `http://localhost:8082/flights/SearchAirports?query=${type}`)

  //     console.log(res)

  //   }, 3000)

  //   timer()

  //   clearTimeout(timer);

  // }


  useEffect(() => {

    console.log(suggestionList)
  },[suggestionList])

  useEffect(() => {

    let timer = setTimeout(async () => {
      
      console.log(value)

      let res = await ApiRequest("post", `http://localhost:8082/flights/SearchAirports?query=${value.toLowerCase()}`)

      console.log(res)
      setSuggestionList(res);

    }, 500)


    return () => clearTimeout(timer);

  }, [value])




  useEffect(() => {
    console.log("From is triggered")
  }, [from])

  useEffect(() => {
    console.log("To is triggered")
  }, [to])




  let searchflights = async () => {


    if(!userInput.from || !userInput.to){
      
      setIsErr(true);
      setNotification("Airport names can't be empty");
      return; 

    }

    await search({from: userInput.from, to: userInput.to, date: userInput.OutboundDate, totalCount: userInput.totalCount, setAvailflights, setLoading});


    // Getting available dates 
    let data = await ApiRequest("post", `http://localhost:8082/flights/getDates?from=${userInput.from}&to=${userInput.to}`)

    if(data.length > 0) setFlightDates(data);
    else setFlightDates([])

    // setUserInput(prev => {

    //   let updated = {...prev}
    //   updated.loggedIn = true;

    //   return updated
    // })

    setCurrentlyIn("flight");
    navigate("/user/searchResults")
  }


 return (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#c5d9d7] to-[#e6f0ef] font-sans">
    <div className="bg-white p-10 rounded-3xl w-full max-w-5xl shadow-2xl border border-gray-200 flex flex-col gap-10">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight">
        ✈️ Find Your Perfect Flight
      </h1>

      {/* Top Filters: Trip Type + Passenger */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Trip Type */}
        <select className="bg-[#f3f7f7] border border-gray-300 rounded-xl px-5 py-3 font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007b83] hover:bg-[#e8f0f0] transition">
          <option>One Way</option>
          <option>Round Trip</option>
        </select>

        {/* Passenger Count */}
        <button
          className="bg-[#f3f7f7] border border-gray-300 rounded-xl px-5 py-3 font-semibold text-gray-800 shadow-sm flex items-center gap-2 hover:bg-[#e8f0f0] transition"
          onClick={toggleModal}
        >
          <FaUser className="text-[#007b83]" /> {userInput.totalCount} Passenger{userInput.totalCount > 1 ? "s" : ""}
        </button>
      </div>

      {/* Passenger Modal */}
      {Modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={toggleModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-8 rounded-3xl shadow-xl w-80"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={toggleModal}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Select Passengers</h2>

            {[
              ["Adult", userInput.adultcount, "adultcount"],
              ["Child", userInput.childcount, "childcount"],
              ["Infant", userInput.infantcount, "infantcount"],
            ].map(([label, count, setter], i) => (
              <div key={i} className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">{label}</span>
                <div className="flex items-center gap-3">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => decrementCount(setter)}
                  >
                    −
                  </button>
                  <span className="font-semibold text-gray-800">{count}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() =>
                      label === "Infant"
                        ? count < userInput.adultcount
                          ? incrementCount(setter)
                          : showMessage("Only 1 infant per adult")
                        : incrementCount(setter)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {message && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm py-1 px-3 rounded-md shadow-md">
                {message}
              </div>
            )}
          </div>
        </div>
      )}


      {/* Search Fields */}
     {/* From */}

<div className="flex flex-col md:flex-row md:space-x-4">
  {/* From */}
  <div className="flex flex-col relative flex-1 mb-4 md:mb-0">
    <label className="text-xl font-bold text-gray-900 mb-2">From</label>

    <div className="relative">
      {/* FaPlaneDeparture Icon */}
      <FaPlaneDeparture className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007b83]" />

      <input
        type="text"
        value={from}
        onFocus={() => setIsFromFocused(true)}
        onBlur={() => setTimeout(() => setIsFromFocused(false), [200])}
        onChange={(e) => {
          setFrom(e.target.value.toLowerCase());
          setValue(e.target.value);
          setQuery("from");
        }}
        className="w-full rounded-xl border border-gray-300 px-10 py-3 bg-gray-50 font-semibold focus:ring-2 focus:ring-[#007b83]"
        placeholder="Enter city or airport"
      />
    </div>

    {/* Suggestions */}
    {query === "from" && isFromFocused && suggestionList.length > 0 && (
      <ul className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
        {suggestionList.map((obj) => (
          <li
            key={obj.airportId}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
            onClick={() => {
              setFrom(obj.airportName.replace(/"/g, ''));
              setQuery("");
              setSuggestionList([]);
            }}
          >
            {/* Top row */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">
                {obj.city.replace(/"/g, '')}, <span className="text-gray-500">{obj.country.replace(/"/g, '')}</span>
              </span>

              <span className="text-sm font-bold text-gray-400">
                {obj.iata.replace(/"/g, '')}
              </span>
            </div>

            {/* Airport name */}
            <div className="text-xs text-gray-400 mt-1">
              {obj.airportName.replace(/"/g, '')}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>


  {/* To */}
  <div className="flex flex-col relative flex-1 mb-4 md:mb-0">
    <label className="text-xl font-bold text-gray-900 mb-2">To</label>

    <div className="relative">
      {/* FaPlaneArrival Icon */}
      <FaPlaneArrival className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007b83]" />

      <input
        type="text"
        value={to}
        onFocus={() => setIsToFocused(true)}
        onBlur={() => setTimeout(() => { setIsToFocused(false) }, [200])}
        onChange={(e) => {
          setTo(e.target.value.toLowerCase());
          setValue(e.target.value);
          setQuery("to");
        }}
        className="w-full rounded-xl border border-gray-300 px-10 py-3 bg-gray-50 font-semibold focus:ring-2 focus:ring-[#007b83]"
        placeholder="Enter city or airport"
      />
    </div>

    {query === "to" && setIsToFocused && suggestionList.length > 0 && (
      <ul className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
        {suggestionList.map((obj) => (
          <li
            key={obj.airportId}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
            onClick={() => {
              setTo(obj.airportName.replace(/"/g, ''));
              setQuery("");
              setSuggestionList([]);
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">
                {obj.city.replace(/"/g, '')}, <span className="text-gray-500">{obj.country.replace(/"/g, '')}</span>
              </span>

              <span className="text-sm font-bold text-gray-400">
                {obj.iata.replace(/"/g, '')}
              </span>
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {obj.airportName.replace(/"/g, '')}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>


  {/* Date */}
  <div className="flex flex-col flex-none w-full md:w-1/4">
    <label className="text-xl font-bold text-gray-900 mb-2">Date</label>
    <input
      type="date"
      value={userInput.OutboundDate}
      onChange={(e) => setUserInput(prev => ({...prev, OutboundDate: e.target.value }))}
      className="w-full rounded-xl border border-gray-300 px-3 py-3 bg-gray-50 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#007b83] transition"
    />
  </div>
</div>

      {/* Search Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={searchflights}
          className="bg-[#007b83] hover:bg-[#016b73] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Search Flights <FaArrowRight />
        </button>
      </div>

      {/* Notification & Loading */}
      <AppNotification />
      <LoadingAnimation />
    </div>
    </div>
 
);

  }
