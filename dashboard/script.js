function showAddCustomerForm() {
    document.getElementById('customerForm').style.display = 'block';
    document.getElementById('companyName').value = '';
    document.getElementById('companyDescription').value = '';
}


function cancelForm() {
    document.getElementById('customerForm').style.display = 'none';
}

function saveCustomer() {
    const companyName = document.getElementById('companyName').value;
    const companyDescription = document.getElementById('companyDescription').value;

    if (!companyName || !companyDescription) {
        alert("Please fill in all fields.");
        return false;
    }

    // Create a new row and add it to the table
    const table = document.querySelector('#customerTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="company">
            <img src="Avatar.png" alt="">
            <div class="people-de">
                <h5>${companyName}</h5>
                <p>${companyDescription}</p>
            </div>
        </td>
        <td class="status">
            <h5>Active</h5>
        </td>
        <td class="About">
            <h5>About</h5>
            <p>Longer description goes here.</p>
        </td>
        <td class="users">
            <!-- Attach user pictures here if needed -->
        </td>
        <td class="licenseuse">
            <!-- Gauge bar -->
        </td>
        <td class="edittable">
            <button class="trash-button" onclick="deleteRow(this)">
                <img src="trash-2.png" alt="Trash Icon">
            </button>
            <button class="edit-button" onclick="showEditCustomerForm(this)">
                <img src="edit-2.png" alt="Edit Icon">
            </button>
        </td>
    `;
    table.appendChild(newRow);
    cancelForm();
    return false;
}

function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
}
function showEditCustomerForm(button) {
    const row = button.closest('tr');
    const companyName = row.querySelector('.people-de h5').textContent;
    const companyDescription = row.querySelector('.people-de p').textContent;

    document.getElementById('companyName').value = companyName;
    document.getElementById('companyDescription').value = companyDescription;
    document.getElementById('customerForm').style.display = 'block';
}
function updateElapsedTime() {
    const currentTime = new Date().getTime();

    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('elapsed-time').textContent = elapsedSeconds + ' seconds';
}
const startTime = new Date().getTime();

const timerInterval = setInterval(updateElapsedTime, 1000);




function createCompanySlideshow() {
    const slideshowContainer = document.getElementById('taskSlideshow');
    const slideshowInterval = 3000; // Set the interval for changing companies (in milliseconds)
    let currentCompanyIndex = 0;

    function updateSlideshow() {
        const companyCells = document.querySelectorAll('.company h5');
        const companyNames = Array.from(companyCells).map((cell) => cell.textContent);
        if (companyNames.length > 0) {
            slideshowContainer.style.opacity = 0;
            setTimeout(() => {
                slideshowContainer.textContent = companyNames[currentCompanyIndex];

                slideshowContainer.style.opacity = 1;

                currentCompanyIndex = (currentCompanyIndex + 1) % companyNames.length;
            }, 500);
        } else {
            slideshowContainer.textContent = "No entries";
        }
    }
    updateSlideshow();
    setInterval(updateSlideshow, slideshowInterval);
}
window.addEventListener('load', createCompanySlideshow);












