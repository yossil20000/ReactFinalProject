/* eslint-disable jsx-control-statements/jsx-jcs-no-undef */
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
import { Avatar } from '@mui/material';
import useGetExpiredLogin from '../../hooks/useGetExpiredLogin'
import RefreshTokenDialog from '../../Components/RefreshTokenDialog';
import { Role } from '../../Interfaces/API/IMember';
type page = {
  name: string,
  route: string,
  roles: Role[];
}

const settings = ['Profile', 'MyAccount', 'Notification', 'Dashboard', 'change_password', 'Logout'];
const remainLoginDialog: number = 30;
const ResponsiveAppBar = () => {
  const [openRefreshDialog, setOpenRefrwshDialog] = React.useState(false);
  const [enableRefreshDialog, setEnableRefrwshDialog] = React.useState(true);
  const [needLogin, setNeedLogin] = React.useState(false);
  const remainLogin = useGetExpiredLogin()
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const login = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();
  const pages: page[] = [
    { name: 'Home', route: ROUTES.HOME ,roles:[]},
    { name: "WAB", route: "WAB" ,roles:[]},
    { name: `Links`, route: 'links' , roles:[]},
    { name: 'Reservations', route: ROUTES.RESERVATION, roles:[Role.user, Role.desk, Role.admin, Role.account] },
    { name: 'Flight', route: ROUTES.Flight , roles:[Role.user, Role.desk, Role.admin, Role.account] },
    { name: "Account", route: "account" ,roles:[Role.user, Role.desk, Role.admin, Role.account]},
    { name: 'Admin', route: 'admin' ,roles:[Role.admin]},
    { name: `Register`, route: "registration" , roles:[Role.admin]},
    { name: 'Contacts', route: 'members' ,roles:[Role.user, Role.desk, Role.admin, Role.account]},
    { name: 'Gallery', route: 'gallery' ,roles:[Role.user, Role.desk, Role.admin, Role.account]},
    { name: `Login ${remainLogin}`, route: "login",roles:[] } 
  ];
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    CustomLogger.info("ResponsiveAppBar/handleOpenNavMenu:event", event.currentTarget)
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
  if (needLogin && remainLogin > 0) {
    setNeedLogin(false);
  }
  if (!needLogin && remainLogin < 0 && remainLogin >  -10) {
    CustomLogger.info("navigate")
    setNeedLogin(true);
    navigate("/login");
  }
  const handleSettingNavMenu = (event: React.MouseEvent<HTMLElement>, setting: string) => {
    event.preventDefault();
    CustomLogger.info("ResponsiveAppBar/handleSettingMenu:Setting", setting)
    CustomLogger.info("ResponsiveAppBar/handleSettingMenu", event.target)
    navigate(`${setting}`)
    setAnchorElNav(null);

  };

  const handleSettingUserMenu = (event: React.MouseEvent<HTMLElement> | undefined, setting: string) => {
    event !== undefined ? event.preventDefault() : null;
    CustomLogger.info("ResponsiveAppBar/handleSettingMenu:Setting", setting)

    if (setting == "Logout") {
      CustomLogger.info("Logout")
      /* setLocalStorage<string>(LOCAL_STORAGE.LOGIN_INFO, "") */
      dispatch(logOut());
      /* navigate("/login"); */
    }
    else {
      navigate(`${setting}`)
    }
    setAnchorElUser(null);
  };

  const onCloseRefreshDialog = (action: boolean): void => {
    CustomLogger.log("ResponsiveAppBar/onCloseRefreshDialog")
    if (!action)
      handleSettingUserMenu(undefined, "Logout");
    setOpenRefrwshDialog(false);
    setEnableRefrwshDialog(true);


  }
  if ((remainLogin - remainLoginDialog) <= 0 && enableRefreshDialog && remainLogin > 0) {
    if (remainLogin <= 0) {
      CustomLogger.info("ResponsiveAppBar/remainLogin", remainLogin)
    }
    CustomLogger.log("ResponsiveAppBar/remainLogin", remainLogin)
    setOpenRefrwshDialog(true);
    setEnableRefrwshDialog(false);
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        {openRefreshDialog == true ?
          (<RefreshTokenDialog open={openRefreshDialog} expired={remainLogin} onClose={onCloseRefreshDialog} />)
          : (null)}

        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', lg: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {login?.member.first_name == "" ? "Hello, Please login" : `Hello ${login?.member.first_name}`}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', lg: 'none' } }}>
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
                display: { xs: 'block', lg: 'none' },
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

            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', lg: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {login.member.first_name == "" ? "Hello, Please login" : `Hello ${login.member.first_name} ${isNaN(remainLogin) || remainLogin > 100 ? "" :  `Expired: ${remainLogin}`}`}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' } }}>
            {pages.map((page, index) => 
             page.roles.length == 0 || login.member.roles.find(role => page?.roles.includes(role)) ? (
              <Button
              key={index}
              onClick={(e) => handleSettingNavMenu(e, page.route)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page.name}
            </Button>
             ) : (
              <></>
             )

            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>

            <RollIcon roles={login?.member?.roles} />
            <Tooltip title={`Open settings ${login?.member?.roles.join("/")}`}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {login?.member?.image !== "" ? (<Avatar alt="Remy Sharp" src={login?.member?.image} />) :
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
