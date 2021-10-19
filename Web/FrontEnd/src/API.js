import axios from "axios";

async function getTimes(){
    let data = []
    await axios.get('/rest/dates').then((Response)=>{
        data = Response.data
    }).catch((Error)=>{
        console.log(Error);
    })
    return data;
}

async function getKeywords(time){
    let data = []
    await axios.get(`/rest/keywords?t=${time}`).then((Response) => {
         data = Response.data
    }).catch((Error) => {
        console.log(Error);
    })
    return data;
}

async function getNews(time, keywords){
    let data = []
    await axios.get(`/rest/news?t=${time}&keywords=${keywords}`).then((Response) => {
        data = Response.data
    }).catch((Error) => {
        console.log(Error);
    })
    return data;
}


export default {getTimes, getKeywords, getNews}