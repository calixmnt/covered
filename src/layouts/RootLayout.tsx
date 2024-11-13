import Header from "../components/Header.tsx";
import {Outlet} from "react-router-dom";

function RootLayout() {

    return (
        <>
            <Header/>
            <main className="main">
                <Outlet />
            </main>
        </>
    )
}

export default RootLayout;