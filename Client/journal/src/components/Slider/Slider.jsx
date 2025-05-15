import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ добавлено
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SliderStyle.css";
import backgroundImage from "../../images/background.png";
import { useDispatch, useSelector } from "react-redux";
import { getStudentSubjects } from '../../store/slices/curriculumSlice';

const Slider = ({ studentId }) => {
    const [expanded, setExpanded] = useState(false);
    const swiperRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // ⬅️ навигация

    const { currentStudentSubjects, isLoading, errors } = useSelector(
        (state) => state.curriculums
    );

    useEffect(() => {
        if (studentId) {
            dispatch(getStudentSubjects({ studentId }));
        }
    }, [studentId, dispatch]);

    const subjectsToDisplay = currentStudentSubjects?.map(item => ({
        id: item.subject.id,
        name: item.subject.name,
        assessmentType: item.assessmentType.name,
        totalHours: item.hours.all
    })) || [];

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

    const handlePlayClick = (subjectId) => (e) => {
        e.stopPropagation();
        navigate(`/grades?studentId=${studentId}&subjectId=${subjectId}`);
    };

    if (isLoading) return <div>Загрузка предметов...</div>;
    if (errors.length > 0) return <div>Ошибка при загрузке предметов: {errors[0].message}</div>;

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
                {subjectsToDisplay.length > 0 ? (
                    subjectsToDisplay.map((subject) => (
                        <SwiperSlide key={subject.id}>
                            <div
                                className="swiper-slide"
                                style={{ backgroundImage: `url(${backgroundImage})` }}
                            >
                                <button
                                    className="play-button"
                                    onClick={handlePlayClick(subject.id)}
                                >
                                    &#9655;
                                </button>
                                <div className="slide-content">
                                    <h2>{subject.name}</h2>
                                    <p>Тип аттестации: {subject.assessmentType}</p>
                                    <p>Часов: {subject.totalHours}</p>
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
