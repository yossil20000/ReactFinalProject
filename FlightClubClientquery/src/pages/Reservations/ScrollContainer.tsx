import React from 'react'
import ScrollContainer from '../../Components/ScrollSnap/ScrollSnap'
import imege1 from '../../Asset/TileBar/IMG-20190715-WA0002.jpg';
import imege2 from '../../Asset/TileBar/IMG-20200222-WA0010.jpg';
import imege3 from '../../Asset/TileBar/IMG-20200221-WA0098.jpg';

const itemData = [
    {
      img: imege1,
      title: 'Yosef And Alex',
      author: 'Yosef Levy',
      key:1
    },
    {
      img: imege3,
      title: 'Near Haifa',
      author: 'Yosef Levy',
      key:2
    },
    {
      img: imege2,
      title: 'Moskin',
      author: 'Yosef Levy',
      key:3
    },
  ];
function ScrollContainerPage() {
   const getReservation = () =>{
    console.log("getReservation-item_data",itemData)
    let arr = itemData.map((item) => {
        return <img src={item.img} key={item.key}></img>
    })
    console.log("getReservation", arr);
    return arr
   }
    let items1 =[{
        img:`<img    key={${itemData[0].key}}    src={${itemData[0].img}}
        
        alt={${itemData[0].title}}
        
      />`,
      key:"1"

    }] 
    let items = [{
        img:"<div key=1>I am a Item</>",
        key:"1"
    },{
        img:"<div key=2>I am a Item</>",
        key:"2"
    }]
    //console.log("Reservation", items);
  return (
    <div className="main">
<ScrollContainer loading={false} items={ getReservation()}>
    
</ScrollContainer>
    </div>
    
  )
}

export default ScrollContainerPage