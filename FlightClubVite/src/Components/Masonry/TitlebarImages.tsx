import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Typography } from '@mui/material';

export interface IImageList {
  image: string;
  title: string;
  author: string;

}

export interface ImageListProps {
  imageList: IImageList[]
}
export default function TitlebarBelowMasonryImageList({ imageList }: ImageListProps) {
  return (
    <Box sx={{ width: "100%", height: "50vh"} }>
      <Box><Typography sx={{ height: "4ex", textAlign: "center" }}>Galllery</Typography></Box>
      <Box sx={{ width: "100%", height: "50vh", overflowY: 'scroll' }}>
        <ImageList cols={1} gap={3}>
          {imageList.map((item) => (
            <ImageListItem key={item.image}>
              <img
                src={`${item.image}?w=248&fit=crop&auto=format`}
                srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar position="below" subtitle={item.author} title={item.title} />

            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}


