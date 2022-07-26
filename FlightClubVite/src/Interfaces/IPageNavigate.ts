import IMemberInfo from "./IMemberInfo";

export interface IPageNavigate {
    numPage:number;
    page:number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    formData: IMemberInfo;
    setFormData: React.Dispatch<React.SetStateAction<IMemberInfo>>;
}