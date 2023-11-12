// Création et insertion du conteneur pour le premier graphique
const wrapperCanvasOne = document.createElement('div');
wrapperCanvasOne.id = 'wrapper-canvas-one';
const tableOne = document.getElementById('table1');
tableOne.parentNode.insertBefore(wrapperCanvasOne, tableOne);

// Création et insertion du canvas pour le premier graphique
const canvasOne = document.createElement('canvas');
canvasOne.id = 'myChart-1';
wrapperCanvasOne.appendChild(canvasOne);

// Extraction des données du premier tableau
const thElement = tableOne.querySelectorAll('tbody tr:nth-child(1) th');
const years = Array.from(thElement).slice(2).map(element => element.textContent.trim());

const rows = tableOne.querySelectorAll('tbody tr');
const countries = [];
const dataCountries = [];

rows.forEach(row => {
  const countriesElements = row.querySelector('td');
  if (countriesElements) {
    countries.push(countriesElements.textContent.trim());
  }

  const cells = Array.from(row.querySelectorAll('td'));
  const rowData = cells.slice(1).map(cell => parseFloat(cell.textContent.trim()));
  dataCountries.push(rowData);
});

dataCountries.shift();

// Création du premier graphique (Ligne)
const ctxOne = document.getElementById('myChart-1').getContext('2d');
new Chart(ctxOne, {
  type: 'line',
  data: {
    labels: years,
    datasets: countries.map((country, index) => {
      return {
          label: country,
          data: dataCountries[index],
          borderColor: `hsl(${360 * index / countries.length}, 70%, 50%)`,
          fill: false,
      }
    }),
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Création et insertion du conteneur pour le deuxième graphique
const wrapperCanvasTwo = document.createElement('div');
wrapperCanvasTwo.id = 'wrapper-canvas-two';
const tableTwo = document.getElementById('table2');
tableTwo.parentNode.insertBefore(wrapperCanvasTwo, tableTwo);

// Création et insertion du canvas pour le deuxième graphique
const canvasTwo = document.createElement('canvas');
canvasTwo.id = 'myChart-2';
wrapperCanvasTwo.appendChild(canvasTwo);

// Extraction des données du deuxième tableau
let countriesTwo = [];
let yearsTwo = [];
let dataCountriesTwo = [];

const thElementTwo = table2.rows[0];
for (let i = 2; i < thElementTwo.cells.length; i++) {
    yearsTwo.push(thElementTwo.cells[i].textContent);
}

for (let j = 1; j < table2.rows.length; j++) {
    const row = table2.rows[j];
    countriesTwo.push(row.cells[1].textContent);

    const rowData = [];
    for (let k = 2; k < row.cells.length; k++) {
        rowData.push(parseFloat(row.cells[k].textContent.replace(",", ".")));
    }
    dataCountriesTwo.push(rowData);
}

// Création du deuxième graphique (Radar)
const ctxTwo = document.getElementById('myChart-2').getContext('2d');
new Chart(ctxTwo, {
  type: 'radar',
  data: {
    labels: countriesTwo,
    datasets: yearsTwo.map((year, index) => ({
        label: year,
        data: dataCountriesTwo.map(row => row[index]),
        borderWidth: 1,
        backgroundColor: `rgba(0, 0, 128, ${0.2 + 0.1 * index})`,
    }))
  },
  options: {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }
});

// Attendre que le document soit complètement chargé pour le troisième graphique
document.addEventListener('DOMContentLoaded', function() {
    var dataPoints = [];
    var chart;

    // Création et insertion du conteneur pour le troisième graphique
    const wrapperCanvasThree = document.createElement('div');
    wrapperCanvasThree.id = 'wrapper-canvas-three';
    const h1Element = document.getElementById('firstHeading');
    h1Element.parentNode.insertBefore(wrapperCanvasThree, h1Element);

    // Création et insertion du canvas pour le troisième graphique
    const canvasThree = document.createElement('canvas');
    canvasThree.id = 'myChart-3';
    wrapperCanvasThree.appendChild(canvasThree);

    // Récupération des données initiales pour le troisième graphique
    fetch("https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=10&length=10&type=json")
        .then(response => response.json())
        .then(data => {
            data.forEach(function(value) {
                dataPoints.push({ x: value[0], y: parseInt(value[1]) });
            });

            // Création du troisième graphique (Area Chart)
            chart = new Chart(document.getElementById("myChart-3"), {
                type: 'line', // Utilisation du type 'line' pour un graphique en aires
                data: {
                    datasets: [{
                        label: 'Données en temps réel',
                        data: dataPoints,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)', // Remplissage semi-transparent
                        borderColor: 'rgb(0, 123, 255)',
                        borderWidth: 2,
                        fill: true, // Activation du remplissage sous la ligne
                        lineTension: 0.3 // Lissage de la ligne
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom'
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Mise à jour périodique du graphique
            function updateChart() {
                fetch("https://canvasjs.com/services/data/datapoints.php?xstart=" + (dataPoints.length + 1) + "&ystart=" + dataPoints[dataPoints.length - 1].y + "&length=1&type=json")
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(function(value) {
                            dataPoints.push({ x: parseInt(value[0]), y: parseInt(value[1]) });
                            if (dataPoints.length > 20) { // Limiter le nombre de points de données
                                dataPoints.shift();
                            }
                        });

                        chart.update();
                        setTimeout(updateChart, 1000); // Planification de la mise à jour suivante
                    });
            }

            updateChart();
        });
});
