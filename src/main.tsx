import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/globas.css';
import './styles/index.css';
import App from './App.tsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import CoversPage from "./components/CoversPage.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import CoverDetails from "./components/CoverDetails.tsx";
import {getRandomItemLoader} from "./utils/spotify.ts";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route index element={<App/>}/>
            <Route
                path={"covers"}
                element={<CoversPage/>}
            />
            <Route
                path={"surprise-of-the-day"}
                element={<CoverDetails/>}
                loader={getRandomItemLoader('track')}
            />
            <Route path={"cover/:id"} element={<CoverDetails/>}/>
            <Route path={"*"} element={<ErrorPage />}/>
        </Route>
    )
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
