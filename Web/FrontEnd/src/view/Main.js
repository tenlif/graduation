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
import API from "../API";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function NavBar(props){
    const {times} = props
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
                    <FadeMenu times={times}/>
                </Toolbar>
            </AppBar>

        </Box>
    );
}

function FadeMenu(props) {
    function timeFormat(timestring){
        if(timestring === undefined){
            return ''
        }else {
            return timestring.slice(0, 4) + '-' + timestring.slice(4, 6) + '-' + timestring.slice(6, 8) + ' ' +
                timestring.slice(8, 10) + ':' + timestring.slice(10, 12) + ':' + timestring.slice(12, 14)
        }
    }
    const {times} = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let time = ''
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('t')){
        time = times[times.length-1]
    }
    else{
        time = urlParams.get('t')
    }

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
                {timeFormat(time)}
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
                {times.map(time => <Link to={`?t=${time}`}><MenuItem onClick={handleClose}>{timeFormat(time)}</MenuItem></Link>)}
            </Menu>
        </div>
    );
}

function GridComponent(props) {
    function handleClick(time, keywords){
        window.location.href = `/list?t=${time}&keywords=${keywords}`
    }
    const { keywords, time } = props;
    return (
        <Grid item xs={4}>
            <Paper>
                <ListItemButton onClick={() => {handleClick(time, keywords)}}>
                    <Box sx={{ minHeight: '150px', padding: '20px', textAlign: 'center'}}>
                        {keywords.split(',').map(keyword => <h3 style={{fontSize: '30px', display:'inline', margin: '5px'}}>#{keyword} </h3>)}
                    </Box>
                </ListItemButton>
            </Paper>
        </Grid>
    )
}

export default function Main() {
    const [times,setTimes] = useState({});
    const [keywords, setKeywords] = useState([]);

    async function fetchTimes(){
        const d = await API.getTimes();
        setTimes(d);
    }

    async function fetchKeywords(time){
        const d = await API.getKeywords(time);
        setKeywords(d);
    }

    let time = ''
    const urlParams = new URLSearchParams(window.location.search);

    let times_arr = []
    for(let i=0; i < times.length; i++){
        times_arr.push(times[i]['time'])
    }

    if (!urlParams.has('t')){
        time = times_arr[times_arr.length-1]
    }
    else{
        time = urlParams.get('t')
    }

    useEffect(async () => {
        await fetchTimes();
        await fetchKeywords(time)
    },[time]);

    return (
        <>
            <NavBar times={times_arr}/>
            <Box sx={{ padding: '30px' }}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {keywords.map((keywords, idx) =>
                        <GridComponent key={idx} keywords={keywords} time={time} />
                    )}
                </Grid>
            </Box>
        </>
    );
}
