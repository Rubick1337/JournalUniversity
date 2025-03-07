import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, Autocomplete, Box
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './TableLearn.css'; // Импортируем CSS для анимации

const TableLearn = () => {
    const [data, setData] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formsOfAttestation, setFormsOfAttestation] = useState([]);
    const [specialtyCode, setSpecialtyCode] = useState("");
    const [specialtyName, setSpecialtyName] = useState("");
    const [startYear, setStartYear] = useState("");
    const [newRow, setNewRow] = useState({
        discipline: "",
        department: "",
        formOfAttestation: "",
        semester: "",
    });

    useEffect(() => {
        axios.get("/TestData/data.json")
            .then((response) => {
                const { specialtyCode, specialtyName, startYear, tableData, disciplines, departments, formsOfAttestation } = response.data;
                setData(tableData);
                setDisciplines(disciplines);
                setDepartments(departments);
                setFormsOfAttestation(formsOfAttestation);
                setSpecialtyCode(specialtyCode);
                setSpecialtyName(specialtyName);
                setStartYear(startYear);
            })
            .catch((error) => console.error("Ошибка загрузки данных:", error));
    }, []);

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (field === "semester" && (value === "" || (parseFloat(value) > 0 && Number.isInteger(parseFloat(value))))) {
            setNewRow({ ...newRow, [field]: value });
        } else if (field !== "semester") {
            setNewRow({ ...newRow, [field]: value });
        }
    };

    const handleAutocompleteChange = (value, field) => {
        setNewRow({ ...newRow, [field]: value || "" });
    };

    const addRow = () => {
        if (newRow.discipline && newRow.department && newRow.formOfAttestation && newRow.semester) {
            const newRowWithId = { ...newRow, id: data.length + 1, semester: parseInt(newRow.semester, 10) };
            setData([...data, { ...newRowWithId, animationClass: 'fade-in' }]);
            setNewRow({ discipline: "", department: "", formOfAttestation: "", semester: "" });
        }
    };

    return (
        <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <div style={{ padding: '16px' }}>
                    <h2>{specialtyCode} {specialtyName}</h2>
                    <p>Год начала подготовки по учебному плану: {startYear}</p>
                </div>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Дисциплина</TableCell>
                            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Кафедра</TableCell>
                            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Форма аттестации</TableCell>
                            <TableCell>Семестр</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id} className={row.animationClass || ''}>
                                <TableCell>{row.discipline}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.formOfAttestation}</TableCell>
                                <TableCell style={{ width: 150 }}>{row.semester}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>
                                <Autocomplete
                                    value={newRow.discipline}
                                    onChange={(e, value) => handleAutocompleteChange(value, "discipline")}
                                    options={disciplines.map((discipline) => discipline.name)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Выберите дисциплину"
                                            fullWidth
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    value={newRow.department}
                                    onChange={(e, value) => handleAutocompleteChange(value, "department")}
                                    options={departments.map((department) => department.name)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Выберите кафедру"
                                            fullWidth
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    value={newRow.formOfAttestation}
                                    onChange={(e, value) => handleAutocompleteChange(value, "formOfAttestation")}
                                    options={formsOfAttestation.map((form) => form.name)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Выберите форму аттестации"
                                            fullWidth
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    min="1"
                                    sx={{ minWidth: 160 }}
                                    step="1"
                                    value={newRow.semester}
                                    onChange={(e) => handleInputChange(e, "semester")}
                                    placeholder="Введите семестр"
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                sx={{
                    position: 'sticky',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    mt: 1,
                    mb: 2,
                }}
            >
                <IconButton onClick={addRow} color="primary">
                    <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default TableLearn;