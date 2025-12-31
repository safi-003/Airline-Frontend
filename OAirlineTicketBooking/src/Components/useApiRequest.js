import { useContext } from "react"
import axios from "axios"
import { UserProviderContext } from "./Contexts/UserProvider"

export function useApiRequest(){

let {setNotification, setIsErr, setLoading} = useContext(UserProviderContext)


let ApiRequest = async (method, endpoint, body={}, rethrow = false, returnObj = false ) => {

    try{
        
        setLoading(true)
        let response;

        switch(method.toLowerCase()){
            
            case "post-with-creds":
            response = await axios.post(endpoint, body, {withCredentials: true})
            break;

            case "post":
            response = await axios.post(endpoint, body)
            break;

            case "get":
            response = await axios.get(endpoint)
            break;

            case "put":
            response = await axios.put(endpoint, body)
            break;

            case "delete":
            response = await axios.delete(endpoint)
            break;

            default:
            throw new Error("Unsupported HTTP Method")
        } 
        
        setIsErr(false)
        setNotification("✅ Request Successfull")

        console.log(response)


        if(returnObj) return response
        
        return response.data
    
    } catch(error){
            
            console.error("❌ API Error", error)
            // setIsErr(true)
            
  

             // 1️⃣ Backend responded (4xx / 5xx)
            if(error.response){

                // let status = error.response.status

                setIsErr(true)
                console.log(error)
                setNotification(error.response.data)

            //     if(status === 400) setNotification("⚠️ Bad Request. Please check your input.")
            //     else if (status == 404) setNotification("🚫 Resource not found.")
            //     else if (status == 500) setNotification("💥 Server error. Please try again later.")
            //     else if (status == 415) setNotification("Unsupported Media received")
            //     else {
            // console.log("in the else block")
            // setIsErr(true)
            // setNotification(error.response.data)
            //     }


                if(rethrow) throw error.response.data
              
            // 2️⃣ Request sent, no response  
            } else if (error.request) {

                setIsErr(true)
                setNotification("🌐 Server is not responding. Please try again later ")
            
            } else {
                setIsErr(true)
                setNotification(`⚠️ ${error.message}`)
            }

          


        } finally {
            setLoading(false)
        }
    
}

     return {ApiRequest}

}