require("dotenv").config()
import jwt from "jsonwebtoken"

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 3 * 24 * 60 * 60, //time in secs => 3 days
    }
  )
}

export default createToken
