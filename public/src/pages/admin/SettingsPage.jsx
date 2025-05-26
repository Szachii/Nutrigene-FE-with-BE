"use client"

import { useState, useEffect } from "react"
import { Save, Store, CreditCard, Truck, Bell, Palette, Users, Edit2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"

const SettingsPage = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Nutrigene",
    storeEmail: "info@nutrigene.com",
    storePhone: "(037) 123-4567",
    storeAddress: "123 Cookie Lane, Sweet City",
    storeCurrency: "LKR",
    storeDescription: "Handcrafted cookies made with the finest ingredients, baked fresh daily with love.",
    logo: "/Logo.jpg",
    favicon: "/placeholder.svg",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    enableCreditCard: true,
    enablePaypal: true,
    taxRate: "8",
    enableTax: true,
  })

  const [shippingSettings, setShippingSettings] = useState({
    enableStandardShipping: true,
    standardShippingRate: "4.99",
    enableExpressShipping: true,
    expressShippingRate: "9.99",
    freeShippingThreshold: "50",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newCustomer: true,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#f59e0b",
    accentColor: "#f59e0b",
    enableDarkMode: true,
  })

  const [teamMembers, setTeamMembers] = useState([])
  const [newTeamMember, setNewTeamMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
    image: null
  })
  const [editingMember, setEditingMember] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)

  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target
    setStoreSettings({
      ...storeSettings,
      [name]: value,
    })
  }

  const handlePaymentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAppearanceSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleTeamMemberChange = (e) => {
    const { name, value } = e.target
    setNewTeamMember({
      ...newTeamMember,
      [name]: value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewTeamMember({
        ...newTeamMember,
        image: file
      })
    }
  }

  const handleAddTeamMember = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const formData = new FormData()
      formData.append('firstName', newTeamMember.firstName)
      formData.append('lastName', newTeamMember.lastName)
      formData.append('email', newTeamMember.email)
      formData.append('role', newTeamMember.role)
      formData.append('department', newTeamMember.department)
      if (newTeamMember.image) {
        formData.append('image', newTeamMember.image)
      }

      const response = await fetch('http://localhost:5000/api/team-members', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to add team member')
      }

      const data = await response.json()
      setTeamMembers([...teamMembers, data])
      setNewTeamMember({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        department: "",
        image: null
      })
      toast.success('Team member added successfully')
    } catch (error) {
      console.error("Error adding team member:", error)
      toast.error(error.message)
    }
  }

  const handleEditMember = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const formData = new FormData()
      formData.append('firstName', editingMember.firstName)
      formData.append('lastName', editingMember.lastName)
      formData.append('email', editingMember.email)
      formData.append('role', editingMember.role)
      formData.append('department', editingMember.department)
      if (editingMember.image instanceof File) {
        formData.append('image', editingMember.image)
      }

      const response = await fetch(`http://localhost:5000/api/team-members/${editingMember._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update team member')
      }

      const updatedMember = await response.json()
      setTeamMembers(teamMembers.map(member => 
        member._id === updatedMember._id ? updatedMember : member
      ))
      setIsEditDialogOpen(false)
      setEditingMember(null)
      toast.success('Team member updated successfully')
    } catch (error) {
      console.error("Error updating team member:", error)
      toast.error(error.message)
    }
  }

  const handleDeleteMember = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`http://localhost:5000/api/team-members/${memberToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete team member')
      }

      setTeamMembers(teamMembers.filter(member => member._id !== memberToDelete._id))
      setIsDeleteDialogOpen(false)
      setMemberToDelete(null)
      toast.success('Team member deleted successfully')
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast.error(error.message)
    }
  }

  const handleEditClick = (member) => {
    setEditingMember({
      ...member,
      image: null
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (member) => {
    setMemberToDelete(member)
    setIsDeleteDialogOpen(true)
  }

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/team-members')
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }
        const data = await response.json()
        // Transform the data to include full image URLs
        const transformedData = data.map(member => ({
          ...member,
          image: member.image && member.image !== '/default-avatar.png'
            ? `http://localhost:5000${member.image}`
            : '/default-avatar.png'
        }))
        setTeamMembers(transformedData)
      } catch (error) {
        console.error("Error fetching team members:", error)
        toast.error("Failed to load team members")
      }
    }

    fetchTeamMembers()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your store details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={storeSettings.storeName}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCurrency">Currency</Label>
                  <Input
                    id="storeCurrency"
                    name="storeCurrency"
                    value={storeSettings.storeCurrency}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    name="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone</Label>
                  <Input
                    id="storePhone"
                    name="storePhone"
                    value={storeSettings.storePhone}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Textarea
                  id="storeAddress"
                  name="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={handleStoreSettingsChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={handleStoreSettingsChange}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo">Store Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <img
                        src={storeSettings.logo || "/Logo.jpg"}
                        alt="Store Logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      Change Logo
                    </Button>
                  </div>
                </div>

                
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure payment options for your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="enableCreditCard" className="font-medium">
                      Credit Card
                    </Label>
                  </div>
                  <Switch
                    id="enableCreditCard"
                    name="enableCreditCard"
                    checked={paymentSettings.enableCreditCard}
                    onCheckedChange={(checked) =>
                      handlePaymentSettingsChange({ target: { name: "enableCreditCard", type: "checkbox", checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 8.5H4.5C3.4 8.5 2.5 9.4 2.5 10.5V17.5C2.5 18.6 3.4 19.5 4.5 19.5H19.5C20.6 19.5 21.5 18.6 21.5 17.5V10.5C21.5 9.4 20.6 8.5 19.5 8.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 15.5H7.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 11.5H20.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Label htmlFor="enablePaypal" className="font-medium">
                      PayPal
                    </Label>
                  </div>
                  <Switch
                    id="enablePaypal"
                    name="enablePaypal"
                    checked={paymentSettings.enablePaypal}
                    onCheckedChange={(checked) =>
                      handlePaymentSettingsChange({ target: { name: "enablePaypal", type: "checkbox", checked } })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTax" className="font-medium">
                      Enable Tax
                    </Label>
                    <p className="text-sm text-muted-foreground">Apply tax to orders</p>
                  </div>
                  <Switch
                    id="enableTax"
                    name="enableTax"
                    checked={paymentSettings.enableTax}
                    onCheckedChange={(checked) =>
                      handlePaymentSettingsChange({ target: { name: "enableTax", type: "checkbox", checked } })
                    }
                  />
                </div>

                {paymentSettings.enableTax && (
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={paymentSettings.taxRate}
                      onChange={handlePaymentSettingsChange}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAddTeamMember} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newTeamMember.firstName}
                      onChange={handleTeamMemberChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newTeamMember.lastName}
                      onChange={handleTeamMemberChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newTeamMember.email}
                      onChange={handleTeamMemberChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={newTeamMember.role}
                      onChange={handleTeamMemberChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={newTeamMember.department}
                      onChange={handleTeamMemberChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full border">
                        <img
                          src={newTeamMember.image ? URL.createObjectURL(newTeamMember.image) : "/default-avatar.png"}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('image').click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="gap-2">
                  <Users className="h-4 w-4" />
                  Add Team Member
                </Button>
              </form>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Team Members</h3>
                <div className="grid gap-4">
                  {teamMembers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full border">
                          <img
                            src={member.image}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">{member.role} - {member.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditClick(member)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDeleteClick(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Team Member Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                    <DialogDescription>
                      Update the team member's information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditMember} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="editFirstName">First Name</Label>
                        <Input
                          id="editFirstName"
                          name="firstName"
                          value={editingMember?.firstName || ''}
                          onChange={(e) => setEditingMember({...editingMember, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editLastName">Last Name</Label>
                        <Input
                          id="editLastName"
                          name="lastName"
                          value={editingMember?.lastName || ''}
                          onChange={(e) => setEditingMember({...editingMember, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="editEmail">Email</Label>
                        <Input
                          id="editEmail"
                          name="email"
                          type="email"
                          value={editingMember?.email || ''}
                          onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editRole">Role</Label>
                        <Input
                          id="editRole"
                          name="role"
                          value={editingMember?.role || ''}
                          onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="editDepartment">Department</Label>
                        <Input
                          id="editDepartment"
                          name="department"
                          value={editingMember?.department || ''}
                          onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editImage">Profile Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-full border">
                            <img
                              src={editingMember?.image instanceof File 
                                ? URL.createObjectURL(editingMember.image) 
                                : editingMember?.image || "/default-avatar.png"}
                              alt="Profile Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              id="editImage"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  setEditingMember({...editingMember, image: file})
                                }
                              }}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('editImage').click()}
                              className="w-full"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Change Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Team Member</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {memberToDelete?.firstName} {memberToDelete?.lastName}? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDeleteMember}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the look and feel of your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    name="theme"
                    value={appearanceSettings.theme}
                    onChange={handleAppearanceSettingsChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableDarkMode" className="font-medium">
                      Enable Dark Mode Toggle
                    </Label>
                    <Switch
                      id="enableDarkMode"
                      name="enableDarkMode"
                      checked={appearanceSettings.enableDarkMode}
                      onCheckedChange={(checked) =>
                        handleAppearanceSettingsChange({
                          target: { name: "enableDarkMode", type: "checkbox", checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={appearanceSettings.primaryColor}
                      onChange={handleAppearanceSettingsChange}
                      className="h-10 w-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={appearanceSettings.primaryColor}
                      onChange={handleAppearanceSettingsChange}
                      name="primaryColor"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="accentColor"
                      name="accentColor"
                      value={appearanceSettings.accentColor}
                      onChange={handleAppearanceSettingsChange}
                      className="h-10 w-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={appearanceSettings.accentColor}
                      onChange={handleAppearanceSettingsChange}
                      name="accentColor"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Theme Preview</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-md border">
                    <div className="bg-background p-4">
                      <div className="mb-4 h-8 w-24 rounded-md bg-primary"></div>
                      <div className="mb-2 h-4 w-full rounded-md bg-muted"></div>
                      <div className="mb-2 h-4 w-2/3 rounded-md bg-muted"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-16 rounded-md bg-primary"></div>
                        <div className="h-8 w-16 rounded-md bg-secondary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-md border">
                    <div className="bg-background p-4 dark">
                      <div className="mb-4 h-8 w-24 rounded-md bg-primary"></div>
                      <div className="mb-2 h-4 w-full rounded-md bg-muted"></div>
                      <div className="mb-2 h-4 w-2/3 rounded-md bg-muted"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-16 rounded-md bg-primary"></div>
                        <div className="h-8 w-16 rounded-md bg-secondary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage

