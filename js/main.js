document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('experience-list')) {
        fetchExperiences();
    }
});

function fetchExperiences() {
    fetch('http://localhost:4680/api/workexperience')
        .then(response => response.json())
        .then(data => {
            const experienceList = document.getElementById('experience-list');
            experienceList.innerHTML = '';
            data.forEach(exp => {
                const li = document.createElement('li');
                li.textContent = `${exp.companyname} - ${exp.jobtitle} (${exp.startdate} - ${exp.enddate})`;

                experienceList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching experiences:', error));
}
