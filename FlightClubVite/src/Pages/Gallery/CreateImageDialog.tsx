import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, Paper, styled, FormControlLabel, Checkbox } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { EAction } from "../../Components/Buttons/ActionButtons";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import MembersCombo from "../../Components/Members/MembersCombo";
import { useCreateImageMutation, useDeleteImageMutation, useUpdateImageMutation } from "../../features/image/imageApiSlice";
import IImage, { IImageBase } from "../../Interfaces/API/IImage";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { resizeFileTobase64 } from "../../Utils/files";
const source: string = "CreateImage"

export interface CreateImageDialogProps {
  value: IImageBase;
  onClose: () => void;
  onSave: (value: IImageBase) => void;
  open: boolean;
  action: EAction
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

let transitionAlertInitial: ITransitionAlrertProps = {
  severity: "success",
  alertTitle: "Create Image",
  alertMessage: "Operation succeed",
  open: false,
  onClose: () => { }
}
function CreateImageDialog({ value, onClose, onSave, open, action, ...other }: CreateImageDialogProps) {

 

  const [CreateImage, { isError, isLoading, error, isSuccess }] = useCreateImageMutation();
  const [UpdateImage] = useUpdateImageMutation();
  const [DeleteImage] = useDeleteImageMutation();
  const [ImageCreate, setImageCreate] = useState<IImage>(value as IImage);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);


  useEffect(() => {
    console.log("CreateImageDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Image Create", alertMessage: "Image Create Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {

      const validation = getValidationFromError(error, handleOnValidatiobClose);
      setValidationAlert(validation);
      return;


    }
  }, [isLoading])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    console.log("PersonalInfo/handleImageUpload/file", file);
    if (file) {
      /* const base64 = await convertFileTobase64(file); */
      await resizeFileTobase64(file, 500, 50).then((result) => {
        console.log("PersonalInfo/handleImageUpload/result.filelength", (result as string).length);
        setImageCreate({ ...ImageCreate, image: result as string });

      }

      ).catch((error) => {
        console.log("PersonalInfo/handleImageUpload/error", error);
      }

      )
      /* console.log("PersonalInfo/handleImageChange/base64", base64) */
    }

  }
  const handleIInputChange = (event: React.ChangeEvent<HTMLInputElement>, isBool: boolean = false) => {
    console.log("handleIInputChange",ImageCreate, event.target.name, event.target.checked, event.target.type,event.target.type == "checkbox" ?  event.target.checked : event.target.value )
    let value : any;
    if(event.target.type == "checkbox")
    {
      console.log("handlePublicChange/ischeckbox")
      value = event.target.checked
    }
    else{
      event.target.value
    }
    setImageCreate({
      ...ImageCreate,
      [event.target.name]: value ,
    });
  };
 
  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    setValidationAlert([])
    console.log("CreateImageDialog/onSave", ImageCreate)

    console.log("CreateImageDialog/onSave/author", ImageCreate.author)
    if(action === EAction.ADD){
      await CreateImage(ImageCreate as IImageBase).unwrap().then((data) => {
        console.log("CreateImageDialoq/onSave/", data);
        onSave(ImageCreate);
      }).catch((err) => {
        console.log("CreateImageDialoq/onSave/error", err.data.errors);
      });
    }
    else if(action === EAction.SAVE){
      await UpdateImage(ImageCreate as IImage).unwrap().then((data) => {
        console.log("CreateImageDialoq/onUpdate/", data);
        onSave(ImageCreate);
      }).catch((err) => {
        console.log("CreateImageDialoq/onUpdate/error", err.data.errors);
      });
    }
    else if(action === EAction.DELETE){
      await DeleteImage((ImageCreate as IImage)._id).unwrap().then((data) => {
        console.log("CreateImageDialoq/onUpdate/", data);
        onSave(ImageCreate);
      }).catch((err) => {
        console.log("CreateImageDialoq/onUpdate/error", err.data.errors);
      });
    }



  }
  const onMemberChanged = (item: InputComboItem) => {
    setImageCreate(prev => ({ ...prev, author: item.lable }))
  }
  const getDialogTitle = () => {
    switch (action) {
      case EAction.ADD:
        return "New Image";
      case EAction.SAVE:
        return "Update Image";
      default:
        return "Delete Image"
    }
  }
  const getDialogActionTitle = () => {
    switch (action) {
      case EAction.ADD:
        return "Create";
      case EAction.SAVE:
        return "Update";
      default:
        return "Delete"
    }
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"

      open={open} {...other}>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          {action === EAction.DELETE ? null : (
            <>
              <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
                <Item>
                  <TextField
                    type={"text"}
                    sx={{ marginLeft: "0px", width: "100%" }}
                    name="title"
                    label="Title"
                    value={ImageCreate.title}
                    onChange={handleIInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
                <Item>
                  <TextField
                    disabled
                    type={"text"}
                    sx={{ marginLeft: "0px", width: "100%" }}
                    name="author"
                    label="Author"
                    value={ImageCreate.author}
                    onChange={handleIInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                <Item>
                  <MembersCombo onChanged={onMemberChanged} source={source} />
                </Item>
              </Grid>
            </>

          )}


          <Grid item xs={12}>
            <img src={ImageCreate?.image} alt="My Image" />
          </Grid>
          {action === EAction.DELETE ? null : (
            <>
                        <Grid item xs={8}>
              <Button
                variant="contained"
                component="label"
              >
                Upload File
                <input
                  hidden
                  type="file"
                  name='image'
                  id='file-upload'
                  accept='.jpg, .png , .jpg'
                  onChange={(e) => handleImageUpload(e)}
                />
              </Button>
              <Grid item xs={4}>
              <FormControlLabel control={<Checkbox onChange={handleIInputChange} name={"public"} checked={ImageCreate.public} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label={`Public`} />
              </Grid>
            </Grid></>

          )}

          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnCancel}>
              Cancle
            </Button></Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnSave}>
              {getDialogActionTitle()}
            </Button></Item>
          </Grid>
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default CreateImageDialog;