const express = require('express')
const router = express.Router()
const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamMemberController')
const { protect, admin } = require('../middleware/authMiddleware')

// Get all team members (public)
router.get('/', getTeamMembers)

// Protected routes (admin only)
router.post('/', protect, admin, createTeamMember)
router.put('/:id', protect, admin, updateTeamMember)
router.delete('/:id', protect, admin, deleteTeamMember)

module.exports = router 