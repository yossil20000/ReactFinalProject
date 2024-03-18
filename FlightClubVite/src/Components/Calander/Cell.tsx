import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
  className?: string,
  onClick?: () =>void,
  style?: React.CSSProperties
 }

const Cell: React.FC<Props> = ({style={height: '100%', width:"100%"}, children,className ,onClick}) => {
  return (
    <div  onClick={onClick} style={style} className={clsx("flex items-center text-center justify-center border-b border-r" , className)}>{children}</div>
  )
}
export default Cell