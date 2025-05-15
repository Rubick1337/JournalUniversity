import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SliderStyle.css";
import backgroundImage from "../../images/background.png";
import { useDispatch } from "react-redux";
import {getStudentSubjects} from '../../store/slices/curriculumSlice'
const Slider = ({ studentId }) => {
    const [disciplines, setDisciplines] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const swiperRef = useRef(null);
const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStudentSubjects())
        axios
            .get("/TestData/disciplines.json")
            .then((response) => setDisciplines(response.data[studentId] || []))
            .catch((error) => console.error("Ошибка загрузки данных:", error));
    }, [studentId]);

    const handleSliderClick = (e) => {
        if (expanded && swiperRef.current) {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const clickPosition = e.clientX;
            const edgeBoundary = width * 0.2;

            if (clickPosition < left + edgeBoundary) {
                swiperRef.current.swiper.slidePrev();
            } else if (clickPosition > left + width - edgeBoundary) {
                swiperRef.current.swiper.slideNext();
            }
        }
    };

    const handlePlayClick = (e) => {
        e.stopPropagation();
        console.log("Play button clicked");
    };

    return (
        <div
            className={`swiper-container ${expanded ? "expanded" : ""}`}
            onClick={expanded ? handleSliderClick : undefined}
        >
            <button
                className="small-expand-button"
                onClick={() => setExpanded((prev) => !prev)}
                title={expanded ? "Свернуть" : "Расширить"}
            >
                {expanded ? "-" : "+"}
            </button>

            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Mousewheel]}
                navigation={!expanded}
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={expanded ? 3 : 1}
                loop={true}
                mousewheel={true}
            >
                {disciplines.length > 0 ? (
                    disciplines.map((discipline) => (
                        <SwiperSlide key={discipline.id}>
                            <div
                                className="swiper-slide"
                                style={{ backgroundImage: `url(${backgroundImage})` }}
                            >
                                <button
                                    className="play-button"
                                    onClick={handlePlayClick}
                                >
                                    &#9655;
                                </button>
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