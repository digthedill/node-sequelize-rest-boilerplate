import "dotenv/config"
import express from "express"
const morgan = require("morgan")
import helmet from "helmet"
import cookieParser from "cookie-parser"
import cors from "cors"
import fs from "fs"
import path from "path"
import routes from "./routes"

const app = express()

app.use(helmet())
app.use(morgan("combined"))
app.use(cors({ credentials: true, origin: "http://localhost:3000" })) //change for production
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())

app.use("/user", routes.user)

// setup credentials for cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true)
  next()
})

app.use((req, res) => {
  res.status(404).send("Page not Found")
})

const port = process.env.PORT || 8600

app.listen(port, () => {
  console.log("serving on " + port)
})
