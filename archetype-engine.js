// ============================================
// SOLAR-PES v4.0 - NEW METHODOLOGY
// Based on 5-Layer Archetype Classification
// Excel-driven Building ID System
// ============================================

// Database from Excel: Yeni_Yapı_ve_Excel_Tablosu_Güncellemesi.xlsx
const ARCHETYPE_DATABASE = {
    
    // LAYER 1: CLIMATE (4 zones based on TS 825)
    climate: {
        "C1": {
            code: "C1",
            name: "Zone 1 (Hot/Temperate)",
            description: "Cooling Dominated",
            technical: "Ud=0.45, g≤0.45",
            cities: ["Antalya", "Adana", "Mersin", "Hatay"],
            hdd18: 900,
            cdd18: 1600,
            epw: "TUR_Antalya.172390_IWEC.epw"
        },
        "C2": {
            code: "C2",
            name: "Zone 2 & 3 (Moderate)",
            description: "Moderate Climate",
            technical: "Ud=0.40, g≤0.45",
            cities: ["İstanbul", "İzmir", "Bursa", "Samsun", "Trabzon"],
            hdd18: 1700,
            cdd18: 900,
            epw: "TUR_Istanbul.172900_IWEC.epw"
        },
        "C3": {
            code: "C3",
            name: "Zone 4 (Cold)",
            description: "Heating Dominated",
            technical: "Ud=0.35, g≥0.55",
            cities: ["Ankara", "Konya", "Kayseri", "Sivas", "Malatya"],
            hdd18: 2600,
            cdd18: 600,
            epw: "TUR_Ankara.171280_IWEC.epw"
        },
        "C4": {
            code: "C4",
            name: "Zone 5 & 6 (Severe Cold)",
            description: "Arctic / Severe",
            technical: "Ud=0.25, g≥0.55",
            cities: ["Erzurum", "Kars", "Van", "Ağrı"],
            hdd18: 4200,
            cdd18: 150,
            epw: "TUR_Erzurum.170930_IWEC.epw"
        }
    },
    
    // LAYER 2: MORPHOLOGY (Plan + Façade + Scale)
    morphology: {
        planType: {
            "PL": {
                code: "PL",
                name: "Linear / Bar",
                description: "Rectangular plan, corridor based",
                icon: "🏬",
                avRatio: "high",
                characteristics: "Doğrusal koridor tipi, yüksek yüzey/hacim oranı"
            },
            "PC": {
                code: "PC",
                name: "Compact / Block",
                description: "Square/Deep plan, low A/V ratio",
                icon: "🏢",
                avRatio: "low",
                characteristics: "Kompakt blok, düşük yüzey/hacim oranı"
            },
            "PU": {
                code: "PU",
                name: "Courtyard / Articulated",
                description: "U/L/H shapes, high A/V ratio",
                icon: "🏛️",
                avRatio: "very-high",
                characteristics: "Avlulu U/L/H formu, çok yüksek yüzey/hacim oranı"
            }
        },
        facadeConfig: {
            "FW": {
                code: "FW",
                name: "Punched Windows",
                description: "Individual windows (Standard)",
                wwr: "0.20-0.30",
                glazingRatio: "low"
            },
            "FR": {
                code: "FR",
                name: "Ribbon Windows",
                description: "Continuous band windows",
                wwr: "0.30-0.50",
                glazingRatio: "medium"
            },
            "FG": {
                code: "FG",
                name: "Curtain Wall",
                description: "Fully glazed façade",
                wwr: "0.50-0.80",
                glazingRatio: "high"
            }
        },
        scale: {
            height: {
                "H-L": {
                    code: "H-L",
                    name: "Low-Rise",
                    description: "1-3 Kat",
                    floors: "1-3",
                    note: "Yüksek çatı/döşeme oranı"
                },
                "H-M": {
                    code: "H-M",
                    name: "Mid-Rise",
                    description: "4+ Kat",
                    floors: "4+",
                    note: "Düşük çatı/döşeme oranı"
                }
            },
            area: {
                "A-S": {
                    code: "A-S",
                    name: "Small",
                    description: "< 2000 m²",
                    range: [0, 2000],
                    note: "Yüksek birim maliyet"
                },
                "A-M": {
                    code: "A-M",
                    name: "Medium",
                    description: "2000-6000 m²",
                    range: [2000, 6000],
                    note: "Standart Okul"
                },
                "A-L": {
                    code: "A-L",
                    name: "Large",
                    description: "> 6000 m²",
                    range: [6000, 999999],
                    note: "Kampüs/Kompleks"
                }
            }
        }
    },
    
    // LAYER 3: ENVELOPE (Vintage + Material + Renovation)
    envelope: {
        vintage: {
            "V1": {
                code: "V1",
                name: "Pre-Regulation",
                period: "< 2008",
                description: "No insulation (Poor U-values)",
                wallU: [1.60, 2.20],
                windowU: [5.0, 6.0],
                performance: "poor"
            },
            "V2": {
                code: "V2",
                name: "TS 825 Standard",
                period: "2008-2023",
                description: "Standard insulation",
                wallU: [0.45, 0.60],
                windowU: [2.0, 2.8],
                performance: "medium"
            },
            "V3": {
                code: "V3",
                name: "NSEB / New",
                period: "> 2024",
                description: "High performance (Low U-values)",
                wallU: [0.25, 0.35],
                windowU: [1.0, 1.4],
                performance: "high"
            }
        },
        material: {
            "MC": {
                code: "MC",
                name: "Reinforced Concrete",
                description: "Concrete Frame + Brick Infill",
                thermal: "high-mass"
            },
            "MS": {
                code: "MS",
                name: "Steel / Prefab",
                description: "Steel Structure",
                thermal: "low-mass"
            }
        },
        renovation: {
            "R0": {
                code: "R0",
                name: "As-Built",
                description: "No intervention",
                improvement: 0
            },
            "R1": {
                code: "R1",
                name: "Renovated",
                description: "Retrofitted (Insulation added)",
                improvement: 40
            }
        }
    },
    
    // LAYER 4: FUNCTION (Education Level + Operation Mode)
    function: {
        level: {
            "LP": {
                code: "LP",
                name: "Primary School",
                description: "Dense occupancy, simple schedule",
                occupancyDensity: "high",
                scheduleComplexity: "simple"
            },
            "LH": {
                code: "LH",
                name: "High School",
                description: "Labs/Workshops included",
                occupancyDensity: "medium",
                scheduleComplexity: "complex"
            }
        },
        mode: {
            "OD": {
                code: "OD",
                name: "Day School",
                description: "08:00 - 17:00 Operation",
                hours: "8-17",
                daysPerYear: 180
            },
            "OB": {
                code: "OB",
                name: "Boarding School",
                description: "24h Operation (Dormitory load)",
                hours: "24h",
                daysPerYear: 280
            }
        }
    },
    
    // LAYER 5: SYSTEMS (HVAC Type)
    systems: {
        "S1": {
            code: "S1",
            name: "Fossil Fuel Boiler",
            description: "Natural Gas/Coal + Radiators",
            fuel: "fossil",
            efficiency: "medium",
            co2: "high"
        },
        "S2": {
            code: "S2",
            name: "Heat Pump",
            description: "Air/Water HP + Low Temp. Emitters",
            fuel: "electric",
            efficiency: "high",
            co2: "low"
        },
        "S3": {
            code: "S3",
            name: "VRF / Split",
            description: "Electric Heating & Cooling",
            fuel: "electric",
            efficiency: "medium-high",
            co2: "medium"
        }
    }
};

