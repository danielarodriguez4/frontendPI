import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, BookOpen, Clock, FileText, X, BarChart3 } from 'lucide-react';
import '../Estilos/TutoringHistoryView.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const TutoringHistoryView = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sessionsPerPage = 5;

  const [sessionTypes, setSessionTypes] = useState([]);
  
  // Estados para el modal de estadísticas
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentStats, setStudentStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Cargar tipos de sesión
  useEffect(() => {
    const fetchSessionTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/session-type/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSessionTypes(response.data.data || []);
      } catch (error) {
        console.error('Error al cargar tipos de sesión:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los tipos de sesión',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33'
        });
      }
    };

    fetchSessionTypes();
  }, []);

  // Cargar sesiones
  const fetchSessions = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session/all?page=${page}&limit=${sessionsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('🔍 DEBUGGING - Respuesta completa:', response.data);
      console.log('🔍 DEBUGGING - Datos de sesiones:', response.data.data);
      console.log('🔍 DEBUGGING - Primera sesión completa:', response.data.data?.[0]);

      // Mapear las sesiones usando los campos correctos del API
      const mappedSessions = response.data.data.map(session => ({
        ...session,
        // Usar los campos que funcionaron en el primer código
        first_name: session.name || 'N/A',
        last_name: session.surname || 'N/A',
        first_name_companion: session.companion_name || 'N/A',
        last_name_companion: session.companion_surname || 'N/A',
        companion_specialty: session.companion_speciality || 'N/A',
        session_type_name: session.session_type_name || 
          sessionTypes.find(type => type.id === session.id_session_type)?.name || 'No definido',
        notes: session.session_notes || 'Sin notas',
        status: session.status || 'Completado'
      }));

      console.log('🔍 DEBUGGING - Sesiones mapeadas:', mappedSessions);
      console.log('🔍 DEBUGGING - Primera sesión mapeada:', mappedSessions[0]);

      setSessions(mappedSessions);
      setTotalPages(Math.ceil((response.data.total || mappedSessions.length) / sessionsPerPage));
      
    } catch (err) {
      console.error('❌ Error al cargar sesiones:', err);
      setError(err.message);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Error al cargar las sesiones',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener estadísticas del estudiante
  const fetchStudentStats = async (studentId, studentName) => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('token');
      
      // Usar el endpoint existente para obtener sesiones del estudiante
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const studentSessions = response.data.data || [];
      
      // Agrupar por tipo de sesión y contar
      const statsMap = {};
      studentSessions.forEach(session => {
        // Usar id_session_type según tu estructura
        const sessionTypeName = sessionTypes.find(type => type.id === session.id_session_type)?.name || 'No definido';
        
        if (statsMap[sessionTypeName]) {
          statsMap[sessionTypeName]++;
        } else {
          statsMap[sessionTypeName] = 1;
        }
      });
      
      // Convertir a array para mostrar, ordenado por cantidad descendente
      const statsArray = Object.entries(statsMap)
        .map(([name, count]) => ({
          session_type: name,
          total_sessions: count
        }))
        .sort((a, b) => b.total_sessions - a.total_sessions);
      
      setStudentStats(statsArray);
      
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las estadísticas del estudiante',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      setStudentStats([]);
    } finally {
      setLoadingStats(false);
    }
  };

  // Manejar click en estudiante
  const handleStudentClick = (session) => {
    console.log('Sesión clickeada:', session);
    
    // Usar id_student según tu estructura de datos
    const studentId = session.id_student;
    const firstName = session.first_name || 'N/A';
    const lastName = session.last_name || 'N/A';
    
    if (!studentId) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo identificar el ID del estudiante',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      return;
    }
    
    const student = {
      id: studentId,
      name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName
    };
    
    console.log('Estudiante seleccionado:', student);
    
    setSelectedStudent(student);
    setShowStudentModal(true);
    fetchStudentStats(student.id, student.name);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
    setStudentStats([]);
  };

  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage, sessionTypes]);

  // Helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completado':
      case 'completed':
        return 'status-completed';
      case 'pendiente':
      case 'pending':
        return 'status-pending';
      case 'cancelado':
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="tutoring-history-container">
      <div className="tutoring-history-card">
        {/* Header */}
        <div className="header">
          <h1 className="header-title">Historial de acompañamientos</h1>
          <p className="header-subtitle">Gestiona y revisa las sesiones de tutoría</p>
        </div>

        {/* Filtros */}
        <div className="filters-container">
          <div className="filters">
            <div className="filter-group">
              <User className="filter-icon" />
              <span className="filter-label">Filtros:</span>
            </div>
            <select className="filter-select">
              <option>Todos</option>
              <option>Completado</option>
              <option>Pendiente</option>
              <option>Cancelado</option>
            </select>
            <select className="filter-select">
              <option value="">Todas las especialidades</option>
              {sessionTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container">
          <table className="sessions-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  <div className="header-content">
                    <User className="header-icon" />
                    Estudiante
                  </div>
                </th>
                <th className="table-header-cell">
                  <div className="header-content">
                    <BookOpen className="header-icon" />
                    Acompañante
                  </div>
                </th>
                <th className="table-header-cell">Tipo de Acompañamiento</th>
                <th className="table-header-cell">
                  <div className="header-content">
                    <FileText className="header-icon" />
                    Notas
                  </div>
                </th>
                <th className="table-header-cell">
                  <div className="header-content">
                    <Calendar className="header-icon" />
                    Fecha
                  </div>
                </th>
                <th className="table-header-cell">Estado</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sessions.map((session, index) => (
                <tr key={session.id || index} className="table-row">
                  <td className="table-cell">
                    <div 
                      className="student-info clickable-student"
                      onClick={() => handleStudentClick(session)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="student-avatar">
                        <span className="avatar-text">
                          {(session.first_name || 'N')[0]}{(session.last_name || 'N')[0]}
                        </span>
                      </div>
                      <div className="student-details">
                        <div className="student-name">
                          {session.first_name} {session.last_name}
                        </div>
                        <div className="student-role">Estudiante</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {session.first_name_companion} {session.last_name_companion}
                  </td>
                  <td className="table-cell">
                    <span className="specialty-badge">
                      {session.session_type_name}
                    </span>
                  </td>
                  <td className="table-cell">
                    {session.notes || 'Sin notas'}
                  </td>
                  <td className="table-cell">
                    <div className="date-info">
                      <span className="date-created">Creado: {formatDate(session.created_at)}</span>
                      {session.updated_at && (
                        <span className="date-updated">
                          <Clock className="clock-icon" />
                          Actualizado: {formatDate(session.updated_at)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${getStatusClass(session.status)}`}>
                      {session.status || 'Completado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            <p className="pagination-text">
              Mostrando página <span className="pagination-current">{currentPage}</span> de{' '}
              <span className="pagination-total">{totalPages}</span>
            </p>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-button pagination-prev"
            >
              <ChevronLeft className="pagination-icon" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-button ${page === currentPage ? 'pagination-active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-button pagination-next"
            >
              <ChevronRight className="pagination-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de estadísticas del estudiante */}
      {showStudentModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <BarChart3 className="modal-icon" />
                Estadísticas de {selectedStudent?.name}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              {loadingStats ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Cargando estadísticas...</p>
                </div>
              ) : (
                <>
                  <div className="stats-summary">
                    <h3>Resumen de Asesorías</h3>
                    <p>Total de sesiones: {studentStats.reduce((sum, stat) => sum + stat.total_sessions, 0)}</p>
                  </div>
                  
                  <div className="stats-table">
                    <h4>Discriminado por tipo de asesoría:</h4>
                    <table className="stats-table-content">
                      <thead>
                        <tr>
                          <th>Tipo de Asesoría</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentStats.map((stat, index) => (
                          <tr key={index}>
                            <td>{stat.session_type}</td>
                            <td className="stats-count">{stat.total_sessions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {studentStats.length === 0 && (
                    <div className="no-stats">
                      <p>No se encontraron estadísticas para este estudiante.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutoringHistoryView;