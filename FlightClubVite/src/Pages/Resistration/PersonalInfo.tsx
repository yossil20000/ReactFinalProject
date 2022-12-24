/* https://www.youtube.com/watch?v=pfxd7L1kzio */
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IMemberUpdate from '../../Interfaces/IMemberInfo';
import { Gender } from '../../Interfaces/API/IMember';
import FemaleIcon from '@mui/icons-material/Female';
import { resizeFileTobase64 } from '../../Utils/files';
import GenderCombo from '../../Components/Buttons/GenderCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function PersonalInfo({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberUpdate>) {

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    console.log("PersonalInfo/handleImageChange/file", file);
    if (file) {
      /* const base64 = await convertFileTobase64(file); */
      await resizeFileTobase64(file, 300).then((result) => {
        console.log("PersonalInfo/handleImageChange/result", result);
        setFormData({ ...formData, image: result as string });

      }

      ).catch((error) => {
        console.log("PersonalInfo/handleImageChange/error", error);
      }

      )
      /* console.log("PersonalInfo/handleImageChange/base64", base64) */
    }

  }
  const onComboChanged = (item: InputComboItem, prop: string): void => {

    setFormData({ ...formData, [prop]: item.lable });
    console.log("formData", formData)
  }
  const handlePersonChange = (prop: any) => (event: any) => {
    setFormData({ ...formData, [prop]: event.target.value });
    console.log("formData", formData)
  };
  const handleContactChange = (prop: any) => (event: any) => {
    setFormData({ ...formData, contact: { ...formData.contact, [prop]: event.target.value } });
    console.log("formData", formData)
  };
  const handleTimeChange = (newValue: Date | null) => {
    if (newValue === null)
      return;
    setFormData({ ...formData, date_of_birth: newValue });
    console.log("formData", formData)
  };
  const handleemailChange = (prop: any) => (event: any) => {
    setFormData({ ...formData, contact: { ...formData.contact, [prop]: event.target.value } });
    console.log("formData", formData)
  };

  return (
    <div className='main' style={{ width: "99%", margin: "1% auto", overflow: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" component="div" align='center'>
            Personal Info
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Button sx={{ m: 1, width: '90%', margin: "auto" }}
              variant={'outlined'}
              onClick={() => {
                setPage((page) => { return page <= 0 ? numPage - 1 : page - 1 });
              }}>
              Previous
            </Button>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Button sx={{ m: 1, width: '90%', margin: "auto" }}
              variant={'outlined'}
              onClick={() => {
                setPage(page + 1 == numPage ? 0 : page + 1);
              }}>
              Next
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="email"
              label="Email"
              value={formData.contact.email}
              onChange={handleemailChange("email")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="member_id"
              label="MemberID"
              value={formData.member_id}
              onChange={handlePersonChange("member_id")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="family_name"
              label="Family Name"
              value={formData.family_name}
              onChange={handlePersonChange("family_name")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handlePersonChange("first_name")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <MobileDatePicker
                label="Date Of Birth"
                inputFormat="MM/dd/yyyy"
                value={formData.date_of_birth}
                onChange={handleTimeChange}
                renderInput={(params) =>
                  <TextField sx={{ width: "100%", margin: "auto" }} {...params} />}
              />
            </LocalizationProvider>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <GenderCombo onChanged={(item) => onComboChanged(item, "gender")} source={"gender"} selectedItem={{ lable: formData?.gender === undefined ? "" : formData?.gender.toString(), _id: "", description: "" }} />
        </Grid>
        <Grid item xs={12}>
          <img src={formData?.image} alt="My Image" />
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
              onChange={(e) => handleImageChange(e)}
            />
          </Button>

        </Grid>
      </Grid>
    </div>

  )
}

export default PersonalInfo


