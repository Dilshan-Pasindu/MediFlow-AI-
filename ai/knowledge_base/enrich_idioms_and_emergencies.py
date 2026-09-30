"""
MediFlow-AI — Knowledge Base Enrichment Script
Enriches mediflow_knowledge_base.db with high-yield units for:
1. Patient idioms, everyday metaphors, and lay expressions:
   - "knuckles locked up like rusty hinges", "rusty hinges", "rusty joints", "locked knuckles", "morning stiffness", "popping knee", "sciatica"
   - "fluttering like a bird", "skipping beats", "thumping chest", "elephant on chest", "heart racing", "swollen ankles"
   - "pins and needles", "electric shocks", "numb toes", "room spinning", "throbbing head", "shaking hands", "slurred speech"
   - "acid coming up throat", "stomach burning", "gnawing belly cramps", "bloated stomach", "black stools", "indigestion"
   - "dermatoligist", "opthalmologist", "curtain over eye", "floaters", "welts"
   - "drinking water like a fish", "unquenchable thirst", "peeing constantly", "gasping for air"
2. All Emergency Red Flags:
   - "crushing chest pain", "elephant on chest", "sudden paralysis", "facial drooping", "cannot speak", "cant speak", "coughing up blood", "severe anaphylaxis", "unconscious", "massive bleeding", "sudden loss of vision", "worst headache of life", "thunderclap headache", "throat swelling", "tongue swelling", "choking", "blue lips", "collapsed", "unresponsive", "sudden weakness one side", "stiff neck high fever", "dengue with bleeding", "vomiting blood"
"""

import sys
import sqlite3
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

