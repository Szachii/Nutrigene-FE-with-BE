import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Nutrigene</h3>
            <p className="mb-4 text-muted-foreground">
            Wholesome,nourishing,and made with love-our cookies are crafted to support moms and delight little ones with every bite!.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
        
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
             
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary hover:underline">
                  Contact
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary hover:underline">
                  FAQ
                </Link>
              </li>
              
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary hover:underline">
                  Privacy Policy
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
            <p className="mb-4 text-muted-foreground">
              Subscribe to our newsletter for exclusive offers and cookie tips.
            </p>
            <form className="flex flex-col space-y-2">
              <div className="flex">
                <Input type="email" placeholder="Your email" className="rounded-r-none" required />
                <Button type="submit" className="rounded-l-none">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Nutrigine. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img src="/VISA.png?height=30&width=50&text=Visa" alt="Visa" className="h-8" />
            <img src="/MasterCard.png?height=30&width=50&text=Mastercard" alt="Mastercard" className="h-8" />
            <img src="/PayPal.png?height=30&width=50&text=PayPal" alt="PayPal" className="h-8" />
            
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

