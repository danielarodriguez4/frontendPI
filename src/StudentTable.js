import React, { useEffect, useState } from 'react';
import './StudentTable.css';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const StudentTable = () => {
    const [students, setStudents] = useState([
        { id: 1, firstName: 'Juan', lastName: 'Pérez', institutionalEmail: 'juan.perez@udea.edu.co', personalEmail: 'juan@test.com', phoneNumber: '1234', fullAddress: 'Calle 60 #5-7', university: 'Universidad de Antioquia' },
        { id: 2, firstName: 'Ana', lastName: 'García', institutionalEmail: 'ana.garcia@udea.edu.co', personalEmail: 'ana@test.com', phoneNumber: '1234', fullAddress: 'Calle 60 #5-7', university: 'Universidad Antioquia' },
        { id: 3, firstName: 'Luis', lastName: 'Martínez', institutionalEmail: 'luis.martinez@udea.edu.co', personalEmail: 'luis@test.com', phoneNumber: '1234', fullAddress: 'Calle 60 #5-7', university: 'Universidad Antioquia' },
        { id: 4, firstName: 'Fernanda', lastName: 'Chacón', institutionalEmail: 'fernanda.chacon@udea.edu.co', personalEmail: 'fernanda@test.com', phoneNumber: '1234', fullAddress: 'Calle 60 #5-7', university: 'Universidad Antioquia' },
    ]);

    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});

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
                                    <td><input name="firstName" value={formData.firstName} onChange={handleChange} /></td>
                                    <td><input name="lastName" value={formData.lastName} onChange={handleChange} /></td>
                                    <td><input name="institutionalEmail" value={formData.institutionalEmail} onChange={handleChange} /></td>
                                    <td><input name="personalEmail" value={formData.personalEmail} onChange={handleChange} /></td>
                                    <td><input name="university" value={formData.university} onChange={handleChange} /></td>
                                    <td><input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /></td>
                                    <td><input name="fullAddress" value={formData.fullAddress} onChange={handleChange} /></td>
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
