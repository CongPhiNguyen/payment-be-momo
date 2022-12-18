const express = require("express")
const cors = require("cors")
var cookieParser = require("cookie-parser")
const route = require("./routes")

const app = express()

app.use(cookieParser())

app.use(
  cors({
    credentials: true,
    origin: true
  })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

route(app)

// set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