// ============================================
// BUILDING ID GENERATION
// ============================================

function generateBuildingID(selections) {
    // Format: C2-PL-FW-H-L-A-M-V2-MC-R0-LP-OD-S1
    // Climate-Plan-Facade-Height-Area-Vintage-Material-Renovation-Level-Mode-System
    
    const parts = [
        selections.climate,           // C2
        selections.planType,          // PL
        selections.facadeConfig,      // FW
        selections.height,            // H-L
        selections.area,              // A-M
        selections.vintage,           // V2
        selections.material,          // MC
        selections.renovation,        // R0
        selections.level,             // LP
        selections.mode,              // OD
        selections.system             // S1
    ];
    
    return parts.filter(p => p).join('-');
}

// ============================================
// CLASSIFICATION LOGIC
// ============================================

function classifyClimate(city) {
    for (const [code, data] of Object.entries(ARCHETYPE_DATABASE.climate)) {
        if (data.cities.includes(city)) {
            return data;
        }
    }
    return ARCHETYPE_DATABASE.climate["C2"]; // Default: Moderate
}

function classifyPlanType(morphologyInput) {
    const mapping = {
        "Tek Blok": "PC",
        "Doğrusal": "PL",
        "Avlu": "PU",
        "Ayrık": "PC"
    };
    const code = mapping[morphologyInput] || "PC";
    return ARCHETYPE_DATABASE.morphology.planType[code];
}

