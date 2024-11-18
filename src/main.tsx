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
import { getRandomItemLoader } from "./utils/spotify.ts";
import HaveFunPage from "./pages/HaveFunPage.tsx";
import CoversPage from "./pages/CoversPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<App />} />
      <Route path={"have-fun"} element={<HaveFunPage />} />
      <Route
        path={"surprise-of-the-day"}
        element={<CoverDetailsPage />}
        loader={getRandomItemLoader("track")}
      />
      <Route path={"covers"} element={<CoversPage />}>
        <Route path={":coverId"} element={<CoverDetailsPage />} />
      </Route>
      <Route path={"*"} element={<ErrorPage />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
