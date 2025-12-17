import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Tipos de datos
interface KpiDataModel {
    title: string;
    value: string;
    trend: string;
    status: "up" | "down" | "danger" | "neutral";
    icon: any;
    bg: string;
    color: string;
}

interface StatusDataModel {
    BaseDatos: string;
    Blockchain: number;
    Billetera: string;
}

type ReportPeriod = "monthly" | "quarterly" | "semiannual";

interface ReportData {
    kpiData: KpiDataModel[];
    siniestrosData: any[];
    coberturaData: any[];
    recaudacionData: any[];
    cotizacionesData: any[];
    systemStatus: StatusDataModel | null;
}

// Función para obtener el título según el período
const getPeriodTitle = (period: ReportPeriod): string => {
    const titles = {
        monthly: "Mensual",
        quarterly: "Trimestral",
        semiannual: "Semestral",
    };
    return titles[period];
};

// Función para filtrar datos por período (simplificada - usa los datos actuales)
const filterDataByPeriod = (data: any[], period: ReportPeriod) => {
    // Por ahora retornamos todos los datos
    // En una implementación más completa, aquí se filtrarían los datos por fecha
    const monthsToShow = period === "monthly" ? 1 : period === "quarterly" ? 3 : 6;
    return data.slice(-monthsToShow);
};

// Función principal para generar el PDF
export const generateDashboardReport = (
    reportData: ReportData,
    period: ReportPeriod
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // ENCABEZADO
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text("Car-Chain System", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 10;
    doc.setFontSize(16);
    doc.setTextColor(52, 73, 94);
    doc.text("Reporte Dashboard", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 8;
    doc.setFontSize(11);
    doc.setTextColor(127, 140, 141);
    doc.text(`Período: ${getPeriodTitle(period)}`, pageWidth / 2, yPosition, {
        align: "center",
    });

    yPosition += 5;
    const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    doc.text(`Generado el: ${currentDate}`, pageWidth / 2, yPosition, {
        align: "center",
    });

    // Línea separadora
    yPosition += 5;
    doc.setDrawColor(189, 195, 199);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // SECCIÓN 1: INDICADORES CLAVE (KPIs)
    yPosition += 10;
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("Indicadores Clave (KPIs)", 20, yPosition);

    yPosition += 8;

    // Crear tabla de KPIs
    const kpiTableData = reportData.kpiData.map((kpi) => [
        kpi.title,
        kpi.value,
        kpi.trend,
        kpi.status === "up" || kpi.status === "down" ? "✓" : "⚠",
    ]);

    autoTable(doc, {
        startY: yPosition,
        head: [["Indicador", "Valor", "Tendencia", "Estado"]],
        body: kpiTableData,
        theme: "striped",
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
        },
        bodyStyles: {
            fontSize: 9,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // SECCIÓN 2: ANÁLISIS ESTADÍSTICO
    if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("Análisis Estadístico", 20, yPosition);

    yPosition += 8;

    // Tabla de Siniestros
    if (reportData.siniestrosData.length > 0) {
        const filteredSiniestros = filterDataByPeriod(
            reportData.siniestrosData,
            period
        );

        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text("Siniestros por mes", 20, yPosition);
        yPosition += 5;

        const siniestrosTableData = filteredSiniestros.map((item: any) => [
            item.name || "N/A",
            item.Aprobados?.toString() || "0",
            item.Rechazados?.toString() || "0",
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [["Mes", "Aprobados", "Rechazados"]],
            body: siniestrosTableData,
            theme: "grid",
            headStyles: {
                fillColor: [52, 152, 219],
                fontSize: 9,
            },
            bodyStyles: {
                fontSize: 8,
            },
            margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabla de Recaudación
    if (reportData.recaudacionData.length > 0) {
        if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
        }

        const filteredRecaudacion = filterDataByPeriod(
            reportData.recaudacionData,
            period
        );

        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text("Recaudación mensual", 20, yPosition);
        yPosition += 5;

        const recaudacionTableData = filteredRecaudacion.map((item: any) => [
            item.name || "N/A",
            `$${item.Monto?.toLocaleString("es-ES") || "0"}`,
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [["Mes", "Monto"]],
            body: recaudacionTableData,
            theme: "grid",
            headStyles: {
                fillColor: [22, 160, 133],
                fontSize: 9,
            },
            bodyStyles: {
                fontSize: 8,
            },
            margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabla de Cotizaciones
    if (reportData.cotizacionesData.length > 0) {
        if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
        }

        const filteredCotizaciones = filterDataByPeriod(
            reportData.cotizacionesData,
            period
        );

        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text("Cotizaciones", 20, yPosition);
        yPosition += 5;

        const cotizacionesTableData = filteredCotizaciones.map((item: any) => [
            item.name || "N/A",
            item.Generadas?.toString() || "0",
            item.Contratadas?.toString() || "0",
            item.Generadas > 0
                ? `${((item.Contratadas / item.Generadas) * 100).toFixed(1)}%`
                : "0%",
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [["Mes", "Generadas", "Contratadas", "Conversión"]],
            body: cotizacionesTableData,
            theme: "grid",
            headStyles: {
                fillColor: [155, 89, 182],
                fontSize: 9,
            },
            bodyStyles: {
                fontSize: 8,
            },
            margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabla de Coberturas
    if (reportData.coberturaData.length > 0) {
        if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text("Distribución por tipo de cobertura", 20, yPosition);
        yPosition += 5;

        const coberturaTableData = reportData.coberturaData.map((item: any) => [
            item.name || "N/A",
            `${item.value}%`,
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [["Tipo de Cobertura", "Porcentaje"]],
            body: coberturaTableData,
            theme: "grid",
            headStyles: {
                fillColor: [230, 126, 34],
                fontSize: 9,
            },
            bodyStyles: {
                fontSize: 8,
            },
            margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // SECCIÓN 3: ESTADO DEL SISTEMA
    if (reportData.systemStatus) {
        if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text("Estado del Sistema", 20, yPosition);

        yPosition += 8;

        const statusTableData = [
            ["Base de datos", reportData.systemStatus.BaseDatos || "N/A"],
            ["Blockchain", reportData.systemStatus.Blockchain?.toString() || "N/A"],
            ["Billetera electrónica", reportData.systemStatus.Billetera || "N/A"],
        ];

        autoTable(doc, {
            startY: yPosition,
            head: [["Componente", "Estado"]],
            body: statusTableData,
            theme: "plain",
            headStyles: {
                fillColor: [44, 62, 80],
                fontSize: 9,
            },
            bodyStyles: {
                fontSize: 8,
            },
            margin: { left: 20, right: 20 },
        });
    }

    // FOOTER
    const totalPages = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        doc.text(
            `Página ${i} de ${totalPages}`,
            pageWidth / 2,
            doc.internal.pageSize.height - 10,
            { align: "center" }
        );
        doc.text(
            "© 2023 Car-Chain System. Todos los derechos reservados.",
            pageWidth / 2,
            doc.internal.pageSize.height - 5,
            { align: "center" }
        );
    }

    // Guardar el PDF
    const fileName = `Reporte_Dashboard_${getPeriodTitle(period)}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
};
