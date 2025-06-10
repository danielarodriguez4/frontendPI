import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilos/StudentTable.css';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v0/user/all`);
                setStudents([response.data]); // Guardamos como array aunque solo sea un estudiante
            } catch (error) {
                console.error('Error al obtener el estudiante:', error);
            }
        };

        fetchStudent();
    }, []);

    const handleEditClick = (student) => {
        setEditingStudent(student.id);
        setFormData({ ...student });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const updatedStudents = students.map((student) =>
            student.id === editingStudent ? { ...student, ...formData } : student
        );
        setStudents(updatedStudents);
        alert('Estudiante actualizado correctamente');
        setEditingStudent(null);
    };

    return (
        <div className="tabla-estudiantes">
            <h2 className="titulo-tabla">Estudiantes registrados</h2>
            <div className="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo institucional</th>
                            <th>Correo personal</th>
                            <th>Universidad</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) =>
                            editingStudent === student.id ? (
                                <tr key={student.id}>
                                    <td><input name="firstName" value={formData.firstName || ''} onChange={handleChange} /></td>
                                    <td><input name="lastName" value={formData.lastName || ''} onChange={handleChange} /></td>
                                    <td><input name="institutionalEmail" value={formData.institutionalEmail || ''} onChange={handleChange} /></td>
                                    <td><input name="personalEmail" value={formData.personalEmail || ''} onChange={handleChange} /></td>
                                    <td><input name="university" value={formData.university || ''} onChange={handleChange} /></td>
                                    <td><input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} /></td>
                                    <td><input name="fullAddress" value={formData.fullAddress || ''} onChange={handleChange} /></td>
                                    <td className="acciones">
                                        <Button onClick={handleSave} color="success" variant="contained" size="small" style={{ marginRight: 5 }}><SaveIcon /></Button>
                                        <Button onClick={() => setEditingStudent(null)} color="error" variant="contained" size="small"><CloseIcon /></Button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={student.id}>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.institutionalEmail}</td>
                                    <td>{student.personalEmail}</td>
                                    <td>{student.university}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>{student.fullAddress}</td>
                                    <td className="acciones">
                                        <Button onClick={() => handleEditClick(student)} variant="contained" size="small" color="primary"><EditIcon /></Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;
