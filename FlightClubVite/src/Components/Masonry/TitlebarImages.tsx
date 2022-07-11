import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export interface IImageList{
  img: string;
  title:string;
  author:string;

}

export interface ImageListProps {
    imageList: IImageList[]
}
export default function TitlebarBelowMasonryImageList({imageList} : ImageListProps) {
  return (
    <Box sx={{ width: "100%", height: 450, overflowY: 'scroll' }}>
      <ImageList  cols={1} gap={3}>
        {imageList.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar position="below" title={item.author } />
            <ImageListItemBar position="top" title={item.title } />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}


