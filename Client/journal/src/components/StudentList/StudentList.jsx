import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./StudentListStyle.css";
import defaultPhoto from '../../images/icons8-тестовый-аккаунт-64.png'; // Фото по умолчанию

const StudentList = ({ group }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get('/TestData/students.json')
            .then(response => {
                // Фильтруем студентов по выбранной группе
                const filteredStudents = response.data.filter(student => student.group === group);
                setStudents(filteredStudents.slice(0, 7)); // Выводим только 7 первых студентов
            })
            .catch(error => {
                console.error('Error fetching the data', error);
            });
    }, [group]); // Зависимость от group

    return (
        <div className="container__students">
            <div className="header__list">
                <h1 className="title">Группа: {group}</h1>
                <a className="see-all" href="#">Показать все...</a>
            </div>
            <div className="student-list">
                {students.map((student, index) => (
                    <div className="student-item" key={index}>
                        <span className="dot"/>
                        <img
                            className="student-photo"
                            src={student.photo ? student.photo : defaultPhoto}
                            alt={`${student.firstName} ${student.lastName}`}
                            onError={(e) => e.target.src = defaultPhoto} // Если фото не загрузилось
                        />
                        <div className="student-info">
                            <span className="student-name">{`${student.firstName} ${student.lastName}`}</span>
                            <span className="student-group">{student.group}</span>
                            <span className="student-subgroup">{student.subgroup}</span> {/* Отображаем подгруппу */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentList;