import React from "react"
import { Router, Routes, Route } from "react-router-dom"
import { Search } from "./Components/SearchFlights"
import { AvailFlights } from "./Components/AvailFlights"
import { AdminProvider } from "./Components/Contexts/AdminProvider"
import { FlightDetails } from "./Components/Admin/FlightDetails"
import { FlightClasses } from "./Components/Admin/FlightClasses"
import { FlightTier } from "./Components/Admin/FlightTiers"
import { UserProvider } from "./Components/Contexts/UserProvider"
import { CreateFlights } from "./Components/Admin/CreateFlight"
import { UserInputProvider } from "./Components/Contexts/UserInputProvider"
import { ProgressBar } from "./Components/ProgressBar"
import { Passengers } from "./Components/Passengers"
import { SeatMap } from "./Components/AirplaneSeats/SeatMap"
import { Bags } from "./Components/Bags"
import { SeatLayout } from "./Components/AirplaneSeats/SeatLayout"
import { Checkout } from "./Components/Checkout"
import { Signup } from "./Components/User/Signup"
import { Login } from "./Components/User/Login"
import { ForgotPassoword } from "./Components/User/ForgotPassword/ForgotPassword"
import { UserProfile } from "./Components/UserProfile"

function App() {

  return (

  // <UserInputProvider>
  //    <UserProvider>
  //   <AdminProvider>  
      <Routes>

      
      <Route element={<UserProfile />}>
        <Route path="/user/SignUp" element={<Signup />}/>
        <Route path="/user/Login" element={<Login />}/>
        <Route path="/user/ForgotPassword" element={<ForgotPassoword />}/>
        
        

        <Route path="/user/search" element={<Search />}/> 
        <Route path="/admin/createFlights/" element={<CreateFlights />}/>
        
        <Route element={<ProgressBar />}>
        
        
        <Route path="/user/searchResults" element={<AvailFlights />}/>
        
        <Route path="/user/PassengerDetails" element={<Passengers />}/>
        <Route path="/user/SeatLayout" element={<SeatLayout />}/>
        <Route path="/user/Bags" element={<Bags />} />
        <Route path="/user/Checkout" element={<Checkout />} />
      </Route> 
      </Route>
      </Routes>     
      // </AdminProvider>
      // </UserProvider>
      // </UserInputProvider>
    
  )
}

export default App
