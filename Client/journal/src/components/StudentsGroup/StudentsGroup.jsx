import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import "../StudentList/StudentListStyle.css";
import defaultPhoto from '../../images/icons8-тестовый-аккаунт-64.png';

const StudentsGroup = ({ group }) => {
    const [students, setStudents] = useState([]);
    const [isMonitor, setIsMonitor] = useState(true); // Флаг старосты
    const [sortMode, setSortMode] = useState('fullList'); // По умолчанию полный список
    const [collapsedSubgroups, setCollapsedSubgroups] = useState({}); // Состояние свернутых подгрупп
    const [groupName, setGroupName] = useState(''); // Название группы
    const [groupNumber, setGroupNumber] = useState(''); // Номер группы
    const [selectedStudent, setSelectedStudent] = useState(null); // Выбранный студент для перемещения
    const [selectedSubgroup, setSelectedSubgroup] = useState(''); // Выбранная подгруппа в селекторе

    // Функция для сортировки студентов по алфавиту
    const sortStudentsAlphabetically = (students) => {
        return [...students].sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    };

    useEffect(() => {
        axios.get('/TestData/students.json')
            .then(response => {
                const data = response.data;
                // Фильтруем студентов по выбранной группе
                const filteredStudents = data.filter(student => student.group === group);
                const sortedData = sortStudentsAlphabetically(filteredStudents); // Сортируем данные
                setStudents(sortedData);

                // Извлекаем название группы и номер группы из props
                if (group) {
                    const [name, number] = group.split('-');
                    setGroupName(name);
                    setGroupNumber(number);
                }
            })
            .catch(error => console.error('Ошибка загрузки данных', error));
    }, [group]); // Зависимость от group

    const onDragEnd = (event) => {
        if (!isMonitor || sortMode !== 'subgroups') return; // Блокируем DnD

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const draggedStudent = students.find(student => student.id === active.id);
        const targetStudent = students.find(student => student.id === over.id);

        if (!draggedStudent || !targetStudent) return;

        // ❌ Запрещаем менять местами студентов внутри одной подгруппы
        if (draggedStudent.subgroup === targetStudent.subgroup) {
            return;
        }

        let updatedStudents = [...students];

        // Если студент переносится в другую подгруппу
        draggedStudent.subgroup = targetStudent.subgroup;

        // Перемещение внутри или между подгруппами
        const oldIndex = updatedStudents.findIndex(student => student.id === active.id);
        const newIndex = updatedStudents.findIndex(student => student.id === over.id);
        updatedStudents = arrayMove(updatedStudents, oldIndex, newIndex);

        // Сортируем студентов после перемещения
        updatedStudents = sortStudentsAlphabetically(updatedStudents);

        // Перенумерация внутри каждой подгруппы
        const subgroups = ["Подгруппа 1", "Подгруппа 2", null]; // Добавляем null для студентов без подгруппы
        subgroups.forEach(subgroup => {
            let count = 1;
            updatedStudents
                .filter(student => student.subgroup === subgroup)
                .forEach(student => {
                    student.number = count++;
                });
        });

        setStudents(updatedStudents);
    };

    // Обработчик для сворачивания/разворачивания подгруппы
    const toggleSubgroup = (subgroup) => {
        setCollapsedSubgroups((prev) => ({
            ...prev,
            [subgroup]: !prev[subgroup],
        }));
    };

    // Фильтрация студентов без подгруппы
    const studentsWithoutSubgroup = students.filter(student => !student.subgroup);

    // Обработчик двойного клика по студенту
    const handleDoubleClick = (student) => {
        if (isMonitor && sortMode === 'subgroups') {
            setSelectedStudent(student);
            setSelectedSubgroup(student.subgroup || ''); // Устанавливаем текущую подгруппу студента
        }
    };

    // Обработчик перемещения студента в подгруппу
    const moveStudentToSubgroup = () => {
        if (!selectedStudent) return;

        const updatedStudents = students.map((student) =>
            student.id === selectedStudent.id ? { ...student, subgroup: selectedSubgroup || null } : student
        );

        // Сортируем студентов после перемещения
        const sortedStudents = sortStudentsAlphabetically(updatedStudents);
        setStudents(sortedStudents);
        setSelectedStudent(null); // Закрываем модальное окно
    };

    // Сортируем студентов перед рендерингом
    const sortedStudents = sortStudentsAlphabetically(students);

    return (
        <div className="container__students student__container__group">
            <div className="header__group">
                <h1 className="title">Группа: {groupName}-{groupNumber}</h1>
                <div className="buttons">
                    <button className="button__group" onClick={() => setSortMode('fullList')}>Показать полный список</button>
                    <button className="button__group" onClick={() => setSortMode('subgroups')}>Сортировать по подгруппам</button>
                    {isMonitor && sortMode === 'subgroups' && (
                        <button className="button__group save__group" onClick={() => console.log('Сохраненные подгруппы:', students)}>
                            Сохранить подгруппы
                        </button>
                    )}
                </div>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                {sortMode === 'subgroups' ? (
                    <div className="subgroups-container">
                        <SortableContext items={sortedStudents} strategy={verticalListSortingStrategy}>
                            {/* Колонка для Подгруппы 1 */}
                            <div className="subgroup-column">
                                <div className="subgroup-header">
                                    <h3>Подгруппа 1</h3>
                                    <button className="collapse-button" onClick={() => toggleSubgroup("Подгруппа 1")}>
                                        {collapsedSubgroups["Подгруппа 1"] ? '▶' : '▼'}
                                    </button>
                                </div>
                                {!collapsedSubgroups["Подгруппа 1"] && (
                                    <>
                                        {sortedStudents
                                            .filter(s => s.subgroup === "Подгруппа 1")
                                            .map((student, index) => (
                                                <SortableStudent
                                                    key={student.id}
                                                    student={{ ...student, number: index + 1 }}
                                                    isDraggable={isMonitor && sortMode === 'subgroups'}
                                                    onDoubleClick={() => handleDoubleClick(student)}
                                                    showSubgroup={false} // Скрываем подгруппу в карточке
                                                />
                                            ))}
                                    </>
                                )}
                            </div>

                            {/* Колонка для студентов без подгруппы (видна только старосте) */}
                            {isMonitor && studentsWithoutSubgroup.length > 0 && (
                                <div className="subgroup-column">
                                    <div className="subgroup-header">
                                        <h3>Без подгруппы</h3>
                                        <button className="collapse-button" onClick={() => toggleSubgroup("Без подгруппы")}>
                                            {collapsedSubgroups["Без подгруппы"] ? '▶' : '▼'}
                                        </button>
                                    </div>
                                    {!collapsedSubgroups["Без подгруппы"] && (
                                        <>
                                            {sortedStudents
                                                .filter(student => !student.subgroup)
                                                .map((student, index) => (
                                                    <SortableStudent
                                                        key={student.id}
                                                        student={{ ...student, number: index + 1 }}
                                                        isDraggable={isMonitor && sortMode === 'subgroups'}
                                                        onDoubleClick={() => handleDoubleClick(student)}
                                                        showSubgroup={false} // Скрываем подгруппу в карточке
                                                    />
                                                ))}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Колонка для Подгруппа 2 */}
                            <div className="subgroup-column">
                                <div className="subgroup-header">
                                    <h3>Подгруппа 2</h3>
                                    <button className="collapse-button" onClick={() => toggleSubgroup("Подгруппа 2")}>
                                        {collapsedSubgroups["Подгруппа 2"] ? '▶' : '▼'}
                                    </button>
                                </div>
                                {!collapsedSubgroups["Подгруппа 2"] && (
                                    <>
                                        {sortedStudents
                                            .filter(s => s.subgroup === "Подгруппа 2")
                                            .map((student, index) => (
                                                <SortableStudent
                                                    key={student.id}
                                                    student={{ ...student, number: index + 1 }}
                                                    isDraggable={isMonitor && sortMode === 'subgroups'}
                                                    onDoubleClick={() => handleDoubleClick(student)}
                                                    showSubgroup={false} // Скрываем подгруппу в карточке
                                                />
                                            ))}
                                    </>
                                )}
                            </div>
                        </SortableContext>
                    </div>
                ) : (
                    <SortableContext items={sortedStudents} strategy={verticalListSortingStrategy}>
                        <div className="student-list-container">
                            <div className="student-list student__list__group">
                                {sortedStudents.map((student, index) => (
                                    <SortableStudent
                                        key={student.id}
                                        student={{...student, number: index + 1}}
                                        isDraggable={false}
                                        onDoubleClick={() => handleDoubleClick(student)}
                                        showSubgroup={true} // Показываем подгруппу в карточке
                                    />
                                ))}
                            </div>
                        </div>
                    </SortableContext>
                )}
            </DndContext>

            {/* Модальное окно для выбора подгруппы */}
            <Dialog
                open={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
            >
                <DialogTitle>Переместить студента</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <p>{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</p>
                    )}
                    <FormControl fullWidth>
                        <InputLabel id="subgroup-select-label">Подгруппа</InputLabel>
                        <Select
                            labelId="subgroup-select-label"
                            id="subgroup-select"
                            value={selectedSubgroup}
                            label="Подгруппа"
                            onChange={(e) => setSelectedSubgroup(e.target.value)}
                        >
                            <MenuItem value="Подгруппа 1">Подгруппа 1</MenuItem>
                            <MenuItem value="Подгруппа 2">Подгруппа 2</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedStudent(null)}>Отмена</Button>
                    <Button onClick={moveStudentToSubgroup}>Выполнить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const SortableStudent = ({ student, isDraggable, onDoubleClick, showSubgroup }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: student.id,
        disabled: !isDraggable // Отключаем DnD, если нельзя перетаскивать
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDraggable ? "grab" : "default" // Изменяем курсор, если нельзя перетаскивать
    };

    // Обработчик двойного касания
    const [lastTap, setLastTap] = useState(0);

    const handleTouchEnd = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) { // 300 мс — время для двойного касания
            onDoubleClick(student); // Вызываем обработчик двойного клика
        }

        setLastTap(currentTime); // Обновляем время последнего касания
    };

    return (
        <div
            className="student-item student-item-adaptive"
            ref={setNodeRef}
            style={style}
            {...(isDraggable ? { ...attributes, ...listeners } : {})}
            onDoubleClick={onDoubleClick} // Обработчик двойного клика для десктопов
            onTouchEnd={handleTouchEnd} // Обработчик окончания касания для мобильных устройств
        >
            <span className="student-number">{student.number}</span>
            <span className="dot" />
            <img
                className="student-photo"
                src={student.photo || defaultPhoto}
                alt={`${student.firstName} ${student.lastName}`}
                onError={(e) => (e.target.src = defaultPhoto)}
            />
            <div className="student-info">
                <span className="student-name">{`${student.firstName} ${student.lastName}`}</span>
                <span className="student-group">{student.group}</span>
                {showSubgroup && (
                    <span className="student-subgroup">{student.subgroup || "Без подгруппы"}</span>
                )}
            </div>
        </div>
    );
};

export default StudentsGroup;