import {React} from "react";
import { AvailFlights } from "./AvailFlights";
import { useApiRequest } from "./useApiRequest";

export function useSearchInDB(){

  let {ApiRequest} = useApiRequest();
  let gateway = import.meta.env.VITE_GATEWAY_URL;

  console.log(gateway)

  let search = async ({from, to, date, totalCount, setAvailflights, availflights}) => {

  let res = await ApiRequest("post", `${gateway}/flights/searchFlight`, {
                departure: from,
                arrival: to,
                depDate: date,
                seats: totalCount,
     
      })  
      
      console.log(res)
      setAvailflights(res)
      
  }

  return {search};
}



