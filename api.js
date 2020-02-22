exports.run = (client) => {
    const express = require("express")
    const app = express();
    app.use(express.json());

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    
    app.get('/commands', (req, res) => {
        res.type('json')
        const DBFilter = client.commands.filter(e => e.info)
        const map = DBFilter.map(e => {return e.info})
        const sorted = map.sort((a, b) => a.name.localeCompare(b.name))
        res.send(sorted)
    })
      
    app.listen(client.config.port, () => {
        console.log(`server running on port ${client.config.port}`)
    });
}