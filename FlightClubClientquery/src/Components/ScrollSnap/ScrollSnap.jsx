import styled, {css,StyleSheetManager} from "styled-components";

const ScrollConatainerStyled = styled.div`
overflow: auto;
scroll-snap-type:y mandatory;
height: 90%;
margin: 0 auto;
max-width: 90vw;
font-size: 60px;`

const ScrollAreaStyled = styled.div`
display:flex;
align-items: center;
justify-content: center;
scroll-snap-align: start;
color: white;
margin: 0 auto;
max-width: 90vw;
height: 100%;
font-size: 60px;`

const ScrollContainer = ({loading,items,...props}) =>{
    const RenderScrollItems = (items) =>{
        console.log("ScrollContainer",items)
        var render= items?.map((item,i) => (<ScrollAreaStyled key={i} >{item}</ScrollAreaStyled>))
        console.log("Renders:", render)
        return render;
    }
    return(
        <ScrollConatainerStyled>
            {loading ? <div>Loading</div> : RenderScrollItems(items)}
        </ScrollConatainerStyled>
    )
}
export default ScrollContainer;