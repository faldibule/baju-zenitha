import * as React from "react";
import axios from "axios";
import {
   AppBar,
   Avatar,
   Typography,
   Grid,
   IconButton,
   Toolbar,
   Tooltip,
   Menu,
   MenuItem,
   Divider,
   Stack,
   Box,
   Link,
   Button,
   Badge,
   Modal,
   InputBase,
   ListItemIcon,
   Backdrop,
   CircularProgress,
} from "@mui/material";
import {
   Logout,
   Search,
   FavoriteBorderRounded,
   ShoppingCartOutlined,
   ListAltRounded,
   ArrowDropDownRounded,
   LockOutlined,
   StorefrontOutlined,
   ShoppingBagOutlined,
} from "@mui/icons-material";

import { apiUrl } from "../../variable/Url";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authentication, carts } from "../../store/Authentication";

export default function Header(props) {
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   const navigate = useNavigate();
   const [auth, setAuth] = useRecoilState(authentication);
   const [cart] = useRecoilState(carts);
   const token = localStorage.getItem("token");
   const name = localStorage.getItem("name");
   const avatar = localStorage.getItem("avatar");
   const [modal, setModal] = React.useState(false);

   const [category, setCategory] = React.useState([]);
   const getCategory = async () => {
      await axios
         .get(`${apiUrl}/category/fetch`, {
            params: {
               with_sub: 1,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setCategory(res.data.data);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   React.useEffect(() => {
      getCategory();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleChange = (e) => {
      setSearch(e.target.value);
   };

   const [search, setSearch] = React.useState();
   const handleSearch = (e) => {
      e.preventDefault();
      search !== undefined && search !== "" && navigate(`/search?q=${search}`);
   };

   const [backdrop, setBackdrop] = React.useState(false);
   const handleLogout = async () => {
      setBackdrop(true);
      await axios
         .delete(`${apiUrl}/auth/logout`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then(() => {
            setAuth({
               auth: false,
               user: null,
            });
            localStorage.clear();
            setBackdrop(false);
            navigate("/");
         })
         .catch((err) => {
            console.log(err.response);
            // let responseError = err.response.data.data;
         });
   };

   return (
      <React.Fragment>
         <AppBar color="default" position="sticky" elevation={0} sx={{ boxShadow: 2 }}>
            <Box
               sx={{
                  display: { sm: "flex", xs: "none" },
                  alignItem: "center",
                  justifyContent: "space-between",
                  px: 3,
                  py: 0.5,
                  background: "#f4f4f4",
                  fontSize: 11,
               }}
            >
               <Box sx={{ alignItems: "center" }}>
                  {/* <EmailRounded fontSize="6px" /> */}
                  <Typography variant="caption">cs@zenitha.com</Typography>
               </Box>
               <Link component={RouterLink} to="/article" underline="none" color="inherit">
                  <Typography variant="caption">Artikel & Tutorial</Typography>
               </Link>
            </Box>
            <Toolbar sx={{ py: 1, background: "#fff" }}>
               <Grid container>
                  <Grid item xs>
                     <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <Box sx={{ borderRadius: 1 }} component={RouterLink} to="/">
                              <Box sx={{ display: { xs: "none", md: "block" } }}>
                                 <img alt="Logo" src="/assets/images/brands/zenitha.png" />
                              </Box>
                              <Box sx={{ display: { xs: "block", md: "none" }, pt: 1, mr: 1 }}>
                                 <img alt="Logo" src="/favicon.ico" />
                              </Box>
                           </Box>
                           <Button
                              onClick={() => setModal(!modal)}
                              onMouseOver={() => setModal(true)}
                              color="inherit"
                              sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", p: 0.5, mx: 1 }}
                           >
                              <Typography sx={{ ml: 1 }} variant="subtitle2">
                                 Kategori
                              </Typography>
                              <ArrowDropDownRounded />
                           </Button>
                           <Modal open={modal} sx={{ zIndex: 1000 }}>
                              <Box
                                 sx={{ width: "100%", bgcolor: "background.paper", mt: 10, p: 4, maxHeight: "70vh", overflow: "auto" }}
                                 onMouseLeave={() => setModal(false)}
                              >
                                 {category.length > 0 ? (
                                    <Grid container spacing={2}>
                                       {category.map((value, index) => (
                                          <Grid item xs={12} sm={6} md={4} lg mb={2} key={index}>
                                             <Stack
                                                direction="row"
                                                divider={<Divider orientation="vertical" flexItem />}
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ pb: 1 }}
                                             >
                                                <img alt={value.category_name} src={value.image_url} height="30" />
                                                <Typography variant="button">{value.category_name}</Typography>
                                             </Stack>
                                             <Divider />
                                             <Grid container spacing={1} pt={1}>
                                                {value.sub_category.map((row, index) => (
                                                   <Grid item xs={6} key={index}>
                                                      <Typography variant="body2" color="text.secondary">
                                                         <Link
                                                            component={RouterLink}
                                                            to={`/category/${value.category_slug}/${row.sub_category_slug}`}
                                                            underline="none"
                                                            color="inherit"
                                                         >
                                                            {row.sub_category_name}
                                                         </Link>
                                                      </Typography>
                                                   </Grid>
                                                ))}
                                             </Grid>
                                          </Grid>
                                       ))}
                                    </Grid>
                                 ) : (
                                    <Typography textAlign="center" mt={2}>
                                       Belum ada kategori
                                    </Typography>
                                 )}
                              </Box>
                           </Modal>
                        </Box>
                        <Box sx={{ flex: 1, mr: { lg: 10, md: 5, sm: 3 } }}>
                           <Box
                              component="form"
                              onSubmit={handleSearch}
                              sx={{ px: "2px", display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 1 }}
                           >
                              <InputBase
                                 sx={{ ml: 1, flex: 1, fontSize: "13px" }}
                                 onChange={handleChange}
                                 placeholder="Cari busana"
                                 inputProps={{ "aria-label": "cari" }}
                                 type="search"
                              />
                              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                              <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                                 <Search />
                              </IconButton>
                           </Box>
                        </Box>
                        <Box sx={{ ml: 1 }}>
                           {auth.auth !== false ? (
                              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
                                 <Box>
                                    <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                                       <Tooltip title="Wishlist">
                                          <IconButton component={RouterLink} to="/wishlist">
                                             <FavoriteBorderRounded fontSize="small" />
                                          </IconButton>
                                       </Tooltip>
                                    </Box>
                                    <Tooltip title="Keranjang">
                                       <IconButton component={RouterLink} to="/cart">
                                          <Badge badgeContent={cart.total} color="error">
                                             <ShoppingCartOutlined fontSize="small" />
                                          </Badge>
                                       </IconButton>
                                    </Tooltip>
                                    <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                                       <Tooltip title="Pesanan">
                                          <IconButton component={RouterLink} to="/order">
                                             <ListAltRounded fontSize="small" />
                                          </IconButton>
                                       </Tooltip>
                                    </Box>
                                 </Box>
                                 <Box>
                                    <Button onClick={handleClick} color="inherit" sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
                                       <Avatar>{avatar}</Avatar>
                                       <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                                          <Typography sx={{ ml: 1 }} variant="subtitle2" noWrap>
                                             {name}
                                          </Typography>
                                          <ArrowDropDownRounded />
                                       </Box>
                                    </Button>
                                    <Menu
                                       anchorEl={anchorEl}
                                       open={open}
                                       onClose={handleClose}
                                       onClick={handleClose}
                                       PaperProps={{
                                          elevation: 0,
                                          sx: {
                                             overflow: "visible",
                                             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                             mt: 1.5,
                                             width: 300,
                                             "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                             },
                                             "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 27,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform: "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                             },
                                          },
                                       }}
                                       transformOrigin={{ horizontal: "right", vertical: "top" }}
                                       anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                    >
                                       <MenuItem component={RouterLink} to="/settings">
                                          <Avatar>{avatar}</Avatar>
                                          <Box>
                                             <Typography noWrap>{name}</Typography>
                                             <Typography variant="caption" noWrap>
                                                nurhilmi.mail@gmail.com
                                             </Typography>
                                          </Box>
                                       </MenuItem>
                                       <Divider />
                                       <Box sx={{ display: { xs: "block", sm: "none" } }}>
                                          <MenuItem component={RouterLink} to="/wishlist">
                                             <ListItemIcon sx={{ mr: 0 }}>
                                                <FavoriteBorderRounded fontSize="small" />
                                             </ListItemIcon>
                                             Wishlist
                                          </MenuItem>
                                          <MenuItem component={RouterLink} to="/order">
                                             <ListItemIcon sx={{ mr: 0 }}>
                                                <ListAltRounded fontSize="small" />
                                             </ListItemIcon>
                                             Pesanan
                                          </MenuItem>
                                          <MenuItem component={RouterLink} to="/category">
                                             <ListItemIcon sx={{ mr: 0 }}>
                                                <ShoppingBagOutlined fontSize="small" />
                                             </ListItemIcon>
                                             Kategori
                                          </MenuItem>
                                       </Box>
                                       <MenuItem component={RouterLink} to="/settings/address">
                                          <ListItemIcon sx={{ mr: 0 }}>
                                             <StorefrontOutlined fontSize="small" />
                                          </ListItemIcon>
                                          Daftar Alamat
                                       </MenuItem>
                                       <MenuItem component={RouterLink} to="/settings/password">
                                          <ListItemIcon sx={{ mr: 0 }}>
                                             <LockOutlined fontSize="small" />
                                          </ListItemIcon>
                                          Ganti Password
                                       </MenuItem>
                                       <Divider />
                                       <MenuItem onClick={handleLogout}>
                                          <ListItemIcon sx={{ mr: 0 }}>
                                             <Logout fontSize="small" />
                                          </ListItemIcon>
                                          Keluar
                                       </MenuItem>
                                    </Menu>
                                 </Box>
                              </Stack>
                           ) : (
                              <Stack spacing={1} direction="row">
                                 {/* <Button variant="outlined" size="small" onClick={() => setLogin(true)}> */}
                                 <Button variant="outlined" size="small" component={RouterLink} to="/login">
                                    Masuk
                                 </Button>
                                 <Button variant="contained" size="small" component={RouterLink} to="/register">
                                    Daftar
                                 </Button>
                              </Stack>
                           )}
                        </Box>
                     </Box>
                  </Grid>
               </Grid>
            </Toolbar>
         </AppBar>
         <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backdrop}>
            <CircularProgress color="inherit" />
         </Backdrop>
      </React.Fragment>
   );
}
