import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoutersStyle.css';

import facultyIcon from '../../images/free-icon-faculty-3663869.png';
import departmentIcon from '../../images/free-icon-lectern-1321023.png';
import subjectIcon from '../../images/free-icon-book-3330314.png';
import positionIcon from '../../images/free-icon-briefcase-1383186.png';
import teacherIcon from '../../images/free-icon-teacher-10618211.png';
import specializationIcon from '../../images/free-icon-compass-998887.png';
import educationFormIcon from '../../images/free-icon-folders-2821739.png';
import curriculumIcon from '../../images/free-icon-calendar-7955483.png';
import programIcon from '../../images/free-icon-document-8931643.png';
import groupIcon from '../../images/free-icon-couple-8890995.png';
import subgroupIcon from '../../images/free-icon-single-person-5231019.png';
import studentIcon from '../../images/free-icon-graduated-4537051.png';
import lessonIcon from '../../images/free-icon-busy-4593078.png';
import absenceIcon from '../../images/free-icon-clear-1632708.png';
import gradeIcon from '../../images/free-icon-evaluation-6020452.png';

const EduCards = () => {
    const navigate = useNavigate();

    const categories = [
        {
            title: 'Основные структуры',
            cards: [
                {
                    id: 1,
                    title: 'Факультеты',
                    icon: facultyIcon,
                    link: '/faculties' // Добавлен / в начало
                },
                {
                    id: 2,
                    title: 'Кафедры',
                    icon: departmentIcon,
                    link: '/departament' // Добавлен / в начало
                },
                {
                    id: 3,
                    title: 'Предметы',
                    icon: subjectIcon,
                    link: '/discipline' // Добавлен / в начало
                }
            ]
        },
        {
            title: 'Персонал',
            cards: [
                {
                    id: 4,
                    title: 'Должности преподавателей',
                    icon: positionIcon,
                    link: '/positions' // Добавлен / в начало
                },
                {
                    id: 5,
                    title: 'Преподаватели',
                    icon: teacherIcon,
                    link: '/teachers' // Добавлен / в начало
                },
                {
                    id: 17,
                    title: 'Персональные данные',
                    icon: subgroupIcon,
                    link: '/personinfo' // Добавлен / в начало
                }
            ]
        },
        {
            title: 'Учебные программы',
            cards: [
                {
                    id: 6,
                    title: 'Направления подготовки',
                    icon: specializationIcon,
                    link: '/specilization' // Добавлен / в начало
                },
                {
                    id: 7,
                    title: 'Формы подготовки',
                    icon: educationFormIcon,
                    link: '/educationform' // Добавлен / в начало
                },
                {
                    id: 8,
                    title: 'Учебные планы',
                    icon: curriculumIcon,
                    link: '/curriculum' // Добавлен / в начало
                },
                {
                    id: 9,
                    title: 'Рабочие программы',
                    icon: programIcon,
                    link: '/curriculum' // Добавлен / в начало
                }
            ]
        },
        {
            title: 'Студенты',
            cards: [
                {
                    id: 10,
                    title: 'Группы',
                    icon: groupIcon,
                    link: '/tablegroups' // Добавлен / в начало
                },
                {
                    id: 12,
                    title: 'Студенты',
                    icon: studentIcon,
                    link: '/studenttable' // Добавлен / в начало
                }
            ]
        },
        {
            title: 'Учебный процесс',
            cards: [
                {
                    id: 15,
                    title: 'Оценки',
                    icon: gradeIcon,
                    link: '/assesmenttype' // Добавлен / в начало
                },
                {
                    id: 16,
                    title: 'Темы дисциплин',
                    icon: lessonIcon,
                    link: '/topic' // Добавлен / в начало
                }
            ]

        }
    ];

    return (
        <div className="edu-container">
            <h1 className="edu-header">Управление образовательным процессом</h1>

            {categories.map((category, index) => (
                <div key={index} className="category-section">
                    <h2 className="category-title">{category.title}</h2>
                    <div className="cards-grid">
                        {category.cards.map(card => (
                            <div
                                key={card.id}
                                className="edu-card"
                                onClick={() => navigate(card.link)}
                            >
                                <div className="card-icon">
                                    <img src={card.icon} alt={card.title} />
                                </div>
                                <h3>{card.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EduCards;