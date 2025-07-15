import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilos/StudentTable.css';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const StudentTable = ({ onNavigateToProfile }) => {
    const universityNames = {
    '685c180f0d2362de34ec5721': 'Universidad de Antioquia',
    '685d566340a71701efb087a8': 'Universidad Nacional'
    };
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchIdNumber, setSearchIdNumber] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/all`);
                const studentsData = Array.isArray(response.data) ? response.data : response.data.data || [];
                setStudents(studentsData);
                setFilteredStudents(studentsData);
            } catch (error) {
                console.error('Error al obtener los estudiantes:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al obtener los estudiantes',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#d33'
                });
            }
        };
        fetchStudents();
    }, []);

    const handleEditClick = (student) => {
        setEditingStudent(student.id);
        setFormData({ ...student });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/${editingStudent}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const updatedStudents = students.map((student) =>
                student.id === editingStudent ? { ...student, ...formData } : student
            );

            setStudents(updatedStudents);
            setFilteredStudents(updatedStudents);
            setEditingStudent(null);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Estudiante actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745'
            });
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo actualizar el estudiante',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSearchIdNumber(value);
        const filtered = students.filter((student) =>
            student.id_number?.toString().includes(value)
        );
        setFilteredStudents(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="tutoring-history-container">
            <div className="tutoring-history-card">
                <div className="header">
                    <h2 className="header-title" style={{ color: 'white' }}>Estudiantes registrados</h2>
                    <p className="header-subtitle">Listado de estudiantes con opción de edición y búsqueda por cédula</p>
                </div>

                <div className="filters-container">
                    <div className="filters">
                        <div className="filter-group">
                            <span className="filter-label">Filtrar por cédula:</span>
                            <input
                                type="text"
                                value={searchIdNumber}
                                onChange={handleFilterChange}
                                placeholder="Ingrese cédula"
                                className="filter-select"
                            />
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table className="sessions-table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell">ID</th>
                                <th className="table-header-cell">Cédula</th>
                                <th className="table-header-cell">Nombre</th>
                                <th className="table-header-cell">Apellido</th>
                                <th className="table-header-cell">Correo institucional</th>
                                <th className="table-header-cell">Correo personal</th>
                                <th className="table-header-cell">Semestre</th>
                                <th className="table-header-cell">Universidad</th>
                                <th className="table-header-cell">Teléfono</th>
                                <th className="table-header-cell">Dirección</th>
                                <th className="table-header-cell">Creación</th>
                                <th className="table-header-cell">Actualización</th>
                                <th className="table-header-cell">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentStudents.map((student) =>
                                editingStudent === student.id ? (
                                    <tr key={student.id} className="table-row">
                                        <td className="table-cell"><input name="id" value={formData.id || ''} onChange={handleChange} disabled /></td>
                                        <td className="table-cell"><input name="id_number" value={formData.id_number || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="first_name" value={formData.first_name || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="last_name" value={formData.last_name || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="institution_email" value={formData.institution_email || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="email" value={formData.email || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="semester" value={formData.semester || ''} onChange={handleChange} /></td>
                                        <td className="table-cell">{universityNames[student.id_university] || student.id_university}</td>
                                        <td className="table-cell"><input name="phone_number" value={formData.phone_number || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="residence_address" value={formData.residence_address || ''} onChange={handleChange} /></td>
                                        <td className="table-cell"><input name="created_at" value={formData.created_at || ''} onChange={handleChange} disabled /></td>
                                        <td className="table-cell"><input name="updated_at" value={formData.updated_at || ''} onChange={handleChange} disabled /></td>
                                        <td className="table-cell actions">
                                            <Button onClick={handleSave} color="success" variant="contained" size="small" style={{ marginRight: 5 }}>
                                                <SaveIcon />
                                            </Button>
                                            <Button onClick={() => setEditingStudent(null)} color="error" variant="contained" size="small" style={{ marginRight: 5 }}>
                                                <CloseIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: '#FFD700', color: 'white', minWidth: '40px', padding: '6px', '&:hover': { backgroundColor: '#FFC107' }, marginRight: '5px' }}
                                                size="small"
                                                onClick={() => window.location.href = `/student/${student.id}`}
                                            >
                                                <VisibilityIcon />
                                            </Button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={student.id} className="table-row">
                                        <td className="table-cell">{student.id}</td>
                                        <td className="table-cell">{student.id_number}</td>
                                        <td className="table-cell">{student.first_name}</td>
                                        <td className="table-cell">{student.last_name}</td>
                                        <td className="table-cell">{student.institution_email}</td>
                                        <td className="table-cell">{student.email}</td>
                                        <td className="table-cell">{student.semester}</td>
                                        <td className="table-cell">{universityNames[student.id_university] || student.id_university}</td>
                                        <td className="table-cell">{student.phone_number}</td>
                                        <td className="table-cell">{student.residence_address}</td>
                                        <td className="table-cell">{student.created_at}</td>
                                        <td className="table-cell">{student.updated_at}</td>
                                        <td className="table-cell actions">
                                            <Button onClick={() => handleEditClick(student)} variant="contained" size="small" color="primary">
                                                <EditIcon />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-container">
                    <div className="pagination-info">
                        <p className="pagination-text">
                            Página <span className="pagination-current">{currentPage}</span> de <span className="pagination-total">{totalPages}</span>
                        </p>
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="pagination-button pagination-prev"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <button
                            className="pagination-button pagination-next"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                <div style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#374151' }}>
                    Total estudiantes registrados: {filteredStudents.length}
                </div>
            </div>
        </div>
    );
};

export default StudentTable;