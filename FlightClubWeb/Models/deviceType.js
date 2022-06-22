var mongoose = require('mongoose');

Schema = mongoose.Schema;

var DeviceTypeSchema = new Schema({
    name: {type: String, unique: true, minLength:5 , required:true},
    category: {type: String, enum:["Airplane","Rotorcraft","FDT"], required: true,default: "Airplane"},
    class:
        {
            engien: {type:String, enum:["SingleEngien",'Multiengien']},
            surface: {type:String, enum:["Land",'Sea']}
        }
    ,
    description: {type: String, maxLength: 200}
});

const newLocal = 'DeviceType';
module.exports = mongoose.model(newLocal, DeviceTypeSchema);