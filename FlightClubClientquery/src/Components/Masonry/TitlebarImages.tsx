import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import imege1 from '../../Asset/TileBar/IMG-20190715-WA0002.jpg';
import imege2 from '../../Asset/TileBar/IMG-20200222-WA0010.jpg';
import imege3 from '../../Asset/TileBar/IMG-20200221-WA0098.jpg';

export default function TitlebarBelowMasonryImageList() {
  return (
    <Box sx={{ width: "100%", height: 450, overflowY: 'scroll' }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {itemData.map((item) => (
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

const itemData = [
  {
    img: imege1,
    title: 'Yosef And Alex',
    author: 'Yosef Levy',
  },
  {
    img: imege3,
    title: 'Near Haifa',
    author: 'Yosef Levy',
  },
  {
    img: imege2,
    title: 'Moskin',
    author: 'Yosef Levy',
  },
];
