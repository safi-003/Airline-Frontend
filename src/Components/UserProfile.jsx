import React, { useContext, useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { UserInputContext } from "./Contexts/UserInputProvider";
import { Outlet } from "react-router-dom";
import { useApiRequest } from "./useApiRequest";
import { HttpStatusCode } from "axios";
import { UserProviderContext } from "./Contexts/UserProvider";

export function UserProfile(){

    let {userInput, setUserInput, userProfile, setUserProfile} = useContext(UserInputContext);
    let {setLoading} = useContext(UserProviderContext)
    let loggedIn = userInput.loggedIn
    let {ApiRequest} = useApiRequest();
    let [confirmLogout, setConfirmLogout] = useState(false)
    // let nav = useNavigate();

    let profile = () => {
        window.open("/user/SignUp", "_blank");
    }

    useEffect(() => {
      console.log(userProfile)
    }, [userProfile])

    useEffect(() => {
      console.log(userInput)
    }, [userInput])

    console.log(userProfile)


    // Logout
    let handleLogout = async () => {

      // Sending LOGOUT Request
      let res = await ApiRequest("post-with-creds", "http://localhost:8083/Users/logout",{}, false, true);
     
      // If request is successfull
      if(res && res.status == HttpStatusCode.Ok){

         setLoading(true)

        // Making logged in false for user input
        setUserInput(prev => {
          let updated = {...prev};

          updated.loggedIn = false;

          return updated;
        })

        // Making profile details empty
        setUserProfile({
          
            email: "",
            fullName: ""
        
        });

      }

      setLoading(false)
      setConfirmLogout(false);
    }


    useEffect(() => {
    
        (async () => {
    
        
        let res = await ApiRequest("post-with-creds", "http://localhost:8085/Auth/authenticate", {}, false, true)
        console.log(res)
    
         if(res && res.status == HttpStatusCode.Ok){
          setUserProfile({
          
            email: res.data.Email,
            fullName: res.data.FullName
        
          });

          setUserInput(prev => {
            
            let updated = {...prev};
    
            updated.loggedIn= true;
    
            return updated;
          })

        }
        })()
        
    
        }, [])


  return (
  <>
    {/* Top bar */}
    <div className="w-full flex items-center justify-end px-6 py-4">
  <div className="flex items-center justify-end min-w-[120px]">
    {loggedIn ? (
      <div className="relative group flex items-center">
        {/* Profile icon */}
        <div className="flex items-center gap-2 font-bold text-lg cursor-pointer">
          <VscAccount size={22} />
        </div>

        {/* Dropdown */}
        <div
          className="
            absolute right-0 top-full mt-3 w-56
            bg-white rounded-xl shadow-lg border
            opacity-0 invisible
            group-hover:opacity-100 group-hover:visible
            transition-all duration-200
            z-50
          "
        >
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-gray-800">
              {userProfile.fullName}
            </p>
            <p className="text-sm text-gray-500 break-all">
              {userProfile.email}
            </p>
          </div>

          <div className="flex flex-col">
            <button className="px-4 py-2 text-left text-sm hover:bg-gray-100">
              View Bookings
            </button>
            <button
              onClick={() => setConfirmLogout(true)}
              className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div
        onClick={profile}
        className="flex items-center gap-2 font-bold text-lg cursor-pointer"
      >
        <span>Log in</span>
      </div>
    )}
  </div>
</div>

{confirmLogout && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    
    {/* Modal box */}
    <div className="bg-white rounded-xl shadow-lg w-[320px] p-6">

      <h2 className="text-lg font-semibold text-gray-800">
        Confirm Logout
      </h2>

      <p className="text-sm text-gray-600 mt-2">
        Do you want to logout?
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setConfirmLogout(false)}
          className="px-4 py-2 rounded-md border text-sm hover:bg-gray-100"
        >
          No
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
        >
          Yes
        </button>

      </div>
    </div>
  </div>
)}


    {/* Page content */}
    <Outlet />
  </>
);
  
}