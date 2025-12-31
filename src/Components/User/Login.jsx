import React, { useContext, useEffect, useState } from "react";
import loginImg from "../images/loginImg.jpg"; // adjust path
import { LoadingAnimation } from "../LoadAnimation";
import { AppNotification } from "../AppNotification";
import { useApiRequest } from "../useApiRequest";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { HttpStatusCode } from "axios";
import { UserInputContext } from "../Contexts/UserInputProvider";
import { UserProfile } from "../UserProfile";
import { UserProviderContext } from "../Contexts/UserProvider";
import { LoginSuccess } from "./LoginSuccess";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const {ApiRequest} = useApiRequest();
  let nav = useNavigate();
  let {userInput, setUserInput, userProfile, setUserProfile} = useContext(UserInputContext)
  let {setNotification, setIsErr, setLoading} = useContext(UserProviderContext)

  let getUserProfile = async () => {  

    try{

    setLoading(true)
    let res = await ApiRequest("post-with-creds", "http://localhost:8085/Auth/authenticate", {}, false, true)
    console.log(res)

    if(res.status == HttpStatusCode.Ok){

      console.log("In the if block");
      console.log(res.data.Email)
      console.log(res.data.FullName)

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
  } catch(error){

    setIsErr(true)
    setNotification(error)
    
  }

    setLoading(false)
  }
    

  useEffect(() => {
    console.log(userProfile)
  }, [userProfile])

  useEffect(() => {
    console.log(userInput)
  },[userInput])
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password });

    let res = await ApiRequest("post-with-creds", "http://localhost:8085/Auth/verifyCreds", 
      {emailId: email, password: password}, false, true) 
    
    console.log(res)

    if(res && res.status == HttpStatusCode.Ok){

      setUserInput(prev => {
        let updated = {...prev};

        updated.loggedIn = true;

        return updated;
      })
    }
    // call login API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        <LoadingAnimation />
        <AppNotification />

        {/* LEFT - LOGIN FORM */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-8">
            Login to continue to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>  

            {/* Password */}
            <div className="relative w-full mb-4">
            <input
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
            />

            <button
                type="button"
                onClick={() => setViewPassword(prev => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
            >
                {viewPassword ? <IoMdEyeOff size={18} /> : <IoEye size={18} />}
            </button>
            </div>


            {/* Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-6 text-center" onClick={() => nav("/user/SignUp")}>
            Don’t have an account?{" "}
            <span className="text-black font-medium cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="hidden md:block">
          <img
            src={loginImg}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
