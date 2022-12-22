import { Box, Button } from '@mui/material';
import React, { useState } from 'react'
import { useFetchAllImagesQuery } from '../../features/image/imageApiSlice'
import AddIcon from '@mui/icons-material/Add';
import CreateImageDialog from './CreateImageDialog';
import { IImageBase, newImage } from '../../Interfaces/API/IImage';
import QuiltedImageList from '../../Components/Masonry/QuiltedImageList';
function GalleryPage() {
  const {data} = useFetchAllImagesQuery();
  const [openPhotoAdd, setOpenPhotoAdd] = useState(false);
  
  
  const handleAddOnClose = () => {
    setOpenPhotoAdd(false);
  }
  const handleAddImage = (event: React.MouseEvent<HTMLElement>) => {
    console.log("GalleryPage/addimage")
    setOpenPhotoAdd(true);
  };
  const handleAddOnSave = (value: IImageBase) => {
    //refetch();
    setOpenPhotoAdd(false);
    console.log("FlightPage/handleAddOnSave/value", value);

  }
  return (
    <>
      <div className='header'>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box></Box>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button onClick={handleAddImage}>
            <AddIcon/>
            </Button>
 
          </Box>
        </Box>
      </div>
      <div className='main' style={{ overflow: 'auto' }}>
      {openPhotoAdd && <CreateImageDialog onClose={handleAddOnClose} value={newImage} open={openPhotoAdd} onSave={handleAddOnSave} />}
        {data?.data ? data.data.length : 0 }
        <QuiltedImageList images={data?.data === undefined ? [] : data?.data}/>
      </div>

    </>

  )
}

export default GalleryPage