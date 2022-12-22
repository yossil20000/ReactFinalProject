export interface IImageBase {
  title: string;
  author: string;
  image: string;
  public: boolean;
}
export default interface IImage extends IImageBase  {
  _id: string;
}
export interface IImageDisplay extends IImage {
  cols?: number;
  rows?: number;

}

export const newImage : IImageBase = {
  title: "",
  author: "",
  image: "",
  public: false
  
}
