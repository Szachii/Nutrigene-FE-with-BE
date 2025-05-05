"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const API_URL = "http://localhost:5000"

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id !== "new"

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    stockCount: "0",
    image: "",
    shortDescription: "",
    description: "",
    category: "",
    demand: "medium",
    featured: false,
    isNew: false,
    isLimited: false,
    ingredients: "",
    discount: "0",
    season: "",
    expiryDate: "",
  })

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [apiError, setApiError] = useState(null)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${API_URL}/api/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setApiError(error.message)
      }
    }

    fetchCategories()
  }, [])

  // Fetch product data if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditing) {
        try {
          setLoading(true)
          const token = localStorage.getItem('token')
          if (!token) {
            throw new Error('No authentication token found')
          }

          const response = await fetch(`${API_URL}/api/products/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch product')
          }

          const product = await response.json()
          setFormData({
            ...product,
            ingredients: product.ingredients.join(", "),
            discount: product.discount ? product.discount.toString() : "0",
            price: product.price.toString(),
          })
          setLoading(false)
        } catch (error) {
          console.error("Error fetching product:", error)
          setApiError(error.message)
          setLoading(false)
          navigate("/admin/products")
        }
      } else {
        // Initialize with default values for new product
        setFormData({
          id: "",
          name: "",
          price: "",
          stockCount: "0",
          image: "/placeholder.svg",
          shortDescription: "",
          description: "",
          category: "",
          demand: "medium",
          featured: false,
          isNew: false,
          isLimited: false,
          ingredients: "",
          discount: "0",
          season: "none",
          expiryDate: "",
        })
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isEditing, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.id.trim()) {
      newErrors.id = "Product ID is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.stockCount.trim()) {
      newErrors.stockCount = "Stock count is required"
    } else if (isNaN(Number.parseInt(formData.stockCount)) || Number.parseInt(formData.stockCount) < 0) {
      newErrors.stockCount = "Stock count must be a non-negative number"
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
    } else {
      const selectedDate = new Date(formData.expiryDate)
      const today = new Date()
      if (selectedDate < today) {
        newErrors.expiryDate = "Expiry date must be in the future"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    if (validateForm()) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        // Ensure expiry date is included and properly formatted
        const productData = {
          ...formData,
          price: Number.parseFloat(formData.price),
          stockCount: Number.parseInt(formData.stockCount),
          discount: Number.parseInt(formData.discount) || 0,
          ingredients: formData.ingredients
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
          expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
          isNewProduct: formData.isNewProduct || false
        }

        console.log('Submitting product data:', productData); // Debug log

        const url = isEditing 
          ? `${API_URL}/api/products/${id}`
          : `${API_URL}/api/products`
        const method = isEditing ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to save product')
        }

        navigate("/admin/products")
      } catch (error) {
        console.error("Error saving product:", error)
        setApiError(error.message)
      }
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete product')
      }

      navigate("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      setApiError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  const seasons = ["current", "upcoming", "holiday", "limited", ""]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? `Edit Product: ${formData.name}` : "Add New Product"}
          </h1>
        </div>
        {isEditing && (
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Product
          </Button>
        )}
      </div>

      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="id">Product ID</Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className={errors.id ? "border-destructive" : ""}
                placeholder="e.g., PROD-001"
              />
              {errors.id && <p className="text-sm text-destructive">{errors.id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (LKR)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockCount">Stock Count</Label>
                <Input
                  id="stockCount"
                  name="stockCount"
                  type="number"
                  value={formData.stockCount}
                  onChange={handleInputChange}
                  className={errors.stockCount ? "border-destructive" : ""}
                  min="0"
                />
                {errors.stockCount && <p className="text-sm text-destructive">{errors.stockCount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.expiryDate ? "border-destructive" : ""}
                />
                {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={(value) => handleInputChange({ target: { name: "category", value } })}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label>Demand Level</Label>
                <RadioGroup
                  name="demand"
                  value={formData.demand}
                  onValueChange={(value) => handleInputChange({ target: { name: "demand", value } })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Product Status</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleInputChange({ target: { name: "featured", type: "checkbox", checked } })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNew"
                      name="isNew"
                      checked={formData.isNew}
                      onCheckedChange={(checked) =>
                        handleInputChange({ target: { name: "isNew", type: "checkbox", checked } })
                      }
                    />
                    <Label htmlFor="isNew">New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isLimited"
                      name="isLimited"
                      checked={formData.isLimited}
                      onCheckedChange={(checked) =>
                        handleInputChange({ target: { name: "isLimited", type: "checkbox", checked } })
                      }
                    />
                    <Label htmlFor="isLimited">Limited Edition</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="/placeholder.svg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={2}
                className={errors.shortDescription ? "border-destructive" : ""}
              />
              {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                rows={3}
                placeholder="Flour, Sugar, Butter, etc."
              />
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Product Preview</h3>
                <p className="text-sm text-muted-foreground">This is how your product will appear in the store</p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Product
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="h-48 w-full overflow-hidden rounded-md bg-muted md:w-48">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.name || "Product preview"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{formData.name || "Product Name"}</h3>
                <div className="mt-1 flex gap-2">
                  {formData.isNew && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
                      New
                    </span>
                  )}
                  {formData.isLimited && (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-800/20 dark:text-amber-400">
                      Limited Edition
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      formData.demand === "high"
                        ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        : formData.demand === "medium"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400"
                    }`}
                  >
                    {formData.demand === "high" ? "High Demand" : formData.demand === "medium" ? "Popular" : "Try Me"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formData.shortDescription || "Short product description"}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {Number.parseFloat(formData.discount) > 0 ? (
                    <>
                      <span className="text-xl font-bold">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
                          Number.parseFloat(formData.price) * (1 - Number.parseFloat(formData.discount) / 100)
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
                          Number.parseFloat(formData.price)
                        )}
                      </span>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-800/20 dark:text-red-400">
                        {formData.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">
                      {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
                        Number.parseFloat(formData.price || 0)
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default ProductForm

