const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')

// @desc    Get all admins
// @route   GET /api/users/admins
// @access  Private/Admin
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ isAdmin: true }).select('-password')
  res.json(admins)
})

// @desc    Create new admin
// @route   POST /api/users/admins
// @access  Private/Admin
const createAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  // Log received data
  console.log('Received admin data:', { firstName, lastName, email })

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    console.log('Missing fields:', {
      firstName: !firstName,
      lastName: !lastName,
      email: !email,
      password: !password
    })
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    res.status(400)
    throw new Error('Please provide a valid email address')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    isAdmin: true
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Update admin
// @route   PUT /api/users/admins/:id
// @access  Private/Admin
const updateAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Delete admin
// @route   DELETE /api/users/admins/:id
// @access  Private/Admin
const deleteAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.deleteOne()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} 