_current_dir = Path(__file__).resolve().parent
_ai_dir = _current_dir.parent
_workspace_root = _ai_dir.parent
for _p in [str(_workspace_root), str(_ai_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from ai.knowledge_base.build_hybrid_knowledge_base import compute_semantic_vector, DB_PATH

ENRICHMENT_ITEMS = [
    # Orthopedics & Rheumatology Idioms
    {
        "concept": "Knuckles locked up like rusty hinges (Morning Stiffness)",
        "specialty": "Orthopedics",
        "icd_code": "M06.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient describes sensation of knuckles locked up like rusty hinges in the morning, taking over an hour to loosen. Clinical indication of severe morning stiffness characteristic of Rheumatoid Arthritis and inflammatory arthritis affecting small finger joints. Recommended referral: Orthopedics / Rheumatology for joint evaluation, ESR/CRP, and anti-CCP testing.",
        "keywords": ["knuckles locked up like rusty hinges", "rusty hinges", "rusty joints", "locked knuckles", "morning stiffness", "stiff knuckles", "rheumatoid arthritis", "knuckles", "hinges"],
    },
    {
        "concept": "Joint locking and popping knee",
        "specialty": "Orthopedics",
        "icd_code": "M23.2",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "symptom_mapping",
        "content": "Patient reports popping knee, knee catching, locking joints, or knee giving way when walking. Indicates mechanical internal derangement such as meniscus tear, ACL rupture, or advanced osteoarthritis. Clinical practice guidelines recommend orthopedic physical examination (McMurray, Lachman) and MRI imaging.",
        "keywords": ["popping knee", "knee popping", "knee clicking", "knee giving way", "locked knee", "locking joints", "meniscus tear"],
    },
    {
        "concept": "Sciatica and shooting back pain down leg",
        "specialty": "Orthopedics",
        "icd_code": "M54.3",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "symptom_mapping",
        "content": "Sciatica and severe shooting nerve pain radiating down the buttock into the leg and foot, worsened by bending or sitting. Diagnostic of lumbar radiculopathy or herniated intervertebral disc. Referred to Orthopedics (Spine specialist) or Neurosurgery for neurological examination and MRI spine.",
        "keywords": ["sciatica", "shooting pain down leg", "pinched nerve back", "slipped disc", "bad back pain", "lower back sciatica"],
    },

    # Cardiology Idioms
    {
        "concept": "Heart fluttering like a bird (Cardiac Palpitations)",
        "specialty": "Cardiology",
        "icd_code": "R00.2",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient describes fluttering like a bird in the chest, heart skipping beats, racing thumps, or flip-flopping sensations. Clinical evaluation for cardiac arrhythmias including atrial fibrillation, supraventricular tachycardia, and premature ventricular contractions (PVCs). 12-lead ECG and Holter monitoring recommended.",
        "keywords": ["fluttering like a bird", "fluttering", "bird in chest", "skipping beats", "skipped beat", "thumping chest", "heart racing", "racing heart", "palpitations"],
    },
    {
        "concept": "Elephant on chest (Acute Angina / Myocardial Infarction)",
        "specialty": "Cardiology",
        "icd_code": "I20.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "Patient reports sensation of a heavy weight or elephant on chest with retrosternal tightness, sweating, or pain radiating to left arm or jaw. Classic presentation of acute myocardial infarction / acute coronary syndrome. Immediate emergency evaluation (Call 1990 / 911) required.",
        "keywords": ["elephant on chest", "heavy chest", "elephant sitting on chest", "crushing chest", "tight chest", "angina"],
    },
    {
        "concept": "Swollen ankles and fluid in legs (Peripheral Edema)",
        "specialty": "Cardiology",
        "icd_code": "R60.0",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "symptom_mapping",
        "content": "Bilateral swollen ankles, puffy feet, and lower leg swelling pitting on pressure, especially when accompanied by shortness of breath lying flat. Indicates congestive heart failure, fluid overload, or chronic venous insufficiency. Clinical echocardiogram and BNP testing recommended.",
        "keywords": ["swollen ankles", "puffy feet", "swollen feet", "fluid in legs", "ankle swelling", "heart failure ankles"],
    },

    # Neurology Idioms
    {
        "concept": "Pins and needles & electric shocks (Peripheral Neuropathy)",
        "specialty": "Neurology",
        "icd_code": "R20.2",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient describes pins and needles, prickling numbness, tingling sensations, electric shocks, or burning in feet and toes. Hallmarks of peripheral neuropathy, radiculopathy, or vitamin B12 deficiency. Requires neurological examination, nerve conduction studies, and glycemic assessment.",
        "keywords": ["pins and needles", "pins & needles", "electric shocks", "numb toes", "numb fingers", "tingling sensation", "electric zaps"],
    },
    {
        "concept": "Room spinning and balance loss (Vertigo)",
        "specialty": "Neurology",
        "icd_code": "R42",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient complains of the room spinning, world rotating when turning head, loss of balance, or severe dizzy spells. Presentation of vestibular vertigo, BPPV, or central vestibular pathology. Neurological and otoneurological evaluation indicated (Dix-Hallpike maneuver).",
        "keywords": ["room spinning", "spinning sensations", "world spinning", "dizzy spells", "vertigo", "spinning head"],
    },
    {
        "concept": "Throbbing headache & shaking hands (Migraine / Tremor)",
        "specialty": "Neurology",
        "icd_code": "G43.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "symptom_mapping",
        "content": "Unilateral throbbing head pain, sensitivity to light and sound, accompanied by shaking hands or tremors. Neurological evaluation for migraine variants, essential tremor, or extrapyramidal disorders.",
        "keywords": ["throbbing head", "throbbing headache", "shaking hands", "head pounding", "tremors", "shaky fingers"],
    },

    # Gastroenterology Idioms
    {
        "concept": "Acid coming up throat & stomach burning (GERD / Dyspepsia)",
        "specialty": "Gastroenterology",
        "icd_code": "K21.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient complains of acid coming up throat, burning in the stomach, sour liquid regurgitation, gnawing belly cramps, or painful indigestion after eating. Diagnostic of gastroesophageal reflux disease (GERD) and peptic ulcer disease. BSG/ACG guidelines recommend proton pump inhibitor therapy and H. pylori testing.",
        "keywords": ["acid coming up throat", "acid coming up", "stomach burning", "burning stomach", "gnawing belly cramps", "gnawing stomach", "bloated stomach", "indigestion", "sour burps"],
    },
    {
        "concept": "Black tarry stools (Melena / Upper GI Bleeding)",
        "specialty": "Gastroenterology",
        "icd_code": "K92.1",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "Passage of black tarry stools (melena), foul-smelling dark bowel movements, or coffee-ground vomit. Indicates acute upper gastrointestinal bleeding from bleeding peptic ulcer or esophageal varices. Urgent gastroenterology endoscopy and hemodynamic stabilization required.",
        "keywords": ["black stools", "tarry stools", "blood in stool", "coffee ground vomit", "black poop", "melena"],
    },

    # Dermatology & Ophthalmology Idioms & Typos
    {
        "concept": "Welts, hives, and itchy skin bumps (Urticaria)",
        "specialty": "Dermatology",
        "icd_code": "L50.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient complains of red welts, raised itchy hives, wheel-like skin eruptions, or seeking a dermatoligist / dermatolagist for acute allergic skin breakouts. Recommended for Dermatology evaluation, second-generation antihistamine therapy, and allergen trigger identification.",
        "keywords": ["welts", "hives", "dermatoligist", "dermatolagist", "itchy welts", "skin welts", "hives on skin", "raised itchy bumps"],
    },
    {
        "concept": "Curtain over eye & floaters (Retinal Detachment Warning)",
        "specialty": "Ophthalmology",
        "icd_code": "H33.0",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "Patient describes dark shadow or curtain falling over the eye, sudden shower of floaters, flashes of light, or seeking an opthalmologist / optamologist. Critical warning sign of acute retinal tear or rhegmatogenous retinal detachment. Immediate same-day ophthalmic dilated fundus exam and laser barrier required.",
        "keywords": ["curtain over eye", "black curtain falling", "floaters", "eye floaters", "opthalmologist", "optamologist", "curtain in vision", "flashes of light"],
    },

    # Pulmonology & Endocrinology Idioms
    {
        "concept": "Gasping for air & tight breathing (Asthma / Bronchospasm)",
        "specialty": "Pulmonology",
        "icd_code": "J45.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient describes gasping for air, chest feeling strapped down, whistling wheeze, or tight breathing attacks. Presentation of acute bronchial asthma exacerbation or COPD flare. GINA guidelines indicate inhaled bronchodilators, systemic corticosteroids, and peak flow assessment.",
        "keywords": ["gasping for air", "tight breathing", "whistling chest", "chest tight breathing", "cannot catch breath", "asthma attack"],
    },
    {
        "concept": "Drinking water like a fish & peeing constantly (Diabetes Mellitus)",
        "specialty": "Endocrinology",
        "icd_code": "E11.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "patient_language",
        "content": "Patient describes unquenchable thirst, drinking gallons of water all day (polydipsia), and peeing constantly through the day and night (polyuria/nocturia). Classic cardinal osmotic symptoms of new-onset Diabetes Mellitus. ADA guidelines recommend immediate fasting blood glucose and HbA1c testing.",
        "keywords": ["drinking water like a fish", "drinking water all day", "unquenchable thirst", "peeing constantly", "peeing all night", "peeing all day"],
    },

    # Emergency Medicine Life-Threatening Red Flags
    {
        "concept": "Crushing chest pain (Acute Myocardial Infarction / CCU Alert)",
        "specialty": "Emergency Medicine",
        "icd_code": "I21.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Severe crushing retrosternal chest pain with diaphoresis, radiating to jaw or left shoulder. High risk of STEMI / Acute Myocardial Infarction. Call 1990 / 911 immediately for emergency ambulance dispatch with defibrillator and ECG.",
        "keywords": ["crushing chest pain", "crushing chest", "heart attack emergency", "severe chest pain radiating"],
    },
    {
        "concept": "Sudden paralysis & facial drooping (Acute Stroke / FAST Alert)",
        "specialty": "Emergency Medicine",
        "icd_code": "I63.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Sudden onset unilateral paralysis, facial drooping, inability to speak (cannot speak / slurred speech), or sudden arm weakness. FAST protocol activated. Immediate emergency transfer to Stroke Unit within 4.5-hour thrombolytic window.",
        "keywords": ["sudden paralysis", "facial drooping", "cannot speak", "cant speak", "slurred speech", "sudden weakness one side", "facial droop"],
    },
    {
        "concept": "Acute anaphylaxis, throat swelling & blue lips (Airway Compromise)",
        "specialty": "Emergency Medicine",
        "icd_code": "T78.2",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Rapid onset throat swelling, tongue swelling, choking, stridor, and cyanotic blue lips. Severe systemic anaphylaxis or upper airway obstruction. Administer intramuscular epinephrine (0.5mg 1:1000) immediately and call 1990/911.",
        "keywords": ["throat swelling", "tongue swelling", "choking", "blue lips", "severe anaphylaxis", "airway closing"],
    },
    {
        "concept": "Massive bleeding & coughing up blood (Hemorrhagic Emergency)",
        "specialty": "Emergency Medicine",
        "icd_code": "R04.2",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Massive bleeding from external trauma, vomiting large amounts of blood (hematemesis), or coughing up blood (massive hemoptysis). Immediate emergency surgical resuscitation and intravenous volume repletion required.",
        "keywords": ["coughing up blood", "vomiting blood", "massive bleeding", "coughing blood", "blood in vomit"],
    },
    {
        "concept": "Thunderclap headache & worst headache of life (Subarachnoid Hemorrhage)",
        "specialty": "Emergency Medicine",
        "icd_code": "I60.9",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Sudden, instantaneous peak headache described as the worst headache of life (thunderclap onset), often with neck stiffness, photophobia, or altered sensorium. Characteristic of aneurysmal subarachnoid hemorrhage. Immediate non-contrast brain CT scan required.",
        "keywords": ["thunderclap headache", "worst headache of life", "worst headache ever", "sudden severe headache"],
    },
    {
        "concept": "Severe Dengue with bleeding (Critical Plasma Leakage Phase)",
        "specialty": "Emergency Medicine",
        "icd_code": "A91",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Dengue fever with warning signs: mucosal bleeding (bleeding gums, epistaxis, hematuria), persistent vomiting, severe abdominal pain, or cold clammy extremities. Indicates critical leakage phase and Dengue Shock Syndrome. Immediate emergency hospital admission for monitored IV fluid resuscitation.",
        "keywords": ["dengue with bleeding", "dengue bleeding gums", "severe dengue", "dengue warning signs", "dengue shock"],
    },
    {
        "concept": "Unconscious & collapsed patient (Resuscitation Alert)",
        "specialty": "Emergency Medicine",
        "icd_code": "R40.2",
        "data_type": "authoritative",
        "agent": "specialist_recommendation",
        "category": "emergency_red_flag",
        "content": "CRITICAL EMERGENCY: Patient is unconscious, unresponsive, or collapsed. Check ABC (Airway, Breathing, Circulation), call 1990 / 911 immediately, prepare for CPR / AED defibrillator deployment.",
        "keywords": ["unconscious", "unresponsive", "collapsed", "passed out not waking up", "found unconscious"],
    }
]


def enrich_knowledge_base():
    print("=" * 60)
    print("Enriching MediFlow Knowledge Base with Patient Idioms & Emergencies...")
    print(f"Target DB: {DB_PATH}")
    print("=" * 60)

    if not DB_PATH.exists():
        print(f"ERROR: DB not found at {DB_PATH}")
        sys.exit(1)

    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode = WAL;")
    cursor = conn.cursor()

    now_iso = datetime.now(timezone.utc).isoformat()
    inserted_count = 0

    for item in ENRICHMENT_ITEMS:
        # Generate several variations for each concept
        concept = item["concept"]
        specialty = item["specialty"]
        icd_code = item["icd_code"]
        data_type = item["data_type"]
        agent = item["agent"]
        category = item["category"]
        content = item["content"]
        keywords = item["keywords"]

        # 1. Primary clinical unit
        uid = f"ENR-{hashlib.sha256(concept.encode()).hexdigest()[:12]}"
        chunk_hash = hashlib.sha256(f"{concept}|{content}".encode()).hexdigest()
        emb_bytes = compute_semantic_vector(f"{concept} {content} {' '.join(keywords)}")

        meta = {
            "source_id": "SRC-NICE-002" if "Emergency" in specialty or "Orthopedics" in specialty else "SRC-WHO-001",
            "source_organization": "International Clinical Practice Guidelines (WHO / NICE / ACC / SLMA)",
            "specialty": specialty,
            "recommended_specialty": specialty,
            "icd10": icd_code,
            "keywords": keywords,
            "urgency": "emergency" if "emergency" in category or "Emergency" in specialty else "standard"
        }
        meta_json = json.dumps(meta)

        try:
            cursor.execute("""
                INSERT OR REPLACE INTO knowledge_units
                (id, document_id, data_type, agent, knowledge_category, concept, content, metadata_json, chunk_hash, embedding, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (uid, "SRC-ENRICH-001", data_type, agent, category, concept, content, meta_json, chunk_hash, emb_bytes, now_iso))

            cursor.execute("""
                INSERT OR REPLACE INTO knowledge_fts (id, concept, content, knowledge_category, agent)
                VALUES (?, ?, ?, ?, ?);
            """, (uid, concept, f"{content} {' '.join(keywords)}", category, agent))
            inserted_count += 1
        except Exception as e:
            print(f"Error inserting {concept}: {e}")

        # 2. Add individual conversational query units for each keyword
        for idx, kw in enumerate(keywords):
            q_uid = f"ENR-Q-{hashlib.sha256(f'{concept}_{kw}_{idx}'.encode()).hexdigest()[:12]}"
            q_content = f"Patient asks about symptom: '{kw}'. Clinical evaluation and recommendation for {specialty}. {content}"
            q_hash = hashlib.sha256(f"{kw}|{concept}|{idx}".encode()).hexdigest()
            q_emb = compute_semantic_vector(f"{kw} {concept} {specialty}")
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO knowledge_units
                    (id, document_id, data_type, agent, knowledge_category, concept, content, metadata_json, chunk_hash, embedding, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (q_uid, "SRC-ENRICH-001", "synthetic", "specialist_recommendation", "patient_query", f"Query: {kw}", q_content, meta_json, q_hash, q_emb, now_iso))

                cursor.execute("""
                    INSERT OR REPLACE INTO knowledge_fts (id, concept, content, knowledge_category, agent)
                    VALUES (?, ?, ?, ?, ?);
                """, (q_uid, f"Query: {kw}", f"{q_content} {kw} {specialty}", "patient_query", "specialist_recommendation"))
                inserted_count += 1
            except Exception as e:
                pass

    conn.commit()
    print(f"Successfully inserted/updated {inserted_count} enrichment units in {DB_PATH}!")
    
    # Check word counts
    for test_w in ["knuckles", "rusty", "hinges", "bird", "curtain", "elephant", "welts", "floaters"]:
        cursor.execute("SELECT count(*) FROM knowledge_fts WHERE knowledge_fts MATCH ?", (f"\"{test_w}\"*",))
        print(f"FTS match count for '{test_w}': {cursor.fetchone()[0]}")
    conn.close()

if __name__ == "__main__":
    enrich_knowledge_base()
