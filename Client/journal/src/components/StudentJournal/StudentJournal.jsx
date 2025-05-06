import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Pagination
} from '@mui/material';
import { fetchStudentJournal, setSelectedGroup, setSelectedSubgroup, setCurrentPage } from '../../store/slices/studentJournalSlice';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
        borderRight: 'none'
    }
}));

const DateHeaderCell = styled(TableCell)(({ theme }) => ({
    borderRight: '2px solid #1976d2',
    '&:last-child': {
        borderRight: 'none'
    }
}));

const SubjectHeaderCell = styled(TableCell)(({ theme }) => ({
    borderRight: '2px solid #1976d2',
    '&:last-child': {
        borderRight: 'none'
    }
}));

const AbsenceCircle = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#e3f2fd',
    color: theme.palette.primary.main,
    fontWeight: 'bold'
}));

const UnauthorizedAbsence = styled('span')(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.error.main
}));

const StudentJournal = () => {
    const dispatch = useDispatch();
    const {
        groups,
        subgroups,
        students,
        subjects,
        selectedGroup,
        selectedSubgroup,
        currentPage,
        loading,
        error
    } = useSelector((state) => state.studentJournal);

    useEffect(() => {
        dispatch(fetchStudentJournal());
    }, [dispatch]);

    const datesPerPage = 2;
    const groupedByDate = subjects.reduce((acc, subject) => {
        if (!acc[subject.date]) acc[subject.date] = [];
        acc[subject.date].push(subject);
        return acc;
    }, {});

    const dateKeys = Object.keys(groupedByDate);
    const totalPages = Math.ceil(dateKeys.length / datesPerPage);
    const visibleDates = dateKeys.slice((currentPage - 1) * datesPerPage, currentPage * datesPerPage);

    const getAbsenceFor = (student, subjectId) => {
        const studentAbsences = students[student];
        if (!studentAbsences) return null;

        return studentAbsences.find((a) => a.subjectId === subjectId);
    };

    const handleSubmit = () => {
        const data = {
            group: selectedGroup,
            subgroup: selectedSubgroup || 'Не выбрана'
        };
        console.log('Отправка данных:', data);
        alert(`Данные отправлены:\nГруппа: ${data.group}\nПодгруппа: ${data.subgroup}`);
    };

    const renderAbsence = (absence) => {
        if (absence.type === 'уважительная') {
            return <AbsenceCircle>{absence.hours}</AbsenceCircle>;
        } else {
            return <UnauthorizedAbsence>{absence.hours}</UnauthorizedAbsence>;
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            {loading && <div>Загрузка...</div>}
            {error && <div>Ошибка: {error}</div>}
            <Box sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Группа</InputLabel>
                    <Select
                        value={selectedGroup}
                        onChange={(e) => dispatch(setSelectedGroup(e.target.value))}
                        label="Группа"
                    >
                        {groups.map((group) => (
                            <MenuItem key={group} value={group}>
                                {group}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedGroup && (
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Подгруппа</InputLabel>
                        <Select
                            value={selectedSubgroup}
                            onChange={(e) => dispatch(setSelectedSubgroup(e.target.value))}
                            label="Подгруппа"
                        >
                            <MenuItem value="">
                                <em>Не выбрана</em>
                            </MenuItem>
                            {subgroups[selectedGroup]?.map((subgroup) => (
                                <MenuItem key={subgroup} value={subgroup}>
                                    {subgroup}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedGroup}
                    sx={{ height: '56px' }}
                >
                    Сохранить данные
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => dispatch(setCurrentPage(page))}
                    color="primary"
                />
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell rowSpan={2}>Студент</StyledTableCell>
                            {visibleDates.map((date) => (
                                <DateHeaderCell key={date} colSpan={groupedByDate[date].length} align="center">
                                    {date}
                                </DateHeaderCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {visibleDates.flatMap((date) =>
                                groupedByDate[date].map((subject) => (
                                    <SubjectHeaderCell key={subject.id} align="center" sx={{ fontStyle: 'italic' }}>
                                        {subject.name}
                                    </SubjectHeaderCell>
                                ))
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(students).map((studentName) => (
                            <TableRow key={studentName}>
                                <StyledTableCell>{studentName}</StyledTableCell>
                                {visibleDates.flatMap((date) =>
                                    groupedByDate[date].map((subject) => {
                                        const absence = getAbsenceFor(studentName, subject.id);
                                        return (
                                            <StyledTableCell key={`${studentName}-${subject.id}`} align="center">
                                                {absence ? renderAbsence(absence) : null}
                                            </StyledTableCell>
                                        );
                                    })
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StudentJournal;