
export interface IPageNavigate<T,U> {
    numPage:number;
    page:number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    formNotify: U;
    setFormNotify: React.Dispatch<React.SetStateAction<U>>;
}