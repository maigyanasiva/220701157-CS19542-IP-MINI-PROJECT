let userSalesData = [];
let userCostData = [];

function submitData(event) {
  event.preventDefault();

  // Get user inputs
  const salesDataInput = document.getElementById('salesData').value;
  const costDataInput = document.getElementById('costData').value;

  // Parse inputs into arrays of numbers
  userSalesData = salesDataInput.split(',').map(Number);
  userCostData = costDataInput.split(',').map(Number);

  // Validate data
  if (userSalesData.length !== userCostData.length) {
    alert("Sales data and cost data must have the same number of entries.");
    return;
  }

  generateReport(); // Update the report with the new data
}

function generateReport() {
  // Check if data exists before proceeding
  if (userSalesData.length === 0 || userCostData.length === 0) {
    alert("Please enter valid sales and cost data.");
    return;
  }

  // Calculate totals and profit
  const totalSales = userSalesData.reduce((sum, value) => sum + value, 0);
  const totalCosts = userCostData.reduce((sum, value) => sum + value, 0);
  const totalProfit = totalSales - totalCosts;

  // Update Summary Data
  document.getElementById('totalSales').innerText = totalSales.toFixed(2);
  document.getElementById('totalProfit').innerText = totalProfit.toFixed(2);
  document.getElementById('totalCosts').innerText = totalCosts.toFixed(2);

  // Update Sales Trends Table
  const salesTrendsBody = document.getElementById('salesTrendsBody');
  const salesTotalRow = document.getElementById('salesTotalRow');
  salesTrendsBody.innerHTML = ''; // Clear existing data
  salesTotalRow.innerHTML = '';   // Clear existing total row

  userSalesData.forEach((sale, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>Time Period ${index + 1}</td><td>$${sale.toFixed(2)}</td>`;
    salesTrendsBody.appendChild(row);
  });

  // Append total sales row
  const totalSalesRow = document.createElement('tr');
  totalSalesRow.innerHTML = `<td>Total Sales</td><td>$${totalSales.toFixed(2)}</td>`;
  salesTotalRow.appendChild(totalSalesRow);

  // Update Cost Analysis Table
  const costAnalysisBody = document.getElementById('costAnalysisBody');
  const costTotalRow = document.getElementById('costTotalRow');
  costAnalysisBody.innerHTML = ''; // Clear existing data
  costTotalRow.innerHTML = '';     // Clear existing total row

  userCostData.forEach((cost, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>Time Period ${index + 1}</td><td>$${cost.toFixed(2)}</td>`;
    costAnalysisBody.appendChild(row);
  });

  // Append total cost row
  const totalCostRow = document.createElement('tr');
  totalCostRow.innerHTML = `<td>Total Costs</td><td>$${totalCosts.toFixed(2)}</td>`;
  costTotalRow.appendChild(totalCostRow);
}
