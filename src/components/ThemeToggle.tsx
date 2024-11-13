import {FiSun} from "react-icons/fi";
import {FiMoon} from "react-icons/fi";
import {useTheme} from "../hooks/useTheme.ts";

export function ThemeToggle() {

    const {theme, switchMode} = useTheme();

    const handleClick = () => {
        const newMode = theme === 'light' ? 'dark' : 'light';
        switchMode(newMode);
    };

    return (
        <button
            onClick={handleClick}
            aria-label={theme === 'light' ? "Activer le mode sombre" : "Activer le mode clair"}
        >
            {theme === 'light' ? <FiMoon/> : <FiSun/>}
        </button>
    );
}