import { Avatar, Grid } from '@mui/material'
import clsx from 'clsx'
import browse from '../../Asset/images/browse.gif'
import { width } from '@mui/system'

interface Props extends React.PropsWithChildren {
  id: number,
  className?: string,
  onClick?: () =>void,
  display?: React.ReactNode,
  displayStyle: React.CSSProperties,
  headerStyle: React.CSSProperties,
  onCellClick: (id: number) => void
 }
 /* style == 1 ? {backgroundColor: "#99cccc"} : {backgroundColor: "#9abce1", color: "#0067fe"} */
const CellFlight: React.FC<Props> = ({ id,headerStyle={backgroundColor: "#9abce1", color: "#0067fe"} ,children,className,onCellClick ,onClick,display=<>{'Flight Error'}</>,displayStyle}) => {
  
  console.log("CellFlight",displayStyle,headerStyle)
  return (
    <div onClick={onClick} style={{height: "100%", width: "100%" , color: "#0067fe"}} className={clsx("flex items-center text-center justify-center border-b border-r" , className)}>
      <Grid style={{height: "100%" ,width: "100%"}} container>
      <Grid style={headerStyle} height={'30%'} width={'100%'} item sm={12}>
      {children}
      </Grid>
      <Grid height={'70%'} width={'100%'} item sm={12} style={displayStyle} >
        <>
        {display}
        <img src={browse} style={{margin:"auto",width: "2.2em" , height: "2.2em"}}/>
        </>
      
      </Grid>
    </Grid>
    </div>
    
    
  )
}
export default CellFlight