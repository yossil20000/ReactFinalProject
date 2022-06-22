const axios = require('axios').default;
let url = "https://api.coincap.io/v2/assets/";

function loadApi(url) {
   return   axios.get(url).then(function(response) {
        //console.log(response.data.data);
        //return JSON.parse(response.data);

        return response.data.data;
    }).catch(function(error) {
        console.log(error);
    });
}
//loadApi(url);
module.exports = loadApi;