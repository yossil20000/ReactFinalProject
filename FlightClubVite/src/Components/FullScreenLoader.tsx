import { Box, CircularProgress, CircularProgressProps, Container, ContainerOwnProps } from '@mui/material';
interface IFullScreenLoaderProps {
  height?: string
}
const FullScreenLoader = ({height="95vh"}:IFullScreenLoaderProps) => {
  return (
    <Container sx={{ height: height }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{ height: '100%' ,backgroundColor:"transparent"}}
      >
        <CircularProgress  />
      </Box>
    </Container>
  );
};

export default FullScreenLoader;
