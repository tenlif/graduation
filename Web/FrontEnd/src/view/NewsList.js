import Box from "@mui/material/Box";
import {
    AppBar, Avatar,
    Button, Divider,
    IconButton,
    List,
    ListItem, ListItemButton,
    ListItemText, Paper,
    Toolbar,
    Typography
} from "@mui/material";
import * as React from "react";
import example from "../example.json";
import {useEffect, useState} from "react";
import API from "../API";

function NavBar(){
    function handleClick(){
        window.location.href = `/`
    }
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
                        News List
                    </Typography>
                    <Button color="inherit" style={{fontWeight: 'bold', fontSize: '20px'}} onClick={handleClick}>←</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

function ListElement(props) {
    const {title, press, url} = props;
    function handleClick(url){
        window.location.href = url
    }
    return(
        <>
            <ListItemButton alignItems="flex-start" onClick={()=>{handleClick(url)}}>
                <ListItemText
                    primary={title}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {press}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItemButton>
            <Divider />
        </>
    )
}

function AlignItemsList() {
    const [news,setNews] = useState([]);
    async function fetchNews(){
        const urlParams = new URLSearchParams(window.location.search);
        const d = await API.getNews(urlParams.get('t'), urlParams.get('keywords'));
        setNews(d);
    }

    useEffect(async () => {
        await fetchNews();
    },[]);

    return (
        <List sx={{bgcolor: 'background.paper' }}>
            {news.map((news, idx) =>
                <ListElement key={idx} title={news.title} url={news.url} press={news.press} />
            )}
        </List>
    );
}


function getStaticProps(){
    const data =  JSON.parse(JSON.stringify(example));
    return data;
}

export default function NewsList() {
    return (
        <>
            <NavBar/>
            <Paper sx={{margin:'30px'}}>
                <AlignItemsList/>
            </Paper>

        </>
    );
}