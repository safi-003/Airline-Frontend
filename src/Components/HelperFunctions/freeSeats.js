
export function FreeSeats(classObj,  AvailSeatsInFlight, part = 1, percent = 0.25, endOfCabin = false){
// totalRows, layout,

    // This function takes all the available seats in flight and from the class Object,
    // Which has all the zone info (Front, Mid, Rear) on the cabin,
    // From the rear cabin it takes the last 25% by default and from the 25%
    // it checks which seats are available and makes their price free

    console.log(classObj)
    console.log(AvailSeatsInFlight)

    // It uses recursion, if the last 25% is not avail then gov to the next 25% above till,
    // the rear cabin is all full
    // The below condition checks that
    if((part * percent) >= 1) endOfCabin = true

    // Selecting last 25% of total rows
    let totalRows = Math.ceil(classObj.seats/classObj.seatsPerRow)
    let layout = classObj.layout
    let freeRows = Math.ceil(totalRows * percent);
    // let rowNum = totalRows - (freeRows*part) - 1;
    let rowNum = totalRows - (freeRows*part);
    let char = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let charArr = [...char];

    let windowSeatsArr = []
    let middleSeatsArr = []
    let aisleSeatsArr = []

    console.log(totalRows)
    console.log(freeRows)
    console.log(rowNum)

    Array.from({length:freeRows}).map(() => {
        let cols = 0;
        rowNum++;

        // When return is used in a map,
        // it only return undefined for that index,
        // it does not skip the entire iteration
        
        if((classObj.bassinetRows.includes(rowNum)) ||
        (classObj.exitRows.includes(rowNum)) ||
        (classObj.extraLegroomRows.includes(rowNum))) return;


    layout.map((rowSize, layoutIndex) => {
     

        Array.from({ length: rowSize }).map((_, colIndex) => {
               cols++;

            let seatId = `${rowNum}${charArr[cols]}`
            // console.log(seatId)

            if(cols == 1 || ((layout.length == layoutIndex + 1) && (colIndex+1 == rowSize))) windowSeatsArr.push(seatId)
            else if((colIndex == 0 && layoutIndex != 0 ) || ((colIndex == rowSize-1) && (layout.length > layoutIndex + 1))) aisleSeatsArr.push(seatId)
            else middleSeatsArr.push(seatId)

        })
    })
    })

    console.log(middleSeatsArr)

    // PRIORITY 1: Middle seats
    let final = middleSeatsArr.filter((seat) => AvailSeatsInFlight.includes(seat))
    console.log(final)
    if(final.length > 1) return final;
    console.log("Still in")

    // PRIORITY 2: Aisle seats
    final = aisleSeatsArr.filter((seat) => AvailSeatsInFlight.includes(seat))
    if(final.length > 1) return final;

    // PRIORITY 3: Window seats
    final = windowSeatsArr.filter((seat) => AvailSeatsInFlight.includes(seat))
    if(final.length > 1) return final;

    // If we have checked till the top part of the cabin, then return false
    if(endOfCabin) return [];

    // Recurse to move to the above part
    return FreeSeats(classObj, AvailSeatsInFlight, part+1) ;

}