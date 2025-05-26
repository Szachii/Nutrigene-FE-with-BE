"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet our dedicated team of professionals who work tirelessly to bring you the best products and services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <Card key={member._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <img
                src={member.image}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
            </div>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-1">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-primary font-medium mb-2">{member.role}</p>
              <p className="text-muted-foreground">{member.department}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No team members found.</p>
        </div>
      )}
    </div>
  )
}

export default AboutPage

