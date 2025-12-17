import React, { useState } from "react";
import { useEffectOnce } from "react-use";
import Spinner from "./GeneralComponents/SpinnerLoader";
import { generateDashboardReport } from "../../utils/pdfGenerator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  AlertCircle,
  XCircle,
  Zap,
  DollarSign,
  Users,
  Link,
  Eye,
  FileText,
  Download,
  Database,
  CreditCard,
  Lock,
} from "lucide-react";

// --- DATOS (Mismos datos que antes) ---
const iconMap = {
  shield: Shield,
  "alert-circle": AlertCircle,
  "x-circle": XCircle,
  zap: Zap,
  "dollar-sign": DollarSign,
  users: Users,
  link: Link,
};
const kpiData = [
  {
    title: "Pólizas vigentes",
    value: "245",
    trend: "+5%",
    status: "up",
    icon: Shield,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    title: "Pólizas vencidas",
    value: "18",
    trend: "+2",
    status: "danger",
    icon: AlertCircle,
    color: "#ea580c",
    bg: "#fff7ed",
  },
  {
    title: "Pólizas canceladas",
    value: "32",
    trend: "Sin cambios",
    status: "neutral",
    icon: XCircle,
    color: "#dc2626",
    bg: "#fef2f2",
  },
  {
    title: "Siniestros del mes",
    value: "16",
    trend: "-8%",
    status: "down",
    icon: Zap,
    color: "#9333ea",
    bg: "#faf5ff",
  },
  {
    title: "Recaudación del mes",
    value: "$175,000",
    trend: "+12%",
    status: "up",
    icon: DollarSign,
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    title: "Nuevos clientes del mes",
    value: "42",
    trend: "+18",
    status: "up",
    icon: Users,
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    title: "Pólizas en blockchain",
    value: "198",
    trend: "+24",
    status: "up",
    icon: Link,
    color: "#4f46e5",
    bg: "#eef2ff",
  },
  /*  {
    title: "Consultas blockchain",
    value: "1,247",
    trend: "+156",
    status: "up",
    icon: Eye,
    color: "#0d9488",
    bg: "#f0fdfa",
  },*/
];

const coberturaData = [
  { name: "Todo Riesgo", value: 37, color: "#3b82f6" },
  { name: "Terceros", value: 26, color: "#10b981" },
  { name: "Resp. Civil", value: 23, color: "#f59e0b" },
  { name: "Robo e Incendio", value: 15, color: "#ef4444" },
];
interface coberturaDataModel {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}
interface statusDataModel {
  BaseDatos: string;
  Blockchain: number;
  Billetera: string;
}
interface KpiDataModel {
  title: string;
  value: string;
  trend: string;
  status: "up" | "down" | "danger" | "neutral";
  icon: React.ElementType | keyof typeof iconMap;
  bg: string;
  color: string;
}

const recaudacionData = [
  { name: "Ene", Monto: 125000 },
  { name: "Feb", Monto: 140000 },
  { name: "Mar", Monto: 155000 },
  { name: "Abr", Monto: 148000 },
  { name: "May", Monto: 165000 },
  { name: "Jun", Monto: 175000 },
];

const cotizacionesData = [
  { name: "Ene", Generadas: 85, Contratadas: 42 },
  { name: "Feb", Generadas: 92, Contratadas: 48 },
  { name: "Mar", Generadas: 110, Contratadas: 55 },
  { name: "Abr", Generadas: 98, Contratadas: 50 },
  { name: "May", Generadas: 125, Contratadas: 62 },
  { name: "Jun", Generadas: 118, Contratadas: 58 },
];

// --- COMPONENTE PRINCIPAL ---

