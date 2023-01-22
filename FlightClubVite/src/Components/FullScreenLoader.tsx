import { Box, CircularProgress, CircularProgressProps, Container } from '@mui/material';
let x : CircularProgressProps = {
  
}
const FullScreenLoader = () => {
  return (
    <Container sx={{ height: '95vh' }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{ height: '100%' }}
      >
        <CircularProgress  />
      </Box>
    </Container>
  );
};

export default FullScreenLoader;
