import React, { useState } from 'react';
import './WorkProgram.css';

const WorkProgram = () => {
    const [activityType, setActivityType] = useState('lecture');
    const [weekForm, setWeekForm] = useState({ weekNumber: '', topic: '', controlForm: '', recommendedPoints: '' });
    const [weeksData, setWeeksData] = useState([]);

    const handleActivityTypeChange = (e) => {
        setActivityType(e.target.value);
        setWeekForm(prev => ({ ...prev, controlForm: '', recommendedPoints: '' }));
    };

    const handleFormChange = (field, value) => {
        setWeekForm(prev => ({ ...prev, [field]: value }));
    };

    const addWeek = () => {
        if (!weekForm.weekNumber || !weekForm.topic) return;

        setWeeksData([...weeksData, { ...weekForm, type: activityType }]);
        setWeekForm({ weekNumber: '', topic: '', controlForm: '', recommendedPoints: '' });
    };

    return (
        <div className="work-program-container">
            <h1>Рабочая программа</h1>

            <div className="info-card">
                <table className="info-table">
                    <colgroup>
                        <col className="info-label-col" />
                        <col className="info-value-col" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th>Дисциплина</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>Кафедры</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>Часы</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>Зачетных единиц</th>
                        <td>static value from server</td>
                    </tr>
                    <tr className="sub-header">
                        <th colSpan="2">Из них</th>
                    </tr>
                    <tr>
                        <th>На лекции</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>На семинары</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>На практику</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>На лаб работы</th>
                        <td>static value from server</td>
                    </tr>
                    <tr>
                        <th>На сам работу</th>
                        <td>static value from server</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="form-card">
                <h2>Добавить занятие</h2>
                <div className="form-group">
                    <label>Тип занятия:</label>
                    <select
                        value={activityType}
                        onChange={handleActivityTypeChange}
                        className="form-select"
                    >
                        <option value="lecture">Лекция</option>
                        <option value="seminar">Семинар</option>
                        <option value="practice">Практика</option>
                        <option value="lab">Лабораторная работа</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Номер недели:</label>
                        <input
                            type="text"
                            value={weekForm.weekNumber}
                            onChange={(e) => handleFormChange('weekNumber', e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Тема:</label>
                        <select
                            value={weekForm.topic}
                            onChange={(e) => handleFormChange('topic', e.target.value)}
                            className="form-select"
                        >
                            <option value="">Выберите тему</option>
                            <option value="topic1">Тема 1</option>
                            <option value="topic2">Тема 2</option>
                            <option value="topic3">Тема 3</option>
                        </select>
                    </div>
                </div>

                {activityType !== 'lecture' && (
                    <div className="form-row">
                        <div className="form-group">
                            <label>Форма контроля знаний:</label>
                            <input
                                type="text"
                                value={weekForm.controlForm}
                                onChange={(e) => handleFormChange('controlForm', e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Рекомендованные баллы:</label>
                            <input
                                type="text"
                                value={weekForm.recommendedPoints}
                                onChange={(e) => handleFormChange('recommendedPoints', e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}

                <button onClick={addWeek} className="submit-btn">
                    Добавить занятие
                </button>
            </div>

            <div className="data-card">
                <h2>План занятий</h2>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Тип</th>
                        <th>Неделя</th>
                        <th>Тема</th>
                        {weeksData.some(item => item.type !== 'lecture') && (
                            <>
                                <th>Форма контроля</th>
                                <th>Баллы</th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {weeksData.length > 0 ? (
                        weeksData.map((week, index) => (
                            <tr key={index}>
                                <td>
                                    {week.type === 'lecture' && 'Лекция'}
                                    {week.type === 'seminar' && 'Семинар'}
                                    {week.type === 'practice' && 'Практика'}
                                    {week.type === 'lab' && 'Лабораторная'}
                                </td>
                                <td>{week.weekNumber}</td>
                                <td>{week.topic}</td>
                                {weeksData.some(item => item.type !== 'lecture') && (
                                    <>
                                        <td>{week.controlForm}</td>
                                        <td>{week.recommendedPoints}</td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-message">Нет добавленных занятий</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkProgram;