import "../../index.css"
import React from 'react'
import Welocome from "./components/welocome"
import TitlebarBelowMasonryImageList from "../../Components/Masonry/TitlebarImages"
import { Messages } from "./components/Messages"


function Home() {
  return (
    <div className="main">
      {/* <Messages></Messages> */}
      <Welocome></Welocome>
      <TitlebarBelowMasonryImageList></TitlebarBelowMasonryImageList>

      {/* <Messages></Messages>
      <Welocome></Welocome>
 */}
      
    </div>
  )
}


export default Home
