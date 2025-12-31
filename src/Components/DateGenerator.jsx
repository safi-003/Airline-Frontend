import React from "react";
import { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSearchInDB } from "./useSearchInDB";
import { UserProviderContext } from "./Contexts/UserProvider";
import { AppNotification } from "./AppNotification";
import { UserInputContext } from "./Contexts/UserInputProvider";

export function DateGenerator() {
  let { 
    // from, to, totalCount, date, setDate, 
    availflights, setAvailflights, datesObj, setDatesObj, flightDates } = useContext(UserProviderContext);

    let {userInput, setUserInput} = useContext(UserInputContext)

  let [visibleDates, setVisibleDates] = useState([]);
  let [firstIdx, setFirstIdx] = useState(0);
  let [lastIdx, setLastIdx] = useState(6);
  let [disableLeft, setDisableLeft] = useState(true);
  let {search} = useSearchInDB();

  const options = { weekday: 'short', day: 'numeric', month: 'short' };

  // Mark dates if flights are available 
  function markDates(d) {

    let final = {
      date: d,
      label: flightDates.some(dateStr => new Date(dateStr).toLocaleDateString("en-CA") === new Date(d).toLocaleDateString("en-CA"))

    }
      return final;
    
    }


  // --- helper functions ---
  function generatePrevDates(date, m) {
    let arr = [];
    
    for (let i = m; i >= 1; i--) {
    
      let temp = new Date(date);
      temp.setDate(temp.getDate() - i);
      let finalDate = markDates(temp);


      arr.push(finalDate);
    }
    return arr;
  }


  function generateFutureDates(date, n) {
    let arr = [];
   
    for (let i = 1; i <= n; i++) {
      
      let temp = new Date(date);
      temp.setDate(temp.getDate() + i);

      let finalDate = markDates(temp);

      arr.push(finalDate);
    }
    return arr;
  }

  // --- initialize ---
  useEffect(() => {
    let userDate = new Date(userInput.OutboundDate);
    let presentDate = new Date();
    let newDates = [];

    let leftDate = new Date(userDate);
    leftDate.setDate(userDate.getDate() - 5);

    console.log(presentDate)
    console.log(leftDate)

    // The previous date
    // while(leftDate < presentDate){

    //   let i = 5;
    //   leftDate.setDate(userDate.getDate() - i)

    // }
    
    // Checking if the before set of dates before the given user date is still in future(should not be in past)
    if (leftDate > presentDate) {
      
      console.log("generating previous daes")
      newDates.push(...generatePrevDates(userDate, 6));
    }

    newDates.push(markDates(userDate));
    // changeDate(userDate); // Add Styling to user selected date
    
    newDates.push(...generateFutureDates(userDate, 14));

    setDatesObj(newDates);
    console.log(firstIdx)
    setVisibleDates(newDates.slice(firstIdx, lastIdx + 1));

    console.log(newDates)

  }, []);


  // --- navigation ---
  let previous = () => {
    if (firstIdx > 0) {
      setFirstIdx(prev => Math.max(prev - 3, 0));
      setLastIdx(prev => prev - 3);
    } else {
      let moreDates = generatePrevDates(datesObj[0], 6);
      setDatesObj(prev => [...moreDates, ...prev]);
    }
  };

  let next = () => {
    if (lastIdx < datesObj.length - 1) {
  
      setFirstIdx(prev => prev + 3);
      setLastIdx(prev => prev + 3);
  
    } else {
  
      let moreDates = generateFutureDates(datesObj[datesObj.length - 1].date, 6);
      setDatesObj(prev => [...prev, ...moreDates]);
    }
  };

  // --- update visible ---
  useEffect(() => {
    if (datesObj.length > 0) {
      setVisibleDates(datesObj.slice(firstIdx, lastIdx + 1));
    }
    setDisableLeft(firstIdx === 0);
  }, [datesObj, firstIdx, lastIdx]);


  // Change the selected date when user clicks on the calendar
  let dateChange = async (selectedDate) => {
    
    console.log("Searching flight for " + userInput.from, userInput.to, userInput.OutboundDate, userInput.totalCount)
    let newDate = new Date(selectedDate).toISOString().split("T")[0]

    setUserInput(prev => ({
      ...prev,
      OutboundDate: newDate
    }))
    // setDate(newDate);
    
    console.log(availflights);
    
    await search({from: userInput.from, to: userInput.to, date: newDate, totalCount: userInput.totalCount, setAvailflights})

    }

  function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}


 return (
  <div className="flex items-center justify-center w-full mt-10">
    {/* Wrapper */}
    <div className="bg-white/90 rounded-3xl shadow-lg border border-[#d6c48b]/40 py-6 px-8 w-[90%] max-w-[1100px] flex items-center justify-between">
      
      {/* LEFT BUTTON */}
      <button
        onClick={previous}
        disabled={disableLeft}
        className="p-3 rounded-full bg-[#f8f5f0] border border-[#d6c48b]/50 shadow hover:bg-[#f0eade] disabled:opacity-40 transition"
      >
        <FaArrowLeft className="text-[#bfa14a]" />
      </button>

      {/* DATES GRID */}
      <div className="grid grid-cols-7 gap-5 flex-1 justify-items-center px-6">
        {visibleDates.map((d, i) => {
          const selected = isSameDay(new Date(userInput.OutboundDate), d.date);
          return (
            <button
              key={i}
              onClick={() => dateChange(d.date)}
              className={`w-[110px] h-[95px] rounded-2xl border-2 text-center flex flex-col justify-center items-center shadow-md transition-all duration-300
                ${
                  selected
                    ? "bg-[#bfa14a] text-white border-[#bfa14a] scale-105"
                    : "bg-[#f9f7f4] text-[#4a4a4a] border-[#d6c48b]/60 hover:bg-[#f3eee8] hover:shadow-lg"
                }`}
            >
              <span className="font-semibold text-sm">
                {d.date.toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <span
                className={`text-lg font-bold ${
                  selected ? "text-white" : "text-gray-800"
                }`}
              >
                {d.date.getDate()}
              </span>
              <span className="text-xs opacity-80 mt-1">
                {d.date.toLocaleDateString("en-GB", { month: "short" })}
              </span>

              {d.label && (
                <span
                  className={`block text-xs font-semibold mt-1 ${
                    selected ? "text-white/90" : "text-teal-600"
                  }`}
                >
                  Available
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={next}
        className="p-3 rounded-full bg-[#f8f5f0] border border-[#d6c48b]/50 shadow hover:bg-[#f0eade] transition"
      >
        <FaArrowRight className="text-[#bfa14a]" />
      </button>
    </div>
  </div>
);


}


