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
import HaveFunPage from "./pages/HaveFunPage.tsx";
import CoversPage from "./pages/CoversPage.tsx";
import ArtistPage from "./pages/ArtistPage.tsx";
import ArtistsPage from "./pages/ArtistsPage.tsx";
import {getRandomItemLoader} from "./api/spotify.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<App />} />
      <Route path={"have-fun"} element={<HaveFunPage />} />
      <Route
        path={"surprise-of-the-day"}
        element={<CoverDetailsPage />}
        loader={getRandomItemLoader}
      />
      <Route path={"covers"} element={<CoversPage />}>
      </Route>
        <Route path={"covers/:coverId"} element={<CoverDetailsPage />} />
        <Route path={"artists"} element={<ArtistsPage />}>
            <Route path={":artistId"} element={<ArtistPage />} />
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
