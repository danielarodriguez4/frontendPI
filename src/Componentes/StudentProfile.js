import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Estilos/StudentProfile.css'; 
import { CircularProgress, Typography, Paper, Divider, Box, Card, CardContent } from '@mui/material'; 

const StudentProfile = () => {
    const { studentId } = useParams(); 
    const [studentInfo, setStudentInfo] = useState(null);
    const [advisoryHistory, setAdvisoryHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch info del estudiante
                const studentResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/id}`);
                setStudentInfo(studentResponse.data.data || studentResponse.data); 

                // Fetch historial de asesorías
                const advisoryResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student`);
                setAdvisoryHistory(advisoryResponse.data.data || advisoryResponse.data); 

            } catch (err) {
                console.error('Error fetching student data:', err);
                setError('No se pudo cargar la información del estudiante o su historial.');
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]); 

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Cargando perfil del estudiante...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" color="error.main">
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    if (!studentInfo) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography variant="h6">No se encontró información para el estudiante con ID: {studentId}</Typography>
            </Box>
        );
    }

    return (
        <div className="student-profile-page">
            <Paper className="profile-container">
                <Typography variant="h4" component="h1" gutterBottom className="profile-title">
                    Perfil de {studentInfo.first_name} {studentInfo.last_name}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Sección de Información del Estudiante */}
                <Typography variant="h5" component="h2" gutterBottom className="section-title">
                    Información del Estudiante
                </Typography>
                <div className="student-info-grid">
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">ID:</Typography> <Typography variant="body1" component="span">{studentInfo.id}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Cédula:</Typography> <Typography variant="body1" component="span">{studentInfo.id_number}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Nombre:</Typography> <Typography variant="body1" component="span">{studentInfo.first_name}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Apellido:</Typography> <Typography variant="body1" component="span">{studentInfo.last_name}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Correo Personal:</Typography> <Typography variant="body1" component="span">{studentInfo.email}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Correo Institucional:</Typography> <Typography variant="body1" component="span">{studentInfo.institution_email}</Typography></div>
                    <div className="info-item full-width"><Typography variant="subtitle1" component="span" className="info-label">Dirección:</Typography> <Typography variant="body1" component="span">{studentInfo.residence_address}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Semestre:</Typography> <Typography variant="body1" component="span">{studentInfo.semester}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Universidad ID:</Typography> <Typography variant="body1" component="span">{studentInfo.university_id}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Teléfono:</Typography> <Typography variant="body1" component="span">{studentInfo.phone_number}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Creado en:</Typography> <Typography variant="body1" component="span">{new Date(studentInfo.created_at).toLocaleString()}</Typography></div>
                    <div className="info-item"><Typography variant="subtitle1" component="span" className="info-label">Última Actualización:</Typography> <Typography variant="body1" component="span">{new Date(studentInfo.updated_at).toLocaleString()}</Typography></div>
                </div>

                <Divider sx={{ my: 4 }} />

                {/* Sección de Historial de Asesorías */}
                <Typography variant="h5" component="h2" gutterBottom className="section-title">
                    Historial de Asesorías
                </Typography>
                {advisoryHistory.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>No hay historial de asesorías para este estudiante.</Typography>
                ) : (
                    <div className="advisory-history-list">
                        {advisoryHistory.map((advisory) => (
                            <Card key={advisory.id} className="advisory-card">
                                <CardContent>
                                    <Typography variant="h6" component="div" gutterBottom className="advisory-card-title">
                                        Asesoría con {advisory.first_name_companion} {advisory.last_name_companion}
                                    </Typography>
                                    <div className="advisory-info-grid">
                                        <div className="info-item"><Typography variant="subtitle2" component="span" className="info-label">ID Asesoría:</Typography> <Typography variant="body2" component="span">{advisory.id}</Typography></div>
                                        <div className="info-item"><Typography variant="subtitle2" component="span" className="info-label">ID Compañero:</Typography> <Typography variant="body2" component="span">{advisory.id_companion}</Typography></div>
                                        <div className="info-item full-width"><Typography variant="subtitle2" component="span" className="info-label">Especialidad Compañero:</Typography> <Typography variant="body2" component="span">{advisory.id_companion_speciality}</Typography></div>
                                        <div className="info-item full-width"><Typography variant="subtitle2" component="span" className="info-label">Fecha:</Typography> <Typography variant="body2" component="span">{new Date(advisory.date).toLocaleDateString()}</Typography></div>
                                        <div className="info-item full-width"><Typography variant="subtitle2" component="span" className="info-label">Notas:</Typography> <Typography variant="body2" component="span">{advisory.notes || 'N/A'}</Typography></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Paper>
        </div>
    );
};

export default StudentProfile;