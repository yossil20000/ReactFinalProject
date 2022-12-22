import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, Paper, styled } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import MembersCombo from "../../Components/Members/MembersCombo";
import { useCreateImageMutation } from "../../features/image/imageApiSlice";
import { IImageBase } from "../../Interfaces/API/IImage";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { convertFileTobase64, resizeFileTobase64 } from "../../Utils/files";
const source: string = "CreateImage"

export interface CreateImageDialogProps {
  value: IImageBase;
  onClose: () => void;
  onSave: (value: IImageBase) => void;
  open: boolean;
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
function CreateImageDialog({ value, onClose, onSave, open, ...other }: CreateImageDialogProps) {

  console.log("CreateImageDialog/value", value)

  const [CreateImage, { isError, isLoading, error, isSuccess }] = useCreateImageMutation();
  const [ImageCreate, setImageCreate] = useState<IImageBase>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);


  useEffect(() => {
    console.log("CreateImageDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Image Create", alertMessage: "Image Create Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {

      const validation = getValidationFromError(error,handleOnValidatiobClose);
      setValidationAlert(validation);
      return;
      

    }
  }, [isLoading])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    console.log("PersonalInfo/handleImageChange/file", file);
    if (file) {
      /* const base64 = await convertFileTobase64(file); */
      await resizeFileTobase64(file,500,50).then((result) => {
        console.log("PersonalInfo/handleImageChange/result.filelength", (result as string ).length);
        setImageCreate({ ...ImageCreate, image: result as string });

      }

      ).catch((error) => {
        console.log("PersonalInfo/handleImageChange/error", error);
      }

      )
      /* console.log("PersonalInfo/handleImageChange/base64", base64) */
    }
    
  }
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImageChange", event.target.name, event.target.value)
    setImageCreate(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])
    
  },[])
  const handleOnSave = async () => {
    setValidationAlert([])
    console.log("CreateImageDialog/onSave", ImageCreate)
    
    console.log("CreateImageDialog/onSave/author", ImageCreate.author)

    await CreateImage(ImageCreate as IImageBase).unwrap().then((data) => {
      console.log("CreateImageDialoq/onSave/", data);
      onSave(ImageCreate);
    }).catch((err) => {
      console.log("CreateImageDialoq/onSave/error", err.data.errors);
    });


  }
  
  const onMemberChanged = (item: InputComboItem) => {
    setImageCreate(prev => ({ ...prev, author: item.lable }))
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"

      open={open} {...other}>
      <DialogTitle>Image Create</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
                type={"text"}
                sx={{ marginLeft: "0px", width: "100%" }}
                name="title"
                label="Title"
                value={ImageCreate.title}
                onChange={handleImageChange}
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
                onChange={handleImageChange}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <MembersCombo onChanged={onMemberChanged} source={source}/>
            </Item>
          </Grid>
          <Grid item xs={12}>
          <img src={ImageCreate?.image} alt="My Image" />
        </Grid>
        <Grid item xs={12}>
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

        </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnCancel}>

              Cancle
            </Button></Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnSave}>
              Save
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