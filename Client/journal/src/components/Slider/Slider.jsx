import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './SliderStyle.css';
import backgroundImage from '../../images/background.png';

const Slider = ({ studentId }) => {
    const [disciplines, setDisciplines] = useState([]);

    useEffect(() => {
        axios.get('/TestData/disciplines.json')
            .then(response => setDisciplines(response.data[studentId] || []))
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }, [studentId]);

    return (
        <div className="swiper-container">
            <Swiper
                modules={[Navigation, Pagination, Mousewheel]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                mousewheel={true}
            >
                {disciplines.length > 0 ? (
                    disciplines.map(discipline => (
                        <SwiperSlide key={discipline.id}>
                            <div className="swiper-slide" style={{ backgroundImage: `url(${backgroundImage})` }}>
                                <button className="play-button">&#9658;</button>
                                <div className="slide-content">
                                    <h2>{discipline.name}</h2>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <p>Нет доступных дисциплин</p>
                )}
            </Swiper>
        </div>
    );
};

export default Slider;
