import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Quality from "./pages/Quality";
import Contact from "./pages/Contact";
import News from "./pages/News";
import ArticleDetail from "./pages/ArticleDetail";
import Announcements from "./pages/Announcements";
import { AdminShell, adminRoutes } from "./admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminShell />}>
          {adminRoutes}
        </Route>
        <Route
          path="*"
          element={
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/quality" element={<Quality />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:slug/" element={<ArticleDetail />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppFloat />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
