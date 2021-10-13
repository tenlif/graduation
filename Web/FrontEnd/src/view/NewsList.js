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
                        News List
                    </Typography>
                    <Button color="inherit" style={{fontWeight: 'bold', fontSize: '20px'}}>←</Button>
                </Toolbar>
            </AppBar>

        </Box>
    );
}

function ListElement(props) {
    const {news} = props;
    return(
        <>
            <ListItemButton alignItems="flex-start">
                <ListItemText
                    primary={news[1]["title"]}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                언론사
                            </Typography>
                            <br/>
                            {" — " + news[1]["preview"]}
                        </React.Fragment>
                    }
                />
            </ListItemButton>
            <Divider />
        </>
    )
}

function AlignItemsList() {
    const data = getStaticProps();
    return (
        <List sx={{bgcolor: 'background.paper' }}>
            {Object.entries(data["좌회전,차선,깜빡이,벌금,방향지시등"]).map((news, idx) =>
                <ListElement key={idx} news={news} />
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