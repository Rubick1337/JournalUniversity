    import React, { useState } from 'react';
    // import { useSelector, useDispatch } from 'react-redux';
    import {
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        Typography,
        TablePagination,
        TextField,
        IconButton,
        Menu,
        MenuItem,
        Modal,
        Box,
        Button,
    } from '@mui/material';
    import MoreVertIcon from '@mui/icons-material/MoreVert';
    import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
    import CloseIcon from '@mui/icons-material/Close';
    import SearchIcon from '@mui/icons-material/Search';
    import Alert from '../Alert/Alert';

    const ContactsTable = () => {
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [searchLastName, setSearchLastName] = useState('');
        const [searchFirstName, setSearchFirstName] = useState('');
        const [searchPhone, setSearchPhone] = useState('');
        const [searchEmail, setSearchEmail] = useState('');
        const [anchorEl, setAnchorEl] = useState(null);
        const [searchAnchorEl, setSearchAnchorEl] = useState(null);
        const [currentRow, setCurrentRow] = useState(null);
        const [openEditModal, setOpenEditModal] = useState(false);
        const [openDeleteModal, setOpenDeleteModal] = useState(false);
        const [openAddModal, setOpenAddModal] = useState(false);
        const [newContact, setNewContact] = useState({
            id: '',
            lastName: '',
            firstName: '',
            phone: '',
            email: ''
        });
        const [editContact, setEditContact] = useState({
            id: '',
            lastName: '',
            firstName: '',
            phone: '',
            email: ''
        });
        const [alertState, setAlertState] = useState({
            open: false,
            message: '',
            severity: 'success'
        });

        // Mock данные
        const [contactsData, setContactsData] = useState([
            { id: '1', lastName: 'Иванов', firstName: 'Иван', phone: '+7 (123) 456-7890', email: 'ivanov@example.com' },
            { id: '2', lastName: 'Петров', firstName: 'Пётр', phone: '+7 (234) 567-8901', email: 'petrov@example.com' },
            { id: '3', lastName: 'Сидорова', firstName: 'Мария', phone: '+7 (345) 678-9012', email: 'sidorova@example.com' },
            { id: '4', lastName: 'Кузнецов', firstName: 'Алексей', phone: '+7 (456) 789-0123', email: 'kuznetsov@example.com' },
            { id: '5', lastName: 'Смирнова', firstName: 'Ольга', phone: '+7 (567) 890-1234', email: 'smirnova@example.com' },
        ]);

        // const dispatch = useDispatch();
        // const contactsData = useSelector(state => state.contact.contactsList.data);
        // const loading = useSelector(state => state.contact.contactsList.isLoading);
        // const error = useSelector(state => state.contact.contactsList.errors);

        // if(loading) {
        //     return <div>Загрузка данных...</div>;
        // }
        // if (error?.length > 0) {
        //     return (
        //         <div>
        //             Ошибка загрузки данных:
        //             <ul>
        //                 {error.map((err, index) => (
        //                     <li key={index}>{err.message || err.toString()}</li>
        //                 ))}
        //             </ul>
        //         </div>
        //     );
        // }

        const showAlert = (message, severity = 'success') => {
            setAlertState({
                open: true,
                message,
                severity
            });
            setTimeout(() => setAlertState(prev => ({ ...prev, open: false })), 3000);
        };

        const handleCloseAlert = () => {
            setAlertState(prev => ({ ...prev, open: false }));
        };

        const handleSearchLastNameChange = (event) => {
            setSearchLastName(event.target.value);
        };

        const handleSearchFirstNameChange = (event) => {
            setSearchFirstName(event.target.value);
        };

        const handleSearchPhoneChange = (event) => {
            setSearchPhone(event.target.value);
        };

        const handleSearchEmailChange = (event) => {
            setSearchEmail(event.target.value);
        };

        const handleMenuClick = (event, row) => {
            setAnchorEl(event.currentTarget);
            setCurrentRow(row);
        };

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        const handleSearchMenuClick = (event) => {
            setSearchAnchorEl(event.currentTarget);
        };

        const handleSearchMenuClose = () => {
            setSearchAnchorEl(null);
        };

        const handleEdit = () => {
            setEditContact(currentRow);
            setOpenEditModal(true);
            handleMenuClose();
        };

        const handleDelete = () => {
            setOpenDeleteModal(true);
            handleMenuClose();
        };

        const handleAdd = () => {
            setNewContact({
                id: '',
                lastName: '',
                firstName: '',
                phone: '',
                email: ''
            });
            setOpenAddModal(true);
        };

        const handleCloseModals = () => {
            setOpenEditModal(false);
            setOpenDeleteModal(false);
            setOpenAddModal(false);
        };

        const handleSaveEdit = () => {
            if (!editContact.lastName || !editContact.firstName || !editContact.phone) {
                showAlert('Обязательные поля должны быть заполнены!', 'error');
                return;
            }

            // Обновляем данные в mock-массиве
            setContactsData(contactsData.map(contact =>
                contact.id === editContact.id ? editContact : contact
            ));

            showAlert('Контакт успешно обновлен!', 'success');
            handleCloseModals();
        };

        const handleSaveAdd = () => {
            if (!newContact.lastName || !newContact.firstName || !newContact.phone) {
                showAlert('Обязательные поля должны быть заполнены!', 'error');
                return;
            }

            // Генерируем новый ID и добавляем контакт
            const newId = Math.max(...contactsData.map(contact => parseInt(contact.id))) + 1;
            const contactToAdd = {
                ...newContact,
                id: newId.toString()
            };

            setContactsData([...contactsData, contactToAdd]);
            showAlert('Контакт успешно добавлен!', 'success');
            handleCloseModals();
        };

        const handleDeleteConfirm = () => {
            // Удаляем контакт из mock-массива
            setContactsData(contactsData.filter(contact => contact.id !== currentRow.id));
            showAlert('Контакт успешно удален!', 'success');
            handleCloseModals();
        };

        const filteredData = contactsData.filter(contact => {
            return (
                contact.lastName.toLowerCase().includes(searchLastName.toLowerCase()) &&
                contact.firstName.toLowerCase().includes(searchFirstName.toLowerCase()) &&
                contact.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
                (contact.email?.toLowerCase() || '').includes(searchEmail.toLowerCase())
            );
        });

        return (
            <>
                <TableContainer component={Paper}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <Typography variant="h6">Список контактов</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={handleSearchMenuClick}>
                                <SearchIcon />
                            </IconButton>
                            <Menu
                                anchorEl={searchAnchorEl}
                                open={Boolean(searchAnchorEl)}
                                onClose={handleSearchMenuClose}
                                sx={{ maxWidth: 300 }}
                            >
                                <Box sx={{ p: 1, width: 300 }}>
                                    <TextField
                                        label="Поиск по фамилии"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        value={searchLastName}
                                        onChange={handleSearchLastNameChange}
                                        sx={{ maxWidth: 250 }}
                                    />
                                    <TextField
                                        label="Поиск по имени"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        value={searchFirstName}
                                        onChange={handleSearchFirstNameChange}
                                        sx={{ maxWidth: 250 }}
                                    />
                                    <TextField
                                        label="Поиск по телефону"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        value={searchPhone}
                                        onChange={handleSearchPhoneChange}
                                        sx={{ maxWidth: 250 }}
                                    />
                                    <TextField
                                        label="Поиск по email"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        value={searchEmail}
                                        onChange={handleSearchEmailChange}
                                        sx={{ maxWidth: 250 }}
                                    />
                                </Box>
                            </Menu>
                        </Box>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Фамилия</TableCell>
                                <TableCell>Имя</TableCell>
                                <TableCell sx={{minWidth: 153}}>Телефон</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(contact => (
                                <TableRow key={contact.id}>
                                    <TableCell>{contact.lastName}</TableCell>
                                    <TableCell>{contact.firstName}</TableCell>
                                    <TableCell>{contact.phone}</TableCell>
                                    <TableCell>{contact.email || '-'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => handleMenuClick(e, contact)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                        <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                    </Menu>
                    <Modal open={openEditModal || openDeleteModal || openAddModal} onClose={handleCloseModals}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24
                        }}>
                            <Box sx={{
                                bgcolor: '#1976d2',
                                color: 'white',
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6">
                                    {openEditModal && "Редактировать контакт"}
                                    {openDeleteModal && "Удалить контакт"}
                                    {openAddModal && "Добавить новый контакт"}
                                </Typography>
                                <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                {openEditModal && (
                                    <div>
                                        <TextField
                                            label="Фамилия*"
                                            fullWidth
                                            margin="normal"
                                            value={editContact.lastName}
                                            onChange={(e) => setEditContact({ ...editContact, lastName: e.target.value })}
                                        />
                                        <TextField
                                            label="Имя*"
                                            fullWidth
                                            margin="normal"
                                            value={editContact.firstName}
                                            onChange={(e) => setEditContact({ ...editContact, firstName: e.target.value })}
                                        />
                                        <TextField
                                            label="Телефон*"
                                            fullWidth
                                            margin="normal"
                                            value={editContact.phone}
                                            onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                                        />
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            margin="normal"
                                            value={editContact.email || ''}
                                            onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button onClick={handleCloseModals}>Отмена</Button>
                                            <Button onClick={handleSaveEdit} color="primary">Сохранить</Button>
                                        </Box>
                                    </div>
                                )}
                                {openDeleteModal && (
                                    <div>
                                        <Typography>Вы уверены, что хотите удалить контакт {currentRow?.lastName} {currentRow?.firstName}?</Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button onClick={handleCloseModals}>Отмена</Button>
                                            <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
                                        </Box>
                                    </div>
                                )}
                                {openAddModal && (
                                    <div>
                                        <TextField
                                            label="Фамилия*"
                                            fullWidth
                                            margin="normal"
                                            value={newContact.lastName}
                                            onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                                        />
                                        <TextField
                                            label="Имя*"
                                            fullWidth
                                            margin="normal"
                                            value={newContact.firstName}
                                            onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                                        />
                                        <TextField
                                            label="Телефон*"
                                            fullWidth
                                            margin="normal"
                                            value={newContact.phone}
                                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                        />
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            margin="normal"
                                            value={newContact.email}
                                            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button onClick={handleCloseModals}>Отмена</Button>
                                            <Button onClick={handleSaveAdd} color="primary">Добавить</Button>
                                        </Box>
                                    </div>
                                )}
                            </Box>
                        </Box>
                    </Modal>
                </TableContainer>

                {/* Кнопка добавления под таблицей */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Добавить контакт
                    </Button>
                </Box>

                {/* Простой Alert вместо компонента */}
                {alertState.open && (
                    <Box sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        p: 2,
                        backgroundColor: alertState.severity === 'error' ? '#f44336' : '#4caf50',
                        color: 'white',
                        borderRadius: 1,
                        boxShadow: 3,
                        zIndex: 9999
                    }}>
                        {alertState.message}
                    </Box>
                )}
            </>
        );
    };

    export default ContactsTable;