function classifyFacadeConfig(windowType) {
    // Pencere tipinden facade config'e çevir
    if (windowType && windowType.includes("Çift")) {
        return ARCHETYPE_DATABASE.morphology.facadeConfig["FW"]; // Standard
    }
    return ARCHETYPE_DATABASE.morphology.facadeConfig["FW"]; // Default
}

function classifyHeight(numFloors) {
    const floors = parseInt(numFloors) || 2;
    if (floors <= 3) {
        return ARCHETYPE_DATABASE.morphology.scale.height["H-L"];
    } else {
        return ARCHETYPE_DATABASE.morphology.scale.height["H-M"];
    }
}

function classifyArea(floorArea) {
    const area = parseInt(floorArea) || 3000;
    if (area < 2000) {
        return ARCHETYPE_DATABASE.morphology.scale.area["A-S"];
    } else if (area <= 6000) {
        return ARCHETYPE_DATABASE.morphology.scale.area["A-M"];
    } else {
        return ARCHETYPE_DATABASE.morphology.scale.area["A-L"];
    }
}

function classifyVintage(year, insulation) {
    const yearNum = parseInt(year) || 2000;
    
    if (yearNum >= 2024) {
        return ARCHETYPE_DATABASE.envelope.vintage["V3"]; // NSEB/New
    } else if (yearNum >= 2008 || insulation === "Var") {
        return ARCHETYPE_DATABASE.envelope.vintage["V2"]; // TS 825
    } else {
        return ARCHETYPE_DATABASE.envelope.vintage["V1"]; // Pre-regulation
    }
}

function classifyMaterial(wallType) {
    if (wallType && wallType.includes("Gazbeton")) {
        return ARCHETYPE_DATABASE.envelope.material["MC"];
    }
    return ARCHETYPE_DATABASE.envelope.material["MC"]; // Default: Concrete
}

function classifyRenovation(renovationYear, buildingYear) {
    if (renovationYear && parseInt(renovationYear) > parseInt(buildingYear)) {
        return ARCHETYPE_DATABASE.envelope.renovation["R1"]; // Renovated
    }
    return ARCHETYPE_DATABASE.envelope.renovation["R0"]; // As-built
}

function classifyEducationLevel(functionType) {
    if (functionType === "Lise") {
        return ARCHETYPE_DATABASE.function.level["LH"]; // High school
    }
    return ARCHETYPE_DATABASE.function.level["LP"]; // Primary
}

function classifyOperationMode(functionType) {
    if (functionType === "Yurt") {
        return ARCHETYPE_DATABASE.function.mode["OB"]; // Boarding
    }
    return ARCHETYPE_DATABASE.function.mode["OD"]; // Day school
}

function classifySystem(fuelType, cooling) {
    if (fuelType === "Doğalgaz" && cooling === "Yok") {
        return ARCHETYPE_DATABASE.systems["S1"]; // Fossil boiler
    } else if (fuelType === "Elektrik" || cooling !== "Yok") {
        return ARCHETYPE_DATABASE.systems["S3"]; // VRF/Split
    }
    return ARCHETYPE_DATABASE.systems["S1"]; // Default
}

// ============================================
// PERFORMANCE EVALUATION
// ============================================

