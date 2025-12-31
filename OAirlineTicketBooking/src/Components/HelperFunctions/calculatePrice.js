
export function CalculatePrice(flight, tierName, cn, flightClass, indicator=""){

    
    let classObj = flightClass.find((obj) => obj.className.toUpperCase() == cn.toUpperCase())

    let className = classObj.className;
    let tierPrice;
    let baseTier = false;

    // Indicator will be used to set dynamic pricing based on kms, date and day etc
    // but when no indicator is given(for small systems), prices are set manually
    if(!indicator){

       if(className.toUpperCase() == "ECONOMY"){

            switch(tierName.toUpperCase()){

            case "VALUE":
                tierPrice = 1314
                 baseTier = false
                break

            case "COMFORT":
                  tierPrice = 3214
                   baseTier = false
                  break

            case "DELUXE":
                  tierPrice = 5315
                  baseTier = false
                  break

            default:
                tierPrice = 0;
                baseTier = true
        }

        } else if(className == "BUSINESS"){

            switch(tierName){

                case "DELUXE":
                      tierPrice = 14535
                      baseTier = false
                      break

                default: 
                     tierPrice = 0;
                     baseTier = true

            }
        
        } else {

            switch(tierName){

                case "DELUXE":
                      tierPrice = 29337
                       baseTier = false
                      break

                default: 
                     tierPrice = 0;
                     baseTier = true

            }
        }
    }


    // let price =  ((Number(flight.basePrice) * Number(classObj.priceMultiplier)) + Number(tierPrice)).toLocaleString('en-IN', {
    //     style: 'currency',
    //     currency: 'INR'
    // }) 

     let price =  (Number(tierPrice)).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
    }) 


    return baseTier ? price : `+${price}`
    


}