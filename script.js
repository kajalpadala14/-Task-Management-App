const addTaskButton = document.getElementById('addTaskButton');
const resetButton = document.getElementById('resetButton');
const taskInput = document.getElementById('taskInput');
const taskDateInput = document.getElementById('taskDate');
const taskDueInput = document.getElementById('taskDue');
const taskPriorityInput = document.getElementById('task-priority');
const taskTableBody = document.querySelector('#taskTable tbody');
const filterDropdown = document.getElementById('filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskTableBody.innerHTML = '';
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');

        row.classList.add(task.completed ? 'completed' :'pending' );
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.date}</td>
            <td>${task.due}</td>
            <td>${task.priority}</td>
            <td>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </td>
            <td>
                <button class="status-toggle" onclick="toggleTaskStatus(${index})">
                    ${task.completed ? 'Completed' : 'Pending'}
                </button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}
addTaskButton.addEventListener('click', () => {
    const title = taskInput.value.trim();
    const date = taskDateInput.value;
    const due = taskDueInput.value;
    const priority = taskPriorityInput.value;

    if (title && date && due && priority) {
        const newTask = {
            title,
            date,
            due,
            priority,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();


        taskInput.value = '';
        taskDateInput.value = '';
        taskDueInput.value = '';
        taskPriorityInput.value = '';
    } else {
        alert("Please fill in all the fields");
    }
});

function renderFilteredTasks(filteredTasks) {
    taskTableBody.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.classList.add(task.completed ? 'completed' : 'pending');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.date}</td>
            <td>${task.due}</td>
            <td>${task.priority}</td>
            <td>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </td>
            <td>
                <button class="status-toggle" onclick="toggleTaskStatus(${index})">
                    ${task.completed ? 'Completed' : 'Pending'}
                </button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.title;
    taskDateInput.value = task.date;
    taskDueInput.value = task.due;
    taskPriorityInput.value = task.priority;

    document.getElementById('save').style.display = 'block';
    addTaskButton.style.display = 'none';
    resetButton.style.display = 'none';

    const saveButton = document.getElementById('save');
    saveButton.onclick = () => {
        const title = taskInput.value.trim();
        const date = taskDateInput.value;
        const due = taskDueInput.value;
        const priority = taskPriorityInput.value;

        if (title && date && due && priority) {
            const updatedTask = {
                title,
                date,
                due,
                priority,
                completed: task.completed
            };

            tasks.splice(index, 1, updatedTask);

            taskInput.value = '';
            taskDateInput.value = '';
            taskDueInput.value = '';
            taskPriorityInput.value = '';
            saveButton.style.display = 'none';
            addTaskButton.style.display = 'block';
            resetButton.style.display = 'block';

            saveTasks();
            renderTasks();
        } 
        else {
            alert("Please fill in all the fields");
        }
    };
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function toggleTaskStatus(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

resetButton.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

filterDropdown.addEventListener('change', () => {
    const filterValue = filterDropdown.value.toLowerCase();
    const now = new Date();

    const filteredTasks = tasks.filter((task) => {
        if (filterValue === "date due 7 days") {
            const dueDate = new Date(task.due);
            return (dueDate - now) / (1000 * 60 * 60 * 24) <= 7; 
        }
        if (["high", "medium", "critical", "low","All Tasks"].includes(filterValue)) {
            return task.priority.toLowerCase() === filterValue;
        }
        if (filterValue === "completed") {
            return task.completed === true; 
        }
        if (filterValue === "pending") {
            return task.completed === false; 
        }
        return true; 
    });
    renderFilteredTasks(filteredTasks);
})
renderTasks();

