import Header from "./Header.tsx";
import React from "react";

function Layout({children}: { children: React.ReactNode }) {

    return (
        <>
            <Header/>
            <main className="main">
                {children}
            </main>
        </>
    )
}

export default Layout;