export default function PageDashboardDefault() {
  const [siniestrosData, setsiniestrosData] = useState<[]>([]);
  const [coberturaDataState, setCoberturaDataState] = useState<
    coberturaDataModel[]
  >([]);
  const [recaudacionData, setRecaudacionDataState] = useState<[]>([]);
  const [cotizacionesData, setCotizacionesDataState] = useState<[]>([]);
  const [kpiData, setKpiData] = useState<KpiDataModel[]>([]);
  const [systemStatus, setSystemStatus] = useState<statusDataModel | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);

  // Handlers para generar reportes PDF
  const handleGenerateReport = (period: "monthly" | "quarterly" | "semiannual") => {
    try {
      setGeneratingPdf(true);

      const reportData = {
        kpiData,
        siniestrosData,
        coberturaData: coberturaDataState.length > 0 ? coberturaDataState : [],
        recaudacionData,
        cotizacionesData,
        systemStatus,
      };

      generateDashboardReport(reportData, period);

      // Pequeño delay para que el usuario vea el estado de loading
      setTimeout(() => {
        setGeneratingPdf(false);
      }, 500);
    } catch (error) {
      console.error("Error generando reporte PDF:", error);
      setGeneratingPdf(false);
      alert("Error al generar el reporte PDF. Por favor intente nuevamente.");
    }
  };

  const handleGenerateMonthlyReport = () => handleGenerateReport("monthly");
  const handleGenerateQuarterlyReport = () => handleGenerateReport("quarterly");
  const handleGenerateSemiAnnualReport = () => handleGenerateReport("semiannual");

  useEffectOnce(() => {
    setLoading(true);
    setError(false);
    const baseUrl = import.meta.env.VITE_BASEURL;

    // Crear un array de todas las promesas
    const fetchPromises = [
      fetch(`${baseUrl}/api/dashboard/dashboard/siniestros-data`)
        .then((res) => res.json())
        .then((result) => {
          setsiniestrosData(result.data);
          console.log("result.data");
          console.log(result);
        }),

      fetch(`${baseUrl}/api/dashboard/dashboard/coberturas-data`)
        .then((res) => res.json())
        .then((result) => {
          setCoberturaDataState(result.data);
          console.log("result.data2");
          console.log(result);
        }),

      fetch(`${baseUrl}/api/dashboard/dashboard/recaudacion-data`)
        .then((res) => res.json())
        .then((result) => {
          setRecaudacionDataState(result.data);
          console.log("result.data3");
          console.log(result);
        }),

      fetch(`${baseUrl}/api/dashboard/dashboard/cotizaciones-data`)
        .then((res) => res.json())
        .then((result) => {
          setCotizacionesDataState(result.data);
          console.log("result.data4");
          console.log(result);
        }),

      fetch(`${baseUrl}/api/dashboard/dashboard/kpi-data`)
        .then((res) => res.json())
        .then((result) => {
          setKpiData(result.data);
          console.log("result.data5");
          console.log(result);
        }),

      fetch(`${baseUrl}/api/dashboard/dashboard/status`)
        .then((res) => res.json())
        .then((result) => {
          setSystemStatus(result.data);
          console.log("result.data6");
          console.log(result);
        }),
    ];

    // Esperar a que todas las promesas se resuelvan
    Promise.all(fetchPromises)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos del dashboard:", err);
        setError(true);
        setLoading(false);
      });
  });

  const displayCoberturaData =
    coberturaDataState.length > 0 ? coberturaDataState : coberturaData;

  // Mostrar loading mientras se cargan todos los fetchs
  if (loading) {
    return <Spinner title="Cargando..." text="Por favor espere" />;
  }

  // Mostrar error si algo falla
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>Ha ocurrido un error inesperado al cargar los datos del dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container-fluid px-4">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="h3 fw-bold text-dark">Dashboard Administrativo</h1>
          <p className="text-secondary">
            Resumen general del sistema Car-Chain
          </p>
        </div>

        {/* SECCIÓN 1: INDICADORES GENERALES */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3 text-dark">Indicadores Generales</h5>
          <div className="row g-3">
            {kpiData.map((kpi, index) => {
              // Obtener el componente de ícono: soporta `kpi.icon` como clave del map o como componente
              const IconComponent: React.ElementType | undefined =
                typeof kpi.icon === "string"
                  ? (iconMap[
                    kpi.icon as keyof typeof iconMap
                  ] as React.ElementType)
                  : (kpi.icon as React.ElementType);

              return (
                <div key={index} className="col-12 col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="rounded p-2 d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: kpi.bg }}
                        >
                          {/* Renderizar el ícono dinámicamente */}
                          {IconComponent && (
                            <IconComponent size={24} color={kpi.color} />
                          )}
                        </div>
                        <span
                          className={`fw-bold small ${kpi.status === "up"
                            ? "text-success"
                            : kpi.status === "down"
                              ? "text-success"
                              : kpi.status === "danger"
                                ? "text-danger"
                                : "text-secondary"
                            }`}
                        >
                          {kpi.trend}
                        </span>
                      </div>
                      <h6 className="card-subtitle mb-1 text-muted small">
                        {kpi.title}
                      </h6>
                      <h3 className="card-title fw-bold mb-0">{kpi.value}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 2: ANÁLISIS Y ESTADÍSTICAS */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3 text-dark">Análisis y Estadísticas</h5>
          <div className="row g-4">
            {/* Gráfico 1: Siniestros */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-4">Siniestros aprobados por mes</h6>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={siniestrosData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#6c757d" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#6c757d" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Aprobados"
                          stroke="#0d6efd"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Rechazados"
                          stroke="#dc3545"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico 2: Cobertura */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-4">
                    Pólizas emitidas por tipo de cobertura
                  </h6>
                  <div className="row align-items-center">
                    <div className="col-md-7" style={{ height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={displayCoberturaData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {displayCoberturaData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="col-md-5">
                      {displayCoberturaData.map((item, idx) => (
                        <div
                          key={idx}
                          className="mb-2 d-flex align-items-center small"
                        >
                          <span
                            className="fw-bold me-2"
                            style={{ color: item.color }}
                          >
                            {item.name}:
                          </span>
                          <span className="text-muted">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico 3: Recaudación */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-4">Recaudación mensual</h6>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={recaudacionData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#6c757d" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#6c757d" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8f9fa" }}
                          contentStyle={{ borderRadius: "8px" }}
                          formatter={(value: number) => [`$${value}`, "Monto"]}
                        />
                        <Bar
                          dataKey="Monto"
                          fill="#198754"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico 4: Cotizaciones */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-4">
                    Cotizaciones generadas vs contratadas
                  </h6>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={cotizacionesData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#6c757d" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#6c757d" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8f9fa" }}
                          contentStyle={{ borderRadius: "8px" }}
                        />
                        <Legend />
                        <Bar
                          dataKey="Generadas"
                          fill="#0d6efd"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="Contratadas"
                          fill="#198754"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: REPORTES */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3 text-dark">Reportes</h5>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <FileText className="me-2 text-secondary" size={20} />
                <h6 className="fw-bold mb-0">Generar Reporte PDF</h6>
              </div>
              <p className="text-muted small mb-4">
                Descarga un reporte completo con todos los indicadores, gráficos
                y estadísticas del sistema.
              </p>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <button
                    className="btn btn-primary w-100 py-3 fw-medium d-flex align-items-center justify-content-center"
                    onClick={handleGenerateMonthlyReport}
                    disabled={generatingPdf}
                  >
                    <Download size={18} className="me-2" />
                    {generatingPdf ? "Generando..." : "Reporte Mensual"}
                  </button>
                </div>
                <div className="col-12 col-md-4">
                  <button
                    className="btn btn-success w-100 py-3 fw-medium d-flex align-items-center justify-content-center"
                    onClick={handleGenerateQuarterlyReport}
                    disabled={generatingPdf}
                  >
                    <Download size={18} className="me-2" />
                    {generatingPdf ? "Generando..." : "Reporte Trimestral"}
                  </button>
                </div>
                <div className="col-12 col-md-4">
                  <button
                    className="btn w-100 py-3 fw-medium text-white d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#9333ea",
                      borderColor: "#9333ea",
                    }}
                    onClick={handleGenerateSemiAnnualReport}
                    disabled={generatingPdf}
                  >
                    <Download size={18} className="me-2" />
                    {generatingPdf ? "Generando..." : "Reporte Semestral"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: ESTADO DEL SISTEMA */}
        <section className="mb-5">
          <h5 className="fw-bold mb-3 text-dark">Estado del Sistema</h5>
          <div className="card border-0 shadow-sm">
            <div className="card border-0 shadow-sm">
              <div className="list-group list-group-flush rounded">

                <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-bottom-0 border-top">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded me-3">
                      <Database size={18} className="text-secondary" />
                    </div>
                    <span className="fw-medium text-dark">Base de datos</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success me-2" style={{ width: 8, height: 8 }}></div>
                    <span className="small text-muted">{systemStatus?.BaseDatos}</span>
                  </div>
                </div>
                <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-bottom-0 border-top">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded me-3">
                      <CreditCard size={18} className="text-secondary" />
                    </div>
                    <span className="fw-medium text-dark">Billetera electronica</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success me-2" style={{ width: 8, height: 8 }}></div>
                    <span className="small text-muted">{systemStatus?.Billetera}</span>
                  </div>
                </div>
                <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-bottom-0 border-top">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded me-3">
                      <Lock size={18} className="text-secondary" />
                    </div>
                    <span className="fw-medium text-dark">Conexion a blockchain</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success me-2" style={{ width: 8, height: 8 }}></div>
                    <span className="small text-muted">{systemStatus?.Blockchain}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-muted small pb-4">
          &copy; 2023 Car-Chain System. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
