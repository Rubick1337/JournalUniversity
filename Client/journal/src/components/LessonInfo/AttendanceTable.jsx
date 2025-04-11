import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Tooltip,
    Button,
    Autocomplete
} from '@mui/material';
import {
    Check as CheckIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { green, red } from '@mui/material/colors';
import styles from './LessonInfo.module.css';
import AnimatedCheckbox from './AnimatedCheckbox';

const mockStudents = [
    { id: 1, name: 'Иванов Иван' },
    { id: 2, name: 'Петров Петр' },
    { id: 3, name: 'Сидорова Мария' },
    { id: 4, name: 'Кузнецов Алексей' },
    { id: 5, name: 'Смирнова Анна' },
    { id: 6, name: 'Федоров Дмитрий' },
];

const AttendanceTable = ({ lessonData }) => {
    const [attendance, setAttendance] = useState([]);
    const [absentStudents, setAbsentStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        student: null,
        isValidAbsence: false,
        isInvalidAbsence: false
    });
    const [isAdding, setIsAdding] = useState(false);

    const handleAttendanceChange = (studentId, type) => {
        setAttendance(prev => {
            const filtered = prev.filter(a => a.studentId !== studentId);
            if (type === null) return filtered;
            return [...filtered, { studentId, type }];
        });
    };

    const handleAddStudent = () => {
        setIsAdding(true);
    };

    const handleSaveNewStudent = () => {
        if (!newStudent.student) {
            return;
        }

        if (!newStudent.isValidAbsence && !newStudent.isInvalidAbsence) {
            return;
        }

        setAbsentStudents([...absentStudents, newStudent.student]);

        if (newStudent.isValidAbsence) {
            handleAttendanceChange(newStudent.student.id, 'valid');
        } else if (newStudent.isInvalidAbsence) {
            handleAttendanceChange(newStudent.student.id, 'invalid');
        }

        setNewStudent({
            student: null,
            isValidAbsence: false,
            isInvalidAbsence: false
        });
        setIsAdding(false);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewStudent({
            student: null,
            isValidAbsence: false,
            isInvalidAbsence: false
        });
    };

    const handleDeleteStudent = (studentId) => {
        setAbsentStudents(absentStudents.filter(s => s.id !== studentId));
        setAttendance(attendance.filter(a => a.studentId !== studentId));
    };

    const getAttendanceStatus = (studentId) => {
        const record = attendance.find(a => a.studentId === studentId);
        return record ? record.type : null;
    };

    const availableStudentsForAbsence = mockStudents.filter(
        student => !absentStudents.some(s => s.id === student.id)
    );

    return (
        <>
            <Box className={styles.attendanceHeader}>
                <Typography variant="h6" className={styles.attendanceTitle}>
                    Посещаемость группы <span className={styles.groupName}>{lessonData.group}</span>
                </Typography>
                <Tooltip title="Добавить студента">
                    <div className={styles.scaleAnimation}>
                        <IconButton
                            color="primary"
                            size="large"
                            onClick={handleAddStudent}
                            disabled={isAdding || availableStudentsForAbsence.length === 0}
                            className={styles.addButton}
                        >
                            <AddIcon fontSize="inherit" style={{ color: 'white' }} />
                        </IconButton>
                    </div>
                </Tooltip>
            </Box>

            <TableContainer className={styles.tableContainer}>
                <Table className={styles.table}>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell className={styles.headerCell}>Студент</TableCell>
                            <TableCell className={styles.headerCell} align="center">Уважительная причина</TableCell>
                            <TableCell className={styles.headerCell} align="center">Неуважительная причина</TableCell>
                            <TableCell className={styles.headerCell} align="center">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {absentStudents.length === 0 && !isAdding ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" className={styles.noStudentsCell}>
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        className={styles.noStudentsText}
                                    >
                                        Все студенты присуствовали
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {absentStudents.map(student => {
                                    const status = getAttendanceStatus(student.id);
                                    const isValidAbsence = status === 'valid';
                                    const isInvalidAbsence = status === 'invalid';

                                    return (
                                        <TableRow key={student.id} className={styles.tableRow}>
                                            <TableCell>
                                                <Typography className={styles.studentName}>
                                                    {student.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <AnimatedCheckbox
                                                    checked={isValidAbsence}
                                                    onChange={() => {
                                                        handleAttendanceChange(
                                                            student.id,
                                                            isValidAbsence ? null : 'valid'
                                                        );
                                                    }}
                                                    color={green[500]}
                                                    icon={<CheckIcon />}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <AnimatedCheckbox
                                                    checked={isInvalidAbsence}
                                                    onChange={() => {
                                                        handleAttendanceChange(
                                                            student.id,
                                                            isInvalidAbsence ? null : 'invalid'
                                                        );
                                                    }}
                                                    color={red[500]}
                                                    icon={<CloseIcon />}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Удалить студента">
                                                    <IconButton
                                                        onClick={() => handleDeleteStudent(student.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {isAdding && (
                                    <TableRow className={styles.tableRow}>
                                        <TableCell>
                                            <Autocomplete
                                                options={availableStudentsForAbsence}
                                                getOptionLabel={(option) => option.name}
                                                value={newStudent.student}
                                                onChange={(e, newValue) =>
                                                    setNewStudent({...newStudent, student: newValue})
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        placeholder="Выберите студента"
                                                        fullWidth
                                                        variant="outlined"
                                                        className={styles.autocompleteInput}
                                                    />
                                                )}
                                                autoFocus
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <AnimatedCheckbox
                                                checked={newStudent.isValidAbsence}
                                                onChange={() => setNewStudent({
                                                    ...newStudent,
                                                    isValidAbsence: !newStudent.isValidAbsence,
                                                    isInvalidAbsence: false
                                                })}
                                                color={green[500]}
                                                icon={<CheckIcon />}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <AnimatedCheckbox
                                                checked={newStudent.isInvalidAbsence}
                                                onChange={() => setNewStudent({
                                                    ...newStudent,
                                                    isInvalidAbsence: !newStudent.isInvalidAbsence,
                                                    isValidAbsence: false
                                                })}
                                                color={red[500]}
                                                icon={<CloseIcon />}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={handleCancelAdd}
                                                color="error"
                                                size="small"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {isAdding && (
                <Box className={styles.actionsBox}>
                    <div className={styles.actionAnimation}>
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={handleCancelAdd}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </Button>
                    </div>
                    <div className={styles.actionAnimation}>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveNewStudent}
                            disabled={!newStudent.student}
                            className={styles.saveButton}
                        >
                            Сохранить
                        </Button>
                    </div>
                </Box>
            )}

            {availableStudentsForAbsence.length === 0 && !isAdding && absentStudents.length > 0 && (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    className={styles.allStudentsAdded}
                >
                    Все студенты группы добавлены в таблицу
                </Typography>
            )}
        </>
    );
};

export default AttendanceTable;