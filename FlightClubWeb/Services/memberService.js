const Member = require('../Models/member');

const getLastMemberId = async () => {
  try {

    const members = (await Member.find().select("member_id id_number").exec()).map((item) => {
      /* return {member_id: Number(item.member_id),id_number: Number(item.id_number)} */
      return item.member_id
    })
    console.log(members.sort()[members.length-1])
    const current = members.sort()[members.length-1].padStart(9,"0")
    return (Number(current) + 1000).toString().padStart(9,0)
  }
  catch (err) {
    console.error(err)
  }
}
const findMembers = async (membersId) => {

  try {
      const members = await Member.find({_id: {"$in" : membersId}})
      console.log(members);
  } 
  catch(error){
    console.error(error)
  }
}
exports.getLastMemberId = getLastMemberId;
exports.findMembers = findMembers;