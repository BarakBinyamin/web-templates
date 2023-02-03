const express = require('express')
const fs      = require('fs')
const app     = express()
const PORT    = 3000

app.get("/", (req,res)=>{
    res.sendFile("index.html", {root:'.'})
})

// serve the socket.io js files
app.use("/socket.io", express.static("socket.io", {'root':'.'}))

/* Start Setup websockets */
const http                  = require('http')
const server                = http.createServer(app)
const { Server }            = require("socket.io")
const io                    = new Server(server)
/* End Setup websockets */

io.on("connection", (socket) => {
    const socketid     = socket.id
    let packetsRecieved = 0
    console.log(`New Client connected with id ${socketid}`)
    socket.on("someEvent", (data)=>{
        packetsRecieved++
        console.log(`Recieved data packet ${packetsRecieved}`)
        fs.appendFileSync("test.mp4", data)
    })

    socket.on("end", ()=>{
        console.log(`Disconnecting client with id ${socketid}...`)
        socket.disconnect()
    })

    socket.on("disconnect", ()=>{
        console.log(`Client disconected: ${socketid}`)
    })
})

server.listen(PORT, () => {
  console.log(`Serving on http://localhost:${PORT}`);
})
  

