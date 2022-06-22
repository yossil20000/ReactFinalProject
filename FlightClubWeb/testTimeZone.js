const zoneService = require('./Services/zoneService');
const timeZone = 'Asia/Nicosia';
let zoneOffset = zoneService.getUtcOffset(timeZone);


(
    async () =>{
        zoneOffset = await zoneService.getUtcOffset(timeZone);
        console.log(`${timeZone} UtcOffset: ${zoneOffset}`);
    }
)()
console.log(`${timeZone} UtcOffset: ${zoneOffset}`);