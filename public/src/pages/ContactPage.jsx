"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "general",
          message: "",
        })

        // Reset submission status after a delay
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      }, 1500)
    }
  }

  // FAQ data
  const faqs = [
    
    {
      question: "How long do your cookies stay fresh?",
      answer:
        "Our cookies stay fresh for up to 7 days when stored in an airtight container at room temperature. For longer storage, you can freeze them for up to 3 months.",
    },
    
    {
      question: "Can I customize my order for special occasions?",
      answer:
        "We offer custom orders for special occasions like birthdays, weddings, and corporate events. Please contact us at least 7 days in advance for custom orders.",
    },
    {
      question: "What is your return policy?",
      answer:
        "Due to the perishable nature of our products, we cannot accept returns. However, if you're not completely satisfied with your order, please contact us within 24 hours of delivery and we'll make it right.",
    },
   
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Contact Us</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Form
              </TabsTrigger>
              
            </TabsList>

            <TabsContent value="contact">
              {isSubmitted ? (
                <div className="rounded-lg border bg-green-50 p-6 text-center dark:bg-green-900/20">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={formErrors.name ? "border-destructive" : ""}
                      />
                      {formErrors.name && <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? "border-destructive" : ""}
                      />
                      {formErrors.email && <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <RadioGroup
                      name="subject"
                      value={formData.subject}
                      onValueChange={(value) => handleInputChange({ target: { name: "subject", value } })}
                      className="mt-2"
                    >
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general" className="font-normal">
                            General Inquiry
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="order" id="order" />
                          <Label htmlFor="order" className="font-normal">
                            Order Support
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="wholesale" id="wholesale" />
                          <Label htmlFor="wholesale" className="font-normal">
                            Wholesale
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="feedback" id="feedback" />
                          <Label htmlFor="feedback" className="font-normal">
                            Feedback
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={formErrors.message ? "border-destructive" : ""}
                    />
                    {formErrors.message && <p className="mt-1 text-xs text-destructive">{formErrors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>

            
          </Tabs>

          {/* FAQ Section */}
          <div className="mt-8 rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div>
          {/* Contact Information */}
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">Bogahamula Waththa,</p>
                  <p className="text-muted-foreground">Negombo Road,Uhumeeya</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">077-9077603</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">Nutrigene@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-muted-foreground">Monday - Friday: 9am - 6pm</p>
                  <p className="text-muted-foreground">Saturday: 9am - 4pm</p>
                  <p className="text-muted-foreground">Sunday:9am-12pm </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6 rounded-lg border bg-background p-6 shadow-sm">
  <h2 className="mb-4 text-xl font-semibold">Find Us</h2>
  <div className="aspect-square overflow-hidden rounded-md bg-muted">
    <iframe
      title="Google Map"
      className="h-full w-full rounded-md"
      src="https://www.google.com/maps/place//@6.9218387,79.8562055,11z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>


          {/* Social Media */}
          <div className="mt-6 rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Connect With Us</h2>
            <div className="flex justify-between">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm3.8 5.2c.4 0 .8.3.8.8 0 .4-.3.8-.8.8-.4 0-.8-.3-.8-.8 0-.5.3-.8.8-.8zM12 7c1.7 0 3.1.5 4.1 1.5 1 1 1.5 2.3 1.5 4.1 0 1.7-.5 3.1-1.5 4.1-1 1-2.3 1.5-4.1 1.5-1.7 0-3.1-.5-4.1-1.5-1-1-1.5-2.3-1.5-4.1 0-1.7.5-3.1 1.5-4.1C8.9 7.5 10.3 7 12 7zm0 2c-1.1 0-2 .4-2.7 1.1-.7.7-1.1 1.6-1.1 2.7 0 1.1.4 2 1.1 2.7.7.7 1.6 1.1 2.7 1.1 1.1 0 2-.4 2.7-1.1.7-.7 1.1-1.6 1.1-2.7 0-1.1-.4-2-1.1-2.7-.7-.7-1.6-1.1-2.7-1.1z" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

