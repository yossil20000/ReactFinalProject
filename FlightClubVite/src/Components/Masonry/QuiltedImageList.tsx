import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IImage, { IImageBase, IImageDisplay } from '../../Interfaces/API/IImage';
import { Box, IconButton, ImageListItemBar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}`,

  };
}
export interface QuiltedImageListProps {
  images: IImageDisplay[],
  onEdit: (image: IImageBase) => void,
  onDelete: (image: IImageBase) => void
}
const getRandom = (minNumber: number = 1, maxNumber: number = 2) => {
  return Math.floor(Math.random() * (maxNumber + 1 - minNumber)) + minNumber;
}
export default function QuiltedImageList({ images, onEdit,onDelete }: QuiltedImageListProps) {
  return (
    <ImageList
      sx={{ width: "100%", height: "100%" }}
      variant="quilted"
      cols={2}
      rowHeight={"auto"}
    >
      {images.map((item: IImageDisplay) => {
        const cols: number = getRandom(1, 2);
        const rows: number = getRandom(1, 4);

        return (<ImageListItem key={item._id} cols={cols || 2} rows={cols || 1} sx={{ display: "flex", flexDirection: "column" }}>
          <img

            {...srcset(item.image, 121, cols, cols)}
            alt={item.title}
            loading="lazy"
            width={"100%"}
            height={"100%"}
            
          />
          <ImageListItemBar
            title={item.title}
            subtitle={<span>by: {item.author}</span>}
            position="below"
          />
          <ImageListItemBar
            sx={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, ' +
                'rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.3) 100%)',
            }}

            position="top"
            actionIcon={
              <Box>
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`star ${item.title}`}
                  onClick={() => onEdit(item as IImageBase)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`star ${item.title}`}
                  onClick={() => onDelete(item as IImageBase)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Box>


            }
            actionPosition="left"
          />
        </ImageListItem>
        )
      }
      )}
    </ImageList>
  );
}
