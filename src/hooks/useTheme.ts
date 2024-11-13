import {useEffect, useState} from "react";

type ThemeMode = 'light' | 'dark';
export const DEFAULT_THEME = "light";

export function useTheme() {

    const getFavoriteTheme = (): ThemeMode => {
        const theme = localStorage.getItem("theme");
        return (theme === 'dark' || theme === 'light') ? theme : DEFAULT_THEME;
    };

    const [theme, setTheme] = useState<ThemeMode>(getFavoriteTheme);


    const switchMode = (mode: ThemeMode) => {
        if (mode === "dark") {
            document.documentElement.classList.remove('light-mode');
        } else if (mode === "light") {
            document.documentElement.classList.add('light-mode');
        }
        localStorage.setItem("theme", mode);
        setTheme(mode);
    };

    useEffect(() => {
        const storedTheme = getFavoriteTheme();
        theme === "light" && document.documentElement.classList.add("light-mode");
        setTheme(storedTheme);
    }, []);

    return {theme, switchMode}
}