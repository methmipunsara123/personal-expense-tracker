
document.getElementById('transactionDate').valueAsDate = new Date();

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const form = document.getElementById('transactionForm');
const tableBody = document.getElementById('transactionTableBody');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const currentBalanceEl = document.getElementById('currentBalance');
const filterType = document.getElementById('filterType');
const searchQuery = document.getElementById('searchQuery');


form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTransaction = {
        id: Date.now(),
        type: document.getElementById('transactionType').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('transactionDate').value
    };

    transactions.push(newTransaction);
    saveAndRender();
    form.reset();
    document.getElementById('transactionDate').valueAsDate = new Date();
});


function saveAndRender() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
}


function renderTransactions() {
    const filterValue = filterType.value;
    const searchVal = searchQuery.value.toLowerCase();

    let filtered = transactions.filter(t => {
        const matchesType = filterValue === 'All' || t.type === filterValue;
        const matchesSearch = t.description.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
        return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No transactions found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = '';
    filtered.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td><span class="badge bg-${t.type === 'Income' ? 'success' : 'danger'}">${t.type}</span></td>
            <td>${t.category}</td>
            <td class="fw-bold ${t.type === 'Income' ? 'text-success' : 'text-danger'}">
                ${t.type === 'Income' ? '+' : '-'} LKR ${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${t.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        if (t.type === 'Income') {
            totalIncome += t.amount;
        } else {
            totalExpenses += t.amount;
        }
    });

    let balance = totalIncome - totalExpenses;

    totalIncomeEl.textContent = `LKR ${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    totalExpensesEl.textContent = `LKR ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    currentBalanceEl.textContent = `LKR ${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveAndRender();
}


filterType.addEventListener('change', renderTransactions);
searchQuery.addEventListener('input', renderTransactions);


renderTransactions();
updateSummary();