function evaluatePerformance(vintage, system, renovation, hasPV) {
    let score = 0;
    
    // Vintage (40 points)
    if (vintage.code === "V3") score += 40;
    else if (vintage.code === "V2") score += 25;
    else score += 10;
    
    // System (30 points)
    if (system.code === "S2") score += 30; // Heat pump best
    else if (system.code === "S3") score += 20;
    else score += 10;
    
    // Renovation (20 points)
    if (renovation.code === "R1") score += 20;
    
    // PV (10 points)
    if (hasPV) score += 10;
    
    let rating, description, icon, className;
    
    if (score >= 70) {
        rating = "HIGH PERFORMANCE";
        description = "Modern standartlarda, düşük enerji tüketimi";
        icon = "🌟";
        className = "high";
    } else if (score >= 45) {
        rating = "MEDIUM PERFORMANCE";
        description = "Orta seviye, iyileştirme potansiyeli var";
        icon = "⚡";
        className = "medium";
    } else {
        rating = "POOR PERFORMANCE";
        description = "Düşük performans, acil yenileme gerekli";
        icon = "⚠️";
        className = "poor";
    }
    
    return { score, rating, description, icon, className };
}

// ============================================
// MAIN CLASSIFICATION FUNCTION
// ============================================

function calculateArchetype() {
    // Get form values
    const city = document.getElementById('city')?.value;
    const morphology = document.getElementById('morphology')?.value;
    const floorArea = document.getElementById('floorArea')?.value;
    const numFloors = document.getElementById('numFloors')?.value;
    const buildingYear = document.getElementById('buildingYear')?.value;
    const renovationYear = document.getElementById('renovationYear')?.value;
    const insulation = document.querySelector('input[name="insulation"]:checked')?.value;
    const wallType = document.getElementById('wallType')?.value;
    const windowType = document.getElementById('windowType')?.value;
    const functionType = document.getElementById('function')?.value;
    const fuelType = document.getElementById('fuelType')?.value;
    const cooling = document.querySelector('input[name="cooling"]:checked')?.value;
    const hasPV = document.querySelector('input[name="solarPV"]')?.checked;
    
    // Check required fields
    if (!city || !morphology || !floorArea || !numFloors || !buildingYear || 
        !insulation || !functionType || !fuelType || !cooling) {
        return null;
    }
    
    // Classify all layers
    const climate = classifyClimate(city);
    const planType = classifyPlanType(morphology);
    const facadeConfig = classifyFacadeConfig(windowType);
    const height = classifyHeight(numFloors);
    const area = classifyArea(floorArea);
    const vintage = classifyVintage(buildingYear, insulation);
    const material = classifyMaterial(wallType);
    const renovation = classifyRenovation(renovationYear, buildingYear);
    const educationLevel = classifyEducationLevel(functionType);
    const operationMode = classifyOperationMode(functionType);
    const system = classifySystem(fuelType, cooling);
    
    // Generate Building ID
    const buildingID = generateBuildingID({
        climate: climate.code,
        planType: planType.code,
        facadeConfig: facadeConfig.code,
        height: height.code,
        area: area.code,
        vintage: vintage.code,
        material: material.code,
        renovation: renovation.code,
        level: educationLevel.code,
        mode: operationMode.code,
        system: system.code
    });
    
    // Evaluate performance
    const performance = evaluatePerformance(vintage, system, renovation, hasPV);
    
    // Calculate parameters
    const avgWallU = ((vintage.wallU[0] + vintage.wallU[1]) / 2).toFixed(2);
    const avgWindowU = ((vintage.windowU[0] + vintage.windowU[1]) / 2).toFixed(2);
    
    return {
        buildingID: buildingID,
        climate: climate,
        planType: planType,
        facadeConfig: facadeConfig,
        height: height,
        area: area,
        vintage: vintage,
        material: material,
        renovation: renovation,
        educationLevel: educationLevel,
        operationMode: operationMode,
        system: system,
        performance: performance,
        parameters: {
            wallU: `${avgWallU} W/m²K`,
            windowU: `${avgWindowU} W/m²K`,
            wwr: facadeConfig.wwr,
            lighting: "10 W/m²",
            equipment: "8 W/m²"
        }
    };
}

// Export for use
window.ARCHETYPE_DATABASE = ARCHETYPE_DATABASE;
window.calculateArchetype = calculateArchetype;
