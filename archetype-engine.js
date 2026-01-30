// ============================================
// SOLAR-PES v5.2 - CLUSTER BASED METHODOLOGY
// Building ID (11 segment) + Cluster ID (4 segment)
// ============================================

const ARCHETYPE_DATABASE = {
    
    // LAYER 1: CLIMATE
    climate: {
        "C1": { code: "C1", name: "Bölge 1 (Sıcak)", description: "Soğutma Ağırlıklı", cities: ["Antalya", "Adana", "Mersin", "Hatay"], hdd18: 900, cdd18: 1600, epw: "TUR_Antalya.172390_IWEC.epw", targetWallU: 0.45, targetWindowU: 2.4, recommendedInsulation: 6, hpCapacityMultiplier: 1.0 },
        "C2": { code: "C2", name: "Bölge 2-3 (Ilıman)", description: "Dengeli İklim", cities: ["İstanbul", "İzmir", "Bursa", "Samsun", "Trabzon"], hdd18: 1700, cdd18: 900, epw: "TUR_Istanbul.172900_IWEC.epw", targetWallU: 0.40, targetWindowU: 2.0, recommendedInsulation: 8, hpCapacityMultiplier: 1.2 },
        "C3": { code: "C3", name: "Bölge 4 (Soğuk)", description: "Isıtma Ağırlıklı", cities: ["Ankara", "Konya", "Kayseri", "Sivas", "Malatya"], hdd18: 2600, cdd18: 600, epw: "TUR_Ankara.171280_IWEC.epw", targetWallU: 0.35, targetWindowU: 1.6, recommendedInsulation: 10, hpCapacityMultiplier: 1.5 },
        "C4": { code: "C4", name: "Bölge 5-6 (Çok Soğuk)", description: "Şiddetli Kış", cities: ["Erzurum", "Kars", "Van", "Ağrı"], hdd18: 4200, cdd18: 150, epw: "TUR_Erzurum.170930_IWEC.epw", targetWallU: 0.25, targetWindowU: 1.2, recommendedInsulation: 14, hpCapacityMultiplier: 2.0 }
    },
    
    // LAYER 2: MORPHOLOGY
    morphology: {
        planType: {
            "PL": { code: "PL", name: "Doğrusal / Koridor", icon: "🏬" },
            "PC": { code: "PC", name: "Kompakt / Blok", icon: "🏢" },
            "PU": { code: "PU", name: "Avlulu / U-L-H", icon: "🏛️" }
        },
        facadeConfig: {
            "FW": { code: "FW", name: "Standart Pencereler", wwr: "0.20-0.30" },
            "FR": { code: "FR", name: "Şerit Pencereler", wwr: "0.30-0.50" },
            "FG": { code: "FG", name: "Giydirme Cephe", wwr: "0.50-0.80" }
        },
        scale: {
            height: {
                "HL": { code: "HL", name: "Alçak", description: "1-3 Kat" },
                "HM": { code: "HM", name: "Yüksek", description: "4+ Kat" }
            },
            area: {
                "AS": { code: "AS", name: "Küçük", description: "< 2000 m²" },
                "AM": { code: "AM", name: "Orta", description: "2000-6000 m²" },
                "AL": { code: "AL", name: "Büyük", description: "> 6000 m²" }
            }
        }
    },
    
    // LAYER 3: ENVELOPE
    envelope: {
        vintage: {
            "V1": { code: "V1", name: "Yönetmelik Öncesi", period: "< 2008", wallU: [1.60, 2.20], windowU: [5.0, 6.0] },
            "V2": { code: "V2", name: "TS 825 Standardı", period: "2008-2023", wallU: [0.45, 0.60], windowU: [2.0, 2.8] },
            "V3": { code: "V3", name: "BEP / Yeni", period: "> 2024", wallU: [0.25, 0.35], windowU: [1.0, 1.4] }
        },
        wallMaterial: {
            "WB": { code: "WB", name: "Tuğla Duvar", baseU: 1.80 },
            "WG": { code: "WG", name: "Gazbeton", baseU: 0.90 },
            "WP": { code: "WP", name: "Bims Blok", baseU: 1.20 },
            "WS": { code: "WS", name: "Sandviç Panel", baseU: 0.50 }
        },
        insulation: {
            materials: {
                "EPS": { name: "EPS", lambda: 0.035 },
                "XPS": { name: "XPS", lambda: 0.030 },
                "RW": { name: "Taş Yünü", lambda: 0.038 },
                "PUR": { name: "Poliüretan", lambda: 0.025 }
            }
        },
        renovation: {
            "R0": { code: "R0", name: "Orijinal" },
            "R1": { code: "R1", name: "Yenilenmiş" }
        }
    },
    
    // LAYER 4: FUNCTION
    function: {
        level: {
            "LP": { code: "LP", name: "İlköğretim" },
            "LH": { code: "LH", name: "Ortaöğretim" }
        },
        mode: {
            "MD": { code: "MD", name: "Sadece Gündüz", description: "Hafta içi 08:00-17:00", annualDays: 180, dailyHours: 9 },
            "ME": { code: "ME", name: "Gündüz + Akşam", description: "Hafta içi 08:00-22:00", annualDays: 180, dailyHours: 14 },
            "MW": { code: "MW", name: "Hafta Sonu Dahil", description: "7 gün gündüz", annualDays: 250, dailyHours: 9 },
            "MB": { code: "MB", name: "Yatılı / 24 Saat", description: "Tam zamanlı", annualDays: 280, dailyHours: 24 }
        }
    },
    
    // LAYER 5: SYSTEMS
    systems: {
        "S1": { code: "S1", name: "Fosil Yakıt Kazan", description: "Doğalgaz/Kömür", fuel: "fossil" },
        "S2": { code: "S2", name: "Isı Pompası", description: "HP", fuel: "electric" },
        "S3": { code: "S3", name: "VRF / Split", description: "Elektrikli", fuel: "electric" }
    },
    
    // CLUSTER DEFINITIONS
    cluster: {
        envelope: {
            "E1": { code: "E1", name: "Poor Envelope", color: "#ef4444" },
            "E2": { code: "E2", name: "Medium Envelope", color: "#f59e0b" },
            "E3": { code: "E3", name: "High Envelope", color: "#10b981" }
        },
        system: {
            "S1": { code: "S1", name: "Poor System", color: "#ef4444" },
            "S2": { code: "S2", name: "Medium System", color: "#f59e0b" },
            "S3": { code: "S3", name: "High System", color: "#10b981" }
        },
        scale: {
            "AS": { code: "AS", name: "Small", impactMultiplier: 1.0 },
            "AM": { code: "AM", name: "Medium", impactMultiplier: 1.5 },
            "AL": { code: "AL", name: "Large", impactMultiplier: 3.0 }
        }
    }
};

