// ============================================
// SOLAR-PES v5.0 - ENHANCED METHODOLOGY
// With Recommendations System
// ============================================

const ARCHETYPE_DATABASE = {
    
    // LAYER 1: CLIMATE (4 zones based on TS 825)
    climate: {
        "C1": {
            code: "C1",
            name: "Bölge 1 (Sıcak)",
            description: "Soğutma Ağırlıklı",
            technical: "Ud=0.45, g≤0.45",
            cities: ["Antalya", "Adana", "Mersin", "Hatay"],
            hdd18: 900,
            cdd18: 1600,
            epw: "TUR_Antalya.172390_IWEC.epw",
            targetWallU: 0.45,
            targetWindowU: 2.4,
            recommendedInsulation: 6
        },
        "C2": {
            code: "C2",
            name: "Bölge 2-3 (Ilıman)",
            description: "Dengeli İklim",
            technical: "Ud=0.40, g≤0.45",
            cities: ["İstanbul", "İzmir", "Bursa", "Samsun", "Trabzon"],
            hdd18: 1700,
            cdd18: 900,
            epw: "TUR_Istanbul.172900_IWEC.epw",
            targetWallU: 0.40,
            targetWindowU: 2.0,
            recommendedInsulation: 8
        },
        "C3": {
            code: "C3",
            name: "Bölge 4 (Soğuk)",
            description: "Isıtma Ağırlıklı",
            technical: "Ud=0.35, g≥0.55",
            cities: ["Ankara", "Konya", "Kayseri", "Sivas", "Malatya"],
            hdd18: 2600,
            cdd18: 600,
            epw: "TUR_Ankara.171280_IWEC.epw",
            targetWallU: 0.35,
            targetWindowU: 1.6,
            recommendedInsulation: 10
        },
        "C4": {
            code: "C4",
            name: "Bölge 5-6 (Çok Soğuk)",
            description: "Şiddetli Kış",
            technical: "Ud=0.25, g≥0.55",
            cities: ["Erzurum", "Kars", "Van", "Ağrı"],
            hdd18: 4200,
            cdd18: 150,
            epw: "TUR_Erzurum.170930_IWEC.epw",
            targetWallU: 0.25,
            targetWindowU: 1.2,
            recommendedInsulation: 14
        }
    },
    
    // LAYER 2: MORPHOLOGY
    morphology: {
        planType: {
            "PL": {
                code: "PL",
                name: "Doğrusal / Koridor",
                description: "Dikdörtgen plan, koridor bazlı",
                icon: "🏬",
                avRatio: "high"
            },
            "PC": {
                code: "PC",
                name: "Kompakt / Blok",
                description: "Kare/derin plan, düşük A/V oranı",
                icon: "🏢",
                avRatio: "low"
            },
            "PU": {
                code: "PU",
                name: "Avlulu / U-L-H",
                description: "U/L/H formları, yüksek A/V oranı",
                icon: "🏛️",
                avRatio: "very-high"
            }
        },
        facadeConfig: {
            "FW": {
                code: "FW",
                name: "Standart Pencereler",
                description: "Tekil pencereler",
                wwr: "0.20-0.30"
            },
            "FR": {
                code: "FR",
                name: "Şerit Pencereler",
                description: "Sürekli bant pencereler",
                wwr: "0.30-0.50"
            },
            "FG": {
                code: "FG",
                name: "Giydirme Cephe",
                description: "Tam cam cephe",
                wwr: "0.50-0.80"
            }
        },
        scale: {
            height: {
                "H-L": { code: "H-L", name: "Alçak", description: "1-3 Kat" },
                "H-M": { code: "H-M", name: "Yüksek", description: "4+ Kat" }
            },
            area: {
                "A-S": { code: "A-S", name: "Küçük", description: "< 2000 m²", range: [0, 2000] },
                "A-M": { code: "A-M", name: "Orta", description: "2000-6000 m²", range: [2000, 6000] },
                "A-L": { code: "A-L", name: "Büyük", description: "> 6000 m²", range: [6000, 999999] }
            }
        }
    },
    
    // LAYER 3: ENVELOPE - Updated with wall materials
    envelope: {
        vintage: {
            "V1": {
                code: "V1",
                name: "Yönetmelik Öncesi",
                period: "< 2008",
                description: "Yalıtımsız (Yüksek U değeri)",
                wallU: [1.60, 2.20],
                windowU: [5.0, 6.0],
                performance: "poor"
            },
            "V2": {
                code: "V2",
                name: "TS 825 Standardı",
                period: "2008-2023",
                description: "Standart yalıtım",
                wallU: [0.45, 0.60],
                windowU: [2.0, 2.8],
                performance: "medium"
            },
            "V3": {
                code: "V3",
                name: "BEP / Yeni",
                period: "> 2024",
                description: "Yüksek performans",
                wallU: [0.25, 0.35],
                windowU: [1.0, 1.4],
                performance: "high"
            }
        },
        wallMaterial: {
            "WB": {
                code: "WB",
                name: "Tuğla Duvar",
                description: "Delikli/Dolu Tuğla",
                baseU: 1.80,
                thermalMass: "high"
            },
            "WG": {
                code: "WG",
                name: "Gazbeton",
                description: "Gaz beton blok",
                baseU: 0.90,
                thermalMass: "medium"
            },
            "WP": {
                code: "WP",
                name: "Bims Blok",
                description: "Bims / Pomza blok",
                baseU: 1.20,
                thermalMass: "medium"
            },
            "WS": {
                code: "WS",
                name: "Sandviç Panel",
                description: "Prefabrik sandviç panel",
                baseU: 0.50,
                thermalMass: "low"
            }
        },
        insulation: {
            materials: {
                "EPS": { name: "EPS (Strafor)", lambda: 0.035 },
                "XPS": { name: "XPS", lambda: 0.030 },
                "RW": { name: "Taş Yünü", lambda: 0.038 },
                "PUR": { name: "Poliüretan", lambda: 0.025 }
            }
        },
        renovation: {
            "R0": { code: "R0", name: "Orijinal", description: "Müdahale yok", improvement: 0 },
            "R1": { code: "R1", name: "Yenilenmiş", description: "Yalıtım eklenmiş", improvement: 40 }
        }
    },
    
    // LAYER 4: FUNCTION - Enhanced with detailed modes
    function: {
        level: {
            "LP": {
                code: "LP",
                name: "İlköğretim",
                description: "İlkokul / Ortaokul",
                occupancyDensity: "high"
            },
            "LH": {
                code: "LH",
                name: "Ortaöğretim",
                description: "Lise / Meslek Lisesi",
                occupancyDensity: "medium"
            }
        },
        mode: {
            "MD": {
                code: "MD",
                name: "Sadece Gündüz",
                description: "Hafta içi 08:00-17:00",
                annualDays: 180,
                dailyHours: 9
            },
            "ME": {
                code: "ME",
                name: "Gündüz + Akşam",
                description: "Hafta içi 08:00-22:00",
                annualDays: 180,
                dailyHours: 14
            },
            "MW": {
                code: "MW",
                name: "Hafta Sonu Dahil",
                description: "7 gün, gündüz saatleri",
                annualDays: 250,
                dailyHours: 9
            },
            "MB": {
                code: "MB",
                name: "Yatılı / 24 Saat",
                description: "Tam zamanlı kullanım",
                annualDays: 280,
                dailyHours: 24
            }
        }
    },
    
    // LAYER 5: SYSTEMS
    systems: {
        "S1": {
            code: "S1",
            name: "Fosil Yakıt Kazan",
            description: "Doğalgaz/Kömür + Radyatör",
            fuel: "fossil",
            efficiency: "medium",
            co2: "high",
            annualCost: "yüksek"
        },
        "S2": {
            code: "S2",
            name: "Isı Pompası",
            description: "Hava/Su Kaynaklı HP",
            fuel: "electric",
            efficiency: "high",
            co2: "low",
            annualCost: "düşük"
        },
        "S3": {
            code: "S3",
            name: "VRF / Split",
            description: "Elektrikli Isıtma-Soğutma",
            fuel: "electric",
            efficiency: "medium-high",
            co2: "medium",
            annualCost: "orta"
        }
    }
};

