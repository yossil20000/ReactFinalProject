export default interface IClubNotice{
    _id: string;
    title: string;
    description: string;
    issue_date: Date;
    due_date: Date;
    isExpired: boolean;
    isPublic: boolean;
}

export const NewNotice : IClubNotice = {
    _id: "",
    title: "Add new Title",
    description: "Add New Message",
    issue_date: new Date(),
    due_date: new Date(),
    isExpired:  false,
    isPublic: false
}

export interface INoticeFilter {
    public: boolean,
    expired: boolean,
    isValid: boolean,
    all: boolean
}
export const NewNoticeFilter : INoticeFilter = {
    public: false,
    expired: false,
    isValid: false,
    all: true
}