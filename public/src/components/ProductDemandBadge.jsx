import { Badge } from "@/components/ui/badge"

const ProductDemandBadge = ({ demand }) => {
  let badgeStyle = {}
  let label = ""

  switch (demand) {
    case "high":
      badgeStyle = "bg-green-500 text-white hover:bg-green-600"
      label = "High Demand"
      break
    case "medium":
      badgeStyle = "bg-blue-500 text-white hover:bg-blue-600"
      label = "Popular"
      break
    case "low":
      badgeStyle = "bg-amber-500 text-white hover:bg-amber-600"
      label = "Try Me"
      break
    default:
      badgeStyle = "bg-gray-500 text-white hover:bg-gray-600"
      label = "New"
  }

  return <Badge className={badgeStyle}>{label}</Badge>
}

export default ProductDemandBadge