// ============================================
// BUILDING ID GENERATION
// ============================================

function generateBuildingID(selections) {
    const parts = [
        selections.climate,
        selections.planType,
        selections.facadeConfig,
        selections.height,
        selections.area,
        selections.vintage,
        selections.wallMaterial,
        selections.renovation,
        selections.level,
        selections.mode,
        selections.system
    ];
    return parts.filter(p => p).join('-');
}

// ============================================
// CLASSIFICATION FUNCTIONS
// ============================================

function classifyClimate(city) {
    for (const [code, data] of Object.entries(ARCHETYPE_DATABASE.climate)) {
        if (data.cities.includes(city)) return data;
    }
    return ARCHETYPE_DATABASE.climate["C2"];
}

function classifyPlanType(morphologyInput) {
    const mapping = { "Tek Blok": "PC", "Doğrusal": "PL", "Avlu": "PU" };
    return ARCHETYPE_DATABASE.morphology.planType[mapping[morphologyInput] || "PC"];
}

function classifyFacadeConfig(windowType) {
    const mapping = {
        "Standart": "FW",
        "Şerit": "FR",
        "Giydirme": "FG"
    };
    return ARCHETYPE_DATABASE.morphology.facadeConfig[mapping[windowType] || "FW"];
}

function classifyHeight(numFloors) {
    return parseInt(numFloors) <= 3 
        ? ARCHETYPE_DATABASE.morphology.scale.height["H-L"]
        : ARCHETYPE_DATABASE.morphology.scale.height["H-M"];
}

function classifyArea(floorArea) {
    const area = parseInt(floorArea) || 3000;
    if (area < 2000) return ARCHETYPE_DATABASE.morphology.scale.area["A-S"];
    if (area <= 6000) return ARCHETYPE_DATABASE.morphology.scale.area["A-M"];
    return ARCHETYPE_DATABASE.morphology.scale.area["A-L"];
}

function classifyVintage(year, hasInsulation, insulationThickness) {
    const yearNum = parseInt(year) || 2000;
    
    if (yearNum >= 2024) return ARCHETYPE_DATABASE.envelope.vintage["V3"];
    if (yearNum >= 2008 || (hasInsulation && insulationThickness >= 5)) {
        return ARCHETYPE_DATABASE.envelope.vintage["V2"];
    }
    return ARCHETYPE_DATABASE.envelope.vintage["V1"];
}

function classifyWallMaterial(wallType) {
    const mapping = {
        "Tuğla": "WB",
        "Gazbeton": "WG",
        "Bims": "WP",
        "Sandviç Panel": "WS"
    };
    return ARCHETYPE_DATABASE.envelope.wallMaterial[mapping[wallType] || "WB"];
}

function classifyRenovation(renovationYear, buildingYear) {
    if (renovationYear && parseInt(renovationYear) > parseInt(buildingYear)) {
        return ARCHETYPE_DATABASE.envelope.renovation["R1"];
    }
    return ARCHETYPE_DATABASE.envelope.renovation["R0"];
}

function classifyEducationLevel(functionType) {
    if (functionType === "Lise" || functionType === "Meslek Lisesi") {
        return ARCHETYPE_DATABASE.function.level["LH"];
    }
    return ARCHETYPE_DATABASE.function.level["LP"];
}

function classifyOperationMode(weekdayDays, hasWeekend, hasEvening, hasDormitory) {
    if (hasDormitory) return ARCHETYPE_DATABASE.function.mode["MB"];
    if (hasWeekend) return ARCHETYPE_DATABASE.function.mode["MW"];
    if (hasEvening) return ARCHETYPE_DATABASE.function.mode["ME"];
    return ARCHETYPE_DATABASE.function.mode["MD"];
}

function classifySystem(fuelType, hasCooling) {
    if (fuelType === "Isı Pompası") return ARCHETYPE_DATABASE.systems["S2"];
    if (fuelType === "Elektrik" || hasCooling) return ARCHETYPE_DATABASE.systems["S3"];
    return ARCHETYPE_DATABASE.systems["S1"];
}

// ============================================
// U-VALUE CALCULATION
// ============================================

function calculateWallU(wallMaterial, hasInsulation, insulationThickness, insulationMaterial) {
    const wall = ARCHETYPE_DATABASE.envelope.wallMaterial[wallMaterial.code];
    let baseU = wall.baseU;
    
    if (hasInsulation && insulationThickness > 0) {
        const insData = ARCHETYPE_DATABASE.envelope.insulation.materials[insulationMaterial] 
            || ARCHETYPE_DATABASE.envelope.insulation.materials["EPS"];
        const insulationR = (insulationThickness / 100) / insData.lambda;
        const baseR = 1 / baseU;
        const totalR = baseR + insulationR;
        return 1 / totalR;
    }
    
    return baseU;
}

// ============================================
// PERFORMANCE EVALUATION
// ============================================

function evaluatePerformance(vintage, system, renovation, hasPV, operationMode) {
    let score = 0;
    
    // Vintage (40 points)
    if (vintage.code === "V3") score += 40;
    else if (vintage.code === "V2") score += 25;
    else score += 10;
    
    // System (30 points)
    if (system.code === "S2") score += 30;
    else if (system.code === "S3") score += 20;
    else score += 10;
    
    // Renovation (15 points)
    if (renovation.code === "R1") score += 15;
    
    // PV (15 points)
    if (hasPV) score += 15;
    
    let rating, description, icon, className;
    
    if (score >= 70) {
        rating = "YÜKSEK PERFORMANS";
        description = "Modern standartlarda, düşük enerji tüketimi";
        icon = "🌟";
        className = "high";
    } else if (score >= 45) {
        rating = "ORTA PERFORMANS";
        description = "Orta seviye, iyileştirme potansiyeli var";
        icon = "⚡";
        className = "medium";
    } else {
        rating = "DÜŞÜK PERFORMANS";
        description = "Düşük performans, acil yenileme gerekli";
        icon = "⚠️";
        className = "poor";
    }
    
    return { score, rating, description, icon, className };
}

// ============================================
// RECOMMENDATIONS GENERATOR
// ============================================