// BUILDING ID (11 segments)
function generateBuildingID(s) {
    return [s.climate, s.planType, s.facadeConfig, s.height, s.area, s.vintage, s.wallMaterial, s.renovation, s.level, s.mode, s.system].filter(p => p).join('-');
}

// CLUSTER ID (4 segments)
function generateClusterID(climate, envelope, system, scale) {
    return climate + "-" + envelope + "-" + system + "-" + scale;
}

// ENVELOPE STATUS (E1/E2/E3)
function classifyEnvelopeStatus(vintage, renovation, calcU, hasIns, insThick) {
    if (vintage.code === "V3" || calcU < 0.4) return ARCHETYPE_DATABASE.cluster.envelope["E3"];
    if (vintage.code === "V2" || (renovation.code === "R1" && hasIns && insThick >= 5)) return ARCHETYPE_DATABASE.cluster.envelope["E2"];
    if (hasIns && insThick >= 3 && calcU < 1.0) return ARCHETYPE_DATABASE.cluster.envelope["E2"];
    return ARCHETYPE_DATABASE.cluster.envelope["E1"];
}

// SYSTEM STATUS
function classifySystemStatus(system, hasCooling, hasPV) {
    if (system.code === "S2" && hasPV) return ARCHETYPE_DATABASE.cluster.system["S3"];
    if (system.code === "S2" || system.code === "S3") return ARCHETYPE_DATABASE.cluster.system["S2"];
    return ARCHETYPE_DATABASE.cluster.system["S1"];
}

