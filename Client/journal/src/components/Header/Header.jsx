import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./headerStyle.css";

import dashboardIcon from "../../images/element-1.png";
import scheduleIcon from "../../images/calendar.png";
import coursesIcon from "../../images/briefcase.png";
import curriculumIcon from "../../images/sms.png";
import groupIcon from "../../images/profile-2user.png";

function Header() {
    const location = useLocation();
    const [active, setActive] = useState("Главная");
    const [hover, setHover] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: "Главная", icon: dashboardIcon, path: "/welcome" },
        { name: "Расписание", icon: scheduleIcon, path: "/schedule" },
        // { name: "Курсы", icon: coursesIcon, path: "/courses" },
        { name: "Успеваемость", icon: curriculumIcon, path: "/curriculum" },
        { name: "Группа", icon: groupIcon, path: "/group" },
    ];

    const sidebarRef = useRef(null); // Ref для бокового меню

    useEffect(() => {
        const currentMenuItem = menuItems.find(item => item.path === location.pathname);
        if (currentMenuItem) {
            setActive(currentMenuItem.name);
        } else {
            setActive("Главная");
        }
    }, [location.pathname]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };


        document.addEventListener("mousedown", handleClickOutside);


        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="container__logo">
                    <div className="logo_bru"></div>
                    <span className="navbar-brand">logoipsum</span>
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasNavbar"
                    aria-controls="offcanvasNavbar"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="offcanvas offcanvas-end"
                    tabIndex="-1"
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    ref={sidebarRef}
                >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Боковое меню</h5>
                        <button
                            type="button"
                            className="btn-close text-reset"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            onClick={() => setIsSidebarOpen(false)}
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end pe-3 position-relative">
                            <div
                                className="hover-bg"
                                style={{
                                    left: isSidebarOpen ? 8 : `${menuItems.findIndex(item => item.name === (hover !== null ? hover : active)) * 182}px`, // Если меню открыто, left = 0
                                    top: isSidebarOpen ? `${menuItems.findIndex(item => item.name === (hover !== null ? hover : active)) * 60}px` : 0, // Если меню открыто, меняем top
                                }}
                            ></div>
                            {menuItems.map((item) => (
                                <li
                                    key={item.name}
                                    className={`nav-item ${active === item.name ? "active" : ""}`}
                                    onMouseEnter={() => setHover(item.name)}
                                    onMouseLeave={() => setHover(null)}
                                >
                                    <div className="nav-link-container">
                                        <div
                                            className="nav-icon"
                                            style={{
                                                backgroundImage: `url(${item.icon})`,
                                                filter:
                                                    hover === item.name // Если наведен на текущий элемент
                                                        ? "brightness(0) invert(1)" // Белая иконка
                                                        : active === item.name && hover === null // Если элемент активен и нет наведения
                                                            ? "brightness(0) invert(1)" // Белая иконка
                                                            : "none", // Иначе черная иконка
                                            }}
                                        ></div>
                                        <a className="nav-link"
                                           href={item.path}
                                           style={{
                                               color:
                                                   hover === item.name // Если наведен на текущий элемент
                                                       ? "white" // Белый текст
                                                       : active === item.name && hover === null // Если элемент активен и нет наведения
                                                           ? "white" // Белый текст
                                                           : "#333", // Иначе черный текст
                                           }}
                                        >
                                            {item.name}
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="profile__header"></div>
                    </div>
                </div>
            </div>
        </nav>
        </header>
    );
}

export default Header;