import { Box, Button } from '@mui/material';
import React, { useState } from 'react'
import { useFetchAllImagesQuery } from '../../features/image/imageApiSlice'
import AddIcon from '@mui/icons-material/Add';
import CreateImageDialog from './CreateImageDialog';
import { IImageBase, IImageDisplay, newImage } from '../../Interfaces/API/IImage';
import QuiltedImageList from '../../Components/Masonry/QuiltedImageList';
import { EAction } from '../../Components/Buttons/ActionButtons';
function GalleryPage() {
  const { data } = useFetchAllImagesQuery();
  const [openPhotoAdd, setOpenPhotoAdd] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IImageBase>(newImage);
  const [selectedAction, setSelectedAction] = useState<EAction>(EAction.ADD)

  const handleAddOnClose = () => {
    setOpenPhotoAdd(false);
  }
  const handleAddImage = (event: React.MouseEvent<HTMLElement>) => {
    console.log("GalleryPage/addimage")
    setSelectedAction(EAction.ADD)
    setSelectedImage(newImage)
    setOpenPhotoAdd(true);
  };
  const handleAddOnSave = (value: IImageBase) => {
    //refetch();
    setOpenPhotoAdd(false);
    console.log("FlightPage/handleAddOnSave/value", value);

  }
  const onEdit = (image: IImageBase) => {
    console.log("GalleryPage/onedit/image", image)
    setSelectedAction(EAction.SAVE)
    setSelectedImage(image)
    setOpenPhotoAdd(true);
  }
  const onDelete = (image: IImageBase) => {
    console.log("GalleryPage/onDelete/image", image)
    setSelectedAction(EAction.DELETE)
    setSelectedImage(image)
    setOpenPhotoAdd(true);
  }
  
  return (
    <>
      <div className='header'>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box></Box>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button onClick={handleAddImage}>
              <AddIcon />
            </Button>

          </Box>
        </Box>
      </div>
      <div className='main' style={{ overflow: 'auto' }}>
        {openPhotoAdd && <CreateImageDialog onClose={handleAddOnClose} value={selectedImage} open={openPhotoAdd} onSave={handleAddOnSave} action={selectedAction} />}
        {data?.data ? data.data.length : 0}
        <QuiltedImageList images={data?.data === undefined ? [] : data?.data} onEdit={onEdit} onDelete={onDelete}/>
      </div>

    </>

  )
}

export default GalleryPage