// SCALE FOR CLUSTER
function classifyScaleForCluster(floorArea) {
    var a = parseInt(floorArea) || 3000;
    if (a < 2000) return ARCHETYPE_DATABASE.cluster.scale["AS"];
    if (a <= 6000) return ARCHETYPE_DATABASE.cluster.scale["AM"];
    return ARCHETYPE_DATABASE.cluster.scale["AL"];
}

// PRIORITY
function calculatePriority(env, sys, scale) {
    if (scale.code === "AL" && env.code === "E1") return { level: 1, label: "★ EN ÖNCELİKLİ", reason: "Büyük + Kötü kabuk", action: "Yalıtım", impact: "CO₂: -150+ ton/yıl", cost: "₺50-80/m²", roi: "3-5 yıl" };
    if (scale.code === "AM" && env.code === "E1") return { level: 1, label: "★ ÖNCELİKLİ", reason: "Orta + Kötü kabuk", action: "Yalıtım", impact: "CO₂: -60+ ton/yıl", cost: "₺50-80/m²", roi: "4-6 yıl" };
    if (scale.code === "AL" && sys.code === "S1") return { level: 2, label: "2. ÖNCELİK", reason: "Büyük + Fosil", action: "HP Dönüşümü", impact: "CO₂: -200+ ton/yıl", cost: "₺150-200/m²", roi: "5-8 yıl" };
    if (scale.code === "AM" && sys.code === "S1") return { level: 2, label: "2. ÖNCELİK", reason: "Orta + Fosil", action: "HP Dönüşümü", impact: "CO₂: -80+ ton/yıl", cost: "₺150-200/m²", roi: "5-8 yıl" };
    if (scale.code === "AS" && (env.code === "E1" || sys.code === "S1")) return { level: 3, label: "3. ÖNCELİK", reason: "Küçük ölçek", action: "Bütçeye göre", impact: "CO₂: -20+ ton/yıl", cost: "Değişken", roi: "4-7 yıl" };
    if (env.code === "E3" && sys.code === "S3") return { level: 4, label: "İYİ DURUMDA", reason: "Zaten verimli", action: "İzleme", impact: "Minimal", cost: "-", roi: "-" };
    return { level: 3, label: "ORTA ÖNCELİK", reason: "Kısmi iyileştirme", action: "Planlı", impact: "Orta", cost: "Değişken", roi: "Değişken" };
}

// RETROFIT SCENARIOS
function generateRetrofitScenarios(clusterID, climate, env, sys, scale, area) {
    var scenarios = [{ id: clusterID + "_baseline", name: "Mevcut Durum", type: "baseline", cost: 0, savings: 0, co2Reduction: 0, color: "#ef4444" }];
    var a = parseInt(area) || 3000;
    if (env.code !== "E3") scenarios.push({ id: clusterID + "_envelope", name: "Kabuk İyileştirme", type: "envelope", description: "+" + climate.recommendedInsulation + "cm yalıtım", cost: a * 65, savings: env.code === "E1" ? 35 : 20, co2Reduction: Math.round(a * 0.015), color: "#f59e0b" });
    if (sys.code === "S1") scenarios.push({ id: clusterID + "_hvac", name: "Sistem Dönüşümü", type: "hvac", description: "Isı pompası", cost: a * 180, savings: 40, co2Reduction: Math.round(a * 0.025), color: "#3b82f6" });
    if (env.code !== "E3" || sys.code !== "S3") scenarios.push({ id: clusterID + "_full", name: "Tam Renovasyon", type: "full", description: "Yalıtım + HP + PV", cost: a * 280, savings: 65, co2Reduction: Math.round(a * 0.04), color: "#10b981" });
    return scenarios;
}

// SIMULATION FILES
function getSimulationFiles(clusterID) {
    var b = clusterID.replace(/-/g, '_');
    return { baseline: b + "_baseline.idf", envelope: b + "_envelope.idf", hvac: b + "_hvac.idf", full: b + "_full.idf" };
}

