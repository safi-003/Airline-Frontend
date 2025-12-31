import React, { useState } from "react";
import { useApiRequest } from "../useApiRequest";
import { UserProviderContext } from "../Contexts/UserProvider";
import { LoadingAnimation } from "../LoadAnimation";
import { AppNotification } from "../AppNotification";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export function Signup() {

    let {ApiRequest} = useApiRequest();
    const [viewPassword, setViewPassword] = useState(false);
    let navigate = useNavigate();

  const [formData, setFormData] = useState({
    Title: "",
    fullName: "",
    Gender: "",
    emailId: "",
    password: "",
    phoneNumber: ""
  });

  const handleChange = (e) => { 
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    await ApiRequest("post", "http://localhost:8083/Users/SaveLocalUser", formData);
    // call signup API here
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
    
    <LoadingAnimation />
    <AppNotification />
    
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-center text-slate-800">
        Create Account
      </h2>

      <p className="text-center text-sm text-slate-500 mb-6">
        Sign up to continue
      </p>

      {/* Title & Gender */}
      {/* <div className="flex gap-4 mb-4">
        <select
          name="title"
          required
          onChange={handleChange}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
        >
          <option value="">Title</option>
          <option>Mr</option>
          <option>Ms</option>
          <option>Mrs</option>
          <option>Dr</option>
        </select>

        <select
          name="gender"
          required
          onChange={handleChange}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div> */}

      {/* Full Name */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        required
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
      />

      {/* Email */}
      <input
        type="email"
        name="emailId"
        placeholder="Email Address"
        required
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
      />

      {/* Password */}
      <div className="relative w-full mb-4">
        <input
          type={viewPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
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

      {/* Phone Number */}
      {/* <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        required
        onChange={handleChange}
        className="w-full mb-6 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
      /> */}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition duration-300"
      >
        Create Account
      </button>

      {/* Already have account */}
      <div className="text-center mt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <span
          className="font-bold text-slate-800 cursor-pointer hover:underline"
          onClick={() => navigate("/user/Login")}
        >
          Log in
        </span>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-300"></div>
        <span className="px-3 text-sm text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-300"></div>
      </div>

      {/* Continue with Google */}
      <button
        type="button"
        onClick={() =>
          window.location.href =
            "http://localhost:8085/oauth2/authorization/google"
        }
        className="w-full flex items-center justify-center gap-3 border border-slate-300 py-2 rounded-lg font-medium hover:bg-slate-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </form>
  </div>
);

}
