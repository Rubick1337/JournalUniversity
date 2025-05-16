import React from 'react';
import './NotFoundPage.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const NotFoundPage = () => {
    return (
        <>
        <Header/>
        <main>
        <div className="not-found-container">
            <div className="loading-dots">
                <div className="dot-not dot-not-1"></div>
                <div className="dot-not dot-not-2"></div>
                <div className="dot-not dot-not-3"></div>
            </div>
            <h1 className="not-found-text">Такой страницы не существует</h1>
        </div>
        </main>
    <Footer/>
        </>
    );
};

export default NotFoundPage;