import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Public Pages
import HomePage from './pages/home/HomePage.jsx';
import ProductsPage from './pages/products/ProductsPage.jsx';
import ProductDetailPage from './pages/products/ProductDetailPage.jsx';
import ServicesPage from './pages/services/ServicesPage.jsx';
import AboutPage from './pages/about/AboutPage.jsx';
import ContactPage from './pages/contact/ContactPage.jsx';
import FAQPage from './pages/faq/FAQPage.jsx';
import PrivacyPage from './pages/legal/PrivacyPage.jsx';
import TermsPage from './pages/legal/TermsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductFormPage from './pages/admin/AdminProductFormPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminServicesPage from './pages/admin/AdminServicesPage.jsx';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage.jsx';
import AdminServiceRequestsPage from './pages/admin/AdminServiceRequestsPage.jsx';
import AdminContactPage from './pages/admin/AdminContactPage.jsx';
import AdminFAQsPage from './pages/admin/AdminFAQsPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public Customer Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="service-requests" element={<AdminServiceRequestsPage />} />
        <Route path="contact" element={<AdminContactPage />} />
        <Route path="faqs" element={<AdminFAQsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
