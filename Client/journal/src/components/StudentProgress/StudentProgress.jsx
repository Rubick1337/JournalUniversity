import React from 'react';
import './StudentProgress.css';
import styled from 'styled-components';

const StudentProgress = () => {
    const student = {
        name: "Смирнова Анна Дмитриевна",
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
                module1: null,
                module2: null,
                final: true,
                passed: false,
                attended: false
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
                grade: 5,
                module1: 28,
                module2: 55,
                passed: true
            },
            {
                discipline: "Компьютерные сети",
                grade: 4,
                module1: 25,
                module2: 52,
                passed: true
            },
            {
                discipline: "Базы данных",
                grade: null,
                module1: 18,
                module2: 42,
                passed: false
            },
            {
                discipline: "Теория алгоритмов",
                grade: 5,
                module1: 30,
                module2: 60,
                passed: true
            }
        ]
    };

    // Функция для отображения значений (заменяет null на '-')
    const displayValue = (value) => value !== null ? value : '-';

    // Функция подсчёта среднего балла
    const calculateAverageGrade = () => {
        // Собираем все оценки
        const allGrades = [
            // Оценки за экзамены (финальные)
            ...student.subjects
                .filter(subject => subject.type === 'Экзамен' && subject.final !== null)
                .map(subject => subject.final),

            // Оценки за курсовые
            ...student.courseWorks
                .filter(work => work.grade !== null)
                .map(work => work.grade),
        ];

        if (allGrades.length === 0) return 0;

        const sum = allGrades.reduce((acc, grade) => acc + grade, 0);
        return (sum / allGrades.length).toFixed(2);
    };

    const averageGrade = calculateAverageGrade();

    // Подсчёт зачётов
    const credits = student.subjects.filter(subject => subject.type === 'Зачет');
    const exams = student.subjects.filter(subject => subject.type === 'Экзамен');
    const passedExam = exams.filter(exam => exam.passed).length;
    const totalExam = exams.length;
    const passedCredits = credits.filter(credit => credit.passed).length;
    const totalCredits = credits.length;
    const missedExams = student.subjects.filter(subject => !subject.attended).length;

    const TableRow = styled.div`
        display: table-row;
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
    `;

    return (
        <div className="student-progress">
            <h2>Успеваемость студента: {student.name}</h2>

            {/* Общая сводка */}
            <div className="summary">
                <div className="summary-row">
                    <p>Общий средний балл: <strong>{averageGrade}</strong></p>
                    <p>Зачёты: <strong>{passedCredits}/{totalCredits}</strong> сдано</p>
                    <p>Экзамены: <strong>{passedExam}/{totalExam}</strong> сдано</p>
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
                            <div className="cell score">{displayValue(subject.module1)}</div>
                            <div className="cell score">{displayValue(subject.module2)}</div>
                            <div className="cell final">
                                {subject.type === 'Зачет' ? (
                                    subject.final === true ? 'Зачёт' : 'Незачёт'
                                ) : (
                                    <span className={`grade-${subject.final}`}>
                                        {displayValue(subject.final)}
                                    </span>
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
                        <div className="header-cell">Модуль 1 (30)</div>
                        <div className="header-cell">Модуль 2 (60)</div>
                        <div className="header-cell">Оценка</div>
                        <div className="header-cell">Статус</div>
                    </div>

                    {student.courseWorks.map((work, index) => (
                        <div className="table-row" key={index}>
                            <div className="cell">{work.discipline}</div>
                            <div className="cell score">{displayValue(work.module1)}</div>
                            <div className="cell score">{displayValue(work.module2)}</div>
                            <div className="cell grade">
                                {work.grade !== null ? (
                                    <span className={`grade-${work.grade}`}>{work.grade}</span>
                                ) : (
                                    '-'
                                )}
                            </div>
                            <div className="cell status">
                                {work.passed ? (
                                    <span className="passed">Сдано</span>
                                ) : (
                                    <span className="not-passed">Не сдано</span>
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