import { Header } from "../components/Header";
import {Outlet} from "react-router-dom";

function RootLayout() {

    return (
        <>
            <Header />
            <main className="main">
                <Outlet />
            </main>
        </>
    )
}

export default RootLayout;