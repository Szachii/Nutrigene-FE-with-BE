import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Uthpala Kulasekara",
      role: "Founder",
      image: "/Founder.jpg?height=300&width=300",
      bio: "",
    },
    {
      name: "Srimal Rathnayaka",
      role: "Marketing Manager",
      image: "/MarketingManager.jpg?height=300&width=300",
      bio: "",
    },
    {
      name: "Omeili Akenya",
      role: "Baker",
      image: "/Baker.jpg?height=300&width=300",
      bio: "",
    },
    
  ]

  // Company values
  const values = [
    {
      title: "Quality Ingredients",
      description:
        "We use only the finest, freshest ingredients in all our cookies. From premium chocolate to locally sourced butter, we never compromise on quality.",
    },
    {
      title: "Handcrafted with Care",
      description:
        "Each cookie is made by hand with attention to detail. We believe that the care we put into our baking process is what makes our cookies special.",
    },
    {
      title: "Innovation",
      description:
        "We're constantly experimenting with new flavors and techniques, pushing the boundaries of what a cookie can be while respecting traditional baking methods.",
    },
    {
      title: "Sustainability",
      description:
        "We're committed to reducing our environmental impact through sustainable packaging, responsible sourcing, and minimizing waste in our production process.",
    },
    {
      title: "Community",
      description:
        "We believe in giving back to the communities we serve, supporting local charities and initiatives that make a difference in people's lives.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 rounded-xl bg-yellow-100 p-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-4xl font-bold">Our Story</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Nutrigene began in a small kitchen with a big dream: to create the most delicious and Healthy  cookies that bring joy
              to Moms' & Babys' lives.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-xl md:h-[400px]">
            <img
              src="/public/Logo.jpg?height=400&width=600"
              alt="Nutrigene"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Our Journey</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-4">
            "Nutrigene," a Cookie Shop known for serving 
            local cuisine. Established in 2022 and owned by Mrs.K.M.U.Kulasekara and location 
            near Kurunegala town. What started as a small operation in Mrs.Uthpala's Kitchen. First, she made biscuits for herself and her child. Now she made cookies natinwide.  


            </p>
            <p className="mb-4">
            Despite our growth,we remain committed to our founding principles,using only the finest ingredients,baking in small batches,and treating every customer like family. Each cookie is still handcrafted with the same care and attention to detail that Mrs.Uthpala put into her very first batch.
            </p>
            
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">2021</h3>
              <p className="text-muted-foreground">
                Nutrigene is founded in Uthpala's kitchen, made for her baby.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">2022</h3>
              <p className="text-muted-foreground">
              We launches online odering. 
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">2023</h3>
              <p className="text-muted-foreground">
              We were sold in Kurunegala shops.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">2024</h3>
              <p className="text-muted-foreground">
              Employees were hired.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">2025</h3>
              <p className="text-muted-foreground">
              Sold cookie and physical islandwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Meet Our Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="mt-2 text-muted-foreground">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div key={index} className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Process */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Let's See...</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative h-[400px] overflow-hidden rounded-xl">
          <video className="h-full w-full object-cover" controls>
    <source src="/video1.mp4" type="video/mp4" />
    
  </video>
          </div>
          <div>
            <div className="mb-4 rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">1. Sourcing Ingredients</h3>
              <p className="text-muted-foreground">
                We carefully select the finest ingredients from trusted suppliers, prioritizing quality and
                sustainability.
              </p>
            </div>
            <div className="mb-4 rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">2. Small Batch Mixing</h3>
              <p className="text-muted-foreground">
                Each batch is mixed by mixture to ensure the perfect texture and consistency for every cookie.
              </p>
            </div>
            <div className="mb-4 rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">3. Precision Baking</h3>
              <p className="text-muted-foreground">
                Our cookies are baked at precise temperatures for the exact amount of time needed to achieve the perfect
                balance of crisp edges and soft centers.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">4. Quality Control</h3>
              <p className="text-muted-foreground">
                Every cookie is inspected to ensure it meets our high standards before being carefully packaged and
                delivered to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl bg-primary p-8 text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Taste the Nutrigene</h2>
          <p className="mb-6">
            Experience our handcrafted cookies made with the finest ingredients and baked with love.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

