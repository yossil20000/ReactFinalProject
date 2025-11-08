export default interface IClubNotice{
    _id: string;
    title: string;
    description: string;
    issue_date: Date;
    due_date: Date;
    isExpired: boolean;
    isPublic: boolean;
    isAlert: boolean;
}

export const NewNotice : IClubNotice = {
    _id: "",
    title: "Add new Title",
    description: "Add New Message",
    issue_date: new Date(),
    due_date: new Date(),
    isExpired:  false,
    isPublic: false,
    isAlert: false
}

export interface INoticeFilter {
    public: boolean,
    expired: boolean,
    isValid: boolean,
    isAlert: boolean,
    all: boolean
}
export const NewNoticeFilter : INoticeFilter = {
    public: false,
    expired: false,
    isValid: false,
    isAlert: false,
    all: true
}