
export function EmptyInput(StateArray, inputRefs, isArr=false){

     let err = false;

     console.log(StateArray)

     Object.entries(inputRefs).forEach(([key, refs]) => {
        
        let element;
        
         console.log(StateArray[key])
        
        if(isArr){

            element = refs.current;
        
        } else {
            element = refs
        }

        if(StateArray && StateArray[key] == "" || StateArray[key] == undefined){

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#ffe6e6";  
                
            err = true;
        }})
        
       return err;
    

}