// ============================================
// SOLAR-PES v4.0 - Main Script
// UI Updates & Form Submission
// ============================================

// Google Apps Script URL - UPDATE THIS!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8t5IYTY-QRzm_T-YTVUyvCbvjL91UrhBdW9KL2qSaB5tsfkQFDpyIyw_iuCZEUBVy/exec';

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateArchetypeDisplay(result) {
    if (!result) {
        document.getElementById('archetypeDisplay').style.display = 'none';
        document.querySelector('.placeholder').style.display = 'flex';
        return;
    }

    document.querySelector('.placeholder').style.display = 'none';
    document.getElementById('archetypeDisplay').style.display = 'block';

    // Building ID
    document.getElementById('buildingID').textContent = result.buildingID;

    // Layer 1: Climate
    const climateHTML = `
        <p><strong>${result.climate.name}</strong> (${result.climate.code})</p>
        <p>${result.climate.description}</p>
        <p style="font-size: 0.9rem; color: #666;">
            ${result.climate.technical}<br>
            HDD18: ${result.climate.hdd18}°C·gün | CDD18: ${result.climate.cdd18}°C·gün
        </p>
    `;
    document.getElementById('climateInfo').innerHTML = climateHTML;

    // Layer 2: Morphology
    const morphHTML = `
        <p><strong>Plan:</strong> ${result.planType.icon} ${result.planType.name} (${result.planType.code})</p>
        <p><strong>Façade:</strong> ${result.facadeConfig.name} (${result.facadeConfig.code}) - WWR: ${result.facadeConfig.wwr}</p>
        <p><strong>Height:</strong> ${result.height.name} (${result.height.code}) - ${result.height.description}</p>
        <p><strong>Area:</strong> ${result.area.name} (${result.area.code}) - ${result.area.description}</p>
    `;
    document.getElementById('morphologyInfo').innerHTML = morphHTML;

    // Layer 3: Envelope
    const envelopeHTML = `
        <p><strong>Vintage:</strong> ${result.vintage.name} (${result.vintage.code}) - ${result.vintage.period}</p>
        <p>${result.vintage.description}</p>
        <p><strong>Material:</strong> ${result.material.name} (${result.material.code})</p>
        <p><strong>Renovation:</strong> ${result.renovation.name} (${result.renovation.code})</p>
    `;
    document.getElementById('envelopeInfo').innerHTML = envelopeHTML;

    // Layer 4: Function
    const functionHTML = `
        <p><strong>Education Level:</strong> ${result.educationLevel.name} (${result.educationLevel.code})</p>
        <p>${result.educationLevel.description}</p>
        <p><strong>Operation Mode:</strong> ${result.operationMode.name} (${result.operationMode.code})</p>
        <p>${result.operationMode.description}</p>
    `;
    document.getElementById('functionInfo').innerHTML = functionHTML;

    // Layer 5: Systems
    const systemsHTML = `
        <p><strong>${result.system.name}</strong> (${result.system.code})</p>
        <p>${result.system.description}</p>
        <p style="font-size: 0.9rem; color: #666;">
            Efficiency: ${result.system.efficiency} | CO₂: ${result.system.co2}
        </p>
    `;
    document.getElementById('systemsInfo').innerHTML = systemsHTML;

    // Performance Card
    const perf = result.performance;
    const perfCard = document.getElementById('performanceCard');
    perfCard.className = `performance-card ${perf.className}`;
    
    document.getElementById('perfIcon').textContent = perf.icon;
    document.getElementById('perfBadge').textContent = perf.rating;
    document.getElementById('perfBadge').className = `performance-badge ${perf.className}`;
    document.getElementById('perfDesc').textContent = perf.description;
    document.getElementById('perfScore').textContent = perf.score;

    // Parameters
    document.getElementById('wallU').textContent = result.parameters.wallU;
    document.getElementById('windowU').textContent = result.parameters.windowU;
    document.getElementById('wwr').textContent = result.parameters.wwr;
    document.getElementById('epwFile').textContent = result.climate.epw;

    // Scroll to results on mobile
    if (window.innerWidth < 1024) {
        setTimeout(() => {
            document.querySelector('.results-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
}

// ============================================
// PROGRESS TRACKING
// ============================================

function updateProgress() {
    const form = document.getElementById('buildingForm');
    const requiredFields = form.querySelectorAll('[required]');
    let filledCount = 0;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            if (document.querySelector(`input[name="${field.name}"]:checked`)) {
                filledCount++;
            }
        } else if (field.value.trim() !== '') {
            filledCount++;
        }
    });
    
    const uniqueRequired = new Set();
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            uniqueRequired.add(field.name);
        } else {
            uniqueRequired.add(field.id);
        }
    });
    
    const progress = (filledCount / uniqueRequired.size) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// ============================================
