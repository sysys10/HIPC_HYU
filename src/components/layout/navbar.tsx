import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../services/authProvider";
import { Link } from "react-router-dom";

export function NavigationBar() {
    const { user } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const menuItems = [
        { to: "/about", text: "소개" },
        {to:"/study", text:"스터디"},
        { to: "/penalty", text: "벌금" },
        { to: "/board", text: "게시판" },
        user
            ? { to: "/mypage", text: "마이페이지" }
            : { to: "/login", text: "로그인" },
    ];

    return (
        <header className={`h-16 fixed left-0 top-0 right-0 bg-white z-50`} >
            <nav className="h-full max-w-5xl w-full mx-auto flex items-center justify-between px-4">
                <Link to="/">
                    <img src="/Logo_2.svg" alt="Logo" width={90} />
                </Link>
                <button
                    className="md:hidden text-gray-700"
                    onClick={toggleMenu}
                    aria-label="메뉴 열기"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <ul className="md:flex hidden items-center font-pretendard">
                    {menuItems.map((item, index) => (
                        <li key={index} className="px-2 text-gray-700 whitespace-nowrap">
                            <Link
                                to={item.to}
                                className="px-[10px] py-3 rounded-lg cursor-pointer text-left hover:bg-gray-100"
                            >
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div
                ref={sidebarRef}
                className={`md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-700"
                        aria-label="메뉴 닫기"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <ul className="flex flex-col items-start font-pretendard p-4">
                    {menuItems.map((item, index) => (
                        <li key={index} className="py-2 text-gray-700 w-full">
                            <Link
                                to={item.to}
                                className="block px-4 py-2 rounded-lg cursor-pointer text-left hover:bg-gray-100 w-full"
                                onClick={toggleMenu}
                            >
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}