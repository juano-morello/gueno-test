const express = require('express')
const axios = require("axios");
const app = express()
app.use(express.json());
const port = 3000
const baseGuenoUrl = 'https://api-gueno.dev.gueno.com/api'

let jwt = ''

app.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    jwt = await (await axios.post(baseGuenoUrl.concat('/auth/login'), {email: email, password: password})).data.access_token
    res.status(200).send(jwt)
})

app.post('/client', async (req, res) => {
    const queryEmail = req.body.email
    const startDate = req.body.startDate
    const endDate = req.body.endDate

    const rawData = await (await axios.get(`${baseGuenoUrl}/client/clientConsumptions/${queryEmail}`, {headers: {Authorization: "Bearer " + jwt}}))
    const filteredData = rawData.data.data.filter(entry => entry.date < endDate && entry.date > startDate)

    console.log(rawData.data.data.length)
    console.log(filteredData.length)
    res.status(200).send(filteredData)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})