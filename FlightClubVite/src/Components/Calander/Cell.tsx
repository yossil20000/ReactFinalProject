import { Box, SxProps, Theme } from '@mui/system'
import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
  className?: string,
  onClick?: () =>void,
  style?: React.CSSProperties
  sx?: SxProps<Theme> | undefined
 }

const Cell: React.FC<Props> = ({style={height: '100%', width:"100%"}, children,className ,onClick,sx}) => {
  return (
    <Box  onClick={onClick} style={style} sx={sx} className={clsx("flex items-center text-center justify-center border-b border-r" , className)}>{children}</Box>
  )
}
export default Cell