// CLASSIFICATION FUNCTIONS
function classifyClimate(city) {
    for (var code in ARCHETYPE_DATABASE.climate) {
        if (ARCHETYPE_DATABASE.climate[code].cities.indexOf(city) >= 0) return ARCHETYPE_DATABASE.climate[code];
    }
    return ARCHETYPE_DATABASE.climate["C2"];
}

function classifyPlanType(m) {
    var map = { "Tek Blok": "PC", "Doğrusal": "PL", "Avlu": "PU" };
    return ARCHETYPE_DATABASE.morphology.planType[map[m] || "PC"];
}

function classifyFacadeConfig(w) {
    var map = { "Standart": "FW", "Şerit": "FR", "Giydirme": "FG" };
    return ARCHETYPE_DATABASE.morphology.facadeConfig[map[w] || "FW"];
}

function classifyHeight(n) {
    return parseInt(n) <= 3 ? ARCHETYPE_DATABASE.morphology.scale.height["HL"] : ARCHETYPE_DATABASE.morphology.scale.height["HM"];
}

function classifyArea(a) {
    var x = parseInt(a) || 3000;
    if (x < 2000) return ARCHETYPE_DATABASE.morphology.scale.area["AS"];
    if (x <= 6000) return ARCHETYPE_DATABASE.morphology.scale.area["AM"];
    return ARCHETYPE_DATABASE.morphology.scale.area["AL"];
}

function classifyVintage(y, ins, thick) {
    var yr = parseInt(y) || 2000;
    if (yr >= 2024) return ARCHETYPE_DATABASE.envelope.vintage["V3"];
    if (yr >= 2008 || (ins && thick >= 5)) return ARCHETYPE_DATABASE.envelope.vintage["V2"];
    return ARCHETYPE_DATABASE.envelope.vintage["V1"];
}

function classifyWallMaterial(w) {
    var map = { "Tuğla": "WB", "Gazbeton": "WG", "Bims": "WP", "Sandviç Panel": "WS" };
    return ARCHETYPE_DATABASE.envelope.wallMaterial[map[w] || "WB"];
}

function classifyRenovation(ry, by) {
    return (ry && parseInt(ry) > parseInt(by)) ? ARCHETYPE_DATABASE.envelope.renovation["R1"] : ARCHETYPE_DATABASE.envelope.renovation["R0"];
}

function classifyEducationLevel(f) {
    return (f === "Lise" || f === "Meslek Lisesi") ? ARCHETYPE_DATABASE.function.level["LH"] : ARCHETYPE_DATABASE.function.level["LP"];
}

function classifyOperationMode(wd, we, ev, dorm) {
    if (dorm) return ARCHETYPE_DATABASE.function.mode["MB"];
    if (we) return ARCHETYPE_DATABASE.function.mode["MW"];
    if (ev) return ARCHETYPE_DATABASE.function.mode["ME"];
    return ARCHETYPE_DATABASE.function.mode["MD"];
}

function classifySystem(f, cool) {
    if (f === "Isı Pompası") return ARCHETYPE_DATABASE.systems["S2"];
    if (f === "Elektrik" || cool) return ARCHETYPE_DATABASE.systems["S3"];
    return ARCHETYPE_DATABASE.systems["S1"];
}

// WALL U CALCULATION
function calculateWallU(wm, hasIns, thick, mat) {
    if (!hasIns || thick <= 0) return wm.baseU;
    var lambda = (ARCHETYPE_DATABASE.envelope.insulation.materials[mat] || {}).lambda || 0.035;
    return 1 / (1 / wm.baseU + (thick / 100) / lambda);
}

// PERFORMANCE
function evaluatePerformance(v, s, r, pv, om) {
    var sc = 50;
    if (v.code === "V3") sc += 40; else if (v.code === "V2") sc += 25; else if (r.code === "R1") sc += 15;
    if (s.code === "S2") sc += 35; else if (s.code === "S3") sc += 25; else sc -= 10;
    if (pv) sc += 15;
    if (om.code === "MB") sc -= 5;
    sc = Math.max(0, Math.min(100, sc));
    if (sc >= 70) return { score: sc, rating: "YÜKSEK PERFORMANS", description: "Bina verimli", className: "high", icon: "🌟" };
    if (sc >= 45) return { score: sc, rating: "ORTA PERFORMANS", description: "İyileştirme potansiyeli", className: "medium", icon: "⚡" };
    return { score: sc, rating: "DÜŞÜK PERFORMANS", description: "Acil iyileştirme", className: "poor", icon: "⚠️" };
}

