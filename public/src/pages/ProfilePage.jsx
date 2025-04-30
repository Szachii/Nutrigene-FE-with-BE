"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { useAuth } from "@/contexts/AuthContext"

const ProfilePage = () => {
  const { user, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
      })
    } else {
      navigate("/login")
    }
  }, [user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      setSuccess("")
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        const data = await response.json()
        if (response.ok) {
          setSuccess("Profile updated successfully!")
          localStorage.setItem('token', data.token)
        } else {
          setErrors({ form: data.message || "Failed to update profile" })
        }
      } catch (error) {
        setErrors({ form: "An error occurred. Please try again." })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true)
      try {
        await deleteAccount()
        navigate("/login", { state: { message: "Account deleted successfully." } })
      } catch (error) {
        setErrors({ form: error.message || "Failed to delete account" })
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!user) return null

  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Avatar className="mx-auto mb-4">
            <AvatarImage src="" alt={`${formData.firstName} ${formData.lastName}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your Sweet Bytes account details</p>
        </div>

        {errors.form && (
          <div className="mb-6 rounded-md bg-destructive/10 p-3 text-center text-destructive">{errors.form}</div>
        )}
        {success && (
          <div className="mb-6 rounded-md bg-green-100 p-3 text-center text-green-700">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">New Password (optional)</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Updating profile...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Account
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage