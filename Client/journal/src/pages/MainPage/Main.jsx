import { useState } from "react";
import Header from "../../components/Header/Header";
import Calendar from "../../components/Calendar/Calendar";
import StudentList from "../../components/StudentList/StudentList";
import Footer from "../../components/Footer/Footer";
import Slider from "../../components/Slider/Slider";
import Schedule from "../../components/Schedule/Schedule";
import "./MainStyle.css";

const MainPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [weekType, setWeekType] = useState('');

    const handleDaySelect = (day, dayOfWeek) => {
        setSelectedDate(day);
        setSelectedDay(dayOfWeek);
    };

    return (
        <>
            <Header />
            <main>
                <div className="container__slider__calendar">
                    <Slider studentId={1} />
                    <Calendar onDaySelect={handleDaySelect} onWeekTypeSelect={setWeekType} />
                </div>
                <div className="container__student__schedule">
                    <StudentList group="АСОИР-221" />
                    {selectedDay && <Schedule selectedDay={selectedDay} weekType={weekType} />}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MainPage;
