import {React} from "react";
import { AvailFlights } from "./AvailFlights";
import { useApiRequest } from "./useApiRequest";

export function useSearchInDB(){

  let {ApiRequest} = useApiRequest();

  let search = async ({from, to, date, totalCount, setAvailflights, availflights}) => {

  let res = await ApiRequest("post", "http://localhost:8082/flights/searchFlight", {
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



