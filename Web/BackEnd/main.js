const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/rest/dates', (req, res) => {
    res.send('Hello World!')
}
)

app.get('/rest/keywords', (req, res) => {
        res.send('Hello World!')
    }
)

app.get('/rest/news', (req, res) => {
        res.send('Hello World!')
    }
)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))