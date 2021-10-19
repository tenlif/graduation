const express = require('express')
const mongoose = require('mongoose');
const bodyParser  = require('body-parser');

const app = express()
const port = process.env.PORT || 8080

const db = mongoose.connection;
const Schema = mongoose.Schema;
const newsSchema = new Schema({
    time: 'string',
    clusters: 'array'
})
const News = mongoose.model('news', newsSchema)

db.on('error', console.error);
db.once('open', () => {
   console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost:27017/mydb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/rest/dates', (req, res) => {
    News.find({}, {"time":true, "_id":false}, (err, news) => {
        let rt = []
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(news);
    })
}
);

app.get('/rest/keywords', (req, res) => {
    if (!req.query.t) return res.status(404).json({error: 'no date'});
    News.findOne({"time":req.query.t}, (err, news) => {
        if(err) return res.status(500).json({error: err});
        if(!news) return res.status(404).json({error: 'news not found'});
        let rt = [];
        for(let i=0; i < news.clusters.length; i++){
            rt.push(news.clusters[i].keywords)
        }
        res.json(rt)
    })
}
)

app.get('/rest/news', (req, res) => {
    if (!req.query.t) return res.status(404).json({error: 'no date'});
    if (!req.query.keywords) return res.status(404).json({error: 'no keywords'});
    News.findOne({"time": req.query.t}, (err, news) => {
        if (err) return res.status(500).json({error: err});
        if (!news) return res.status(404).json({error: 'news not found'});
        let rt = [];
        for (let i=0; i < news.clusters.length; i++) {
            if(news.clusters[i].keywords == req.query.keywords){
                rt=news.clusters[i].news;
                break;
            }
        }
        res.json(rt)
    })
}
)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))