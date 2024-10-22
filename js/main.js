document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('experience-list')) {
        fetchExperiences(); // Hämta arbetserfarenheter och visa på sidan
    }
});

// Funktion för att formatera datum
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE'); // Detta ger format: ÅÅÅÅ-MM-DD
}
// Funktion för att hämta arbetserfarenheter från servern
function fetchExperiences() {
    fetch('http://localhost:4680/api/workexperience')
        .then(response => response.json())
        .then(data => {
            const experienceList = document.getElementById('experience-list');
            experienceList.innerHTML = '';
            data.forEach(exp => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${exp.companyname} - ${exp.jobtitle} (${formatDate(exp.startdate)} - ${formatDate(exp.enddate)})
                    <button class="update-btn" data-id="${exp.id}">Uppdatera</button>
                    <button class="delete-btn" data-id="${exp.id}">Radera</button>
                `;
                experienceList.appendChild(li);
            });

            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', handleUpdate);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDelete);
            });
        })
        .catch(error => console.error('Fel vid hämtning av erfarenheter:', error));
}

// Funktion för att hantera radering av en arbetserfarenhet
function handleDelete(event) {
    const experienceId = event.target.getAttribute('data-id'); // Hämta ID för den arbetserfarenhet som ska raderas

    fetch(`http://localhost:4680/api/workexperience/${experienceId}`, {
        method: 'DELETE', // Skicka DELETE-förfrågan
    })
    .then(response => response.json())
    .then(data => {
        console.log('Raderad:', data); // Logga att raderingen lyckades
        fetchExperiences(); // Hämta listan igen efter radering
    })
    .catch(error => console.error('Fel vid radering:', error));
}

// Funktion för att hantera uppdatering av en arbetserfarenhet
function handleUpdate(event) {
    const experienceId = event.target.getAttribute('data-id'); // Hämta ID för den arbetserfarenhet som ska uppdateras
    // Omdirigera användaren till sidan för att lägga till erfarenhet med ID:t i URL:en
    window.location.href = `add.html?experienceId=${experienceId}`;
}


document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('formTitle');
    const submitButton = document.getElementById('submitButton');
    const form = document.getElementById('add-experience-form');
    
    // Kontrollera om vi är i uppdateringsläge
    const urlParams = new URLSearchParams(window.location.search);
    const experienceId = urlParams.get('experienceId');

    if (experienceId) {
        // Ändra titel och knapptext för uppdateringsläge
        formTitle.textContent = 'Uppdatera arbetserfarenhet';
        submitButton.textContent = 'Uppdatera';

        // Hämta befintlig erfarenhet och fyll i formuläret
        fetch(`http://localhost:4680/api/workexperience/${experienceId}`)
            .then(response => response.json())
            .then(exp => {
                document.getElementById('companyname').value = exp.companyname;
                document.getElementById('jobtitle').value = exp.jobtitle;
                document.getElementById('location').value = exp.location;
                document.getElementById('startdate').value = exp.startdate;
                document.getElementById('enddate').value = exp.enddate;
                document.getElementById('description').value = exp.description;
            })
            .catch(error => console.error('Fel vid hämtning av erfarenhet för uppdatering:', error));
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const experience = {
            companyname: document.getElementById('companyname').value,
            jobtitle: document.getElementById('jobtitle').value,
            location: document.getElementById('location').value,
            startdate: document.getElementById('startdate').value,
            enddate: document.getElementById('enddate').value,
            description: document.getElementById('description').value
        };

        const method = experienceId ? 'PUT' : 'POST';
        const url = experienceId 
            ? `http://localhost:4680/api/workexperience/${experienceId}`
            : 'http://localhost:4680/api/workexperience';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(experience)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Framgång:', data);
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Fel:', error));
    });
});