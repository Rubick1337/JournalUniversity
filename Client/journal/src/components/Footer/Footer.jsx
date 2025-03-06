import React from 'react';
import "./FooterStyle.css"

const Footer = () => {
    return (
        <footer>
            <div className="background__footer">
                <div className="container__footer">
                    <div className="container__bru">
                        <div className="bru__logo__footer"></div>
                        <div className="bru__logo__footer__text">
                            <h4>
                                БРУ был основан
                                1 сентября 1961 года в соответствии
                                с Постановлением Совета Министров СССР от 10 августа 1961
                            </h4>
                        </div>
                        <div className="container_social">
                            <div className="facebook"></div>
                            <div className="linkedin"></div>
                            <div className="twitter"></div>
                            <div className="instagram"></div>
                        </div>
                    </div>
                    <div className="universtity">
                        <h4>Университет</h4>
                        <a href="">Информация</a>
                        <a href="">Главная</a>
                        <a href="">Контакты</a>
                        <a href="">Новости</a>
                        <a href="">О нас</a>
                    </div>
                    <div className="faculity">
                        <h4>Факультеты</h4>
                        <a href="">Довузовская подготовка</a>
                        <a href="">Инженерно-эконом</a>
                        <a href="">Авто машиностроение</a>
                        <a href="">Машиностроение</a>
                        <a href="">Строительный</a>

                    </div>
                    <div className="admission">
                        <h4>Наука</h4>
                        <a href="">Советы по защите</a>
                        <a href="">Фестиваль науки</a>
                        <a href="">Конференции</a>
                        <a href="">Публикации</a>
                        <a href="">Выставки</a>
                    </div>
                </div>
            </div>
            <div className="footer__end">
                <h5>All Copyrights are reserved ©️</h5>
            </div>
        </footer>
    )
}
export default Footer;