function generateRecommendations(data) {
    const recommendations = [];
    const climate = data.climate;
    const currentWallU = data.calculatedWallU;
    const hasInsulation = data.hasInsulation;
    const insulationThickness = data.insulationThickness || 0;
    const system = data.system;
    const hasPV = data.hasPV;
    const floorArea = data.floorArea;
    const hasCooling = data.hasCooling;
    
    // 1. INSULATION RECOMMENDATION
    if (!hasInsulation || currentWallU > climate.targetWallU) {
        const targetU = climate.targetWallU;
        const neededInsulation = climate.recommendedInsulation;
        
        let savingsPercent = 0;
        if (currentWallU > 1.5) savingsPercent = 45;
        else if (currentWallU > 0.8) savingsPercent = 30;
        else if (currentWallU > 0.5) savingsPercent = 15;
        
        recommendations.push({
            type: "insulation",
            priority: "high",
            icon: "🧱",
            title: "Dış Cephe Yalıtımı",
            current: `Mevcut U değeri: ${currentWallU.toFixed(2)} W/m²K`,
            target: `Hedef U değeri: ${targetU} W/m²K`,
            action: `${neededInsulation} cm EPS/XPS yalıtım uygulanmalı`,
            benefit: `Isıtma enerjisinde yaklaşık %${savingsPercent} tasarruf`,
            details: [
                `${climate.name} için TS 825 gereksinimi: U ≤ ${targetU} W/m²K`,
                `Önerilen yalıtım kalınlığı: ${neededInsulation} cm`,
                `Tercih edilen malzeme: XPS veya Taş Yünü (yangın güvenliği için)`
            ]
        });
    }
    
    // 2. HEATING SYSTEM RECOMMENDATION
    if (system.code === "S1") {
        const estimatedSavings = hasCooling ? 50 : 35;
        
        recommendations.push({
            type: "hvac",
            priority: "high",
            icon: "🔥",
            title: "Isıtma Sistemi Dönüşümü",
            current: `Mevcut sistem: ${system.name}`,
            target: "Hedef sistem: Isı Pompası",
            action: "Doğalgaz kazanından ısı pompasına geçiş yapılmalı",
            benefit: `Enerji maliyetinde %${estimatedSavings} azalma, CO₂ emisyonunda %60+ düşüş`,
            details: [
                "Elektrifikasyon ile karbon ayak izi önemli ölçüde azalır",
                "Isı pompası hem ısıtma hem soğutma sağlar",
                "Yıllık işletme maliyeti doğalgazın yarısına düşer",
                "Devlet teşviklerinden yararlanılabilir"
            ]
        });
    }
    
    // 3. COOLING RECOMMENDATION
    if (!hasCooling && (climate.code === "C1" || climate.code === "C2")) {
        recommendations.push({
            type: "cooling",
            priority: "medium",
            icon: "❄️",
            title: "Soğutma Sistemi",
            current: "Mevcut: Soğutma yok",
            target: "Hedef: Verimli soğutma sistemi",
            action: `${climate.name}'de soğutma ihtiyacı yüksek`,
            benefit: "Öğrenci ve personel konforu, verimlilik artışı",
            details: [
                `CDD18: ${climate.cdd18}°C·gün - soğutma yükü önemli`,
                "VRF veya ısı pompası sistemi önerilir",
                "Isıtma dönüşümü ile birlikte planlanabilir"
            ]
        });
    }
    
    // 4. PV RECOMMENDATION
    if (!hasPV) {
        const roofArea = Math.round(floorArea * 0.4); // Tahmini çatı alanı
        const pvCapacity = Math.round(roofArea * 0.15); // 150 W/m² panel
        const annualProduction = pvCapacity * 1400; // kWh/yıl (Türkiye ortalaması)
        
        recommendations.push({
            type: "renewable",
            priority: "medium",
            icon: "☀️",
            title: "Güneş Enerjisi (PV) Sistemi",
            current: "Mevcut: PV yok",
            target: `Potansiyel kapasite: ${pvCapacity} kWp`,
            action: "Çatıya güneş paneli kurulumu yapılmalı",
            benefit: `Yıllık ~${Math.round(annualProduction/1000)} MWh temiz enerji üretimi`,
            details: [
                `Tahmini kullanılabilir çatı alanı: ${roofArea} m²`,
                `Önerilen sistem kapasitesi: ${pvCapacity} kWp`,
                `Yıllık üretim tahmini: ${annualProduction.toLocaleString()} kWh`,
                "Fazla üretim şebekeye satılabilir"
            ]
        });
    }
    
    // 5. WINDOW RECOMMENDATION (if old building)
    if (data.vintage.code === "V1") {
        recommendations.push({
            type: "windows",
            priority: "medium",
            icon: "🪟",
            title: "Pencere Yenileme",
            current: `Mevcut U değeri: ~${data.vintage.windowU[0]}-${data.vintage.windowU[1]} W/m²K`,
            target: `Hedef U değeri: ${climate.targetWindowU} W/m²K`,
            action: "Çift cam veya ısı camlı PVC pencere",
            benefit: "Isı kaybında %30-40 azalma, konfor artışı",
            details: [
                "Low-E kaplamalı çift cam önerilir",
                "Pencere kasalarının da yalıtımı önemli",
                "Hava sızıntıları önlenir"
            ]
        });
    }
    
    return recommendations;
}

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

