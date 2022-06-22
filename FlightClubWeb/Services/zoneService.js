const axios = require('axios').default;

const getUtcOffset = async function(timeZone = "Asia/Nicosia"){
    try{
        const response = await axios.get('https://www.timeapi.io/api/TimeZone/zone',{
            params:{
                timeZone: timeZone
            }
        })
        return response.data.currentUtcOffset.seconds;
    }
    catch(error){
        console.log(error);
    }

}

module.exports = {
    getUtcOffset: getUtcOffset
}