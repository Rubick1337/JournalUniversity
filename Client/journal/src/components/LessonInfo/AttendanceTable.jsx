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
    Autocomplete,
    Menu,
    MenuItem,
    Divider,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import styles from './LessonInfo.module.css';

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
        validAbsence: '',
        invalidAbsence: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const MAX_HOURS = 2;

    const handleAbsenceChange = (studentId, type, value) => {
        const numericValue = value === '' ? 0 : Number(value);

        // Проверка суммы часов перед изменением
        const existingRecord = attendance.find(a => a.studentId === studentId);
        const otherType = type === 'validAbsence' ? 'invalidAbsence' : 'validAbsence';
        const otherValue = existingRecord ? existingRecord[otherType] : 0;

        if (numericValue + otherValue > MAX_HOURS) {
            setErrorMessage(`Сумма часов не может превышать ${MAX_HOURS} ч`);
            setErrorOpen(true);
            return;
        }

        setAttendance(prev => {
            const filtered = prev.filter(a => a.studentId !== studentId);

            if (numericValue === 0 && otherValue === 0) {
                return filtered;
            }

            return [...filtered, {
                studentId,
                validAbsence: type === 'validAbsence' ? numericValue : otherValue,
                invalidAbsence: type === 'invalidAbsence' ? numericValue : otherValue
            }];
        });
    };

    const handleAddStudent = () => {
        setIsAdding(true);
    };

    const handleSaveNewStudent = () => {
        if (!newStudent.student || (newStudent.validAbsence === '' && newStudent.invalidAbsence === '')) {
            return;
        }

        const valid = newStudent.validAbsence === '' ? 0 : Number(newStudent.validAbsence);
        const invalid = newStudent.invalidAbsence === '' ? 0 : Number(newStudent.invalidAbsence);

        // Проверка суммы часов для нового студента
        if (valid + invalid > MAX_HOURS) {
            setErrorMessage(`Сумма часов не может превышать ${MAX_HOURS} ч`);
            setErrorOpen(true);
            return;
        }

        setAbsentStudents([...absentStudents, newStudent.student]);

        if (valid > 0 || invalid > 0) {
            setAttendance(prev => [
                ...prev,
                {
                    studentId: newStudent.student.id,
                    validAbsence: valid,
                    invalidAbsence: invalid
                }
            ]);
        }

        setNewStudent({
            student: null,
            validAbsence: '',
            invalidAbsence: ''
        });
        setIsAdding(false);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewStudent({
            student: null,
            validAbsence: '',
            invalidAbsence: ''
        });
    };

    const handleDeleteStudent = (studentId) => {
        setAbsentStudents(absentStudents.filter(s => s.id !== studentId));
        setAttendance(attendance.filter(a => a.studentId !== studentId));
        handleCloseMenu();
    };

    const handleEditStudent = (studentId) => {
        setEditingStudentId(studentId);
        handleCloseMenu();
    };

    const handleSaveEdit = (studentId) => {
        setEditingStudentId(null);
    };

    const handleCancelEdit = () => {
        setEditingStudentId(null);
    };

    const getStudentAbsence = (studentId) => {
        const record = attendance.find(a => a.studentId === studentId);
        return record || { validAbsence: 0, invalidAbsence: 0 };
    };

    const handleOpenMenu = (event, studentId) => {
        setAnchorEl(event.currentTarget);
        setSelectedStudentId(studentId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedStudentId(null);
    };

    const handleCloseError = () => {
        setErrorOpen(false);
    };

    const availableStudentsForAbsence = mockStudents.filter(
        student => !absentStudents.some(s => s.id === student.id)
    );

    return (
        <>
            <Snackbar
                open={errorOpen}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

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
                                    const absence = getStudentAbsence(student.id);
                                    const isEditing = editingStudentId === student.id;

                                    return (
                                        <TableRow key={student.id} className={styles.tableRow}>
                                            <TableCell>
                                                <Typography className={styles.studentName}>
                                                    {student.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {isEditing ? (
                                                    <TextField
                                                        type="number"
                                                        value={absence.validAbsence}
                                                        onChange={(e) => handleAbsenceChange(
                                                            student.id,
                                                            'validAbsence',
                                                            e.target.value
                                                        )}
                                                        inputProps={{
                                                            min: 0,
                                                            max: MAX_HOURS,
                                                            step: 1,
                                                            style: { textAlign: 'center' }
                                                        }}
                                                        size="small"
                                                        variant="outlined"
                                                        className={styles.absenceInput}
                                                    />
                                                ) : (
                                                    <Typography>
                                                        {absence.validAbsence > 0 ? `${absence.validAbsence} ч` : '-'}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {isEditing ? (
                                                    <TextField
                                                        type="number"
                                                        value={absence.invalidAbsence}
                                                        onChange={(e) => handleAbsenceChange(
                                                            student.id,
                                                            'invalidAbsence',
                                                            e.target.value
                                                        )}
                                                        inputProps={{
                                                            min: 0,
                                                            max: MAX_HOURS,
                                                            step: 1,
                                                            style: { textAlign: 'center' }
                                                        }}
                                                        size="small"
                                                        variant="outlined"
                                                        className={styles.absenceInput}
                                                    />
                                                ) : (
                                                    <Typography>
                                                        {absence.invalidAbsence > 0 ? `${absence.invalidAbsence} ч` : '-'}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Tooltip title="Сохранить">
                                                            <IconButton
                                                                onClick={() => handleSaveEdit(student.id)}
                                                                color="primary"
                                                                size="small"
                                                            >
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Отменить">
                                                            <IconButton
                                                                onClick={handleCancelEdit}
                                                                color="error"
                                                                size="small"
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleOpenMenu(e, student.id)}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl) && selectedStudentId === student.id}
                                                            onClose={handleCloseMenu}
                                                        >
                                                            <MenuItem onClick={() => handleEditStudent(student.id)}>
                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                                                Редактировать
                                                            </MenuItem>
                                                            <Divider />
                                                            <MenuItem onClick={() => handleDeleteStudent(student.id)}>
                                                                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                                                Удалить
                                                            </MenuItem>
                                                        </Menu>
                                                    </>
                                                )}
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
                                            <TextField
                                                type="number"
                                                value={newStudent.validAbsence}
                                                onChange={(e) => setNewStudent({
                                                    ...newStudent,
                                                    validAbsence: e.target.value
                                                })}
                                                inputProps={{
                                                    min: 0,
                                                    max: MAX_HOURS,
                                                    step: 1,
                                                    style: { textAlign: 'center' }
                                                }}
                                                size="small"
                                                variant="outlined"
                                                className={styles.absenceInput}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="number"
                                                value={newStudent.invalidAbsence}
                                                onChange={(e) => setNewStudent({
                                                    ...newStudent,
                                                    invalidAbsence: e.target.value
                                                })}
                                                inputProps={{
                                                    min: 0,
                                                    max: MAX_HOURS,
                                                    step: 1,
                                                    style: { textAlign: 'center' }
                                                }}
                                                size="small"
                                                variant="outlined"
                                                className={styles.absenceInput}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Tooltip title="Сохранить">
                                                    <IconButton
                                                        onClick={handleSaveNewStudent}
                                                        color="primary"
                                                        size="small"
                                                        disabled={!newStudent.student || (
                                                            newStudent.validAbsence === '' &&
                                                            newStudent.invalidAbsence === ''
                                                        )}
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Отменить">
                                                    <IconButton
                                                        onClick={handleCancelAdd}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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