// Gráfico de tipos de contrato
const tipoCtx = document.getElementById('chartTipoContrato').getContext('2d');
new Chart(tipoCtx, {
    type: 'doughnut',
    data: {
        labels: Object.keys(contractsData.types),
        datasets: [{
            data: Object.values(contractsData.types),
            backgroundColor: [
                '#4361ee',
                '#3a0ca3',
                '#7209b7'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});

// Gráfico de vencimientos
const vencimientosCtx = document.getElementById('chartVencimientos').getContext('2d');
new Chart(vencimientosCtx, {
    type: 'bar',
    data: {
        labels: Object.keys(contractsData.expiring),
        datasets: [{
            label: 'Contratos',
            data: Object.values(contractsData.expiring),
            backgroundColor: '#f72585'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});