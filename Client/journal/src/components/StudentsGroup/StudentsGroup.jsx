import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents, updateStudent } from '../../store/slices/studentSlice';
import { fetchSubgroups } from '../../store/slices/subgroupSlice';
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
    const dispatch = useDispatch();
    const { data: allStudents, isLoading } = useSelector(state => state.students);
    const { data: subgroupsData } = useSelector(state => state.subgroups);
    const [students, setStudents] = useState([]);
    const [isMonitor, setIsMonitor] = useState(true);
    const [sortMode, setSortMode] = useState('fullList');
    const [collapsedSubgroups, setCollapsedSubgroups] = useState({});
    const [groupName, setGroupName] = useState('');
    const [groupNumber, setGroupNumber] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedSubgroup, setSelectedSubgroup] = useState('');

    // Функция для преобразования данных студента
    const transformStudentData = (student) => {
        return {
            id: student.id,
            firstName: student.person?.name || '',
            lastName: student.person?.surname || '',
            group: student.group?.name || '',
            subgroup: student.subgroup?.name || null,
            photo: student.icon_path || defaultPhoto,
            reprimandCount: student.countReprimand || 0,
            parentName: student.perent ? `${student.perent.surname} ${student.perent.name}` : '',
            originalData: student // Сохраняем оригинальные данные для обновления
        };
    };

    // Сортировка студентов по алфавиту
    const sortStudentsAlphabetically = (students) => {
        return [...students].sort((a, b) => {
            const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
            const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    };

    useEffect(() => {
        dispatch(fetchStudents({ groupQuery: group, limit: 1000 }));
        dispatch(fetchSubgroups({}));
    }, [dispatch, group]);

    useEffect(() => {
        if (allStudents && allStudents.length > 0) {
            const filteredStudents = allStudents
                .filter(student => student.group?.name === group)
                .map(transformStudentData);

            const sortedData = sortStudentsAlphabetically(filteredStudents);
            setStudents(sortedData);

            if (group) {
                const [name, number] = group.split('-');
                setGroupName(name);
                setGroupNumber(number);
            }
        }
    }, [allStudents, group]);

    // Обновление подгруппы студента
    const updateStudentSubgroup = async (studentId, newSubgroupName) => {
        try {
            const studentToUpdate = students.find(s => s.id === studentId);
            if (!studentToUpdate) return;

            const subgroupToAssign = subgroupsData.find(s => s.name === newSubgroupName);
            if (!subgroupToAssign) return;

            const updateData = {
                ...studentToUpdate.originalData,
                subgroup_id: subgroupToAssign.id
            };

            await dispatch(updateStudent({
                id: studentId,
                data: {
                    count_reprimand: updateData.countReprimand,
                    icon_path: updateData.icon_path || '',
                    person_id: updateData.person.id,
                    group_id: updateData.group.id,
                    subgroup_id: subgroupToAssign.id,
                    perent_person_id: updateData.perent?.id || null
                }
            }));

            // Обновляем локальное состояние
            setStudents(prev =>
                sortStudentsAlphabetically(prev.map(s =>
                    s.id === studentId
                        ? { ...s, subgroup: newSubgroupName, originalData: { ...s.originalData, subgroup: subgroupToAssign } }
                        : s
                ))
            );

        } catch (error) {
            console.error('Ошибка при обновлении подгруппы:', error);
        }
    };

    const onDragEnd = async (event) => {
        if (!isMonitor || sortMode !== 'subgroups') return;

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const draggedStudent = students.find(s => s.id === active.id);
        const targetStudent = students.find(s => s.id === over.id);

        if (!draggedStudent || !targetStudent || draggedStudent.subgroup === targetStudent.subgroup) {
            return;
        }

        await updateStudentSubgroup(draggedStudent.id, targetStudent.subgroup);
    };

    const toggleSubgroup = (subgroup) => {
        setCollapsedSubgroups(prev => ({
            ...prev,
            [subgroup]: !prev[subgroup],
        }));
    };

    const studentsWithoutSubgroup = students.filter(student => !student.subgroup);

    const handleDoubleClick = (student) => {
        if (isMonitor && sortMode === 'subgroups') {
            setSelectedStudent(student);
            setSelectedSubgroup(student.subgroup || '');
        }
    };

    const moveStudentToSubgroup = async () => {
        if (!selectedStudent) return;

        await updateStudentSubgroup(selectedStudent.id, selectedSubgroup);
        setSelectedStudent(null);
    };

    const sortedStudents = sortStudentsAlphabetically(students);

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div className="container__students student__container__group">
            <div className="header__group">
                <h1 className="title">Группа: {groupName}-{groupNumber}</h1>
                <div className="buttons">
                    <button className="button__group" onClick={() => setSortMode('fullList')}>
                        Показать полный список
                    </button>
                    <button className="button__group" onClick={() => setSortMode('subgroups')}>
                        Сортировать по подгруппам
                    </button>
                </div>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                {sortMode === 'subgroups' ? (
                    <div className="subgroups-container">
                        <SortableContext items={sortedStudents} strategy={verticalListSortingStrategy}>
                            {/* Подгруппа 1 */}
                            <div className="subgroup-column">
                                <div className="subgroup-header">
                                    <h3>Подгруппа 1</h3>
                                    <button
                                        className="collapse-button"
                                        onClick={() => toggleSubgroup("Подгруппа 1")}
                                    >
                                        {collapsedSubgroups["Подгруппа 1"] ? '▶' : '▼'}
                                    </button>
                                </div>
                                {!collapsedSubgroups["Подгруппа 1"] && (
                                    <>
                                        {sortedStudents
                                            .filter(s => s.subgroup === "1 подгруппа")
                                            .map((student, index) => (
                                                <SortableStudent
                                                    key={student.id}
                                                    student={{ ...student, number: index + 1 }}
                                                    isDraggable={isMonitor && sortMode === 'subgroups'}
                                                    onDoubleClick={() => handleDoubleClick(student)}
                                                    showSubgroup={false}
                                                />
                                            ))}
                                    </>
                                )}
                            </div>

                            {/* Студенты без подгруппы */}
                            {isMonitor && studentsWithoutSubgroup.length > 0 && (
                                <div className="subgroup-column">
                                    <div className="subgroup-header">
                                        <h3>Без подгруппы</h3>
                                        <button
                                            className="collapse-button"
                                            onClick={() => toggleSubgroup("Без подгруппы")}
                                        >
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
                                                        showSubgroup={false}
                                                    />
                                                ))}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Подгруппа 2 */}
                            <div className="subgroup-column">
                                <div className="subgroup-header">
                                    <h3>Подгруппа 2</h3>
                                    <button
                                        className="collapse-button"
                                        onClick={() => toggleSubgroup("Подгруппа 2")}
                                    >
                                        {collapsedSubgroups["Подгруппа 2"] ? '▶' : '▼'}
                                    </button>
                                </div>
                                {!collapsedSubgroups["Подгруппа 2"] && (
                                    <>
                                        {sortedStudents
                                            .filter(s => s.subgroup === "2 подгруппа")
                                            .map((student, index) => (
                                                <SortableStudent
                                                    key={student.id}
                                                    student={{ ...student, number: index + 1 }}
                                                    isDraggable={isMonitor && sortMode === 'subgroups'}
                                                    onDoubleClick={() => handleDoubleClick(student)}
                                                    showSubgroup={false}
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
                                        showSubgroup={true}
                                    />
                                ))}
                            </div>
                        </div>
                    </SortableContext>
                )}
            </DndContext>

            {/* Модальное окно для выбора подгруппы */}
            <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
                <DialogTitle>Переместить студента</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <p>{`${selectedStudent.lastName} ${selectedStudent.firstName}`}</p>
                    )}
                    <FormControl fullWidth>
                        <InputLabel>Подгруппа</InputLabel>
                        <Select
                            value={selectedSubgroup}
                            onChange={(e) => setSelectedSubgroup(e.target.value)}
                            label="Подгруппа"
                        >
                            <MenuItem value="1 подгруппа">Подгруппа 1</MenuItem>
                            <MenuItem value="2 подгруппа">Подгруппа 2</MenuItem>
                            <MenuItem value="">Без подгруппы</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedStudent(null)}>Отмена</Button>
                    <Button onClick={moveStudentToSubgroup}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const SortableStudent = ({ student, isDraggable, onDoubleClick, showSubgroup }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: student.id,
        disabled: !isDraggable
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDraggable ? "grab" : "default"
    };

    const handleTouchEnd = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            onDoubleClick(student);
        }
        setLastTap(currentTime);
    };

    const [lastTap, setLastTap] = useState(0);

    return (
        <div
            className="student-item student-item-adaptive"
            ref={setNodeRef}
            style={style}
            {...(isDraggable ? { ...attributes, ...listeners } : {})}
            onDoubleClick={() => onDoubleClick(student)}
            onTouchEnd={handleTouchEnd}
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
                <span className="student-name">{`${student.lastName} ${student.firstName}`}</span>
                <span className="student-group">{student.group}</span>
                {showSubgroup && (
                    <span className="student-subgroup">{student.subgroup || "Без подгруппы"}</span>
                )}
                {student.reprimandCount > 0 && (
                    <span className="student-reprimand">Замечания: {student.reprimandCount}</span>
                )}
            </div>
        </div>
    );
};

export default StudentsGroup;