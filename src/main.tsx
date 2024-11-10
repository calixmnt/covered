import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/globas.css';
import './styles/index.css';
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CoversPage from "./components/CoversPage.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import Layout from "./components/Layout.tsx";
import CoverDetails from "./components/CoverDetails.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout>
            <App/>
        </Layout>,
    },
    {
        path: "/covers",
        element: <Layout>
            <CoversPage/>
        </Layout>,
    },
    {
      path:"/cover/:coverId",
      element: <Layout><CoverDetails/></Layout>
    },
    {
        path: "/not-found",
        element: <ErrorPage/>
    }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
