import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { useFetchAllImagesQuery } from '../../features/image/imageApiSlice'
import AddIcon from '@mui/icons-material/Add';
import CreateImageDialog from './CreateImageDialog';
import IImage, { IImageBase, IImageDisplay, newImage } from '../../Interfaces/API/IImage';
import QuiltedImageList from '../../Components/Masonry/QuiltedImageList';
import { EAction } from '../../Components/Buttons/ActionButtons';
import MembersCombo from '../../Components/Members/MembersCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { MemberType } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
const source = "GalleryPage/filter"
function GalleryPage() {

  const { data } = useFetchAllImagesQuery();
  const [openPhotoAdd, setOpenPhotoAdd] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IImageBase>(newImage);
  const [selectedAction, setSelectedAction] = useState<EAction>(EAction.ADD)
  const [filter, setFilter] = useState(false);
  const [selectedMember, setSelectedMember] = useState<InputComboItem>()
  const handleAddOnClose = () => {
    setOpenPhotoAdd(false);
  }
  const handleAddImage = (event: React.MouseEvent<HTMLElement>) => {
    CustomLogger.log("GalleryPage/addimage")
    setSelectedAction(EAction.ADD)
    setSelectedImage(newImage)
    setOpenPhotoAdd(true);
  };
  const handleAddOnSave = (value: IImageBase) => {
    //refetch();
    setOpenPhotoAdd(false);
    CustomLogger.log("FlightPage/handleAddOnSave/value", value);

  }
  const onEdit = (image: IImageBase) => {
    CustomLogger.log("GalleryPage/onedit/image", image)
    setSelectedAction(EAction.SAVE)
    setSelectedImage(image)
    setOpenPhotoAdd(true);
  }
  const onDelete = (image: IImageBase) => {
    CustomLogger.log("GalleryPage/onDelete/image", image)
    setSelectedAction(EAction.DELETE)
    setSelectedImage(image)
    setOpenPhotoAdd(true);
  }

  const onMemberChanged = (item: InputComboItem) => {
    setSelectedMember(item)
  }
  const filterImage = useCallback((): IImage[] => {
    if (filter && selectedMember !== undefined) {
      const filtered = data?.data.filter((image) => image.author == selectedMember?.lable)
      CustomLogger.info("GalleryPage/filterImage/filtered", filtered)
      return filtered !== undefined ? filtered : []
    }
    return data?.data === undefined ? [] : data?.data

  }, [data?.data, filter, selectedMember])
  return (
    <>
      <div className='header'>
        <Typography variant="h6" align="center">Gallery</Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box display={'flex'} flexGrow={1}  >
            <MembersCombo onChanged={onMemberChanged} source={source} filter={{
              filter: {
                status: Status.Active, member_type: MemberType.Member
              }
            }} />
            <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { width: 'max-content' } }} control={<Checkbox onChange={() => setFilter(prev => !prev)} name={"isValid"} checked={filter} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label={`Filter ${filterImage().length} / ${data?.data ? data.data.length : 0}`} />
          </Box>

          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button onClick={handleAddImage}>
              <AddIcon />
            </Button>

          </Box>
        </Box>
      </div>
      <div className='main' style={{ overflow: 'auto' }}>
        {openPhotoAdd && <CreateImageDialog onClose={handleAddOnClose} value={selectedImage} open={openPhotoAdd} onSave={handleAddOnSave} action={selectedAction} />}

        <QuiltedImageList images={filterImage()} onEdit={onEdit} onDelete={onDelete} readOnly={false} />
      </div>

    </>

  )
}

export default GalleryPage