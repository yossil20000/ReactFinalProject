import ContainerPage, { ContainerPageHeader } from './Layout/Container'
import { Box } from '@mui/system'
import { Grid, Link } from '@mui/material'

function LinksPage() {
  return (
    <>
      <ContainerPage>
        <>
          <ContainerPageHeader >
            <>
            <Box marginTop={0} display={'flex'} flexDirection={'column'} >
              <Grid container key={"taf"}>
                <Grid item xs={12} sm={1}>
                  TAF:
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Link href="https://metar-taf.com/taf/LLBG" target="_blank">LLBG</Link>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Link href="https://metar-taf.com/taf/LLHA" target="_blank">LLHA</Link>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Link href="https://metar-taf.com/taf/LLMG" target="_blank">LLMG</Link>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Link href="https://metar-taf.com/taf/LLIB" target="_blank">LLIB</Link>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Link href="https://metar-taf.com/taf/LLER" target="_blank">LLER</Link>
                </Grid>
              </Grid>

              <Box >
                <Grid container key={"radar"} display={'flex'} flexDirection={'row'}>
                  <Grid item xs={12} sm={1}>
                    Radar:
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Link href="https://www.weather1.live/radar/">Rain Radar</Link>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Link href="https://www.weather2day.co.il/rain-radar-google#radar">Rain Radar On Map</Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box >
              <Grid container key={"radar"} display={'flex'} flexDirection={'row'}>
                <Grid item xs={12} sm={1}>
                  Notams:
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Link href="https://www.aopa.org.il/notams">Notams</Link>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Link href="https://theairlinepilots.com/flightplanningforairlinepilots/notamdecode.php" target="_blank">Notam Decode</Link>
                </Grid>
              </Grid>
            </Box>
            </>
          </ContainerPageHeader>
        </>
      </ContainerPage >
    </>
  )
}

export default LinksPage