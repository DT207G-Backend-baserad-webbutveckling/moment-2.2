document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('add-experience-form')) {
        document.getElementById('add-experience-form').addEventListener('submit', addExperience);
    }
});

function addExperience(event) {
    event.preventDefault();
    const form = event.target;

    const experience = {
        companyname: form.companyname.value,
        jobtitle: form.jobtitle.value,
        location: form.location.value,
        startdate: form.startdate.value,
        enddate: form.enddate.value,
        description: form.description.value
    };

    console.log('Sending data:', experience);

    fetch('http://localhost:4680/api/workexperience', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(experience)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        form.reset();
        window.location.href = 'index.html';
    })
    .catch(error => console.error('Error adding experience:', error));
}
