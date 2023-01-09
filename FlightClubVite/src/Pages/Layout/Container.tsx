type Props = {
  children: JSX.Element,
};

function ContainerPage(props: Props) {
  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      {props.children}
    </div>
  )
}

export function ContainerPageHeader(props: Props) {
  return (
    <div className='header'>
      {props.children}
    </div>
  )
}

export function ContainerPageMain(props: Props) {
  return (
    <div className='main' style={{ overflow: "auto", height: "100%" }}>
      {props.children}
    </div>
  )
}
export function ContainerPageFooter(props: Props) {
  return (
    <div className='footer' >
      {props.children}
    </div>
  )
}
export default ContainerPage