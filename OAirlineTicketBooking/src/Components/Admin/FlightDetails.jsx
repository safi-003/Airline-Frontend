import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from "react";
import { AdminProviderContext } from "../Contexts/AdminProvider";
import { UserProviderContext } from "../Contexts/UserProvider";
import { AppNotification } from "../AppNotification";
import { EmptyInput } from "../InputValidation/EmptyInput";
import {useApiRequest} from "../useApiRequest.js"

export const FlightDetails = forwardRef((props, ref) => {

let {flight, setFlight, flightClass, setFlightClass} = useContext(AdminProviderContext)

    let {setNotification, setIsErr} = useContext(UserProviderContext)
    let {ApiRequest} = useApiRequest();

    let handleChange = (e) => {

      const {name, value} = e.target;

      e.target.style.border = ""
      e.target.style.backgroundColor = ""
      
      setFlight(prev => ({

        ...prev,
        [name]: name == "totalSeats" || name == "basePrice" ? Number(value) : (name == "departure"  ||
          name == "arrival" ? value.toLowerCase() : value)

      }))  
      
        if(name == "aircraftModel"){
        (async () => {
        let res = await ApiRequest("post", `http://localhost:8082/flights/getFlightCapacity/${value}`)
     
        setFlight(prev => ({
        ...prev,
        "totalSeats" : res,
        "vacant" : res

      }))
      })();
      }
    }

    // Initializing vacant seats when total seats are assigned
    // useEffect(() => {

    //  (async () => {
    //     let res = await ApiRequest("post", `http://localhost:8082/flights/getFlightCapacity/${flight.aircraftModel}`)
     
    //     setFlight(prev => ({
    //     ...prev,
    //     "totalSeats" : res,
    //     "vacant" : res

    //   }))
    //   })();

      

    // }, [flight.aircraftModel])

    useEffect(() => {
    console.log(flightClass)
  }, [flightClass])


    let inputRefs = {

      aircraftModel: useRef(),
            departure: useRef(),
            arrival: useRef(),
            departureTime: useRef(),
            arrivalTime: useRef(),
            basePrice: useRef(),
            // totalSeats: useRef(),
            airlines: useRef(),
            stops: useRef()

    }

    async function validate(){

            let isValid = true;

            const econ = await ApiRequest("post",
            `http://localhost:8082/flights/getFlightClassLayout?aircraft=${flight.aircraftModel}&className=economy`
          );

          const first = await ApiRequest("post",
            `http://localhost:8082/flights/getFlightClassLayout?aircraft=${flight.aircraftModel}&className=first`
          );

          const business = await ApiRequest("post",
            `http://localhost:8082/flights/getFlightClassLayout?aircraft=${flight.aircraftModel}&className=business`
          );

          const classes = [
            { className: "economy", ...econ },
            { className: "business", ...business },
            { className: "first", ...first }
          ];

          // Final React State Update
          setFlightClass(
            classes.map(c => ({
              className: c.className,
              seatCount: c.seats,
              seatsPerRow: c.seatsPerRow,
              layout: c.layout,
              priceMultiplier: "",
              vacant: c.seats
            }))
          );


            // Arrival datetime should be after the departure datetime
            if(new Date(flight.depDateTime) > new Date(flight.arrivalDateTime)){
                setIsErr(true)
                setNotification("Departure date and time should be before the arrival date and time")

                inputRefs.depDateTime.current.style.border = "2px solid red";
                inputRefs.depDateTime.current.style.backgroundColor = "#ffe6e6"

                inputRefs.arrivalDateTime.current.style.border = "2px solid red";
                inputRefs.arrivalDateTime.current.style.backgroundColor = "#ffe6e6";

                return false;
            }
            
            if(EmptyInput(flight, inputRefs)){
                
                setIsErr(true)
                setNotification("Input fields cannot be empty")
                isValid = false;
            }
            
            return isValid;
    }

    useImperativeHandle(ref, () => ({

      validate

    }))

    return(

    <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        ✈️ Flight Details Form
      </h1>

    <AppNotification />
      <form className="space-y-5">
        {/* Airlines */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Airlines</h2>
          <input
            name="airlines"
            ref={inputRefs.airlines}
            onChange={handleChange}
            value={flight.airlines}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter Airlines"
          />
        </div>

        {/* Aircraft Model */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Aircraft Model</h2>

          <select
          onChange={handleChange}
          ref={inputRefs.aircraftModel}
          name="aircraftModel"
          value={flight.aircraftModel}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black transition text-sm">

          <option value="" disabled hidden className="text-gray-500">
            Choose the Aircraft
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="B777-300ER">
            Boeing 777-300ER — Total 354 | F: 8 | J: 42 | Y: 304
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="B777-200LR">
            Boeing 777-200LR — Total 317 | F: 8 | J: 42 | Y: 267
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="B787-9">
            Boeing 787-9 Dreamliner — Total 290 | F: 8 | J: 30 | Y: 252
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="B787-8">
            Boeing 787-8 Dreamliner — Total 254 | F: 8 | J: 20 | Y: 226
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="B747-8i">
            Boeing 747-8 Intercontinental — Total 364 | F: 8 | J: 80 | Y: 276
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="A380">
            Airbus A380-800 — Total 489 | F: 14 | J: 76 | Y: 399
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="A350-900">
            Airbus A350-900 — Total 315 | F: 8 | J: 38 | Y: 269
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="A350-1000">
            Airbus A350-1000 — Total 360 | F: 8 | J: 46 | Y: 306
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="A330-300">
            Airbus A330-300 — Total 300 | F: 8 | J: 34 | Y: 258
          </option>

          <option className="bg-gray-50 hover:bg-gray-100" value="A340-600">
            Airbus A340-600 — Total 380 | F: 8 | J: 56 | Y: 316
          </option>

        </select>

        </div>

        {/* Capacity */}
        {/* <div>
          <h2 className="text-gray-700 mb-1 font-medium">Total Seats</h2>
          <input
            type="number"
            name="totalSeats"
            ref={inputRefs.totalSeats}
            onChange={handleChange}
            value={flight.totalSeats}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Total number of seats"
          />
        </div> */}

         {/* basePrice */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Base Price</h2>
          <input
            type="number"
            name="basePrice"
            ref={inputRefs.basePrice}
            onChange={handleChange}
            value={flight.basePrice}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter the base price for the flight"
          />
        </div>

        {/* Departure Time */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Departure Time</h2>
          <input
            name="departureTime"
            ref={inputRefs.departureTime}
            type="datetime-local"
            onChange={handleChange}
            value={flight.departureTime}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* Arrival Time */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Arrival Time</h2>
          <input
            name="arrivalTime"
            ref={inputRefs.arrivalTime}
            type="datetime-local"
            onChange={handleChange}
            value={flight.arrivalTime}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>


        {/* Departure Airport */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Departure Airport</h2>
          <input
            name="departure"
            ref={inputRefs.departure}
            onChange={handleChange}
            value={flight.departure}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter Departure Location"
          />
        </div>

        {/* Arrival Airport */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Arrival Airport</h2>
          <input
            name="arrival"
            onChange={handleChange}
            ref={inputRefs.arrival}
            value={flight.arrival}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter Arrival Location"
          />
        </div>

        {/* Stops */}
        <div>
          <h2 className="text-gray-700 mb-1 font-medium">Stops</h2>
          <input
            name="stops"
            onChange={handleChange}
            ref={inputRefs.stops}
            value={flight.stops}
            className="w-full border border-black/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter Stops"
          />
        </div>
        
        </form>
        </div>
        </div>

    )
}
)


    