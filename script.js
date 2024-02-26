import incomeObj from "./income.js";
import expenseObj from "./expense.js";
// script.js

document.addEventListener("DOMContentLoaded", function () {
  // Get the sign form container element
  var signFormContainer = document.querySelector(".sign-form-container");

  // Check if the sign form container exists
  if (signFormContainer) {
    // Get the username from the data-username attribute
    var username = signFormContainer.dataset.username;

    // Display the welcome message with the username on the index.html page
    displayWelcomeMessage(username);
  }
});

// Function to display a welcome message with the username
function displayWelcomeMessage(username) {
  // Check if the username is available
  if (username) {
    // Update the welcome message on index.html
    var welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
      welcomeMessage.textContent = "Welcome, " + username + "!";
      setTimeout(function () {
        welcomeMessage.style.display = "none";
      }, 300000);
    }
  }
}

const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});

// incomeTracker.initiate();
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
class Tracker {
  constructor() {
    this.incomeObj = incomeObj;
    this.expenseObj = expenseObj;
    this.incomeBtn = document.getElementById("incomeBtn");
    this.expenseBtn = document.getElementById("expenseBtn");
    this.summaryBtn = document.getElementById("summaryBtn");
    this.budgetBtn = document.getElementById("budgetBtn");
    this.historyBtn = document.getElementById("historyBtn");

    this.incomeDiv = document.querySelector(".income-container");
    this.expenseDiv = document.querySelector(".expense-container");
    this.summaryDiv = document.querySelector(".summary-container");
    this.budgetDiv = document.querySelector(".budget-container");
    this.historyDiv = document.querySelector(".history-container");

    this.tabDivs = [
      this.incomeDiv,
      this.expenseDiv,
      this.summaryDiv,
      this.budgetDiv,
      this.historyDiv,
    ];
    this.tabBtns = [
      this.incomeBtn,
      this.expenseBtn,
      this.summaryBtn,
      this.budgetBtn,
      this.historyBtn,
    ];

    this.summaryBudgetTableBody = document.getElementById(
      "summaryIncomeBudgetTableBody"
    );
    this.summaryCategoryExpense = document.getElementById(
      "summaryCatExpensesList"
    );

    //event handlers
    this.incomeBtn.addEventListener("click", this.showTab.bind(this));
    this.expenseBtn.addEventListener("click", this.showTab.bind(this));
    this.summaryBtn.addEventListener("click", this.showTab.bind(this));
    this.budgetBtn.addEventListener("click", this.showTab.bind(this));
    this.historyBtn.addEventListener("click", this.showTab.bind(this));
  }

  showTab(e) {
    const clickedTab = e.target.id;
    const container = clickedTab.split("Btn")[0];
    const containerName = `${clickedTab.split("Btn")[0]}-container`;
    var containertxt = `${clickedTab.split("Btn")[0]}`;

    // Update the existing text div with the container name
    const textDiv = document.getElementById("dashboardtxt");
    if (textDiv) {
      containertxt = capitalizeFirstLetter(containertxt);
      textDiv.textContent = containertxt;
    }

    this.tabDivs.forEach((div) => {
      if (div.classList.contains(containerName)) {
        div.classList.remove("hidden");
      } else {
        div.classList.add("hidden");
      }
    });

    // add active button class
    this.tabBtns.forEach((btn) => {
      if (btn.id === e.target.id) return btn.classList.add("active-tab");
      btn.classList.remove("active-tab");
    });
  }

  getBudgetList() {
    const budgetCategories = this.incomeObj.budgetCategories;
    budgetCategories.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${item.category}</td><td>${item.budget}</td>`;
      this.summaryBudgetTableBody.insertAdjacentElement("beforeBegin", tr);
    });
  }
  getCategoryExpenses() {
    const expenseList = this.expenseObj.getcategoryExpenses();
    const exhaustedDivWidthConstant = 285;
    expenseList.forEach((item) => {
      // row element
      const row = document.createElement("tr");
      //cols
      const itemCol = document.createElement("td");
      const exhaustCol = document.createElement("td");
      const totalCol = document.createElement("td");
      // div for showing how much is exhausted from a category
      const exhaustedDiv = document.createElement("div");
      exhaustedDiv.className = "exhaustionDiv";
      exhaustedDiv.style.width = `${exhaustedDivWidthConstant}px`;
      const innerExhaustionDiv = document.createElement("div");
      innerExhaustionDiv.className = "innerexhaustionDiv";
      exhaustedDiv.append(innerExhaustionDiv);
      //inner exhaust width calculations
      const exhaustedPercent = item.expense / item.total;
      const innerWidth = exhaustedPercent * exhaustedDivWidthConstant;
      innerExhaustionDiv.style.width = `${innerWidth}px`;

      // putting values into table
      itemCol.textContent = `${item.tag}`;
      exhaustCol.append(exhaustedDiv);
      totalCol.textContent = `${item.expense}/${item.total}`;
      row.append(itemCol, exhaustCol, totalCol);
      this.summaryCategoryExpense.insertAdjacentElement("afterbegin", row);
    });
  }
  getTotalExpense() {
    let totalExpense = 0;
    this.expenses.foreach((el) => {
      totalExpense += parseInt(el.expense);
    });
    return totalExpense;
  }
  getSavings() {
    const income = this.incomeObj.income;
    const expense = this.expenseObj.getTotalExpense();
    const saving = income - expense;
    const savingSpan = document.getElementById("summarySpan");
    savingSpan.textContent = saving;
  }
  initiate() {
    console.log("initiating main tracker");
    this.incomeObj.initiate();
    this.expenseObj.initiate();
    this.getBudgetList();
    this.getCategoryExpenses();
    this.getSavings();
  }
}

const tracker = new Tracker();
tracker.initiate();
// Clear all items from local storage
//localStorage.clear();
