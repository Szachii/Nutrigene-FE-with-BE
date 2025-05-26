const TeamMember = require('../models/teamMemberModel')
const asyncHandler = require('express-async-handler')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'team-members')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Only image files are allowed!'))
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image')

// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
const getTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await TeamMember.find({})
  res.json(teamMembers)
})

// @desc    Create a team member
// @route   POST /api/team-members
// @access  Private/Admin
const createTeamMember = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      res.status(400)
      throw new Error(err.message)
    }

    const { firstName, lastName, email, role, department } = req.body

    const teamMemberExists = await TeamMember.findOne({ email })

    if (teamMemberExists) {
      res.status(400)
      throw new Error('Team member already exists')
    }

    const teamMember = await TeamMember.create({
      firstName,
      lastName,
      email,
      role,
      department,
      image: req.file ? `/uploads/team-members/${req.file.filename}` : '/default-avatar.png'
    })

    if (teamMember) {
      res.status(201).json(teamMember)
    } else {
      res.status(400)
      throw new Error('Invalid team member data')
    }
  })
})

// @desc    Update a team member
// @route   PUT /api/team-members/:id
// @access  Private/Admin
const updateTeamMember = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      res.status(400)
      throw new Error(err.message)
    }

    const { firstName, lastName, email, role, department } = req.body

    const teamMember = await TeamMember.findById(req.params.id)

    if (!teamMember) {
      res.status(404)
      throw new Error('Team member not found')
    }

    // Check if email is being changed and if it's already in use
    if (email !== teamMember.email) {
      const emailExists = await TeamMember.findOne({ email })
      if (emailExists) {
        res.status(400)
        throw new Error('Email already in use')
      }
    }

    // Update fields
    teamMember.firstName = firstName || teamMember.firstName
    teamMember.lastName = lastName || teamMember.lastName
    teamMember.email = email || teamMember.email
    teamMember.role = role || teamMember.role
    teamMember.department = department || teamMember.department

    // Handle image update
    if (req.file) {
      // Delete old image if it exists and is not the default avatar
      if (teamMember.image && teamMember.image !== '/default-avatar.png') {
        const oldImagePath = path.join(__dirname, '..', teamMember.image)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      teamMember.image = `/uploads/team-members/${req.file.filename}`
    }

    const updatedTeamMember = await teamMember.save()
    res.json(updatedTeamMember)
  })
})

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
// @access  Private/Admin
const deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id)

  if (!teamMember) {
    res.status(404)
    throw new Error('Team member not found')
  }

  // Delete the team member's image if it exists and is not the default avatar
  if (teamMember.image && teamMember.image !== '/default-avatar.png') {
    const imagePath = path.join(__dirname, '..', teamMember.image)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
  }

  await teamMember.deleteOne()
  res.json({ message: 'Team member removed successfully' })
})

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} 