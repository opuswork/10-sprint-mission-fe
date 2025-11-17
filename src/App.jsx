import React from "react";
import Landing from "./pages/Landing";
import SecondHandMarket from "./pages/SecondHandMarket";
import Registration from "./pages/Registration";
import ProductDetail from "./pages/ProductDetail";
import EditProductInfo from "./pages/editProductInfo";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from 'react-router-dom';


export default function App() {
  return (
  <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/items" element={<SecondHandMarket />} />
        <Route path="/items/:id" element={<ProductDetail />} />
        <Route path="/items/:id/edit" element={<EditProductInfo />} />
        <Route path="/registration" element={<Registration />} />
      </Routes> 
      <Footer />
    </BrowserRouter>
  </>
  );
}