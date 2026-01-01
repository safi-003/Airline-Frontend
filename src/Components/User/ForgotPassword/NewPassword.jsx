import React,{ useState, useContext } from "react";
import { LoadingAnimation } from "../../LoadAnimation";
import { UserProviderContext } from "../../Contexts/UserProvider";
import { AppNotification } from "../../AppNotification";
import { useApiRequest } from "../../useApiRequest";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

export function NewPassword({email}){
    
  let {setNotification, setIsErr} = useContext(UserProviderContext)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasError, setHasError] = useState(false)
  const [errDesc, setErrDesc] = useState("")
  const [viewPassword, setViewPassword] = useState(false)
  const {ApiRequest} = useApiRequest();
  let gateway = import.meta.env.VITE_GATEWAY_URL;
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setIsErr(true)
      setNotification("Both fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsErr(true)
      setNotification("Passwords do not match");
      return;
    }

    try{

        setHasError(false)

        await ApiRequest("post", `${gateway}/Users/ForgotPassword`, 
        {emailId: email, 
        password: newPassword,
        confirmPassword: confirmPassword
        }, true )

        console.log("Password updated")

    } catch(err){

        setHasError(true)
        setErrDesc(err)
        console.log(err)

    }

    
    // setError("");
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <LoadingAnimation />
      <AppNotification />
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Create New Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Password must be within 8 to 30 characters and 
          must contain at least one uppercase, one lowercase, one digit, and one special character
        </p>

        {hasError &&  
        <p className="text-red-500">
            {errDesc}
        </p>}

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type={viewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className = {`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition
            ${hasError ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500" 
                       : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"}`}
          />
          <button
            type="button"
            onClick={() => setViewPassword(prev => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
            >
            {viewPassword ? <IoMdEyeOff size={18} /> : <IoEye size={18} />}
            </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type={viewPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className = {`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition
            ${hasError ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500" 
                       : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"}`}
          />
            <button
            type="button"
            onClick={() => setViewPassword(prev => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
            >
            {viewPassword ? <IoMdEyeOff size={18} /> : <IoEye size={18} />}
            </button>
        </div>


        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white
                     font-medium hover:bg-indigo-700 transition
                     shadow-md"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

