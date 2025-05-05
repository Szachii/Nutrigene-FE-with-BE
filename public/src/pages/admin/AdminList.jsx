"use client"

import { useState, useEffect } from "react"
import { Plus, User, Shield, Trash2, Edit2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"

const AdminList = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://localhost:5000/api/users/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch admins')
      }

      const data = await response.json()
      setAdmins(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching admins:", error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingAdmin) {
      setEditingAdmin(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setNewAdmin(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError(null)

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Log the data being sent
    console.log('Sending admin data:', {
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      email: newAdmin.email,
      password: newAdmin.password
    })

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://localhost:5000/api/users/admins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: newAdmin.firstName.trim(),
          lastName: newAdmin.lastName.trim(),
          email: newAdmin.email.trim(),
          password: newAdmin.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server response:', errorData)
        throw new Error(errorData.message || 'Failed to add admin')
      }

      // Reset form and close dialog
      setNewAdmin({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
      setIsDialogOpen(false)
      
      // Refresh admin list
      fetchAdmins()
      toast.success('Admin created successfully')
    } catch (error) {
      console.error("Error adding admin:", error)
      setError(error.message)
      toast.error(error.message)
    }
  }

  const handleEditAdmin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`http://localhost:5000/api/users/admins/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingAdmin.name,
          email: editingAdmin.email,
          password: editingAdmin.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update admin')
      }

      setEditingAdmin(null)
      fetchAdmins()
      toast.success('Admin updated successfully')
    } catch (error) {
      console.error("Error updating admin:", error)
      setError(error.message)
      toast.error(error.message)
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`http://localhost:5000/api/users/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete admin')
      }

      fetchAdmins()
      toast.success('Admin deleted successfully')
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast.error(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">Manage system administrators</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin account with full access to the admin dashboard.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newAdmin.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newAdmin.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type="submit">Create Admin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin List</CardTitle>
          <CardDescription>All system administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin._id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={editingAdmin?._id === admin._id} onOpenChange={(open) => !open && setEditingAdmin(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setEditingAdmin(admin)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Admin</DialogTitle>
                        <DialogDescription>
                          Update administrator account
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditAdmin} className="space-y-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={editingAdmin?.name || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editingAdmin?.email || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={editingAdmin?.password || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update Admin</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDeleteAdmin(admin._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminList 