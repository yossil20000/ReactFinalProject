
export interface IPageNavigate<T> {
    numPage:number;
    page:number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
}