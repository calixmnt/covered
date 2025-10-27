import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globas.css";
import "./styles/index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import CoverDetailsPage from "./pages/CoverDetailsPage.tsx";

import './styles/improved.css';
import './styles/gallery-promo.css';
import './styles/logo.css';
import './styles/searchbar-themes.css';
import './styles/privacy.css';
import './styles/footer.css';
import { QueryProvider } from './providers/QueryProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import FavoritesPage from "./pages/FavoritesPage.tsx";
import GiftPage from "./pages/GiftPage.tsx";
import CoversPage from "./pages/CoversPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import { initAnalytics } from "./analytics.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<App />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path={"covers"} element={<CoversPage />} />
      <Route path={"covers/:coverId"} element={<CoverDetailsPage />} />

      <Route path={"gift-of-the-day"} element={<GiftPage />} />
      <Route path={"privacy"} element={<PrivacyPage />} />
      <Route path={"*"} element={<ErrorPage />} />
    </Route>,
  ),
);

initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </LanguageProvider>
  </StrictMode>,
);
