// ============================================
// SOLAR-PES v4.1 - Main Script
// Modal Popup + UI Updates
// ============================================

// Google Apps Script URL - UPDATE THIS!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxskHDqe1GolSyiMwTXW4nsWzkKFpSyfkBfEPWRM1d6mpxD7Arl8R6klF8gIZiud23p/exec';

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal() {
    const modal = document.getElementById('archetypeModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('archetypeModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateArchetypeDisplay(result) {
    if (!result) return;

    // Building ID
    const buildingIDEl = document.getElementById('buildingID');
    if (buildingIDEl) buildingIDEl.textContent = result.buildingID;

    // Layer 1: Climate
    const climateHTML = `
        <p><strong>${result.climate.name}</strong> (${result.climate.code})</p>
        <p>${result.climate.description}</p>
        <p style="font-size: 0.75rem; color: #666;">
            ${result.climate.technical}<br>
            HDD18: ${result.climate.hdd18}°C·gün | CDD18: ${result.climate.cdd18}°C·gün
        </p>
    `;
    const climateInfo = document.getElementById('climateInfo');
    if (climateInfo) climateInfo.innerHTML = climateHTML;

    // Layer 2: Morphology
    const morphHTML = `
        <p><strong>Plan:</strong> ${result.planType.icon} ${result.planType.name} (${result.planType.code})</p>
        <p><strong>Façade:</strong> ${result.facadeConfig.name} (${result.facadeConfig.code}) - WWR: ${result.facadeConfig.wwr}</p>
        <p><strong>Height:</strong> ${result.height.name} (${result.height.code}) - ${result.height.description}</p>
        <p><strong>Area:</strong> ${result.area.name} (${result.area.code}) - ${result.area.description}</p>
    `;
    const morphologyInfo = document.getElementById('morphologyInfo');
    if (morphologyInfo) morphologyInfo.innerHTML = morphHTML;

    // Layer 3: Envelope
    const envelopeHTML = `
        <p><strong>Vintage:</strong> ${result.vintage.name} (${result.vintage.code}) - ${result.vintage.period}</p>
        <p>${result.vintage.description}</p>
        <p><strong>Material:</strong> ${result.material.name} (${result.material.code})</p>
        <p><strong>Renovation:</strong> ${result.renovation.name} (${result.renovation.code})</p>
    `;
    const envelopeInfo = document.getElementById('envelopeInfo');
    if (envelopeInfo) envelopeInfo.innerHTML = envelopeHTML;

    // Layer 4: Function
    const functionHTML = `
        <p><strong>Education Level:</strong> ${result.educationLevel.name} (${result.educationLevel.code})</p>
        <p>${result.educationLevel.description}</p>
        <p><strong>Operation Mode:</strong> ${result.operationMode.name} (${result.operationMode.code})</p>
        <p>${result.operationMode.description}</p>
    `;
    const functionInfo = document.getElementById('functionInfo');
    if (functionInfo) functionInfo.innerHTML = functionHTML;

    // Layer 5: Systems
    const systemsHTML = `
        <p><strong>${result.system.name}</strong> (${result.system.code})</p>
        <p>${result.system.description}</p>
        <p style="font-size: 0.75rem; color: #666;">
            Efficiency: ${result.system.efficiency} | CO₂: ${result.system.co2}
        </p>
    `;
    const systemsInfo = document.getElementById('systemsInfo');
    if (systemsInfo) systemsInfo.innerHTML = systemsHTML;

    // Performance Card
    const perf = result.performance;
    const perfCard = document.getElementById('performanceCard');
    if (perfCard) perfCard.className = `performance-card ${perf.className}`;
    
    const perfIcon = document.getElementById('perfIcon');
    if (perfIcon) perfIcon.textContent = perf.icon;
    
    const perfBadge = document.getElementById('perfBadge');
    if (perfBadge) {
        perfBadge.textContent = perf.rating;
        perfBadge.className = `performance-badge ${perf.className}`;
    }
    
    const perfDesc = document.getElementById('perfDesc');
    if (perfDesc) perfDesc.textContent = perf.description;
    
    const perfScore = document.getElementById('perfScore');
    if (perfScore) perfScore.textContent = perf.score;

    // Parameters
    const wallU = document.getElementById('wallU');
    if (wallU) wallU.textContent = result.parameters.wallU;
    
    const windowU = document.getElementById('windowU');
    if (windowU) windowU.textContent = result.parameters.windowU;
    
    const wwr = document.getElementById('wwr');
    if (wwr) wwr.textContent = result.parameters.wwr;
    
    const epwFile = document.getElementById('epwFile');
    if (epwFile) epwFile.textContent = result.climate.epw;
}

// ============================================
// PROGRESS TRACKING
// ============================================

function updateProgress() {
    const form = document.getElementById('buildingForm');
    if (!form) return;
    
    const requiredFields = form.querySelectorAll('[required]');
    const uniqueRequired = new Set();
    let filledCount = 0;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            uniqueRequired.add(field.name);
        } else {
            uniqueRequired.add(field.id);
        }
    });
    
    uniqueRequired.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            if (field.value.trim() !== '') filledCount++;
        } else {
            // Radio group
            if (document.querySelector(`input[name="${id}"]:checked`)) {
                filledCount++;
            }
        }
    });
    
    const totalUnique = uniqueRequired.size;
    const progress = totalUnique > 0 ? (filledCount / totalUnique) * 100 : 0;
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = progress + '%';
}