function calculateArchetype() {
    // Get form values
    const city = document.getElementById('city')?.value;
    const morphology = document.getElementById('morphology')?.value;
    const floorArea = parseInt(document.getElementById('floorArea')?.value) || 0;
    const numFloors = document.getElementById('numFloors')?.value;
    const buildingYear = document.getElementById('buildingYear')?.value;
    const renovationYear = document.getElementById('renovationYear')?.value;
    
    const hasInsulation = document.querySelector('input[name="insulation"]:checked')?.value === "Var";
    const insulationThickness = parseInt(document.getElementById('insulationThickness')?.value) || 0;
    const insulationMaterial = document.getElementById('insulationMaterial')?.value || "EPS";
    
    const wallType = document.getElementById('wallType')?.value;
    const windowType = document.getElementById('windowType')?.value;
    const functionType = document.getElementById('function')?.value;
    
    const weekdayDays = parseInt(document.getElementById('weekdayDays')?.value) || 5;
    const hasWeekend = document.querySelector('input[name="weekendUse"]:checked')?.value === "Var";
    const hasEvening = document.querySelector('input[name="eveningUse"]:checked')?.value === "Var";
    const hasDormitory = document.querySelector('input[name="hasDormitory"]:checked')?.value === "Var";
    
    const fuelType = document.getElementById('fuelType')?.value;
    const hasCooling = document.querySelector('input[name="cooling"]:checked')?.value === "Var";
    const hasPV = document.querySelector('input[name="solarPV"]')?.checked;
    
    // Check required fields
    if (!city || !morphology || !floorArea || !numFloors || !buildingYear || 
        !wallType || !functionType || !fuelType) {
        return null;
    }
    
    // Classify all layers
    const climate = classifyClimate(city);
    const planType = classifyPlanType(morphology);
    const facadeConfig = classifyFacadeConfig(windowType);
    const height = classifyHeight(numFloors);
    const area = classifyArea(floorArea);
    const vintage = classifyVintage(buildingYear, hasInsulation, insulationThickness);
    const wallMaterial = classifyWallMaterial(wallType);
    const renovation = classifyRenovation(renovationYear, buildingYear);
    const educationLevel = classifyEducationLevel(functionType);
    const operationMode = classifyOperationMode(weekdayDays, hasWeekend, hasEvening, hasDormitory);
    const system = classifySystem(fuelType, hasCooling);
    
    // Calculate actual wall U-value
    const calculatedWallU = calculateWallU(wallMaterial, hasInsulation, insulationThickness, insulationMaterial);
    
    // Generate Building ID
    const buildingID = generateBuildingID({
        climate: climate.code,
        planType: planType.code,
        facadeConfig: facadeConfig.code,
        height: height.code,
        area: area.code,
        vintage: vintage.code,
        wallMaterial: wallMaterial.code,
        renovation: renovation.code,
        level: educationLevel.code,
        mode: operationMode.code,
        system: system.code
    });
    
    // Evaluate performance
    const performance = evaluatePerformance(vintage, system, renovation, hasPV, operationMode);
    
    // Generate recommendations
    const recommendations = generateRecommendations({
        climate,
        vintage,
        system,
        wallMaterial,
        hasInsulation,
        insulationThickness,
        calculatedWallU,
        hasPV,
        hasCooling,
        floorArea
    });
    
    // Calculate parameters
    const avgWindowU = ((vintage.windowU[0] + vintage.windowU[1]) / 2).toFixed(2);
    
    return {
        buildingID,
        climate,
        planType,
        facadeConfig,
        height,
        area,
        vintage,
        wallMaterial,
        renovation,
        educationLevel,
        operationMode,
        system,
        performance,
        recommendations,
        calculatedWallU,
        parameters: {
            wallU: `${calculatedWallU.toFixed(2)} W/m²K`,
            windowU: `${avgWindowU} W/m²K`,
            wwr: facadeConfig.wwr,
            annualDays: operationMode.annualDays,
            dailyHours: operationMode.dailyHours
        },
        formData: {
            hasInsulation,
            insulationThickness,
            insulationMaterial,
            hasCooling,
            hasPV,
            hasDormitory
        }
    };
}

// Export
window.ARCHETYPE_DATABASE = ARCHETYPE_DATABASE;
window.calculateArchetype = calculateArchetype;
