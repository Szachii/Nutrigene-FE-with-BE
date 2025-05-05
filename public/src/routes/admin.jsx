import { Route, Routes } from "react-router-dom"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminList from "@/pages/admin/AdminList"
import ProductForm from "@/pages/admin/ProductForm"
import OrderDetailPage from "@/pages/admin/OrderDetailPage"
import ProductsPage from "@/pages/admin/ProductsPage"
import OrdersPage from "@/pages/admin/OrdersPage"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="admins" element={<AdminList />} />
      <Route path="products">
        <Route index element={<ProductsPage />} />
        <Route path="new" element={<ProductForm />} />
        <Route path=":id" element={<ProductForm />} />
      </Route>
      <Route path="orders">
        <Route index element={<OrdersPage />} />
        <Route path=":id" element={<OrderDetailPage />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes 