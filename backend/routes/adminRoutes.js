const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController')

// Get all admins
router.get('/', protect, admin, getAdmins)

// Create new admin
router.post('/', protect, admin, createAdmin)

// Update admin
router.put('/:id', protect, admin, updateAdmin)

// Delete admin
router.delete('/:id', protect, admin, deleteAdmin)

module.exports = router 