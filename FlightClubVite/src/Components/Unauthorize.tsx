import { Card, CardContent, CardHeader, CardMedia, Paper, Typography } from '@mui/material'
import Unauthorized from '../Asset/Unauthorized.png'
function Unauthorize() {
  return (
    <div className='main'>
      <Paper elevation={5} sx={{ width: "100%" ,height:"100%" ,margin:"auto"}}>

    
<Card sx={{ width: "90%" ,height:"100%" ,margin:"auto"}}>
<CardHeader
       
        
        title="User Unauthorized"
        subheader={new Date().toDateString()}
      />
      <CardMedia
        component="img"
        height="100%"
        width="100%"
        alt="green iguana"
        src= {Unauthorized}
      />
      <CardContent>

        <Typography variant="body2" color="text.secondary">
Please loging with the right user permition.

        </Typography>
      </CardContent>

    </Card>
    </Paper>
    </div>
 
  )
}

export default Unauthorize