// RECOMMENDATIONS
function generateRecommendations(d) {
    var recs = [];
    if (d.calculatedWallU > d.climate.targetWallU) {
        recs.push({ type: "insulation", priority: d.calculatedWallU > 1 ? "high" : "medium", icon: "🧱", title: "Yalıtım İyileştirme", current: "U: " + d.calculatedWallU.toFixed(2), target: "Hedef: " + d.climate.targetWallU, action: d.climate.recommendedInsulation + "cm XPS", benefit: "%" + (d.calculatedWallU > 1.5 ? 45 : 30) + " tasarruf", details: ["HP çarpanı: " + d.climate.hpCapacityMultiplier + "x"] });
    }
    if (d.system.code === "S1") {
        recs.push({ type: "hvac", priority: "high", icon: "🔥", title: "HP Dönüşümü", current: d.system.name, target: "Isı Pompası", action: "Fosil→HP", benefit: "Maliyet %40↓, CO₂ %60↓", details: [] });
    }
    if (!d.hasCooling && (d.climate.code === "C1" || d.climate.code === "C2")) {
        recs.push({ type: "cooling", priority: "medium", icon: "❄️", title: "Soğutma", current: "Yok", target: "VRF/Split", action: "Soğutma ekle", benefit: "Konfor", details: [] });
    }
    if (!d.hasPV) {
        var pv = Math.round(d.floorArea * 0.06);
        recs.push({ type: "pv", priority: "medium", icon: "☀️", title: "PV Sistemi", current: "Yok", target: pv + "kWp", action: "Çatıya PV", benefit: Math.round(pv * 1.4) + "MWh/yıl", details: [] });
    }
    if (d.vintage.code === "V1") {
        recs.push({ type: "windows", priority: "medium", icon: "🪟", title: "Pencere", current: "Eski", target: "U:" + d.climate.targetWindowU, action: "Low-E çift cam", benefit: "%35 ısı kaybı↓", details: [] });
    }
    return recs;
}

