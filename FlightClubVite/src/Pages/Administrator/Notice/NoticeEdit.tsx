import { Box, Checkbox, createTheme, FormControlLabel, Grid, TextField, ThemeProvider } from "@mui/material"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import IClubNotice, { NewNotice } from "../../../Interfaces/API/IClubNotice";
import { useAppSelector,useAppDispatch } from "../../../app/hooks";
import { setNotice, setNoticeValue } from "../../../features/clubNotice/noticeSlice";
import { setProperty } from "../../../Utils/setProperty";
const defaultMaterialThem = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        margin: "none"
      }
    }
  }
})
export interface INoticeEditProps {
  selectedNotice: IClubNotice;
  seSelectedNotice: React.Dispatch<React.SetStateAction<IClubNotice>>;
}
function NoticeEdit() {
  const notice : IClubNotice = useAppSelector((state) => state.selectedNotice);
  const noticeDispatch = useAppDispatch();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("NoticeEdit/handleChange", event.target.name, event.target.value)
    const newObj: IClubNotice = SetProperty(notice, event.target.name, event.target.value) as IClubNotice;
    noticeDispatch(setNotice(newObj));
  };

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("SetProperty/newobj", newObj)
    return newObj;
  }

  const handleDateChange = (newValue: DateTime | null, property: string) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    console.log("NoticeEdit/handleDateChange", new Date(newDate))
   
    noticeDispatch(setNoticeValue({key: property,value: new Date(newDate)}));
  };
  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("NoticeEdit/handleBoolainChange", event.target.name, event.target.checked)
    noticeDispatch(setNoticeValue({key: event.target.name,value: event.target.checked}));
 
  };

  return (
    <Box>
      <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12} rowGap={2}>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            sx={{ marginLeft: "0px", width: "100%" }}
            name="title"
            label="Title"
            value={notice?.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            sx={{ marginLeft: "0px", width: "100%" }}
            name="description"
            label="Message"
            value={notice?.description}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={12} >
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={defaultMaterialThem}>
              <DateTimePicker
                disableMaskedInput
                label="Issue Date"
                mask=''
                key={"issue_date"}
                value={notice?.issue_date}
                onChange={(e: DateTime | null) => handleDateChange(e, "issue_date")}
                renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft: "0" }} />}
              />

            </ThemeProvider>

          </LocalizationProvider>
        </Grid>
        {notice.isExpired !== true ? null : (
        <Grid item xs={12} >
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={defaultMaterialThem}>
            <DateTimePicker
            
              disableMaskedInput
              label="Due Date"
              mask=''
              key={"due_date"}
              value={notice?.due_date}
              onChange={(e: DateTime | null) => handleDateChange(e, "due_date")}
              renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft: "0" }} />}
            />

          </ThemeProvider>

        </LocalizationProvider>
      </Grid>
        )}

        <Grid item xs={6} >
          <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"isExpired"} checked={notice?.isExpired} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Expired" />
        </Grid>
        <Grid item xs={6} >
          <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"isPublic"} checked={notice?.isPublic} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Public" />
        </Grid>
      </Grid>
    </Box>
  )
}

export default NoticeEdit