// ============================================
// FORM SUBMISSION
// ============================================

async function submitToGoogleSheets(formData) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.warn('Google Apps Script URL tanımlanmamış.');
        return { success: true, local: true };
    }
    
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        return { success: true };
    } catch (error) {
        console.error('Google Sheets error:', error);
        return { success: false, error: error.message };
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ İşleniyor...';
    
    if (typeof calculateArchetype !== 'function') {
        showMessage('❌ Sistem hatası: archetype-engine.js yüklenmemiş!', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Building ID Oluştur ve Kaydet';
        return;
    }
    
    const result = calculateArchetype();
    
    if (!result) {
        showMessage('❌ Lütfen tüm zorunlu alanları doldurun!', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Building ID Oluştur ve Kaydet';
        return;
    }
    
    // Update modal content
    updateArchetypeDisplay(result);
    
    // Collect form data
    const formData = {
        timestamp: new Date().toISOString(),
        buildingID: result.buildingID,
        buildingName: document.getElementById('buildingName')?.value || '',
        city: document.getElementById('city')?.value || '',
        district: document.getElementById('district')?.value || '',
        climateCode: result.climate.code,
        climateName: result.climate.name,
        epwFile: result.climate.epw,
        hdd18: result.climate.hdd18,
        cdd18: result.climate.cdd18,
        planTypeCode: result.planType.code,
        planTypeName: result.planType.name,
        facadeConfigCode: result.facadeConfig.code,
        facadeConfigName: result.facadeConfig.name,
        heightCode: result.height.code,
        numFloors: document.getElementById('numFloors')?.value || '',
        areaCode: result.area.code,
        floorArea: document.getElementById('floorArea')?.value || '',
        vintageCode: result.vintage.code,
        vintageName: result.vintage.name,
        buildingYear: document.getElementById('buildingYear')?.value || '',
        renovationYear: document.getElementById('renovationYear')?.value || '',
        insulation: document.querySelector('input[name="insulation"]:checked')?.value || '',
        materialCode: result.material.code,
        materialName: result.material.name,
        wallType: document.getElementById('wallType')?.value || '',
        renovationCode: result.renovation.code,
        educationLevelCode: result.educationLevel.code,
        educationLevelName: result.educationLevel.name,
        operationModeCode: result.operationMode.code,
        operationModeName: result.operationMode.name,
        function: document.getElementById('function')?.value || '',
        numStudents: document.getElementById('numStudents')?.value || '',
        operatingDays: document.getElementById('operatingDays')?.value || '',
        systemCode: result.system.code,
        systemName: result.system.name,
        fuelType: document.getElementById('fuelType')?.value || '',
        cooling: document.querySelector('input[name="cooling"]:checked')?.value || '',
        solarPV: document.querySelector('input[name="solarPV"]')?.checked ? 'Var' : 'Yok',
        pvCapacity: document.getElementById('pvCapacity')?.value || '',
        performanceScore: result.performance.score,
        performanceRating: result.performance.rating,
        performanceDescription: result.performance.description,
        wallU: result.parameters.wallU,
        windowU: result.parameters.windowU,
        wwr: result.parameters.wwr,
        contactName: document.getElementById('contactName')?.value || '',
        email: document.getElementById('email')?.value || ''
    };
    
    // Submit to Google Sheets
    const submitResult = await submitToGoogleSheets(formData);
    
    // Open modal
    openModal();
    
    if (submitResult.success) {
        if (submitResult.local) {
            showMessage(`✅ Building ID: ${result.buildingID}`, 'success');
        } else {
            showMessage(`✅ Kaydedildi: ${result.buildingID}`, 'success');
        }
    } else {
        showMessage('⚠️ Kayıt hatası ama Building ID oluşturuldu.', 'error');
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = '🚀 Building ID Oluştur ve Kaydet';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function resetForm() {
    const form = document.getElementById('buildingForm');
    if (form) {
        form.reset();
        updateProgress();
        const pvGroup = document.getElementById('pvCapacityGroup');
        if (pvGroup) pvGroup.style.display = 'none';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('buildingForm');
    if (!form) {
        console.error('buildingForm bulunamadı!');
        return;
    }
    
    // Progress tracking
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Modal close events
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // New entry button
    const newEntryBtn = document.getElementById('newEntryBtn');
    if (newEntryBtn) {
        newEntryBtn.addEventListener('click', () => {
            closeModal();
            resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Close modal on background click
    const modal = document.getElementById('archetypeModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    // PV toggle
    const pvCheckbox = document.querySelector('input[name="solarPV"]');
    if (pvCheckbox) {
        pvCheckbox.addEventListener('change', function() {
            const pvGroup = document.getElementById('pvCapacityGroup');
            if (pvGroup) pvGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Initial progress
    updateProgress();
    
    console.log('SOLAR-PES v4.1 initialized');
});
