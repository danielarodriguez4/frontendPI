import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, BookOpen, Clock, FileText } from 'lucide-react';
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
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session/all?page=${page}&limit=${sessionsPerPage}`
      );

      const mappedSessions = response.data.data.map(session => ({
        ...session,
        first_name: session.name,
        last_name: session.surname,
        first_name_companion: session.companion_name,
        last_name_companion: session.companion_surname,
        companion_specialty: session.companion_speciality,
        session_type_name: session.session_type_name || 
          sessionTypes.find(type => type.id === session.id_session_type)?.name || 'No definido',
        notes: session.session_notes,
        status: session.status || 'Completado'
      }));

      setSessions(mappedSessions);
      setTotalPages(Math.ceil((response.data.total || mappedSessions.length) / sessionsPerPage));
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
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
                    <div className="student-info">
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
    </div>
  );
};

export default TutoringHistoryView;
