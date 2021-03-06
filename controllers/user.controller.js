import bcrypt from "bcrypt"
import createToken from "../utils/createToken"
const db = require("../models")
const User = db.rest.models.user

exports.login = async (req, res) => {}

exports.getAllUsers = async (req, res) => {
  // authenticate
  const users = await User.findAll()
  if (!users) {
    return res.status(400).send({
      message: "Something wrong happened`",
    })
  }
  res.status(200).send(users)
}

exports.getUser = async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({
    where: {
      id,
    },
  })
  if (!user) {
    return res.status(400).send({
      message: `No user found with ${id}`,
    })
  }
  return res.send({
    user,
  })
}

exports.createUser = async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password) {
    res.status(400).json({
      message: "Must include username or password",
    })
  }
  const usernameExists = await User.findOne({
    where: {
      username,
    },
  })
  if (usernameExists) {
    res.status(400).json({
      message: `${username} already exists, try a new name`,
    })
  }
  const emailExists = await User.findOne({
    where: {
      email,
    },
  })
  if (emailExists) {
    res.status(400).json({
      message: `${email} is already registered! `,
    })
  }

  try {
    const salt = await bcrypt.genSalt()
    const hashedP = await bcrypt.hash(password, salt)
    const user = await User.create({
      username,
      password: hashedP,
      email,
    })

    // token not being recieved in brower
    const token = createToken(user.id)
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3, //3 days represented in milisecs
    })
    res.send(user)
  } catch (e) {
    return res.status(500).send({
      message: e,
    })
  }
}

exports.updateUser = async (req, res) => {
  const id = req.params.id
  const { username, password, email } = req.body
  const user = await User.findOne({
    where: {
      id,
    },
  })
  if (!user) {
    return res.status(400).send({
      message: "User not found",
    })
  }
  try {
    if (username) {
      user.username = username
    }
    if (password) {
      const salt = await bcrypt.genSalt()
      const hashedP = await bcrypt.hash(password, salt)
      user.password = hashedP
    }
    if (email) {
      user.email = email
    }
    user.save()
    return res.status(200).send(user)
  } catch (e) {
    return res.status(500).send({
      message: e,
    })
  }
}
exports.deleteUser = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).send({
      message: "provide Id of user you want deleted",
    })
  }
  const user = await User.findOne({
    where: {
      id,
    },
  })
  if (!user) {
    return res.status(400).send({
      message: "User not found",
    })
  }
  try {
    await user.destroy()
    return res.status(200).send({
      message: "User has been deleted",
    })
  } catch (e) {
    return res.status(500).send({
      message: e,
    })
  }
}
