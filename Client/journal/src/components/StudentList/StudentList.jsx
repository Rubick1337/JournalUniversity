import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStudents } from '../../store/slices/studentSlice';
import "./StudentListStyle.css";
import defaultPhoto from '../../images/icons8-тестовый-аккаунт-64.png';

const StudentList = ({ group }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Загрузка данных через Redux
        dispatch(fetchStudents({ groupQuery: group, limit: 1000 }))
            .then((response) => {
                if (response.payload?.data) {
                    setStudents(response.payload.data.slice(0, 5)); // Берем первые 5 студентов
                }
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }, [dispatch, group]);

    const handleShowAll = () => {
        // Переходим на страницу группы с полным списком
        navigate(`/group`);
    };

    // Функция для безопасного извлечения имени группы
    const getGroupName = (groupObj) => {
        if (!groupObj) return '';
        if (typeof groupObj === 'string') return groupObj;
        return groupObj.name || '';
    };

    // Функция для безопасного извлечения имени подгруппы
    const getSubgroupName = (subgroupObj) => {
        if (!subgroupObj) return 'Без подгруппы';
        if (typeof subgroupObj === 'string') return subgroupObj;
        return subgroupObj.name || 'Без подгруппы';
    };

    return (
        <div className="container__students">
            <div className="header__list">
                <h1 className="title">Группа: {group}</h1>
                <button className="see-all" onClick={handleShowAll}>
                    Показать
                </button>
            </div>
            <div className="student-list">
                {students.map((student, index) => (
                    <div className="student-item" key={index}>
                        <span className="dot"/>
                        <img
                            className="student-photo"
                            src={student.photo || student.icon_path || defaultPhoto}
                            alt={`${student.firstName || student.person?.name} ${student.lastName || student.person?.surname}`}
                            onError={(e) => e.target.src = defaultPhoto}
                        />
                        <div className="student-info">
                            <span className="student-name">
                                {`${student.firstName || student.person?.name} ${student.lastName || student.person?.surname}`}
                            </span>
                            <span className="student-group">
                                {getGroupName(student.group)}
                            </span>
                            <span className="student-subgroup">
                                {getSubgroupName(student.subgroup)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentList;