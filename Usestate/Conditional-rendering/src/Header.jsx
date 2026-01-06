import { useState } from "react";
import { FaRegMoon } from "react-icons/fa";
import { MdWbSunny } from "react-icons/md";

export const Header = ({ setCurrentTab }) => {
    const [darkTheme, setDarkTheme] = useState(true)
    const [lightTheme, setLightTheme] = useState(false)
    const navs = ["Home", "Services", "Contact", "About us"];
    const setBgDark = () => {
        setDarkTheme(false);
        setLightTheme(true)
    }
    const setBgLight = () => {
        setDarkTheme(true);
        setLightTheme(false)
    }
    return (
        <header className={`flex justify-between items-center max-w-[95%] m-auto p-6 h-12 bg-${!darkTheme ? "black" :"[#d9d06f]"} text-${!darkTheme ? "white" : "black"}`}>
            <div className="logo">
                <a href="#">Logo</a>
            </div>

            <ul className="flex gap-4 justify-center items-center">
                {navs.map((nav) => (
                    <li key={nav}>
                        <a href={`#${nav.toLowerCase().replace(" ", "-")}`} onClick={() => setCurrentTab(nav)} className="hover:text-[#595656]">
                            {nav}
                        </a>
                    </li>
                ))}
                {darkTheme && <li><button onClick={setBgDark} className="bg-black text-white p-1 px-1.5 rounded-xl flex items-center gap-1 cursor-pointer"><FaRegMoon /> Dark Theme</button></li>}
                {lightTheme && <li><button onClick={setBgLight} className="bg-white text-black p-1 px-1.5 rounded-xl flex items-center gap-1 cursor-pointer"><MdWbSunny /> Light Theme</button></li>}

            </ul>
        </header>
    );
};
