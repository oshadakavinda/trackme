class Income {
  constructor() {
    // initial values
    this.income = this.calculateCategory("income");
    this.budget = this.calculateCategory("budget");
    this.savings = this.income - this.budget;
    this.incomeCategories = this.getIncomeCategories();
    this.budgetCategories = this.getBudgetCategories();

    // ui components
    this.incomeAddForm = document.getElementById("incomeAddForm");
    this.budgetAddBtn = document.getElementById("budgetAddBtn");
    this.budgetTable = document.getElementById("budgetTable");
    this.incomeBudgetTableBody = document.getElementById(
      "incomeBudgetTableBody"
    );
    this.incomeChartInstance = null;
    this.incBudComparisonChartInstance = null;

    this.incomeChart = document.getElementById("incomeChart");
    this.incBudComparisonChart = document.getElementById("incBudCompareChart");
    this.incomeChartTableBody = document.getElementById("incomeChartTableBody");
    this.budgetChartTableBody = document.getElementById("budgetChartTableBody");
    this.savingValue = document.getElementById("estimatedSavingsValue");
    this.summaryIncomeChart = document.getElementById("SummaryIncomeChart");

    // Event Handlers
    this.incomeAddForm.addEventListener(
      "submit",
      this.addIncomeForm.bind(this)
    );
    this.budgetAddBtn.addEventListener("click", this.addBudgetForm.bind(this));
    this.budgetTable.addEventListener("click", this.removeBudgetRow.bind(this));
  }

  // internal calculations
  calculateCategory(category) {
    if (this.getStorageItem(category + "Categories")) {
      const categories = this.getStorageItem(category + "Categories");
      return categories.reduce(
        (acc, curr) => (acc += parseFloat(curr[category])),
        0
      );
    } else {
      return 0;
    }
  }

  setStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getStorageItem(item) {
    const localStorageItem = localStorage.getItem(item);
    return localStorageItem ? JSON.parse(localStorageItem) : undefined;
  }

  updateIncomeTransactionList() {
    this.incomeChartTableBody.innerHTML = "";

    this.incomeCategories.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>-${item.source}</td><td>${item.income}</td>`;
      this.incomeChartTableBody.appendChild(tr);
    });
  }

  addIncome(newIncome, source) {
    const lastIncomeCatId = this.getLastCategoryId("incomeCategories");
    const newId = lastIncomeCatId + 1;

    const catObj = {
      id: newId,
      source: source,
      income: parseFloat(newIncome),
    };

    const storageIncomeCategories =
      this.getStorageItem("incomeCategories") || [];

    const existingCategoryIndex = storageIncomeCategories.findIndex(
      (category) => category.source === source
    );

    if (existingCategoryIndex !== -1) {
      storageIncomeCategories[existingCategoryIndex].income +=
        parseFloat(newIncome);
    } else {
      storageIncomeCategories.push(catObj);
    }

    this.incomeCategories = storageIncomeCategories;
    this.setStorageItem("incomeCategories", storageIncomeCategories);

    this.incomeChartTableBody.innerHTML = "";
    this.addIncomeChart();
  }

  getLastCategoryId(categoryName) {
    const storageCategories = this.getStorageItem(categoryName);
    if (storageCategories && storageCategories.length > 0) {
      const lastCategory = storageCategories[storageCategories.length - 1];
      return lastCategory ? lastCategory.id : 0;
    }
    return 0;
  }

  addBudget(newBudget, newCategory) {
    const totalBudget = this.budget + parseFloat(newBudget);

    if (totalBudget > this.income) {
      alert("Total budget cannot exceed income. Please enter a valid budget.");
      return;
    }

    let newCatArr = [];
    const lastBudgetCatId = this.getLastCategoryId("budgetCategories");
    const newId = lastBudgetCatId + 1;

    const catObj = {
      id: newId,
      category: newCategory,
      budget: parseFloat(newBudget),
    };

    const storageBudgetCategories = this.getStorageItem("budgetCategories");

    if (storageBudgetCategories) {
      newCatArr = [...storageBudgetCategories, catObj];
    } else {
      newCatArr.push(catObj);
    }

    this.budgetCategories = newCatArr;
    this.setStorageItem("budgetCategories", newCatArr);

    location.reload(); // To reload the page
  }

  getBudgetCategories() {
    return this.getStorageItem("budgetCategories") || [];
  }

  getIncomeCategories() {
    return this.getStorageItem("incomeCategories") || [];
  }

  removeItem(item, id) {
    const itemCategoryName = item + "Categories";
    const itemCategory = this.getStorageItem(itemCategoryName);
    const newCategoryArray = itemCategory.filter((item) => item.id != id);
    this.setStorageItem(itemCategoryName, newCategoryArray);
    location.reload();
  }

  addIncomeForm(e) {
    e.preventDefault();

    const newIncomeInput = document.getElementById("newIncomeInput").value;
    const newSourceInput = document.getElementById(
      "newIncomeSourceInput"
    ).value;
    const existingSourceInput = document.getElementById(
      "existingIncomeSourceInput"
    ).value;
    const newSource = newSourceInput || existingSourceInput;

    if (newIncomeInput !== "") {
      this.addIncome(newIncomeInput, newSource);
    }
  }

  mapBudgetTable() {
    const existingRows = document.querySelectorAll(
      "#budgetTable tr:not(:first-child)"
    );
    existingRows.forEach((row) => row.remove());

    this.budgetCategories.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", `bRow${item.id}`);
      tr.innerHTML = `<td>${item.category}</td><td>${item.budget}</td>
                      <td><button id="budDelBtn${item.id}" class="del-btn">delete</button>
                          <button id="budEditBtn${item.id}" class="edit-btn">edit</button></td>`;
      this.incomeBudgetTableBody.insertAdjacentElement("beforeBegin", tr);
    });
  }

  addBudgetForm() {
    const newBudget = document.getElementById("budgetInput").value;
    const newBudgetCategory = document.getElementById(
      "budgetCategoryInput"
    ).value;

    if (newBudget !== "") {
      this.addBudget(newBudget, newBudgetCategory);
    }
  }

  removeBudgetRow(e) {
    const btnId = e.target.id;

    if (btnId.includes("budDelBtn")) {
      const id = btnId.split("budDelBtn")[1];
      const budRowId = `bRow${id}`;
      const budRow = document.getElementById(budRowId);
      budRow.remove();
      this.removeItem("budget", id);
    } else if (btnId.includes("budEditBtn")) {
      const id = btnId.split("budEditBtn")[1];
      this.editBudget(id);
    }
  }

  editBudget(id) {
    const budgetCategory = this.budgetCategories.find(
      (item) => item.id === parseInt(id)
    );

    if (budgetCategory) {
      const newBudget = prompt(
        "Enter the new budget amount:",
        budgetCategory.budget
      );

      if (newBudget !== null && !isNaN(newBudget)) {
        budgetCategory.budget = parseFloat(newBudget);
        this.setStorageItem("budgetCategories", this.budgetCategories);
        location.reload(); // To reload the page
      }
    }
  }

  updateIncomeChart(labels, data) {
    if (this.incomeChartInstance) {
      this.incomeChartInstance.data.labels = labels;
      this.incomeChartInstance.data.datasets[0].data = data;
      this.incomeChartInstance.update();
    }
  }

  getAllIncomes() {
    const sortedIncomes = this.incomeCategories.sort((a, b) =>
      a.id > b.id ? -1 : 1
    );
    const allIncomesBody = document.getElementById("allIncomesBody");
    let serial = 1;

    allIncomesBody.innerHTML = "";
    const incomeLabels = [];
    const incomeData = [];

    sortedIncomes.forEach((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString();
      allIncomesBody.insertAdjacentHTML(
        "beforeend",
        `<tr><td>${serial}</td><td>${item.source}</td><td>${item.income}</td><td>${formattedDate}</td></tr>`
      );
      serial++;
      incomeLabels.push(item.source);
      incomeData.push(item.income);
    });

    this.updateIncomeChart(incomeLabels, incomeData);
  }

  addIncomeChart() {
    const incomeLabels = [];
    const incomeData = [];

    this.incomeCategories.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<tr><td>-${item.source}</td><td>${item.income}</td></tr>`;
      this.incomeChartTableBody.insertAdjacentElement("beforeEnd", tr);
      incomeLabels.push(item.source);
      incomeData.push(item.income);
    });

    if (this.incomeChartInstance) {
      this.incomeChartInstance.data.labels = incomeLabels;
      this.incomeChartInstance.data.datasets[0].data = incomeData;
      this.incomeChartInstance.update();
    } else {
      const data = {
        labels: incomeLabels,
        datasets: [
          {
            data: incomeData,
            backgroundColor: [
              "rgba(200, 27, 200,0.5)",
              "rgb(255, 159, 64,0.5)",
              "rgb(255, 205, 86,0.5)",
              "rgb(75, 192, 192,0.5)",
              "rgb(54, 162, 235,0.5)",
              "rgb(1, 142, 203,0.5)",
              "rgb(106, 144, 204)",
              "rgb(1, 142, 203)",
              "rgb(102, 55, 221)",
            ],
          },
        ],
      };

      const config = {
        type: "doughnut",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Income Sources",
            },
          },
        },
      };

      this.incomeChartInstance = new Chart(this.incomeChart, config);

      const myChart2 = new Chart(this.summaryIncomeChart, config);
    }
  }

  addBudgetCompareChart() {
    this.budgetCategories.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<tr><td>-${item.category}</td><td>${item.budget}</td></tr>`;
      this.budgetChartTableBody.insertAdjacentElement("beforeEnd", tr);
    });

    this.savingValue.textContent = this.savings;

    const data = {
      labels: ["Income/budget"],
      datasets: [
        {
          label: "Income",
          data: [this.income],
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgb(150, 230, 132)",
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: "Budget",
          data: [this.budget],
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgb(255, 99, 132)",
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: "Savings",
          data: [this.savings],
          borderColor: "rgb(120, 162, 235)",
          backgroundColor: "rgb(255, 200, 132)",
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Income Budget Comparison ",
          },
        },
      },
    };

    if (this.incBudComparisonChartInstance) {
      this.incBudComparisonChartInstance.data = data;
      this.incBudComparisonChartInstance.update();
    } else {
      this.incBudComparisonChartInstance = new Chart(
        this.incBudComparisonChart,
        config
      );
    }
  }

  initiate() {
    document.getElementById("incomeValue").textContent = this.income;
    document.getElementById("incomeBudgetValue").textContent = this.budget;
    this.mapBudgetTable();
    this.addIncomeChart();
    this.addBudgetCompareChart();
    this.getAllIncomes();
  }

  consoleStorage() {
    console.log(this.income, this.incomeCategories);
    console.log(this.budget, this.budgetCategories);
  }
}

const incomeObj = new Income();

export default incomeObj;
