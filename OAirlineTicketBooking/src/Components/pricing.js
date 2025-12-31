import { FormatPrice } from "./HelperFunctions/formatPrice";

export function pricing(flightObj, className, calculateTierPrice = false, tierName="" ){

    if(calculateTierPrice){return}

    let basePrice = flightObj.basePrice;
    let priceMultiplier = ""

    flightObj.flightClassList.map((clsObj) => {

        if(clsObj.className == className){
            priceMultiplier = clsObj.priceMultiplier
        }
    })

    let finalPrice = FormatPrice((Number(basePrice) * Number(priceMultiplier))).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
    })

    return FormatPrice(finalPrice)



}