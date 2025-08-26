document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();

    // Helper to get all form data as an object
    const getFormData = (form) => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    };

    // Helper to save data to localStorage
    const saveData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // Helper to load data from localStorage
    const loadData = (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    };

    // --- Page Specific Logic ---

    if (page === 'index.html' || page === '') {
        localStorage.clear(); // Start fresh
        const prospectForm = document.getElementById('prospect-form');
        prospectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getFormData(prospectForm);
            saveData('prospectData', data);
            
            if (data.serviceChoice === 'Solar') {
                window.location.href = 'solar-details.html';
            } else {
                window.location.href = 'other-services.html';
            }
        });
    }

    if (page === 'solar-details.html') {
        const solarForm = document.getElementById('solar-details-form');
        const billSlider = document.getElementById('monthlyBill');
        const billValue = document.getElementById('bill-value');

        billSlider.addEventListener('input', () => {
            billValue.textContent = `$${billSlider.value}`;
        });

        solarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getFormData(solarForm);
            saveData('solarDetailsData', data);
            window.location.href = 'scheduling.html';
        });
    }

    if (page === 'other-services.html') {
        const otherServicesForm = document.getElementById('other-services-form');
        const serviceTypeSelect = document.getElementById('serviceType');
        const descriptionGroup = document.getElementById('description-group');
        const descriptionTextarea = document.getElementById('description');

        serviceTypeSelect.addEventListener('change', () => {
            if (serviceTypeSelect.value === 'other') {
                descriptionGroup.style.display = 'block';
                descriptionTextarea.required = true;
            } else {
                descriptionGroup.style.display = 'none';
                descriptionTextarea.required = false;
            }
        });

        otherServicesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getFormData(otherServicesForm);
            saveData('otherServicesData', data);
            window.location.href = 'scheduling.html';
        });
    }
    
    if (page === 'scheduling.html') {
        const schedulingForm = document.getElementById('scheduling-form');
        const dateInput = document.getElementById('appointmentDate');
        dateInput.min = new Date().toISOString().split("T")[0];

        schedulingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getFormData(schedulingForm);
            saveData('schedulingData', data);
            window.location.href = 'confirmation.html';
        });
    }

    if (page === 'confirmation.html') {
        const prospectData = loadData('prospectData');
        const solarDetailsData = loadData('solarDetailsData');
        const otherServicesData = loadData('otherServicesData');
        const schedulingData = loadData('schedulingData');

        const submissionData = {
            ...prospectData,
            ...solarDetailsData,
            ...otherServicesData,
            ...schedulingData
        };

        const summaryDiv = document.getElementById('summary');
        let summaryHtml = '<h2>Your Summary:</h2><ul>';
        for(const [key, value] of Object.entries(submissionData)) {
            if (value) {
                summaryHtml += `<li><strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> ${value}</li>`;
            }
        }
        summaryHtml += '</ul>';
        summaryDiv.innerHTML = summaryHtml;

        const title = document.getElementById('confirmation-title');
        const message = document.getElementById('confirmation-message');
        const startOverBtn = document.getElementById('start-over-btn');

        fetch("https://formspree.io/f/mrblnyld", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(submissionData),
        }).then(response => {
            if (response.ok) {
                title.textContent = '✅ Thank You!';
                message.textContent = 'Your request has been submitted. We will be in touch shortly.';
                localStorage.clear();
            } else {
                throw new Error('Network response was not ok.');
            }
        }).catch(error => {
            title.textContent = '❌ Submission Error';
            message.innerHTML = `There was a problem submitting your request. Please try again later.<br><em>${error.message}</em>`;
        }).finally(() => {
            startOverBtn.style.display = 'block';
        });
    }
});
