import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Logout, Person } from "@mui/icons-material";
import "./headerStyle.css";

import { logoutUser } from "../../store/slices/authSlice";
import dashboardIcon from "../../images/element-1.png";
import scheduleIcon from "../../images/calendar.png";
import curriculumIcon from "../../images/sms.png";
import groupIcon from "../../images/profile-2user.png";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState("Главная");
    const [hover, setHover] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const profileMenuRef = useRef(null);
    const sidebarRef = useRef(null);

    const baseMenuItems  = [
        { name: "Главная", icon: dashboardIcon, path: "/welcome" },
        { name: "Расписание", icon: scheduleIcon, path: "/schedule" },
        { name: "учеб план", icon: curriculumIcon, path: "/curriculum" },
    ];
    const getRoleSpecificMenuItem = () => {
        if ([4, 5].includes(user?.role_id)) {
            return { name: "учеб отдел", icon: groupIcon, path: "/router" };
        }
        if ([3].includes(user?.role_id)) {
            return { name: "Занятия", icon: groupIcon, path: "/router" };
        }
        return { name: "Группа", icon: groupIcon, path: "/grades" };
    };

    // Формируем полный список пунктов меню
    const menuItems = [...baseMenuItems, getRoleSpecificMenuItem()];
    useEffect(() => {
        const currentMenuItem = menuItems.find(item => item.path === location.pathname);
        setActive(currentMenuItem ? currentMenuItem.name : "Главная");
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !sidebarRef.current?.contains(event.target) &&
                !profileMenuRef.current?.contains(event.target) &&
                anchorEl
            ) {
                setIsSidebarOpen(false);
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [anchorEl]);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleClose();
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser(user?.refreshToken)).unwrap();
            handleClose();

            // Перенаправляем на страницу входа
            navigate("/");

            // Принудительно обновляем страницу через 100мс
            setTimeout(() => {
                window.location.reload();
            }, 100);

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

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
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {isSidebarOpen && (
                        <div
                            className="sidebar-overlay"
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 1040,
                                transition: 'opacity 0.3s ease'
                            }}
                        />
                    )}

                    <div
                        className={`offcanvas offcanvas-end ${isSidebarOpen ? "show" : ""}`}
                        ref={sidebarRef}
                        style={{
                            visibility: isSidebarOpen ? 'visible' : 'hidden',
                            zIndex: 1050
                        }}
                    >
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title">Боковое меню</h5>
                            <button
                                type="button"
                                className="btn-close text-reset"
                                onClick={() => setIsSidebarOpen(false)}
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end pe-3 position-relative">
                                <div
                                    className="hover-bg"
                                    style={{
                                        left: isSidebarOpen ? 8 : `${menuItems.findIndex(item => item.name === (hover !== null ? hover : active)) * 182}px`,
                                        top: isSidebarOpen ? `${menuItems.findIndex(item => item.name === (hover !== null ? hover : active)) * 60}px` : 0,
                                    }}
                                ></div>
                                {menuItems.map((item) => (
                                    <li
                                        key={item.name}
                                        className={`nav-item ${
                                            hover === item.name ? "active" :
                                                (active === item.name && hover === null) ? "active" : ""
                                        }`}
                                        onMouseEnter={() => setHover(item.name)}
                                        onMouseLeave={() => setHover(null)}
                                    >
                                        <div className="nav-link-container">
                                            <div
                                                className="nav-icon"
                                                style={{
                                                    backgroundImage: `url(${item.icon})`,
                                                    filter:
                                                        hover === item.name ||
                                                        (active === item.name && hover === null)
                                                            ? "brightness(0) invert(1)"
                                                            : "none",
                                                }}
                                            ></div>
                                            <a
                                                className="nav-link"
                                                href={item.path}
                                                style={{
                                                    color:
                                                        hover === item.name ||
                                                        (active === item.name && hover === null)
                                                            ? "white"
                                                            : "#333",
                                                }}
                                            >
                                                {item.name}
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div
                                className="profile__header"
                                onClick={handleProfileClick}
                                ref={profileMenuRef}
                            ></div>

                            <Menu
                                className="profile-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <MenuItem className="menu-item" onClick={() => handleNavigation("/profile")}>
                                    <ListItemIcon className="menu-icon">
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    Профиль
                                </MenuItem>
                                <Divider className="menu-divider" />
                                <MenuItem className="menu-item" onClick={handleLogout}>
                                    <ListItemIcon className="menu-icon">
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Выйти
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;