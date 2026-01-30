// ============================================
// SOLAR-PES v5.1 - Main Script
// TÜM form verileri + Email bildirimi
// ============================================

// ⚠️ BURAYA GOOGLE APPS SCRIPT URL'İNİ YAPIŞTIR
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8OjZAN1g2EI00VDJyB42uf3VlizzPGvhJSnuSkMNAlCHGVl1Hge9A2glx0e86fIOy/exec';

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
    
    // ============================================
    // CLUSTER DISPLAY
    // ============================================
    const clusterContainer = document.getElementById('clusterInfo');
    if (clusterContainer && result.cluster) {
        const c = result.cluster;
        clusterContainer.innerHTML = `
            <div class="cluster-card">
                <div class="cluster-header">
                    <span class="cluster-label">CLUSTER ID</span>
                    <span class="cluster-id">${c.id}</span>
                </div>
                
                <div class="cluster-breakdown">
                    <div class="cluster-item" style="border-color: ${c.envelope.color}">
                        <span class="cluster-code" style="background: ${c.envelope.color}">${c.envelope.code}</span>
                        <span class="cluster-name">${c.envelope.name}</span>
                    </div>
                    <div class="cluster-item" style="border-color: ${c.system.color}">
                        <span class="cluster-code" style="background: ${c.system.color}">${c.system.code}</span>
                        <span class="cluster-name">${c.system.name}</span>
                    </div>
                    <div class="cluster-item" style="border-color: ${c.scale.color}">
                        <span class="cluster-code" style="background: ${c.scale.color}">${c.scale.code}</span>
                        <span class="cluster-name">${c.scale.name}</span>
                    </div>
                </div>
                
                <div class="cluster-priority" style="background: ${c.priority.color}15; border-color: ${c.priority.color}">
                    <span class="priority-level">Öncelik: ${c.priority.name}</span>
                    <span class="priority-action">${c.priority.action}</span>
                </div>
            </div>
        `;
    }
    
    // ============================================
    // RETROFIT SCENARIOS DISPLAY
    // ============================================
    const scenariosContainer = document.getElementById('retrofitScenarios');
    if (scenariosContainer && result.cluster?.retrofitScenarios) {
        const scenarios = result.cluster.retrofitScenarios;
        scenariosContainer.innerHTML = `
            <h4 style="margin-bottom: 12px; color: #1b4332;">🛤️ Retrofit Senaryoları</h4>
            <div class="scenarios-grid">
                ${scenarios.map(s => `
                    <div class="scenario-card" style="border-color: ${s.color}">
                        <div class="scenario-header" style="background: ${s.color}">
                            <span>${s.name}</span>
                        </div>
                        <div class="scenario-body">
                            <div class="scenario-cluster">${s.clusterID}</div>
                            ${s.cost > 0 ? `
                                <div class="scenario-stats">
                                    <div class="stat">
                                        <span class="stat-label">Maliyet</span>
                                        <span class="stat-value">${s.costDisplay}</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">Tasarruf</span>
                                        <span class="stat-value">%${s.savings}</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">CO₂</span>
                                        <span class="stat-value">-${s.co2Reduction}t/yıl</span>
                                    </div>
                                </div>
                                <div class="scenario-action">${s.action || ''}</div>
                            ` : `
                                <div class="scenario-current">Mevcut durum</div>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // ============================================
    // SIMULATION FILES DISPLAY
    // ============================================
    const simFilesContainer = document.getElementById('simulationFiles');
    if (simFilesContainer && result.cluster?.simulationFiles) {
        const files = result.cluster.simulationFiles;
        simFilesContainer.innerHTML = `
            <h4 style="margin-bottom: 12px; color: #1b4332;">📚 Simülasyon Dosyaları</h4>
            <div class="sim-files-list">
                ${files.map(f => `
                    <div class="sim-file-item">
                        <span class="file-icon">📄</span>
                        <span class="file-name">${f.name}</span>
                        <span class="file-tag" style="background: ${f.color}">${f.type}</span>
                    </div>
                `).join('')}
            </div>
        `;

    }

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
// FORM DATA COLLECTION - TÜM ALANLAR
// ============================================

function collectAllFormData(result) {
    // Form elemanlarından değerleri al
    const getValue = (id) => document.getElementById(id)?.value || '';
    const getRadio = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';
    const getCheckbox = (name) => document.querySelector(`input[name="${name}"]`)?.checked ? 'Evet' : 'Hayır';

    // TÜM VERİLERİ TOPLA
    const formData = {
        // ========== TIMESTAMP & ID ==========
        timestamp: new Date().toISOString(),
        buildingID: result.buildingID,
        
        // ========== GENEL BİLGİLER ==========
        buildingName: getValue('buildingName'),
        city: getValue('city'),
        district: getValue('district'),
        
        // ========== LAYER 1: CLIMATE ==========
        climateCode: result.climate.code,
        climateName: result.climate.name,
        climateDescription: result.climate.description,
        epwFile: result.climate.epw,
        hdd18: result.climate.hdd18,
        cdd18: result.climate.cdd18,
        targetWallU: result.climate.targetWallU,
        targetWindowU: result.climate.targetWindowU,
        recommendedInsulation: result.climate.recommendedInsulation,
        
        // ========== LAYER 2: MORPHOLOGY ==========
        planTypeCode: result.planType.code,
        planTypeName: result.planType.name,
        facadeConfigCode: result.facadeConfig.code,
        facadeConfigName: result.facadeConfig.name,
        heightCode: result.height.code,
        heightName: result.height.name,
        numFloors: getValue('numFloors'),
        areaCode: result.area.code,
        areaName: result.area.name,
        floorArea: getValue('floorArea'),
        morphology: getValue('morphology'),
        windowType: getValue('windowType'),
        
        // ========== LAYER 3: ENVELOPE ==========
        vintageCode: result.vintage.code,
        vintageName: result.vintage.name,
        vintagePeriod: result.vintage.period,
        buildingYear: getValue('buildingYear'),
        renovationYear: getValue('renovationYear'),
        
        // Duvar malzemesi
        wallMaterialCode: result.wallMaterial.code,
        wallMaterialName: result.wallMaterial.name,
        wallType: getValue('wallType'),
        
        // Yalıtım
        insulation: getRadio('insulation'),
        insulationThickness: getValue('insulationThickness'),
        insulationMaterial: getValue('insulationMaterial'),
        calculatedWallU: result.calculatedWallU ? result.calculatedWallU.toFixed(2) : '',
        
        // Renovasyon
        renovationCode: result.renovation.code,
        renovationName: result.renovation.name,
        
        // ========== LAYER 4: FUNCTION ==========
        educationLevelCode: result.educationLevel.code,
        educationLevelName: result.educationLevel.name,
        functionType: getValue('function'),
        numStudents: getValue('numStudents'),
        
        // Yurt bilgisi
        hasDormitory: getRadio('hasDormitory'),
        
        // Kullanım programı
        operationModeCode: result.operationMode.code,
        operationModeName: result.operationMode.name,
        operationModeDescription: result.operationMode.description,
        weekdayDays: getValue('weekdayDays'),
        weekendUse: getRadio('weekendUse'),
        eveningUse: getRadio('eveningUse'),
        annualDays: result.operationMode.annualDays,
        dailyHours: result.operationMode.dailyHours,
        
        // ========== LAYER 5: SYSTEMS ==========
        systemCode: result.system.code,
        systemName: result.system.name,
        systemDescription: result.system.description,
        fuelType: getValue('fuelType'),
        cooling: getRadio('cooling'),
        
        // PV
        solarPV: getCheckbox('solarPV'),
        pvCapacity: getValue('pvCapacity'),
        
        // ========== PERFORMANCE ==========
        performanceScore: result.performance.score,
        performanceRating: result.performance.rating,
        performanceDescription: result.performance.description,
        performanceClass: result.performance.className,
        
        // ========== PARAMETERS ==========
        wallU: result.parameters.wallU,
        windowU: result.parameters.windowU,
        wwr: result.parameters.wwr,
        
        // ========== İLETİŞİM ==========
        contactName: getValue('contactName'),
        email: getValue('email'),
        
        // ========== RECOMMENDATIONS SUMMARY ==========
        recommendationsCount: result.recommendations ? result.recommendations.length : 0,
        recommendationsSummary: result.recommendations 
            ? result.recommendations.map(r => `${r.title}: ${r.action}`).join(' | ')
            : '',
        
        // ========== CLUSTER DATA ==========
        clusterID: result.clusterID || '',
        envelopeCluster: result.cluster?.envelope?.code || '',
        envelopeClusterName: result.cluster?.envelope?.name || '',
        systemCluster: result.cluster?.system?.code || '',
        systemClusterName: result.cluster?.system?.name || '',
        scaleCluster: result.cluster?.scale?.code || '',
        scaleClusterName: result.cluster?.scale?.name || '',
        
        // Priority
        clusterPriorityLevel: result.cluster?.priority?.level || '',
        clusterPriorityLabel: result.cluster?.priority?.label || '',
        clusterPriorityReason: result.cluster?.priority?.reason || '',
        clusterPriorityAction: result.cluster?.priority?.action || '',
        clusterPriorityImpact: result.cluster?.priority?.impact || '',
        clusterPriorityCost: result.cluster?.priority?.cost || '',
        clusterPriorityROI: result.cluster?.priority?.roi || '',
        
        // Retrofit scenarios summary
        retrofitScenariosCount: result.cluster?.retrofitScenarios?.length || 0,
        retrofitScenariosSummary: result.cluster?.retrofitScenarios
            ? result.cluster.retrofitScenarios.filter(s => s.type !== 'baseline')
                .map(s => `${s.name}: ₺${(s.cost || 0).toLocaleString()}, %${s.savings} tasarruf, -${s.co2Reduction}t CO₂`)
                .join(' | ')
            : '',
        
        // Simulation files
        simFileBaseline: result.cluster?.simulationFiles?.baseline || '',
        simFileFull: result.cluster?.simulationFiles?.full || ''
    };
    
    return formData;
}

// ============================================
// FORM SUBMISSION
// ============================================

async function submitToGoogleSheets(formData) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.log('Google Script URL ayarlanmamış, veriler sadece lokalde');
        console.log('Gönderilecek veri:', formData);
        return { success: true, local: true };
    }
    
    try {
        console.log('Google Sheets\'e gönderiliyor...', formData);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Gönderim başarılı');
        return { success: true };
    } catch (e) {
        console.error('Google Sheets gönderim hatası:', e);
        return { success: false, error: e.message };
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Analiz ediliyor...';

    if (typeof calculateArchetype !== 'function') {
        showMessage('❌ Sistem hatası! archetype-engine.js yüklenemedi.', 'error');
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

    // UI'ı güncelle
    updateArchetypeDisplay(result);

    // TÜM form verilerini topla
    const formData = collectAllFormData(result);
    
    // Google Sheets'e gönder
    btn.textContent = '📤 Kaydediliyor...';
    const submitResult = await submitToGoogleSheets(formData);
    
    if (submitResult.local) {
        console.log('Lokal mod - veriler konsola yazıldı');
    }
    
    // Modal aç ve mesaj göster
    switchTab('current');
    openModal();
    
    if (submitResult.success) {
        showMessage(`✅ Analiz tamamlandı ve kaydedildi: ${result.buildingID}`, 'success');
    } else {
        showMessage(`⚠️ Analiz tamamlandı ama kaydetme başarısız: ${submitResult.error}`, 'error');
    }

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
        
        const insulationDetails = document.getElementById('insulationDetails');
        const dormitorySection = document.getElementById('dormitorySection');
        const pvCapacityGroup = document.getElementById('pvCapacityGroup');
        
        if (insulationDetails) insulationDetails.style.display = 'none';
        if (dormitorySection) dormitorySection.style.display = 'none';
        if (pvCapacityGroup) pvCapacityGroup.style.display = 'none';
    }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('buildingForm');
    if (!form) {
        console.error('Form bulunamadı!');
        return;
    }

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
    console.log('SOLAR-PES v5.1 initialized - Tüm veriler Google Sheets\'e gönderilecek');
});
