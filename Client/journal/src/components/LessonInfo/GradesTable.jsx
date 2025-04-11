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
    Autocomplete,
    Select,
    MenuItem,
    FormControl,
    Menu
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

const mockAssignments = [
    { id: 1, title: 'Лабораторная работа 1' },
    { id: 2, title: 'Лабораторная работа 2' },
    { id: 3, title: 'Курсовая работа' },
    { id: 4, title: 'Домашнее задание 1' },
    { id: 5, title: 'Домашнее задание 2' },
];

const gradeTypes = [
    { value: 'grade', label: 'Оценка' },
    { value: 'pass', label: 'Зачет' },
    { value: 'points', label: 'Баллы' },
];

const GradesTable = ({ lessonData }) => {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState({
        student: null,
        assignment: null,
        type: 'grade',
        value: ''
    });
    const [isAddingGrade, setIsAddingGrade] = useState(false);
    const [editingGradeId, setEditingGradeId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentGrade, setCurrentGrade] = useState(null);

    const handleAddGrade = () => {
        setIsAddingGrade(true);
    };

    const handleSaveNewGrade = () => {
        if (!newGrade.student || !newGrade.assignment || !newGrade.value) {
            return;
        }

        setGrades([...grades, {
            id: Date.now(),
            studentId: newGrade.student.id,
            studentName: newGrade.student.name,
            assignmentId: newGrade.assignment.id,
            assignmentTitle: newGrade.assignment.title,
            type: newGrade.type,
            value: newGrade.value
        }]);

        setNewGrade({
            student: null,
            assignment: null,
            type: 'grade',
            value: ''
        });
        setIsAddingGrade(false);
    };

    const handleCancelAddGrade = () => {
        setIsAddingGrade(false);
        setNewGrade({
            student: null,
            assignment: null,
            type: 'grade',
            value: ''
        });
    };

    const handleMenuOpen = (event, grade) => {
        setAnchorEl(event.currentTarget);
        setCurrentGrade(grade);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentGrade(null);
    };

    const handleEditGrade = () => {
        if (!currentGrade) return;
        setEditingGradeId(currentGrade.id);
        setNewGrade({
            student: mockStudents.find(s => s.id === currentGrade.studentId),
            assignment: mockAssignments.find(a => a.id === currentGrade.assignmentId),
            type: currentGrade.type,
            value: currentGrade.value
        });
        handleMenuClose();
    };

    const handleDeleteGrade = () => {
        if (!currentGrade) return;
        setGrades(grades.filter(g => g.id !== currentGrade.id));
        handleMenuClose();
    };

    const handleSaveEditedGrade = () => {
        if (!newGrade.student || !newGrade.assignment || !newGrade.value) {
            return;
        }

        setGrades(grades.map(grade =>
            grade.id === editingGradeId ? {
                ...grade,
                studentId: newGrade.student.id,
                studentName: newGrade.student.name,
                assignmentId: newGrade.assignment.id,
                assignmentTitle: newGrade.assignment.title,
                type: newGrade.type,
                value: newGrade.value
            } : grade
        ));

        setEditingGradeId(null);
        setNewGrade({
            student: null,
            assignment: null,
            type: 'grade',
            value: ''
        });
    };

    const handleCancelEditGrade = () => {
        setEditingGradeId(null);
        setNewGrade({
            student: null,
            assignment: null,
            type: 'grade',
            value: ''
        });
    };

    const allStudentsAvailableForGrades = mockStudents;

    return (
        <>
            <Box className={styles.attendanceHeader} style={{ marginTop: '32px' }}>
                <Typography variant="h6" className={styles.attendanceTitle}>
                    Оценки группы <span className={styles.groupName}>{lessonData.group}</span>
                </Typography>
                <Tooltip title="Добавить оценку">
                    <div className={styles.scaleAnimation}>
                        <IconButton
                            color="primary"
                            size="large"
                            onClick={handleAddGrade}
                            disabled={isAddingGrade}
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
                            <TableCell className={styles.headerCell}>Задание</TableCell>
                            <TableCell className={styles.headerCell}>Тип оценки</TableCell>
                            <TableCell className={styles.headerCell}>Значение</TableCell>
                            <TableCell className={styles.headerCell} align="center">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades.length === 0 && !isAddingGrade && !editingGradeId ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className={styles.noStudentsCell}>
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        className={styles.noStudentsText}
                                    >
                                        Нет оценок
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {grades.map(grade => (
                                    <TableRow key={grade.id} className={styles.tableRow}>
                                        {editingGradeId === grade.id ? (
                                            <>
                                                <TableCell>
                                                    <Autocomplete
                                                        options={allStudentsAvailableForGrades}
                                                        getOptionLabel={(option) => option.name}
                                                        value={newGrade.student}
                                                        onChange={(e, newValue) =>
                                                            setNewGrade({...newGrade, student: newValue})
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                fullWidth
                                                                variant="outlined"
                                                                className={styles.autocompleteInput}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        options={mockAssignments}
                                                        getOptionLabel={(option) => option.title}
                                                        value={newGrade.assignment}
                                                        onChange={(e, newValue) =>
                                                            setNewGrade({...newGrade, assignment: newValue})
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                fullWidth
                                                                variant="outlined"
                                                                className={styles.autocompleteInput}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={newGrade.type}
                                                            onChange={(e) => setNewGrade({...newGrade, type: e.target.value})}
                                                            className={styles.select}
                                                        >
                                                            {gradeTypes.map((type) => (
                                                                <MenuItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={newGrade.value}
                                                        onChange={(e) => setNewGrade({...newGrade, value: e.target.value})}
                                                        className={styles.gradeInput}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={handleCancelEditGrade}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={handleSaveEditedGrade}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>
                                                    <Typography className={styles.studentName}>
                                                        {grade.studentName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={styles.studentName}>
                                                        {grade.assignmentTitle}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={styles.studentName}>
                                                        {gradeTypes.find(t => t.value === grade.type)?.label}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={styles.studentName}>
                                                        {grade.value}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={(e) => handleMenuOpen(e, grade)}
                                                        size="small"
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleEditGrade}>
                                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                        Редактировать
                                    </MenuItem>
                                    <MenuItem onClick={handleDeleteGrade}>
                                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                        Удалить
                                    </MenuItem>
                                </Menu>

                                {isAddingGrade && (
                                    <TableRow className={styles.tableRow}>
                                        <TableCell>
                                            <Autocomplete
                                                options={allStudentsAvailableForGrades}
                                                getOptionLabel={(option) => option.name}
                                                value={newGrade.student}
                                                onChange={(e, newValue) =>
                                                    setNewGrade({...newGrade, student: newValue})
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
                                        <TableCell>
                                            <Autocomplete
                                                options={mockAssignments}
                                                getOptionLabel={(option) => option.title}
                                                value={newGrade.assignment}
                                                onChange={(e, newValue) =>
                                                    setNewGrade({...newGrade, assignment: newValue})
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        placeholder="Выберите задание"
                                                        fullWidth
                                                        variant="outlined"
                                                        className={styles.autocompleteInput}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={newGrade.type}
                                                    onChange={(e) => setNewGrade({...newGrade, type: e.target.value})}
                                                    className={styles.select}
                                                >
                                                    {gradeTypes.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                placeholder="Значение"
                                                fullWidth
                                                variant="outlined"
                                                value={newGrade.value}
                                                onChange={(e) => setNewGrade({...newGrade, value: e.target.value})}
                                                className={styles.gradeInput}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={handleCancelAddGrade}
                                                color="error"
                                                size="small"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={handleSaveNewGrade}
                                                color="primary"
                                                size="small"
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {isAddingGrade && (
                <Box className={styles.actionsBox}>
                    <div className={styles.actionAnimation}>
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={handleCancelAddGrade}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </Button>
                    </div>
                    <div className={styles.actionAnimation}>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveNewGrade}
                            disabled={!newGrade.student || !newGrade.assignment || !newGrade.value}
                            className={styles.saveButton}
                        >
                            Сохранить
                        </Button>
                    </div>
                </Box>
            )}
        </>
    );
};

export default GradesTable;