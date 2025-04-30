import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart2, Settings, Tag } from "lucide-react"

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin",
      active: currentPath === "/admin",
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/products",
      active: currentPath.includes("/admin/products"),
    },
    {
      title: "Categories",
      icon: <Tag className="h-5 w-5" />,
      path: "/admin/categories",
      active: currentPath.includes("/admin/categories"),
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/admin/orders",
      active: currentPath.includes("/admin/orders"),
    },
    {
      title: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/customers",
      active: currentPath.includes("/admin/customers"),
    },
    {
      title: "Analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      path: "/admin/analytics",
      active: currentPath.includes("/admin/analytics"),
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
      active: currentPath.includes("/admin/settings"),
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r bg-white dark:border-gray-800 dark:bg-gray-950 md:block">
        <div className="flex h-16 items-center border-b px-6 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Nutrigene</span>
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1 px-2 dark:bg-gray-800">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout

