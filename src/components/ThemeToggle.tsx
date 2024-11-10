import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";
import {useState} from "react";

type ThemeMode = 'light' | 'dark';

export function ThemeToggle () {
    const [isLight, setIsLight] = useState(() => {
        return document.documentElement.classList.contains('light-mode');
    });

    const handleClick = () => {
        const newMode: ThemeMode = isLight ? 'dark' : 'light';
        switchMode(newMode);
        setIsLight(!isLight);
    }

    const switchMode = (mode: ThemeMode) => {
        if (mode === "light") {
            document.documentElement.classList.add('light-mode');
        }else {
            document.documentElement.classList.remove('light-mode');
        }
    }

    return(
        <>
            {isLight ? <FiMoon onClick={handleClick}/> : <FiSun onClick={handleClick} />}
        </>
    )
}