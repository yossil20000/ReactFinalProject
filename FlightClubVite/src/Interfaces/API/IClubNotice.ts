export default interface IClubNotice{
    "_id": string;
    "title": string;
    "description": string;
    "issue_date": Date;
    "due_date": Date;
}

export const NewNotice : IClubNotice = {
    _id: "",
    title: "",
    description: "",
    issue_date: new Date(),
    due_date: new Date()
}