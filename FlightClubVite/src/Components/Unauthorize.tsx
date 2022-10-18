import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Paper, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import { height, margin } from '@mui/system'
import React from 'react'
import image from '../Asset/TileBar/IMG-20190715-WA0002.jpg'
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
        src="../src/Asset/Unauthorized.png"
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