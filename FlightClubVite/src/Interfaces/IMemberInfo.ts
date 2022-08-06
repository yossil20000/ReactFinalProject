
export default interface IMemberInfo{
    _id:string;
    member_id: string
    family_name: string
    first_name: string
    contact:{
        billing_address: {
            line1: string
            line2: string
            city: string
            postcode: string
            province: string
            state: string
        },
        shipping_address: {
            line2: string
            line1: string
            city:  string
            postcode: string
            province: string
            state: string
        },
        phone: {
            country:string
            area: string
            number: string
        },
        email: string
    },
    date_of_birth?: Date;
    password:string;
}