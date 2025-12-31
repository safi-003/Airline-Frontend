import React from 'react'
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import { UserInputProvider } from './Components/Contexts/UserInputProvider.jsx'
import { UserProvider } from './Components/Contexts/UserProvider.jsx'
import { AdminProvider } from './Components/Contexts/AdminProvider.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  
  
//   <React.StrictMode>
    <BrowserRouter>
      <UserInputProvider>
        <UserProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </UserProvider>
      </UserInputProvider>
    </BrowserRouter>
//   </React.StrictMode>
);