// FORM SUBMISSION
// ============================================

async function submitToGoogleSheets(formData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Kaydediliyor...';
    
    const result = calculateArchetype();
    
    if (!result) {
        showMessage('❌ Lütfen tüm zorunlu alanları doldurun!', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Building ID Oluştur ve Kaydet';
        return;
    }
    
    // Collect all form data
    const formData = {
        timestamp: new Date().toISOString(),
        
        // Building ID
        buildingID: result.buildingID,
        
        // General
        buildingName: document.getElementById('buildingName').value,
        city: document.getElementById('city').value,
        district: document.getElementById('district').value || '',
        
        // Layer 1: Climate
        climateCode: result.climate.code,
        climateName: result.climate.name,
        epwFile: result.climate.epw,
        hdd18: result.climate.hdd18,
        cdd18: result.climate.cdd18,
        
        // Layer 2: Morphology
        planTypeCode: result.planType.code,
        planTypeName: result.planType.name,
        facadeConfigCode: result.facadeConfig.code,
        facadeConfigName: result.facadeConfig.name,
        heightCode: result.height.code,
        numFloors: document.getElementById('numFloors').value,
        areaCode: result.area.code,
        floorArea: document.getElementById('floorArea').value,
        
        // Layer 3: Envelope
        vintageCode: result.vintage.code,
        vintageName: result.vintage.name,
        buildingYear: document.getElementById('buildingYear').value,
        renovationYear: document.getElementById('renovationYear').value || '',
        insulation: document.querySelector('input[name="insulation"]:checked').value,
        materialCode: result.material.code,
        materialName: result.material.name,
        wallType: document.getElementById('wallType').value,
        renovationCode: result.renovation.code,
        
        // Layer 4: Function
        educationLevelCode: result.educationLevel.code,
        educationLevelName: result.educationLevel.name,
        operationModeCode: result.operationMode.code,
        operationModeName: result.operationMode.name,
        function: document.getElementById('function').value,
        numStudents: document.getElementById('numStudents').value || '',
        operatingDays: document.getElementById('operatingDays').value || '',
        
        // Layer 5: Systems
        systemCode: result.system.code,
        systemName: result.system.name,
        fuelType: document.getElementById('fuelType').value,
        cooling: document.querySelector('input[name="cooling"]:checked').value,
        
        // Renewable Energy
        solarPV: document.querySelector('input[name="solarPV"]').checked ? 'Var' : 'Yok',
        pvCapacity: document.getElementById('pvCapacity').value || '',
        
        // Performance
        performanceScore: result.performance.score,
        performanceRating: result.performance.rating,
        performanceDescription: result.performance.description,
        
        // Parameters
        wallU: result.parameters.wallU,
        windowU: result.parameters.windowU,
        wwr: result.parameters.wwr,
        
        // Contact
        contactName: document.getElementById('contactName').value || '',
        email: document.getElementById('email').value || ''
    };
    
    const submitResult = await submitToGoogleSheets(formData);
    
    if (submitResult.success) {
        showMessage(`✅ Başarılı! Building ID: ${result.buildingID}`, 'success');
        
        setTimeout(() => {
            if (confirm('Form başarıyla gönderildi! Yeni bir bina eklemek ister misiniz?')) {
                document.getElementById('buildingForm').reset();
                updateArchetypeDisplay(null);
                updateProgress();
            }
        }, 2000);
    } else {
        showMessage('⚠️ Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin.', 'error');
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = '🚀 Building ID Oluştur ve Kaydet';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('buildingForm');
    
    // Progress tracking
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    
    // Real-time archetype calculation
    const watchFields = [
        'city', 'morphology', 'numFloors', 'floorArea', 
        'buildingYear', 'renovationYear', 'wallType', 
        'windowType', 'function', 'fuelType'
    ];
    
    watchFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', () => {
                const result = calculateArchetype();
                updateArchetypeDisplay(result);
            });
        }
    });
    
    // Radio buttons
    document.querySelectorAll('input[name="insulation"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const result = calculateArchetype();
            updateArchetypeDisplay(result);
            updateProgress();
        });
    });
    
    document.querySelectorAll('input[name="cooling"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const result = calculateArchetype();
            updateArchetypeDisplay(result);
            updateProgress();
        });
    });
    
    // PV toggle
    const pvCheckbox = document.querySelector('input[name="solarPV"]');
    if (pvCheckbox) {
        pvCheckbox.addEventListener('change', function() {
            const pvGroup = document.getElementById('pvCapacityGroup');
            pvGroup.style.display = this.checked ? 'block' : 'none';
            
            const result = calculateArchetype();
            updateArchetypeDisplay(result);
        });
    }
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Initial progress
    updateProgress();
});
