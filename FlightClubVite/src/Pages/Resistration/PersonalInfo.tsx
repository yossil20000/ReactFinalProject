/* https://www.youtube.com/watch?v=pfxd7L1kzio */
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IMemberUpdate from '../../Interfaces/IMemberInfo';
import { resizeFileTobase64 } from '../../Utils/files';
import GenderCombo from '../../Components/Buttons/GenderCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: 'none'
}));


function PersonalInfo({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberUpdate>) {
  CustomLogger.info("PersonalInfo/formData", formData , formData.date_of_birth)
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    CustomLogger.info("PersonalInfo/handleImageChange/file", file);
    if (file) {
      /* const base64 = await convertFileTobase64(file); */
      await resizeFileTobase64(file, 300).then((result) => {
        CustomLogger.info("PersonalInfo/handleImageChange/result", result);
        setFormData({ ...formData, image: result as string });
      }
      ).catch((error) => {
        CustomLogger.error("PersonalInfo/handleImageChange/error", error);
      }
      )
    }
  }
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setFormData({ ...formData, [prop]: item.label });
    CustomLogger.info("PersonalInfo/onComboChanged/formData", formData)
  }
  const handlePersonChange = (prop: any) => (event: any) => {
    setFormData({ ...formData, [prop]: event.target.value });
    CustomLogger.info("PersonalInfo/handlePersonChange/formData", formData)
  };

  const handleTimeChange = (newValue: Date | null) => {
    if (newValue === null)
      return;
    setFormData({ ...formData, date_of_birth: newValue });
    CustomLogger.info("PersonalInfo/handleTimeChange/formData", formData)
  };
  const handleemailChange = (prop: any) => (event: any) => {
    setFormData({ ...formData, contact: { ...formData.contact, [prop]: event.target.value } });
    CustomLogger.info("PersonalInfo/handleemailChange/formData", formData)
  };


  const handlePhoneChange = (prop: any) => (event: any) => {
    setFormData(prev => ({ ...prev, contact: { ...prev.contact, phone: { ...prev.contact.phone, [prop]: event.target.value } } }));
    CustomLogger.info("PersonalInfo/handleemailChange/formData", formData)
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
              disabled={formData._id == "" ? false : true}
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
              disabled={formData._id == "" ? false : true}
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
            <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
              <MobileDateTimePicker
                label="Date Of Birth"
                views={['year', 'month', 'day']}
                value={DateTime.fromJSDate(formData.date_of_birth ? new Date(formData.date_of_birth) : new Date())}
                onChange={(e) => { handleTimeChange(e ? e.toJSDate() : new Date()) }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 4 }}>
            <Grid item xs={4}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Phone: {`+${formData?.contact?.phone.country}${formData?.contact?.phone.area.replace(/^0+/, '')}${formData?.contact?.phone.number}`}</Typography>
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handlePhoneChange("country")} id="country" label="Country"
                name="contact.phone.country" placeholder="Country Code" variant="standard"
                value={formData?.contact?.phone.country} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handlePhoneChange("area")} id="area" label="Area"
                name="contact.phone.area" placeholder="Area code" variant="standard"
                value={formData?.contact?.phone.area} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth onChange={handlePhoneChange("number")} id="number" label="Number"
                name="contact.phone.number" placeholder="Phone Number" variant="standard"
                value={formData?.contact?.phone.number} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <GenderCombo onChanged={(item) => onComboChanged(item, "gender")} source={"gender"} selectedItem={{ label: formData?.gender === undefined ? "" : formData?.gender.toString(), _id: "", description: "" }} />
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


