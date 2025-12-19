import { Box, Checkbox, createTheme, FormControlLabel, Grid, TextField, ThemeProvider } from "@mui/material"
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import IClubNotice, { NewNotice } from "../../../Interfaces/API/IClubNotice";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
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
export interface INoticeProps {
  selectedNotice: IClubNotice;
  seSelectedNotice: React.Dispatch<React.SetStateAction<IClubNotice>>;
}
function NoticeEdit() {
  const notice: IClubNotice = useAppSelector((state) => state.selectedNotice);
  const noticeDispatch = useAppDispatch();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("Notice/handleChange", event.target.name, event.target.value)
    const newObj: IClubNotice = SetProperty(notice, event.target.name, event.target.value) as IClubNotice;
    noticeDispatch(setNotice(newObj));
  };

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.info("SetProperty/newobj", newObj)
    return newObj;
  }

  const handleDateChange = (newValue: Date, property: string) => {
    let newDate = newValue;
    CustomLogger.log("Notice/handleDateChange", new Date(newDate))
    noticeDispatch(setNoticeValue({ key: property, value: new Date(newDate) }));
  };
  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("Notice/handleBoolainChange", event.target.name, event.target.checked)
    noticeDispatch(setNoticeValue({ key: event.target.name, value: event.target.checked }));
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} >
          <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={defaultMaterialThem}>
              <MobileDateTimePicker
                label="Issue Date"
                key={"issue_date"}
                value={DateTime.fromJSDate(notice?.issue_date ? notice?.issue_date : new Date())}
                onChange={(e: any | null) => handleDateChange(e == undefined ? new Date() : e.toJSDate(), "issue_date")}
              />
            </ThemeProvider>

          </LocalizationProvider>
        </Grid>
        {notice.isExpired !== true ? null : (
          <Grid item xs={12} >
            <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
              <ThemeProvider theme={defaultMaterialThem}>
                <MobileDateTimePicker
                  label="Due Date"
                  key={"due_date"}
                  value={DateTime.fromJSDate(notice?.due_date ? notice?.due_date : new Date())}
                  onChange={(e: any | null) => handleDateChange(e === undefined || e === null ? new Date() : e.toJSDate(), "due_date")}
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