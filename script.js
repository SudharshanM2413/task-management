// ==========================================
// TASK MANAGEMENT SYSTEM
// ==========================================


// Get elements from HTML

const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");

const taskDate =
    document.getElementById("taskDate");

const taskPriority =
    document.getElementById("taskPriority");

const taskCategory =
    document.getElementById("taskCategory");

const taskList =
    document.getElementById("taskList");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");


// ==========================================
// Load Tasks
// ==========================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


// Variable used while editing

let editTaskId = null;


// Display tasks when page opens

displayTasks();


// ==========================================
// Add / Update Task
// ==========================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get form values

    const title =
        taskTitle.value.trim();

    const description =
        taskDescription.value.trim();

    const date =
        taskDate.value;

    const priority =
        taskPriority.value;

    const category =
        taskCategory.value;


    // Check title

    if (title === "") {

        alert("Please enter a task title.");

        return;
    }


    // Check date

    if (date === "") {

        alert("Please select a due date.");

        return;
    }


    // ======================================
    // Update Existing Task
    // ======================================

    if (editTaskId !== null) {

        const taskIndex =
            tasks.findIndex(
                task => task.id === editTaskId
            );


        if (taskIndex !== -1) {

            tasks[taskIndex].title =
                title;

            tasks[taskIndex].description =
                description;

            tasks[taskIndex].date =
                date;

            tasks[taskIndex].priority =
                priority;

            tasks[taskIndex].category =
                category;
        }


        editTaskId = null;

        submitButton.textContent =
            "Add Task";

        document.getElementById("formTitle")
            .textContent =
            "Add New Task";

        cancelButton.style.display =
            "none";

    }

    // ======================================
    // Add New Task
    // ======================================

    else {

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            date: date,

            priority: priority,

            category: category,

            status: "Pending",

            createdAt:
                new Date().toISOString()

        };


        tasks.push(newTask);

    }


    // Save tasks

    saveTasks();


    // Display tasks

    displayTasks();


    // Clear form

    taskForm.reset();

});


// ==========================================
// Save Tasks to Local Storage
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// Display Tasks
// ==========================================

function displayTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value.toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const selectedPriority =
        priorityFilter.value;


    // Filter tasks

    const filteredTasks =
        tasks.filter(function(task) {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText) ||
                task.description
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                selectedStatus === "All" ||
                task.status === selectedStatus;


            const matchesPriority =
                selectedPriority === "All" ||
                task.priority === selectedPriority;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });


    // Show empty message

    if (filteredTasks.length === 0) {

        document.getElementById(
            "emptyMessage"
        ).style.display = "block";

    }

    else {

        document.getElementById(
            "emptyMessage"
        ).style.display = "none";

    }


    // Display each task

    filteredTasks.forEach(function(task) {

        const taskCard =
            createTaskCard(task);

        taskList.appendChild(taskCard);

    });


    updateDashboard();

}


// ==========================================
// Create Task Card
// ==========================================

function createTaskCard(task) {

    const card =
        document.createElement("div");


    card.className =
        "task-card";


    // Add completed class

    if (task.status === "Completed") {

        card.classList.add("completed");

    }


    // Priority class

    let priorityClass = "";


    if (task.priority === "High") {

        priorityClass =
            "priority-high";

    }

    else if (task.priority === "Medium") {

        priorityClass =
            "priority-medium";

    }

    else {

        priorityClass =
            "priority-low";

    }


    // Status class

    let statusClass = "";


    if (task.status === "Pending") {

        statusClass =
            "status-pending";

    }

    else if (task.status === "In Progress") {

        statusClass =
            "status-progress";

    }

    else {

        statusClass =
            "status-completed";

    }


    // Create HTML

    card.innerHTML = `

        <div class="task-top">

            <div>

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-description">
                    ${escapeHTML(
                        task.description ||
                        "No description"
                    )}
                </div>

            </div>

        </div>


        <div class="task-info">

            <span class="badge ${priorityClass}">
                Priority: ${task.priority}
            </span>


            <span class="badge ${statusClass}">
                ${task.status}
            </span>


            <span class="badge">
                ${task.category}
            </span>


            <span class="task-date">
                Due: ${formatDate(task.date)}
            </span>

        </div>


        <div class="task-actions">

            <button
                class="complete-btn"
                onclick="changeStatus(${task.id})"
            >
                ${getStatusButtonText(task.status)}
            </button>


            <button
                class="edit-btn"
                onclick="editTask(${task.id})"
            >
                Edit
            </button>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>

        </div>

    `;


    return card;

}


// ==========================================
// Change Task Status
// ==========================================

function changeStatus(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    // Status sequence

    if (task.status === "Pending") {

        task.status =
            "In Progress";

    }

    else if (task.status === "In Progress") {

        task.status =
            "Completed";

    }

    else {

        task.status =
            "Pending";

    }


    saveTasks();

    displayTasks();

}


// ==========================================
// Get Status Button Text
// ==========================================

function getStatusButtonText(status) {

    if (status === "Pending") {

        return "Start";

    }

    if (status === "In Progress") {

        return "Complete";

    }

    return "Reopen";

}


// ==========================================
// Edit Task
// ==========================================

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    // Put values into form

    taskTitle.value =
        task.title;

    taskDescription.value =
        task.description;

    taskDate.value =
        task.date;

    taskPriority.value =
        task.priority;

    taskCategory.value =
        task.category;


    // Store task ID

    editTaskId = id;


    // Change form appearance

    document.getElementById(
        "formTitle"
    ).textContent =
        "Update Task";


    submitButton.textContent =
        "Update Task";


    cancelButton.style.display =
        "block";


    // Scroll to form

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// Cancel Edit
// ==========================================

function cancelEdit() {

    editTaskId = null;


    taskForm.reset();


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Task";


    submitButton.textContent =
        "Add Task";


    cancelButton.style.display =
        "none";

}


// ==========================================
// Delete Task
// ==========================================

function deleteTask(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmation) {

        return;

    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    displayTasks();

}


// ==========================================
// Clear All Tasks
// ==========================================

function clearAllTasks() {

    if (tasks.length === 0) {

        alert("There are no tasks to clear.");

        return;

    }


    const confirmation =
        confirm(
            "Are you sure you want to delete all tasks?"
        );


    if (!confirmation) {

        return;

    }


    tasks = [];


    saveTasks();

    displayTasks();

}


// ==========================================
// Update Dashboard
// ==========================================

function updateDashboard() {

    const total =
        tasks.length;


    const pending =
        tasks.filter(
            task => task.status === "Pending"
        ).length;


    const inProgress =
        tasks.filter(
            task => task.status === "In Progress"
        ).length;


    const completed =
        tasks.filter(
            task => task.status === "Completed"
        ).length;


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "pendingTasks"
    ).textContent =
        pending;


    document.getElementById(
        "progressTasks"
    ).textContent =
        inProgress;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    // Calculate percentage

    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    document.getElementById(
        "progressText"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";

}


// ==========================================
// Format Date
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "No date";

    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// Prevent HTML Injection
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


// ==========================================
// Set Minimum Date
// ==========================================

const today =
    new Date().toISOString()
        .split("T")[0];


taskDate.min = today;
