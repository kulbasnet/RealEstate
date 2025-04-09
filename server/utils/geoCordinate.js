const axios = require('axios')
const geoCordinate = async(locationName)=>{
    try{
        const API_KEY = process.env.OPENCAGE_API_KEY;
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`,{
            params:{
                q: locationName,
                key: API_KEY
            }
        });

        if(response.data.results.length>0){
            const {lat,lng} = response.data.results[0].geometry;
            return {lat,lng};
        }else{
            throw new Error("Location not found");
        }

    }catch(error){
        console.error("Erorr fetching coordinates", error); 
        return null;

    }

}

module.exports={geoCordinate};