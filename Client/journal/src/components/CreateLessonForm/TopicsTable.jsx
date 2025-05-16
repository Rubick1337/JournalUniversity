import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Chip
} from '@mui/material';

const TopicsTable = ({ filteredTopics, discipline, topicSearch, onTopicSelect }) => {
    return (
        <TableContainer>
            <Table className="dialog-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Название темы</TableCell>
                        <TableCell align="right">Часов</TableCell>
                        <TableCell align="right">Проведено часов</TableCell>
                        <TableCell>Действие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic, index) => (
                            <TableRow
                                key={topic.id}
                                hover
                                sx={{
                                    animation: 'fadeInRow 0.3s ease-in-out',
                                    animationFillMode: 'both',
                                    animationDelay: `${0.1 * index}s`
                                }}
                            >
                                <TableCell>{topic.name}</TableCell>
                                <TableCell align="right">{topic.hours}</TableCell>
                                <TableCell align="right">{topic.completedHours}</TableCell>
                                <TableCell>
                                    {topic.completedHours >= topic.hours ? (
                                        <Chip
                                            label="Проведено"
                                            color="success"
                                            variant="filled"
                                            sx={{
                                                cursor: 'not-allowed',
                                                fontWeight: 'bold',
                                                minWidth: 100
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Выбрать"
                                            color="primary"
                                            variant="filled"
                                            onClick={() => onTopicSelect(topic)}
                                            sx={{
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                minWidth: 100,
                                                '&:hover': {
                                                    opacity: 0.9
                                                }
                                            }}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography>
                                    {discipline
                                        ? topicSearch
                                            ? 'Темы не найдены'
                                            : 'Нет доступных тем для выбранной дисциплины'
                                        : 'Сначала выберите дисциплину'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TopicsTable;