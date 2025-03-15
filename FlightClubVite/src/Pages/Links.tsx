import ContainerPage, { ContainerPageHeader } from './Layout/Container'
import { Box, color } from '@mui/system'
import { Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
interface IContacts {
  name: string;
  email: string;
  phone: string;
  type: string;
  rating: string;
}
const contacts: IContacts[] = [
  { name: "Asher Choen", email: "", phone: "0522263273", type: "", rating: "" },
  { name: "Ran Barlev", email: "", phone: "0544843484", type: "", rating: "" },
  { name: "Kuperberg Moti", email: "", phone: "0546887376", type: "", rating: "" },
  { name: "Hilel Lapidot", email: "", phone: "0548006061", type: "", rating: "" }
]
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
              <Box >
                <Grid container key={"radar"} display={'flex'} flexDirection={'row'}>
                  <Grid item xs={12} sm={1}>
                    Flight Board:
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Link href="https://www.iaa.gov.il/airports/haifa/flight-board/?flightType=arrivals">LLHA Flights</Link>
                  </Grid>

                </Grid>
              </Box>
              <Box >
                <Grid container key={"radar"} display={'flex'} flexDirection={'row'}>
                  <Grid item xs={12} sm={12}>
                    Instructors:
                  </Grid>
                  <Grid>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableHead sx={{ backgroundColor: 'gray' }}> 
                          <TableRow >
                            <TableCell align="center" colSpan={1}>Name</TableCell>
                            <TableCell align="center" colSpan={2}>Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Rating</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {contacts.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell align="center">{row.name}</TableCell>
                              <TableCell align="center" colSpan={2}>{row.email}</TableCell>
                              <TableCell align="center">{row.phone}</TableCell>
                              <TableCell align="center">{row.type}</TableCell>
                              <TableCell align="center">{row.rating}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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