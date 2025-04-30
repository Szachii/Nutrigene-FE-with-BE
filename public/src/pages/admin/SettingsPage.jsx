"use client"

import { useState } from "react"
import { Save, Store, CreditCard, Truck, Bell, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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

