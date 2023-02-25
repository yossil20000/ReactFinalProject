import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import IMemberUpdate from '../../Interfaces/IMemberInfo';
import { INotification } from '../../Interfaces/API/INotification';
import { SetProperty } from '../../Utils/setProperty';
import Notify from './Notify';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Notification({ numPage, page, setPage, formData, setFormData ,formNotify,setFormNotify}: IPageNavigate<IMemberUpdate,INotification>) {
  const handleNotifyChange = (prop: string) => (event: any) => {
    let newObj = SetProperty(formNotify,prop,event.target.value)
    setFormNotify(newObj);
    console.log("notifyForm", newObj)
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Typography variant="h5" component="div" align='center'>
            Notification
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
              id="fullName"
              label="Full Name"
              value={formNotify.member.fullName}
              onChange={handleNotifyChange("member.fullName")}
            />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="email"
              label="email"
              value={formNotify.member.email}
              onChange={handleNotifyChange("member.email")}
            />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="phone"
              label="Phone"
              value={formNotify.member.phone}
              onChange={handleNotifyChange("member.phone")}
            />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
             <Notify notify={formNotify.notify[0]}/>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
          <Notify notify={formNotify.notify[1]}/>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="state"
              label="State"
              value={formNotify.notify}
              onChange={handleNotifyChange("state")}
            />
          </Item>
        </Grid>
      </Grid>
    </Box>

  )
}



export default Notification