// ============================================
// SOLAR-PES v5.0 - Main Script
// ============================================

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ============================================
// MODAL & TABS
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

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
}

// ============================================
// CONDITIONAL FIELDS
// ============================================

function setupConditionalFields() {
    // Yalıtım detayları
    document.querySelectorAll('input[name="insulation"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const details = document.getElementById('insulationDetails');
            if (details) {
                details.style.display = this.value === 'Var' ? 'block' : 'none';
            }
        });
    });

    // Lise seçilince yurt seçeneği
    const functionSelect = document.getElementById('function');
    if (functionSelect) {
        functionSelect.addEventListener('change', function() {
            const dormitory = document.getElementById('dormitorySection');
            if (dormitory) {
                const isHighSchool = this.value === 'Lise' || this.value === 'Meslek Lisesi';
                dormitory.style.display = isHighSchool ? 'block' : 'none';
            }
        });
    }

    // PV detayları
    const pvCheckbox = document.querySelector('input[name="solarPV"]');
    if (pvCheckbox) {
        pvCheckbox.addEventListener('change', function() {
            const pvGroup = document.getElementById('pvCapacityGroup');
            if (pvGroup) pvGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// ============================================
// UI UPDATE
// ============================================

function updateArchetypeDisplay(result) {
    if (!result) return;

    document.getElementById('buildingID').textContent = result.buildingID;

    // Climate
    document.getElementById('climateInfo').innerHTML = `
        <p><strong>${result.climate.name}</strong> (${result.climate.code})</p>
        <p>${result.climate.description}</p>
        <p style="font-size:0.75rem;color:#666;">HDD18: ${result.climate.hdd18}°C·gün | CDD18: ${result.climate.cdd18}°C·gün</p>
    `;

    // Morphology
    document.getElementById('morphologyInfo').innerHTML = `
        <p><strong>Plan:</strong> ${result.planType.icon} ${result.planType.name}</p>
        <p><strong>Cephe:</strong> ${result.facadeConfig.name} (WWR: ${result.facadeConfig.wwr})</p>
        <p><strong>Ölçek:</strong> ${result.height.name}, ${result.area.name} (${result.area.description})</p>
    `;

    // Envelope
    const insInfo = result.formData.hasInsulation 
        ? `${result.formData.insulationThickness} cm ${result.formData.insulationMaterial}` 
        : 'Yok';
    document.getElementById('envelopeInfo').innerHTML = `
        <p><strong>Dönem:</strong> ${result.vintage.name} (${result.vintage.period})</p>
        <p><strong>Duvar:</strong> ${result.wallMaterial.name}</p>
        <p><strong>Yalıtım:</strong> ${insInfo}</p>
        <p><strong>Hesaplanan U:</strong> ${result.calculatedWallU.toFixed(2)} W/m²K</p>
    `;

    // Function
    const dormInfo = result.formData.hasDormitory ? ' (Yatılı)' : '';
    document.getElementById('functionInfo').innerHTML = `
        <p><strong>Seviye:</strong> ${result.educationLevel.name}${dormInfo}</p>
        <p><strong>Kullanım:</strong> ${result.operationMode.name}</p>
        <p style="font-size:0.75rem;color:#666;">${result.operationMode.description}</p>
    `;

    // Systems
    const coolingInfo = result.formData.hasCooling ? 'Var' : 'Yok';
    const pvInfo = result.formData.hasPV ? 'Var' : 'Yok';
    document.getElementById('systemsInfo').innerHTML = `
        <p><strong>Isıtma:</strong> ${result.system.name}</p>
        <p><strong>Soğutma:</strong> ${coolingInfo}</p>
        <p><strong>PV:</strong> ${pvInfo}</p>
    `;

    // Performance
    const perf = result.performance;
    document.getElementById('performanceCard').className = `performance-card ${perf.className}`;
    document.getElementById('perfIcon').textContent = perf.icon;
    document.getElementById('perfBadge').textContent = perf.rating;
    document.getElementById('perfBadge').className = `performance-badge ${perf.className}`;
    document.getElementById('perfDesc').textContent = perf.description;
    document.getElementById('perfScore').textContent = perf.score;

    // Parameters
    document.getElementById('wallU').textContent = result.parameters.wallU;
    document.getElementById('windowU').textContent = result.parameters.windowU;
    document.getElementById('wwr').textContent = result.parameters.wwr;
    document.getElementById('annualDays').textContent = result.parameters.annualDays + ' gün';

    // Recommendations
    displayRecommendations(result.recommendations);
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsList');
    if (!container) return;

    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:2rem;">🎉 Tebrikler! Binanız iyi durumda, kritik öneri bulunmuyor.</p>';
        return;
    }

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card priority-${rec.priority}">
            <div class="rec-header">
                <span class="rec-icon">${rec.icon}</span>
                <span class="rec-title">${rec.title}</span>
                <span class="rec-priority">${rec.priority === 'high' ? 'Yüksek Öncelik' : 'Orta Öncelik'}</span>
            </div>
            <div class="rec-body">
                <p class="rec-current">📍 ${rec.current}</p>
                <p class="rec-target">🎯 ${rec.target}</p>
                <p class="rec-action">💡 ${rec.action}</p>
                <p class="rec-benefit">✅ ${rec.benefit}</p>
                ${rec.details && rec.details.length > 0 ? `
                    <div class="rec-details">
                        <ul>${rec.details.map(d => `<li>${d}</li>`).join('')}</ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ============================================
// PROGRESS
// ============================================

function updateProgress() {
    const form = document.getElementById('buildingForm');
    if (!form) return;

    const required = form.querySelectorAll('[required]');
    const unique = new Set();
    let filled = 0;

    required.forEach(f => {
        const key = f.type === 'radio' ? f.name : f.id;
        unique.add(key);
    });

    unique.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.trim()) {
            filled++;
        } else if (document.querySelector(`input[name="${id}"]:checked`)) {
            filled++;
        }
    });

    const progress = unique.size > 0 ? (filled / unique.size) * 100 : 0;
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = progress + '%';
}

// ============================================
// FORM SUBMISSION
// ============================================

async function submitToGoogleSheets(formData) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
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
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Analiz ediliyor...';

    if (typeof calculateArchetype !== 'function') {
        showMessage('❌ Sistem hatası!', 'error');
        btn.disabled = false;
        btn.textContent = '🔍 Analiz Et ve Öneri Al';
        return;
    }

    const result = calculateArchetype();

    if (!result) {
        showMessage('❌ Lütfen tüm zorunlu alanları doldurun!', 'error');
        btn.disabled = false;
        btn.textContent = '🔍 Analiz Et ve Öneri Al';
        return;
    }

    updateArchetypeDisplay(result);

    // Collect form data
    const formData = {
        timestamp: new Date().toISOString(),
        buildingID: result.buildingID,
        buildingName: document.getElementById('buildingName')?.value || '',
        city: document.getElementById('city')?.value || '',
        district: document.getElementById('district')?.value || '',
        // ... add more fields as needed
        performanceScore: result.performance.score,
        performanceRating: result.performance.rating
    };

    await submitToGoogleSheets(formData);
    
    // Switch to current tab and open modal
    switchTab('current');
    openModal();
    showMessage(`✅ Analiz tamamlandı: ${result.buildingID}`, 'success');

    btn.disabled = false;
    btn.textContent = '🔍 Analiz Et ve Öneri Al';
}

function showMessage(text, type) {
    const div = document.getElementById('formMessage');
    if (!div) return;
    div.textContent = text;
    div.className = `form-message ${type}`;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 5000);
}

function resetForm() {
    const form = document.getElementById('buildingForm');
    if (form) {
        form.reset();
        updateProgress();
        document.getElementById('insulationDetails').style.display = 'none';
        document.getElementById('dormitorySection').style.display = 'none';
        document.getElementById('pvCapacityGroup').style.display = 'none';
    }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('buildingForm');
    if (!form) return;

    // Setup
    setupConditionalFields();
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    form.addEventListener('submit', handleFormSubmit);

    // Modal
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('newEntryBtn')?.addEventListener('click', () => {
        closeModal();
        resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Close modal on outside click or ESC
    document.getElementById('archetypeModal')?.addEventListener('click', e => {
        if (e.target.id === 'archetypeModal') closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    updateProgress();
    console.log('SOLAR-PES v5.0 initialized');
});
