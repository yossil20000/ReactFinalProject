let mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const Role =require('../Models/role').schema

const SALT_WORK_FACTOR = 10;



const {DateTime} = require('luxon');
const { QuarterType } = require('./constants');

var Schema = mongoose.Schema;
var FlightsSummarySchema = new Schema({
    year: {type: String, require: true},
    quarter: {
        type: [{type: mongoose.Decimal128 ,default: 0, get: getDecimal}],
        default: [0, 0.0, 0.0, 0.0],
        validate: {
          validator: function(v) {
            return v.length === 4 && v.every(val => !isNaN(val)); 
          },
          message: 'Decimal array must have 4 values and all values must be numbers.'
        }
      },
    total: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
},{toJSON: {getters: true}})

var MemberSchema = new Schema({
    member_id: {type: String, required: true },
    id_number: {type: String, required: true ,default: "00000000"},
    family_name: {type: String, required: true },
    first_name: {type: String, required: true },
    contact:{
        billing_address: {
            line1: {type: String},
            line2: {type: String},
            city: {type: String},
            postcode: {type: String},
            province: {type: String},
            state: {type: String}
        },
        shipping_address: {
            line1: {type: String},
            line2: {type: String},
            city: {type: String},
            postcode: {type: String},
            province: {type: String},
            state: {type: String, uppercase:true}
        },
        phone: {
            country:{type: String, default: "972"},
            area: {type: String, default: "054"},
            number: {type: String, default: ""}
        },
        email: {
            type: String,
            lowercase: true ,
            trim: true,
            required: [true,"email not provided"],
            validate:{
                validator: function(v){
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: `{VALUE} is not valid email!`
            }
        }
    },
    
    username: {
        type: String,
         required: true,
         index: {unique:[true , "username already exist in database"]},
        },
    password: {type: String, required: true ,minlength: 8 },
    member_type:{type:String, enum:['Supplier','Member'] , default: 'Supplier'},
    status:{type:String, enum:["Active","Suspended","Removed"], default: "Active"},
    role: {type: Role, _id:false} ,
    date_of_birth: {type: Date, required: true},
    date_of_join: {type: Date, required: true},
    date_of_leave: {type: Date},
    flights_summary: [FlightsSummarySchema],
    flights: [{type: Schema.ObjectId,ref: 'Flight'}],
    flight_reservs: [{type: Schema.ObjectId, ref: 'FlightReservation'}],
    membership: {type: Schema.ObjectId,ref: 'Membership'},
    image: {type: String},
    gender: {type: String, enum:["male","female","other"], default: "other"},
    token_expiresIn: {type: String, default: "3000s"}
},{timestamps: true});

/* MemberSchema.pre('save', function(next) { 
    var user = this;

  // if(!user.isModified('passwors')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt)  {
        if(err) return(next(err));
        bcrypt.hash(user.password, salt, function(err,hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
}); */
function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};

MemberSchema.methods.hash = function(password){
    return bcrypt.hashSync(password,SALT_WORK_FACTOR);
}

MemberSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch)  {
        if(err) {return cb(err);}
        cb(null, isMatch);
    })
};

MemberSchema.virtual('code_area_phone')
.get(function() {
    return `${this.contact.phone.country}${this.contact.phone.area}${this.contact.phone.number}`;
});
MemberSchema.virtual('date_of_birth_formatted')
.get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});

MemberSchema.virtual('date_of_join_formatted')
.get(function () {
    return DateTime.fromJSDate(this.date_of_join).toLocaleString(DateTime.DATE_MED);
});

MemberSchema.virtual('date_of_leave_formatted')
.get(function () {
    return DateTime.fromJSDate(this.date_of_leave).toLocaleString(DateTime.DATE_MED);
});

MemberSchema.virtual('full_name')
.get(function() {
    return `${this.family_name } ${this.first_name}`;
});
module.exports = mongoose.model('Member', MemberSchema);