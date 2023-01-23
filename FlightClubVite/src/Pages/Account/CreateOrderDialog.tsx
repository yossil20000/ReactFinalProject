import { Dialog, DialogTitle, DialogContent, createTheme, Paper, styled, Grid, Button, Card, CardContent, Typography, CardActions, Divider } from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import { useCreateOrderMutation } from "../../features/Account/accountApiSlice";
import { COrderCreate, IOrder, IOrderBase } from "../../Interfaces/API/IAccount";
import IFlight, { } from "../../Interfaces/API/IFlight";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
const source: string = "CreateOrder"

export interface CreateOrderDialogProps {
  value: IOrderBase;
  onClose: () => void;
  onSave: (value: IOrderBase) => void;
  open: boolean;
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const defaultMaterialThem = createTheme({

})
let transitionAlertInitial: ITransitionAlrertProps = {
  severity: "success",
  alertTitle: "Create Order",
  alertMessage: "Operation succeed",
  open: false,
  onClose: () => { }
}
function CreateOrderDialog({ value, onClose, onSave, open, ...other }: CreateOrderDialogProps) {

  console.log("CreateOrderDialog/value", value)

  const [CreateOrder, { isError, isLoading, error, isSuccess }] = useCreateOrderMutation();
  const [orderCreate, setorderCreate] = useState<IOrderBase>(new COrderCreate());
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved,setIsSaved] = useState(false);

  useEffect(() => {
    console.log("CreateOrderDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Order Create", alertMessage: "Order Create Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {

      const validation = getValidationFromError(error, handleOnValidatiobClose);
      setValidationAlert(validation);
      return;


    }
  }, [isLoading])



  const handleFligtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFligtChange", event.target.name, event.target.value)
    setorderCreate(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleOnCancel = () => {
    setValidationAlert([])
    if(isSaved)
      onSave(value)
    else
      onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    console.log("CreateOrderDialog/onSave", orderCreate)
    let order = new COrderCreate();
    order.copy(orderCreate);
    console.log("CreateOrderDialog/onSave/order", order)
    console.log("CreateOrderDialog/onSave/date", orderCreate.order_date)

    await CreateOrder(value as IOrderBase).unwrap().then((data) => {
      console.log("CreateOrderDialog/onSave/", data);
      if(data.data._id !== undefined){
        setIsSaved(true)
      }
        /* onSave(value); */
        
      
    }).catch((err) => {
      console.log("CreateOrderDialog/onSave/error", err.data.errors);
    });


  }
  const onDeviceChanged = (item: InputComboItem, has_hobbs: boolean) => {

    setorderCreate(prev => ({ ...prev, _id_device: item._id, reuired_hobbs: has_hobbs }))
  }
  const onMemberChanged = (item: InputComboItem) => {
    setorderCreate(prev => ({ ...prev, _id_member: item._id }))
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"

      open={open} {...other}>
      <DialogTitle>Order Create</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center">
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary"  gutterBottom>
                  Order Details
                </Typography>
                <Divider light />
              </Grid>

              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Product
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Units
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Price Per Unit
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Ammount
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {value.orderType.referance}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {value.units}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {value.pricePeUnit}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {value.amount}
                </Typography>
              </Grid>
              <Divider light />
              <Grid item xs={12}>
              <Divider light />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Description:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {value.desctiption}
                </Typography>
              </Grid>
            </Grid>

          </CardContent>
          <CardActions>
          <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnCancel}>

              {isSaved === true ? "Close ": "Cancle"}
            </Button></Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" } } 
            disabled={isSaved === true ? true : false}
              onClick={handleOnSave}>
              {isSaved === true ? "Saved" : "Save"}
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
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default CreateOrderDialog;