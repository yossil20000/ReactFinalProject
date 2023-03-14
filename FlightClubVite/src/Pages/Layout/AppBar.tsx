import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logOut } from '../../features/Auth/authSlice';
import RollIcon from '../../Components/Buttons/RollIcon';
import UserIcon from '../../Components/Buttons/UserIcon';
import { useEffect } from 'react';
import { Avatar } from '@mui/material';

type page = {
  name: string,
  route: string
}
const pages: page[] = [
  { name: 'Home', route: ROUTES.HOME },
  { name: 'Reservations', route: ROUTES.RESERVATION },
  { name: 'Flight', route: ROUTES.Flight },
  { name: 'Members', route: 'members' },
  { name: 'Gallery', route: 'gallery'},
  { name: 'Admin', route: 'admin' },
  { name: "Account", route: "account" },
  { name: "Login", route: "login" },
  
  ];
const settings = ['Profile', 'MyAccount','Notification', 'Dashboard', 'change_password', 'Logout'];

const ResponsiveAppBar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const login = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingNavMenu = (event: React.MouseEvent<HTMLElement>, setting: string) => {
    event.preventDefault();
    console.log("handleSettingMenu:Setting", setting)
    console.log("handleSettingMenu", event.target)
    navigate(`${setting}`)
    setAnchorElNav(null);

  };

  const handleSettingUserMenu = (event: React.MouseEvent<HTMLElement>, setting: string) => {
    event.preventDefault();
    console.log("handleSettingMenu:Setting", setting)
    console.log("handleSettingMenu", event.target)
    if (setting == "Logout") {
      console.log("Logout")
      /* setLocalStorage<string>(LOCAL_STORAGE.LOGIN_INFO, "") */
      dispatch(logOut());
      /* navigate("/login"); */
    }
    else {
      navigate(`${setting}`)
    }
    setAnchorElUser(null);
  };
  useEffect(() => {

  }, [login])
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {login?.member.first_name == "" ? "Hello, Please login" : `Hello ${login?.member.first_name}`}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-left"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={(e) => handleSettingNavMenu(e, page.route)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {login.member.first_name == "" ? "Hello, Please login" : `Hello ${login.member.first_name}`}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={(e) => handleSettingNavMenu(e, page.route)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <RollIcon roles={login?.member?.roles} />
            <Tooltip title={`Open settings ${login?.member?.roles.join("/")}`}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {login?.member?.image !== "" ? (<Avatar alt="Remy Sharp" src={login?.member?.image} /> ) : 
                (<UserIcon roles={login?.member?.roles} />)
                }
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-right"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} >
                  <Typography key={setting} textAlign="center" onClick={(e) => handleSettingUserMenu(e, setting)} >{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
