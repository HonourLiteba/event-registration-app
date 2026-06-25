// Fallback in case localStorage is blocked by the browser on local 'file://' links
let participants = [];
try {
    const saved = localStorage.getItem('participants');
    if (saved) {
        participants = JSON.parse(saved);
    }
} catch (e) {
    console.log("Local storage restricted on raw file URLs. Using runtime memory instead.");
}

const form = document.getElementById('registration-form');
const feedbackMessage = document.getElementById('feedback-message');
const participantsList = document.getElementById('participants-list');
const participantCount = document.getElementById('participant-count');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    validateForm();
});

function validateForm() {
    const fullNameValue = document.getElementById('full-name').value.trim();
    const emailValue = document.getElementById('email').value.trim();
    const ageValue = document.getElementById('age').value.trim();
    const technologyValue = document.getElementById('technology').value;
    const termsChecked = document.getElementById('terms').checked;

    let errors = [];

    if (fullNameValue === '') {
        errors.push('Full name is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        errors.push('Email is invalid.');
    }

    const ageNum = Number(ageValue);
    if (ageValue === '' || ageNum <= 0) {
        errors.push('Age must be greater than 0.');
    } else if (ageNum < 18) {
        errors.push('Age must be at least 18.');
    }

    if (technologyValue === '') {
        errors.push('Technology must be selected.');
    }

    if (!termsChecked) {
        errors.push('You must accept the terms.');
    }

    if (errors.length > 0) {
        showFeedback(errors.join('<br>'), 'error');
    } else {
        const successText = `
            <strong>${fullNameValue}</strong> has been registered for the event.<br>
            Technology: ${technologyValue}<br>
            Age: ${ageNum}
        `;
        showFeedback(successText, 'success');
        
        createParticipant(fullNameValue, emailValue, ageNum, technologyValue);
        form.reset();
    }
}

function showFeedback(message, type) {
    feedbackMessage.innerHTML = message;
    feedbackMessage.className = `message ${type}`;
}

function createParticipant(name, email, age, tech) {
    const participant = {
        id: Date.now().toString(),
        name: name,
        email: email,
        age: age,
        tech: tech
    };

    participants.push(participant);
    updateStorageAndUI();
}

function renderParticipants() {
    participantsList.innerHTML = '';
    
    participants.forEach(p => {
        const li = document.createElement('li');
        li.className = 'participant-item';
        
        li.innerHTML = `
            <div class="participant-info">
                <p><strong>${p.name}</strong> (${p.age}) - <em>${p.tech}</em></p>
                <p style="font-size: 0.8rem; color: #a0a0a0;">${p.email}</p>
            </div>
            <button class="btn-delete" onclick="deleteParticipant('${p.id}')">Delete</button>
        `;
        
        participantsList.appendChild(li);
    });

    participantCount.textContent = participants.length;
}

function deleteParticipant(id) {
    participants = participants.filter(p => p.id !== id);
    updateStorageAndUI();
}

function updateStorageAndUI() {
    try {
        localStorage.setItem('participants', JSON.stringify(participants));
    } catch (e) {
        // Quietly fail safe if browser locks local storage file systems
    }
    renderParticipants();
}

renderParticipants();