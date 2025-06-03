/*Lógica de visualización de métricas y diseños*/

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';

const dataLine = [
  { mes: 'Ene', Tutorías: 10, Talleres: 5, Asesorías: 3 },
  { mes: 'Feb', Tutorías: 20, Talleres: 10, Asesorías: 8 },
  { mes: 'Mar', Tutorías: 25, Talleres: 15, Asesorías: 12 }
];

const dataPie = [
  { name: 'Falta de comprensión', value: 400 },
  { name: 'Dificultad práctica', value: 300 },
  { name: 'Motivación', value: 300 },
  { name: 'Otro', value: 200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const dataBar = [
  { tipo: 'Programación', valoraciones: 95 },
  { tipo: 'Cálculo', valoraciones: 60 },
  { tipo: 'Estadística', valoraciones: 80 },
  { tipo: 'Redacción', valoraciones: 75 }
];

const DashboardMetrica = () => {
  return (
    <div className="dashboard-container">
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>
      
      {/* Grid container for charts */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        width: '100%'
      }}>
        {/* First column */}
        <div className="chart-container">
          <h3>Número de tutorías por mes</h3>
          <LineChart width={500} height={300} data={dataLine}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Tutorías" stroke="#8884d8" />
            <Line type="monotone" dataKey="Talleres" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Asesorías" stroke="#ffc658" />
          </LineChart>
        </div>

        {/* Second column */}
        <div className="chart-container">
          <h3>Motivo de la tutoría</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Third chart (spans entire width or fits in remaining space) */}
        <div className="chart-container" style={{ gridColumn: '1 / -1' }}>
          <h3>Valoraciones de las tutorías</h3>
          <BarChart width={900} height={300} data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valoraciones" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrica;