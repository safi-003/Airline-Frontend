import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pnr = location.state?.pnr;

  // Edge case: user refreshed page or accessed URL directly
  if (!pnr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            Booking information not found
          </h2>
          <p className="text-gray-600 mb-6">
            Please check your email for booking details or go back to home.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-sky-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
            ✓
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Flight Booked Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Please find your PNR below.
        </p>

        {/* PNR Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl py-4 mb-6">
          <p className="text-sm text-gray-500">PNR Number</p>
          <p className="text-2xl font-mono font-semibold text-gray-900 tracking-widest">
            {pnr}
          </p>
        </div>

        {/* Instructions */}
        <div className="text-left text-gray-700 space-y-3 text-sm mb-8">
          <p>✈️ Please use this PNR for check-in and at the airport counter.</p>
          <p>📧 A confirmation email with your ticket details has been sent.</p>
          <p>🕒 Online check-in usually opens 24 hours before departure.</p>
          <p>🆔 Carry a valid government-issued ID while travelling.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/user/bookings")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/user/search")}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Book Another Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
