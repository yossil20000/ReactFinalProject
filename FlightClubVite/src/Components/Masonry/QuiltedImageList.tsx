import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IImage, { IImageDisplay } from '../../Interfaces/API/IImage';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}`,
    
  };
}
export interface QuiltedImageListProps {
  images : IImageDisplay[]
}
const getRandom = (minNumber: number = 1, maxNumber: number =2)=> {
  return Math.floor(Math.random() * (maxNumber + 1 - minNumber )) + minNumber; 
}
export default function QuiltedImageList({images} : QuiltedImageListProps) {
  return (
    <ImageList
      sx={{ width: 500, height: 450 }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {images.map((item) => {
        const cols : number= getRandom(1,2);
        const rows : number= getRandom(1,2);
        
      return   (<ImageListItem key={item.image} cols={cols || 2} rows={rows || 1}>
        <img
          
          {...srcset(item.image, 121, rows, cols)}
          alt={item.title}
          loading="lazy"
        />
      </ImageListItem>
    )  
      }
      )}
    </ImageList>
  );
}
