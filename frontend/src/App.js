import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import PMBasicsPage from "./components/PMBasicsPage";
import DiscoveryPage from "./components/DiscoveryPage";
import ProductSensePage from "./components/ProductSensePage";
import MetricsPage from "./components/MetricsPage";
import AIEraPage from "./components/AIEraPage";
import InteractiveToolsPage from "./components/InteractiveToolsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pm-basics" element={<PMBasicsPage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/product-sense" element={<ProductSensePage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/ai-era" element={<AIEraPage />} />
          <Route path="/tools" element={<InteractiveToolsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;