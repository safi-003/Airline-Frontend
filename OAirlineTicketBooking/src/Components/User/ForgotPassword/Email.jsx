import React,{ useState } from "react";
import { useApiRequest } from "../../useApiRequest";
import { LoadingAnimation } from "../../LoadAnimation";
import { AppNotification } from "../../AppNotification";

export function Email({email, setEmail, goToOtp}) {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {ApiRequest} = useApiRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let res = await ApiRequest("post", `http://localhost:8084/Users/GenerateOTP/${encodeURIComponent(email.toLowerCase())}`)
    
    setMessage("An OTP has been sent to your email.");
    setLoading(false);

    if(res.status == 200){
      goToOtp();
    }
    

  };

  

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md"
    >
      <LoadingAnimation />
      <AppNotification />

      <h2 className="text-xl font-semibold text-center mb-2">
        Forgot Password
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        Enter your registered email address
      </p>

      {/* EMAIL FIELD */}
      <input
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 mb-4
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Submit"}
      </button>

      

      {message && (
        <p className="text-green-600 text-sm mt-4 text-center">{message}</p>
      )}
    </form>
  </div>
);

}
