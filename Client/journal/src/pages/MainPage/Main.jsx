import { useState } from "react";
import Header from "../../components/Header/Header";
import Calendar from "../../components/Calendar/Calendar";
import StudentList from "../../components/StudentList/StudentList";
import Footer from "../../components/Footer/Footer";
import Slider from "../../components/Slider/Slider";
import Schedule from "../../components/Schedule/Schedule";
import "./MainStyle.css";
import { useSelector } from "react-redux";
import TeacherSchedule from "../../components/TeacherSchedule/TeacherSchedule";

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekType, setWeekType] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  const handleDaySelect = (date, dayOfWeek) => {
    setSelectedDate(date);
    setSelectedDay(dayOfWeek);

    // Форматируем дату в DD.MM.YYYY
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    setFormattedDate(`${day}.${month}.${year}`);
  };
  const userData= useSelector((state) => state.user.user);
  const teacher_id = userData?.teacher_id;
  const isTeacher = teacher_id !== null;
  return (
    <>
      <Header />
      <main>
        <div className="container__slider__calendar">
          <Slider studentId={1} />
          <Calendar
            onDaySelect={handleDaySelect}
            onWeekTypeSelect={setWeekType}
          />
        </div>
        <div className="container__student__schedule">
          <StudentList group="АСОИР-221" />
          {isTeacher ? (
            <TeacherSchedule/>
          ) : (
            selectedDay && (
              <Schedule
                selectedDay={selectedDay}
                formattedDate={formattedDate}
                weekType={weekType}
              />
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
