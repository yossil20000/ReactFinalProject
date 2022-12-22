import Resizer from "react-image-file-resizer";

export function convertFileTobase64(file: any)  {
  return new Promise((resolve,reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}


export const resizeFileTobase64 = (file: any,maxWidth: number,quality: number = 100) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxWidth,
      "JPEG",
      quality,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });