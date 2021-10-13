import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {AppBar, ListItemButton} from "@mui/material";
import {Toolbar} from "@mui/material";
import {IconButton} from "@mui/material";
import {Typography} from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Button} from "@mui/material";
import {Fade} from "@mui/material";


import example from '../example.json'

import './Main.css';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function NavBar(){
    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News Keywords
                    </Typography>
                    <FadeMenu/>
                </Toolbar>
            </AppBar>

        </Box>
    );
}

function FadeMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="fade-button"
                aria-controls="fade-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="inherit"
            >
                Dashboard
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    );
}

function GridComponent(props) {
    const { news } = props;
    return (
        <Grid item xs={4}>
            <Paper>
            <ListItemButton>
                    <Box sx={{ minHeight: '150px', padding: '20px', textAlign: 'center'}}>
                        {news[0].split(',').map(keyword => <h3 style={{fontSize: '30px', display:'inline', margin: '5px'}}>#{keyword} </h3>)}
                    </Box>
                </ListItemButton>
            </Paper>
        </Grid>
    )
}

function getStaticProps(){
    const data =  JSON.parse(JSON.stringify(example));
    return data;
}

export default function Main() {
    const data = getStaticProps();
    return (
        <>
            <NavBar/>
            <Box sx={{ padding: '30px' }}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {Object.entries(data).map((news, idx) =>
                        <GridComponent key={idx} news={news} />
                    )}
                </Grid>
            </Box>
        </>
    );
}
