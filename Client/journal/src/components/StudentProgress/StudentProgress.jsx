import React from 'react';
import './StudentProgress.css';
import styled from 'styled-components';

const StudentProgress = () => {
    const student = {
        name: "Смирнова Анна Дмитриевна",
        averageScore: 4.5,
        subjects: [
            {
                name: "Веб-программирование",
                type: "Экзамен",
                module1: 28,
                module2: 55,
                final: 5,
                passed: true,
                attended: true
            },
            {
                name: "Компьютерные сети",
                type: "Зачет",
                module1: 25,
                module2: 52,
                final: true,
                passed: true,
                attended: true
            },
            {
                name: "Базы данных",
                type: "Экзамен",
                module1: 30,
                module2: 58,
                final: 5,
                passed: true,
                attended: true
            },
            {
                name: "Теория алгоритмов",
                type: "Экзамен",
                module1: 22,
                module2: 48,
                final: 4,
                passed: true,
                attended: true
            },
            {
                name: "Физическая культура",
                type: "Зачет",
                module1: 30,
                module2: 60,
                final: true,
                passed: true,
                attended: true
            },
            {
                name: "Иностранный язык",
                type: "Зачет",
                module1: null,
                module2: null,
                final: false,
                passed: false,
                attended: false
            }
        ],
        courseWorks: [
            {
                discipline: "Веб-программирование",
                supervisor: "Иванов И.И.",
                module1: 28,
                module2: 55,
                passed: true
            },
            {
                discipline: "Компьютерные сети",
                supervisor: "Петров П.П.",
                module1: 25,
                module2: 52,
                passed: true
            },
            {
                discipline: "Базы данных",
                supervisor: "Сидорова С.С.",
                module1: 18,
                module2: 42,
                passed: false
            },
            {
                discipline: "Теория алгоритмов",
                supervisor: "Кузнецов К.К.",
                module1: 30,
                module2: 60,
                passed: true
            }
        ]
    };

    // Подсчёт зачётов
    const credits = student.subjects.filter(subject => subject.type === 'Зачет');
    const passedCredits = credits.filter(credit => credit.passed).length;
    const totalCredits = credits.length;
    const missedExams = student.subjects.filter(subject => !subject.attended).length;

    const TableRow = styled.div `
        display:table-row;
        animation: fadeIn 0.5s ease-out forwards;
        opacity: 0;
        animation-delay: ${props => props.$index * 0.1}s;
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `
    return (
        <div className="student-progress">
            <h2>Успеваемость студента: {student.name}</h2>

            {/* Общая сводка */}
            <div className="summary">
                <div className="summary-row">
                    <p>Средний балл: <strong>{student.averageScore}</strong></p>
                    <p>Зачёты: <strong>{passedCredits}/{totalCredits}</strong> сдано</p>
                    <p>Курсовые: <strong>
                        {student.courseWorks.filter(cw => cw.passed).length}/
                        {student.courseWorks.length}
                    </strong> защищены</p>
                    {missedExams > 0 && (
                        <p className="warning">Неявок: <strong>{missedExams}</strong></p>
                    )}
                </div>
            </div>

            {/* Таблица по предметам */}
            <h3>Академическая успеваемость</h3>
            <div className="table-container">
                <div className="progress-table">
                    <div className="table-header">
                        <div className="header-cell">Дисциплина</div>
                        <div className="header-cell">Тип</div>
                        <div className="header-cell">Модуль 1 (30)</div>
                        <div className="header-cell">Модуль 2 (60)</div>
                        <div className="header-cell">Итог</div>
                        <div className="header-cell">Статус</div>
                    </div>

                    {student.subjects.map((subject, index) => (
                        <TableRow key={index} $index={index}>
                            <div className="cell">{subject.name}</div>
                            <div className="cell">{subject.type}</div>
                            <div className="cell score">
                                {subject.module1 !== null ? subject.module1 : '-'}
                            </div>
                            <div className="cell score">
                                {subject.module2 !== null ? subject.module2 : '-'}
                            </div>
                            <div className="cell final">
                                {subject.type === 'Зачет' ? (
                                    subject.final === true ? 'Зачет' : 'Незачет'
                                ) : (
                                    <span className={`grade-${subject.final}`}>{subject.final}</span>
                                )}
                            </div>
                            <div className="cell status">
                                {!subject.attended ? (
                                    <span className="missed">Неявка</span>
                                ) : subject.passed ? (
                                    <span className="passed">Сдано</span>
                                ) : (
                                    <span className="not-passed">Не сдано</span>
                                )}
                            </div>
                            </TableRow>
                    ))}
                </div>
            </div>

            {/* Таблица по курсовым */}
            <h3>Курсовые работы</h3>
            <div className="table-container">
                <div className="progress-table">
                    <div className="table-header">
                        <div className="header-cell">Дисциплина</div>
                        <div className="header-cell">Руководитель</div>
                        <div className="header-cell">Модуль 1 (30)</div>
                        <div className="header-cell">Модуль 2 (60)</div>
                        <div className="header-cell">Статус</div>
                    </div>

                    {student.courseWorks.map((work, index) => (
                        <div className="table-row" key={index}>
                            <div className="cell">{work.discipline}</div>
                            <div className="cell">{work.supervisor}</div>
                            <div className="cell score">{work.module1}</div>
                            <div className="cell score">{work.module2}</div>
                            <div className="cell status">
                                {work.passed ? (
                                    <span className="passed">Защищена</span>
                                ) : (
                                    <span className="not-passed">Не сдана</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;