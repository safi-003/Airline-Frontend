import React, { useEffect, useContext } from "react";
import { UserInputContext } from "../Contexts/UserInputProvider";
import { useApiRequest } from "../useApiRequest";

export function LoginSuccess(){

    let {setUserInput} = useContext(UserInputContext)
    let {ApiRequest} = useApiRequest();

    useEffect(() => {

      setUserInput(prev => {
        
        let updated = {...prev};

        updated.loggedIn= true;

        return updated;
      })
    

    }, [])


    return(
        <div>
            <h2>Successfully authenticated</h2>
        </div>
    )
}