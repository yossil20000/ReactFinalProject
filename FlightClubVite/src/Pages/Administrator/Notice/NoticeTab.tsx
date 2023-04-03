import "../../../Types/date.extensions"
import { Box, Checkbox, Divider, FormControlLabel, Grid } from '@mui/material'
import React, { useCallback, useState } from 'react'
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons'
import Stepper from '../../../Components/Buttons/Stepper';
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert'
import { useCreateNoticeMutation, useDeleteNoticeMutation, useFetchAllNoticesQuery, useUpdateNoticeMutation } from '../../../features/clubNotice/noticeApiSlice';
import { useFetchAllClubNoticeQuery } from '../../../features/Users/userSlice';
import useLocalStorage from '../../../hooks/useLocalStorage';
import IClubNotice, { INoticeFilter, NewNotice, NewNoticeFilter } from '../../../Interfaces/API/IClubNotice';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import NoticeEdit from './Notice';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setNotice } from "../../../features/clubNotice/noticeSlice";
const source = "NoticeTab/status"
function NoticeTab() {
  const { isError, isLoading, isSuccess, isFetching, error, data: notices } = useFetchAllNoticesQuery();
  const notice: IClubNotice = useAppSelector((state) => state.selectedNotice as IClubNotice);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [noticeFilter, setNoticeFilter] = useLocalStorage<INoticeFilter>("NoticeTab/Filter", NewNoticeFilter);
  const [updateNotice] = useUpdateNoticeMutation();
  const [createNotice] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const { refetch } = useFetchAllClubNoticeQuery();
  const noticeDispatch = useAppDispatch();

  const filter = useCallback(() => {
    CustomLogger.log("NoticeTab/callback/notice")
    const filtered = notices?.data?.filter((notice) => {
      CustomLogger.info("Filter/notice.due_date < new Date(): ", new Date(notice.due_date).getTime(), new Date().getTime(), new Date(notice.due_date).getTime() < new Date().getTime())
      if (noticeFilter.all) return true;
      if (noticeFilter.public && !notice.isPublic) return false;
      if (noticeFilter.expired && !notice.isExpired) return false;
      if (noticeFilter.isValid && notice.isExpired) {
        if (new Date(notice.due_date).getTime() < new Date().getTime())
          return false;
      }
      if (noticeFilter.isValid === false) {
        if (notice.isExpired && new Date(notice.due_date).getTime() <= new Date().getTime())
          return true;
        return false
      }
      return true;
    })
    CustomLogger.info("NoticeTab/callback/filteed", filtered)
    return filtered?.sort((left, right) => {
      if (noticeFilter.isValid)
        return new Date(left.issue_date).getTime() - new Date(right.issue_date).getTime();
      else
        return new Date(left.due_date).getTime() - new Date(right.due_date).getTime();
    });
  }, [noticeFilter])
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (notice !== undefined && notice?._id !== "") {
        payLoad = await updateNotice(notice as unknown as IClubNotice).unwrap();
        CustomLogger.info("NoticeTab/updateNotice/payload", payLoad);
        if (payLoad.error) {
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }

      }
      else {
        payLoad = await createNotice(notice as unknown as IClubNotice).unwrap();
        CustomLogger.info("NoticeTab/createNotice/payload", payLoad);
        if (payLoad.error) {
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }

      }
    }
    catch (error: any) {
      CustomLogger.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }
    finally {
      refetch();
    }

  }
  async function onDelete(): Promise<void> {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (notice !== undefined && notice?._id !== "") {
        payLoad = await deleteNotice(notice._id).unwrap();
        CustomLogger.info("NoticeTab/OnDelete/payload", payLoad);
        if (payLoad.error) {
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }

      }
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      const validation = getValidationFromError(error, onValidationAlertClose);
      setValidationAlert(validation);

    }
    finally {
      refetch();
    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    CustomLogger.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        noticeDispatch(setNotice(NewNotice));
        setNoticeFilter((prev: any) => ({
          ...prev,
          all: true,
        }));
        break;
      case EAction.SAVE:
        onSave()
        break;
      case EAction.DELETE:
        onDelete();

    }
  }


  const onStepChange = (step: number) => {
    const notice = filter()?.at(step);
    CustomLogger.log("NoticeTab/OnStepChanged/notice/step", notice, step)
    if (notice === undefined) {
      CustomLogger.warn("NoticeTab/OnStepChanged/empty")
      return;
    };
    CustomLogger.log("NoticeTab/OnStepChanged/Set")
    noticeDispatch(setNotice(notice));
    if (filter()?.at(step) === undefined || filter()?.at(step) === null) {
      CustomLogger.info("NoticeTab/OnStepChanged/empty")
      noticeDispatch(setNotice(NewNotice));
    }
    else {
      CustomLogger.info("NoticeTab/OnStepChanged/notice", notice)
      noticeDispatch(setNotice(notice));
    }


  }
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("NoticeEdit/handleBoolainChange", event.target.name, event.target.checked)
    setNoticeFilter((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };
  const getMaxSteps = (): number => {
    const maxLength = filter()?.length;
    if (maxLength === undefined) return 0;
    return maxLength;
  }
  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
        <Grid container columns={12} width={"100%"}>

          <Grid item xs={12}>
            <Divider textAlign="left">Navigation</Divider>
          </Grid>
          {/* <Grid item xs={3}><Button>fff</Button> </Grid> */}
          <Grid item xs={12}>
            <Stepper initialStep={0} maxSteps={getMaxSteps()} leftButton='Prev' rightButton='Next' onStepChange={onStepChange} />
          </Grid>
        </Grid>
        <Grid container columns={12} width={"100%"}>

          <Grid item xs={12}>
            <Divider textAlign="left">Filter</Divider>
          </Grid>
          <Grid item xs={3}  >
            <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"all"} checked={noticeFilter?.all} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="All" />
          </Grid>
          {
            noticeFilter?.all === false ?
              (
                <>
                  <Grid item xs={3}  >
                    <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"isValid"} checked={noticeFilter?.isValid} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="Valid" />
                  </Grid>
                  <Grid item xs={3} >
                    <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"expired"} checked={noticeFilter?.expired} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="Expired" />
                  </Grid>
                  <Grid item xs={3} >
                    <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"public"} checked={noticeFilter?.public} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="Public" />
                  </Grid>
                </>
              ) : null
          }


        </Grid>
        <Divider variant="fullWidth" textAlign="left">Current Messgae</Divider>
      </div>
      <div className='main' style={{ overflow: "auto", height: "100%" }}>
        <Box marginTop={2}>
          {getMaxSteps() === 0 ? <NoticeEdit /> : <NoticeEdit />}
          <Grid container>

            {validationAlert.length > 0 ? (<>{validationAlert}</>) : (<>validationAlert Empty{validationAlert}</>)}
            {validationAlert.map((item) => {
              CustomLogger.error("validationAlert.map")
              return (

                <Grid item xs={12}>
                  <ValidationAlert {...item} />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </div>
      <div className='footer'>
        <Box className='yl__action_button'>
          <ActionButtons OnAction={onAction} show={[EAction.SAVE, EAction.ADD, EAction.DELETE]} item={""} />
        </Box>

      </div>
    </div>
  )
}

export default NoticeTab