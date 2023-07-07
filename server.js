const https = require('https')
const http = require('http')
const fs = require('fs');
var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var R = require('ramda')
const path = require('path')
//require('dotenv').config();

/*
const cert = fs.readFileSync('/etc/letsencrypt/live/nftarena.cc/cert.pem');
const ca = fs.readFileSync('/etc/letsencrypt/live/nftarena.cc/chain.pem');
const key = fs.readFileSync('/etc/letsencrypt/live/nftarena.cc/privkey.pem');
var options = {
  key: key,
  cert: cert
};
*/ var options = {}

var app = express()

app.use(express.static(path.resolve(__dirname, './dist')))
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.options('*', cors())
app.options(options)

let hydroponicRunning = false
let timer = null
let interval = 600000 // timer interval in ms

//routes
app.get('/hydroponic/:status', function(req, res) {
  if (req.params.status === "nice") {
    hydroponicRunning = true
    timer = Date.now() + interval + 10; // we add 10ms here for safety

    console.log("running: ", hydroponicRunning)
    
    new Promise((resolve, reject) => {
      setTimeout(resolve, interval)
    }).then(() => {
      
      console.log("timeout resolved: ", Date.now() - timer)
      if (Date.now() - timer > 0) hydroponicRunning = false
    })
    res.send({info: "hydroponic running for "+interval+"ms"})
    
  }
  else
    res.send({youlike: "yes"})
})

app.get('/hydroponic', function(req, res) {
  if (hydroponicRunning)
    res.send({running: true})
  else
    res.status(500).send({running: false})
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(options, app)
const httpPort = 8080
const httpsPort = 443

httpServer.listen(httpPort, () => {
  console.log('HTTP Server running on port '+httpPort)
})

/*
httpsServer.listen(httpsPort, () => {
  console.log('HTTPS Server running on port '+httpsPort)
})
*/