// MAIN FUNCTION
function calculateArchetype() {
    var city = document.getElementById('city') ? document.getElementById('city').value : null;
    var morphology = document.getElementById('morphology') ? document.getElementById('morphology').value : null;
    var floorArea = parseInt(document.getElementById('floorArea') ? document.getElementById('floorArea').value : 0) || 0;
    var numFloors = document.getElementById('numFloors') ? document.getElementById('numFloors').value : null;
    var buildingYear = document.getElementById('buildingYear') ? document.getElementById('buildingYear').value : null;
    var renovationYear = document.getElementById('renovationYear') ? document.getElementById('renovationYear').value : null;
    
    var insCheck = document.querySelector('input[name="insulation"]:checked');
    var hasInsulation = insCheck ? insCheck.value === "Var" : false;
    var insulationThickness = parseInt(document.getElementById('insulationThickness') ? document.getElementById('insulationThickness').value : 0) || 0;
    var insulationMaterial = document.getElementById('insulationMaterial') ? document.getElementById('insulationMaterial').value : "EPS";
    
    var wallType = document.getElementById('wallType') ? document.getElementById('wallType').value : null;
    var windowType = document.getElementById('windowType') ? document.getElementById('windowType').value : null;
    var functionType = document.getElementById('function') ? document.getElementById('function').value : null;
    
    var weekdayDays = parseInt(document.getElementById('weekdayDays') ? document.getElementById('weekdayDays').value : 5) || 5;
    var weCheck = document.querySelector('input[name="weekendUse"]:checked');
    var hasWeekend = weCheck ? weCheck.value === "Var" : false;
    var evCheck = document.querySelector('input[name="eveningUse"]:checked');
    var hasEvening = evCheck ? evCheck.value === "Var" : false;
    var dormCheck = document.querySelector('input[name="hasDormitory"]:checked');
    var hasDormitory = dormCheck ? dormCheck.value === "Var" : false;
    
    var fuelType = document.getElementById('fuelType') ? document.getElementById('fuelType').value : null;
    var coolCheck = document.querySelector('input[name="cooling"]:checked');
    var hasCooling = coolCheck ? coolCheck.value === "Var" : false;
    var pvEl = document.querySelector('input[name="solarPV"]');
    var hasPV = pvEl ? pvEl.checked : false;
    
    if (!city || !morphology || !floorArea || !numFloors || !buildingYear || !wallType || !functionType || !fuelType) return null;
    
    var climate = classifyClimate(city);
    var planType = classifyPlanType(morphology);
    var facadeConfig = classifyFacadeConfig(windowType);
    var height = classifyHeight(numFloors);
    var area = classifyArea(floorArea);
    var vintage = classifyVintage(buildingYear, hasInsulation, insulationThickness);
    var wallMaterial = classifyWallMaterial(wallType);
    var renovation = classifyRenovation(renovationYear, buildingYear);
    var educationLevel = classifyEducationLevel(functionType);
    var operationMode = classifyOperationMode(weekdayDays, hasWeekend, hasEvening, hasDormitory);
    var system = classifySystem(fuelType, hasCooling);
    var calculatedWallU = calculateWallU(wallMaterial, hasInsulation, insulationThickness, insulationMaterial);
    
    // CLUSTER
    var envelopeStatus = classifyEnvelopeStatus(vintage, renovation, calculatedWallU, hasInsulation, insulationThickness);
    var systemStatus = classifySystemStatus(system, hasCooling, hasPV);
    var scaleStatus = classifyScaleForCluster(floorArea);
    var clusterID = generateClusterID(climate.code, envelopeStatus.code, systemStatus.code, scaleStatus.code);
    var priority = calculatePriority(envelopeStatus, systemStatus, scaleStatus);
    var retrofitScenarios = generateRetrofitScenarios(clusterID, climate, envelopeStatus, systemStatus, scaleStatus, floorArea);
    var simulationFiles = getSimulationFiles(clusterID);
    
    // BUILDING ID
    var buildingID = generateBuildingID({ climate: climate.code, planType: planType.code, facadeConfig: facadeConfig.code, height: height.code, area: area.code, vintage: vintage.code, wallMaterial: wallMaterial.code, renovation: renovation.code, level: educationLevel.code, mode: operationMode.code, system: system.code });
    
    var performance = evaluatePerformance(vintage, system, renovation, hasPV, operationMode);
    var recommendations = generateRecommendations({ climate: climate, vintage: vintage, system: system, wallMaterial: wallMaterial, hasInsulation: hasInsulation, insulationThickness: insulationThickness, calculatedWallU: calculatedWallU, hasPV: hasPV, hasCooling: hasCooling, floorArea: floorArea });
    var avgWindowU = ((vintage.windowU[0] + vintage.windowU[1]) / 2).toFixed(2);
    
    return {
        buildingID: buildingID,
        clusterID: clusterID,
        cluster: { envelope: envelopeStatus, system: systemStatus, scale: scaleStatus, priority: priority, retrofitScenarios: retrofitScenarios, simulationFiles: simulationFiles },
        climate: climate,
        planType: planType,
        facadeConfig: facadeConfig,
        height: height,
        area: area,
        vintage: vintage,
        wallMaterial: wallMaterial,
        renovation: renovation,
        educationLevel: educationLevel,
        operationMode: operationMode,
        system: system,
        performance: performance,
        recommendations: recommendations,
        calculatedWallU: calculatedWallU,
        parameters: { wallU: calculatedWallU.toFixed(2) + " W/m²K", windowU: avgWindowU + " W/m²K", wwr: facadeConfig.wwr, annualDays: operationMode.annualDays, dailyHours: operationMode.dailyHours },
        formData: { hasInsulation: hasInsulation, insulationThickness: insulationThickness, insulationMaterial: insulationMaterial, hasCooling: hasCooling, hasPV: hasPV, hasDormitory: hasDormitory }
    };
}

window.ARCHETYPE_DATABASE = ARCHETYPE_DATABASE;
window.calculateArchetype = calculateArchetype;
window.generateClusterID = generateClusterID;
