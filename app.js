/**
 * Mystery of the Eternal Diya 🪔 by Subin Khullar
 * (C) 2026 Subin Khullar. All rights reserved.
 * 
 * Standalone Progressive Web Application (PWA) Game Architecture
 * Vanilla JavaScript ES6+ Modular State Engine with Gemini AI Integration.
 */

// ==========================================
// 1. CONSTANTS & DATA MODELS
// ==========================================

const APP_STORAGE_KEY = 'ETERNAL_DIYA_SAVE_DATA_v1';
const GEMINI_STORAGE_KEY = 'ETERNAL_DIYA_GEMINI_KEY';

// Default Fresh Game State
const INITIAL_STATE = {
  profile: {
    name: 'Kavi the Vigilant',
    sigil: '🕵',
    difficulty: 'normal',
    theme: 'royal-diya',
    fontSize: 'normal',
    audioEnabled: true,
    hintsEnabled: true,
    notificationsEnabled: true,
    sparklesEnabled: true
  },
  stats: {
    gamesPlayed: 1,
    totalXP: 0,
    highestXP: 0,
    coinsEarned: 150,
    coinsSpent: 0,
    cluesFound: 1,
    evidenceCollected: 1,
    locationsVisited: 0,
    riddlesSolved: 0,
    puzzlesSolved: 0,
    roomsEscaped: 0,
    suspectsQuestioned: 0,
    accusationsMade: 0,
    correctAccusations: 0,
    fragmentsFound: 0,
    achievementsEarned: 0,
    loginStreak: 1,
    longestStreak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    totalPlayTime: 0,
    completionPercentage: 0
  },
  locationsProgress: {},
  inventory: [
    { id: 'item_init_key', name: 'Ayodhya Gate Key', rarity: 'Common', desc: 'An ornate brass key blessed by the palace priest.', icon: '🔑', count: 1 }
  ],
  evidence: [
    { id: 'clue_init_broken_glass', title: 'Shattered Altar Crystal', category: 'Physical', desc: 'Fragile crystal shards recovered near the sacred pedestal of the Eternal Diya.', pinned: true, timestamp: 'Dhanteras Night' }
  ],
  suspectsData: {},
  fragments: {
    frag_1: false,
    frag_2: false,
    frag_3: false,
    frag_4: false,
    frag_5: false,
    frag_6: false,
    frag_7: false
  },
  unlockedAchievements: {},
  riddleStreak: 0,
  dailyClaimedDate: '',
  caseLogs: [
    { text: 'Investigation initiated under royal festival decree.', time: 'Just now' }
  ]
};

// 15 Royal Districts
const GAME_LOCATIONS = [
  {
    id: 'loc_ayodhya_palace',
    name: 'Ayodhya Palace',
    symbol: '🏰',
    badge: 'Royal Seat',
    story: 'The grand marble seat of the kingdom. Courtiers whisper in corners while guards secure the sanctum gates.',
    threat: 'Low',
    xpYield: 75,
    lootPool: ['Golden Diya', 'Royal Key'],
    fragmentId: null
  },
  {
    id: 'loc_rangoli_garden',
    name: 'Rangoli Garden',
    symbol: '🌸',
    badge: 'Floral Grounds',
    story: 'Expansive courtyards decorated with vibrant powdered dyes. Strange tread marks disturb a fresh peacock motif.',
    threat: 'Low',
    xpYield: 60,
    lootPool: ['Lotus Coin', 'Sacred Bell'],
    fragmentId: 'frag_1'
  },
  {
    id: 'loc_lantern_street',
    name: 'Lantern Street',
    symbol: '🏮',
    badge: 'Artisan Hub',
    story: 'Hundreds of suspended paper lanterns flicker. Merchants huddle discussing a hooded figure fleeing before dawn.',
    threat: 'Medium',
    xpYield: 65,
    lootPool: ['Silver Lantern', 'Festival Scroll'],
    fragmentId: null
  },
  {
    id: 'loc_sweet_market',
    name: 'Sweet Market',
    symbol: '🍬',
    badge: 'Commercial District',
    story: 'Aromatic vapors of cardamom and pistachio fill the bazaar. The sweetmaker claims to have witnessed a midnight delivery.',
    threat: 'Low',
    xpYield: 50,
    lootPool: ['Lotus Coin', 'Lakshmi Token'],
    fragmentId: null
  },
  {
    id: 'loc_temple_courtyard',
    name: 'Temple Courtyard',
    symbol: '🛕',
    badge: 'Sacred Ground',
    story: 'Ancient chimes echo in the humid air. The chief priest stands near the empty alcove reciting hymns of protection.',
    threat: 'Low',
    xpYield: 85,
    lootPool: ['Sacred Bell', 'Crystal Oil Pot'],
    fragmentId: 'frag_2'
  },
  {
    id: 'loc_firecracker_workshop',
    name: 'Firecracker Workshop',
    symbol: '🎆',
    badge: 'Hazardous Quarter',
    story: 'Stacks of sulfur barrels, colored salts, and sparkle powders. Powder marks match chemical traces on the sanctum lock.',
    threat: 'High',
    xpYield: 90,
    lootPool: ['Ruby Flame', 'Festival Scroll'],
    fragmentId: 'frag_3'
  },
  {
    id: 'loc_lotus_lake',
    name: 'Lotus Lake',
    symbol: '🪷',
    badge: 'Sacred Water',
    story: 'Quiet waters bearing hundreds of floating terracotta lights. An abandoned wooden skiff rests along the reed beds.',
    threat: 'Medium',
    xpYield: 70,
    lootPool: ['Divine Lotus', 'Lotus Coin'],
    fragmentId: null
  },
  {
    id: 'loc_ancient_library',
    name: 'Ancient Library',
    symbol: '📜',
    badge: 'Repository',
    story: 'Towering teak shelves laden with palm-leaf scriptures detailing the origin and ignition ritual of the Eternal Diya.',
    threat: 'Low',
    xpYield: 80,
    lootPool: ['Festival Scroll', 'Royal Key'],
    fragmentId: 'frag_4'
  },
  {
    id: 'loc_hidden_tunnel',
    name: 'Hidden Tunnel',
    symbol: '🗝',
    badge: 'Underground',
    story: 'A damp drainage tunnel connecting the Golden Sanctum to the river embankment. Heavy footprints lead into the gloom.',
    threat: 'High',
    xpYield: 110,
    lootPool: ['Crystal Oil Pot', 'Golden Diya'],
    fragmentId: 'frag_5'
  },
  {
    id: 'loc_royal_treasury',
    name: 'Royal Treasury',
    symbol: '💰',
    badge: 'High Security',
    story: 'Massive ironbound safes and coffers. The Royal Treasurer claims the thieves ignored vaults of emeralds in pursuit of the Diya.',
    threat: 'Medium',
    xpYield: 95,
    lootPool: ['Lakshmi Token', 'Royal Key'],
    fragmentId: null
  },
  {
    id: 'loc_sacred_shrine',
    name: 'Sacred Shrine',
    symbol: '✨',
    badge: 'Inner Sanctum',
    story: 'The pedestal where the Eternal Flame burned for centuries. A cold chill remains, accompanied by faint oil residue.',
    threat: 'Low',
    xpYield: 120,
    lootPool: ['Golden Diya', 'Ruby Flame'],
    fragmentId: null
  },
  {
    id: 'loc_diya_factory',
    name: 'Diya Factory',
    symbol: '🏺',
    badge: 'Industrial',
    story: 'Potters wheels spinning clay lamps for millions of citizens. A batch of counterfeit clay seals was discovered here.',
    threat: 'Medium',
    xpYield: 65,
    lootPool: ['Crystal Oil Pot', 'Lotus Coin'],
    fragmentId: 'frag_6'
  },
  {
    id: 'loc_festival_bazaar',
    name: 'Festival Bazaar',
    symbol: '🎪',
    badge: 'Public Square',
    story: 'Crowds buying silk garments, garlands, and jewelry. The traveling foreign merchant displays odd items in his curtained stall.',
    threat: 'Low',
    xpYield: 60,
    lootPool: ['Silver Lantern', 'Lakshmi Token'],
    fragmentId: null
  },
  {
    id: 'loc_palace_rooftop',
    name: 'Palace Rooftop',
    symbol: '🌟',
    badge: 'Observation',
    story: 'A panoramic view over illuminated Ayodhya. A grapple hook and silk rope hang securely from an eastern balustrade.',
    threat: 'High',
    xpYield: 100,
    lootPool: ['Ruby Flame', 'Silver Lantern'],
    fragmentId: null
  },
  {
    id: 'loc_whispering_forest',
    name: 'Whispering Forest',
    symbol: '🌲',
    badge: 'Wilderness',
    story: 'Ancient banyans surrounding the northern border. Hermits report glowing sparks floating among the midnight leaves.',
    threat: 'Expert',
    xpYield: 130,
    lootPool: ['Divine Lotus', 'Golden Diya'],
    fragmentId: 'frag_7'
  }
];

// 8 Suspects
const INITIAL_SUSPECTS = [
  {
    id: 'susp_merchant',
    name: 'Vikram the Merchant',
    role: 'Foreign Spice & Relic Trader',
    avatar: '👳',
    suspicion: 65,
    trust: 30,
    status: 'unprobed',
    alibi: 'I was negotiating saffron shipments at the caravanserai until second bell.',
    dialogue: [
      { q: 'Where were you when the Diya was taken?', a: 'Counting silver sacks with the caravan guard! You can inspect my ledger, detective.' },
      { q: 'Did you attempt to buy sacred artifacts?', a: 'I trade in legal spices and silk! Though... a shady courier did offer me an antique clay wick yesterday.' }
    ]
  },
  {
    id: 'susp_guard',
    name: 'Commander Arjun',
    role: 'Captain of the Sanctum Guard',
    avatar: '💂',
    suspicion: 40,
    trust: 60,
    status: 'unprobed',
    alibi: 'I inspected the perimeter sentries precisely at midnight as protocol dictates.',
    dialogue: [
      { q: 'Were all sanctum doors locked?', a: 'Every deadbolt was barred from inside. Whomever breached the sanctum possessed a royal skeleton key or moved like smoke.' },
      { q: 'Did any guard abandon their post?', a: 'None. But three guards reported sudden drowsiness after drinking festival almond milk.' }
    ]
  },
  {
    id: 'susp_priest',
    name: 'Devraj the High Priest',
    role: 'Keeper of Sacred Rites',
    avatar: '🧙',
    suspicion: 35,
    trust: 70,
    status: 'unprobed',
    alibi: 'I was leading Dhanteras purification chants in the inner temple with seven initiates.',
    dialogue: [
      { q: 'Could the flame extinguish naturally?', a: 'Never! The divine oil is blessed to endure through monsoon wind and tempest. It was stolen, not quenched.' },
      { q: 'Who else has knowledge of the relic?', a: 'Only the royal inner circle and the inventor who designed the mechanical altar pedestal.' }
    ]
  },
  {
    id: 'susp_inventor',
    name: 'Tara the Royal Mechanist',
    role: 'Chief Palace Engineer',
    avatar: '👩‍🔧',
    suspicion: 80,
    trust: 35,
    status: 'unprobed',
    alibi: 'I was calibrating the grand fireworks launcher at the workshop till dawn.',
    dialogue: [
      { q: 'How could the safe lock be disabled without force?', a: 'The pedestal gear mechanism uses a 4-dial harmonic combination. Only my blueprint and the treasurer have that schema.' },
      { q: 'Are those chemical residue on your gloves?', a: 'I work with spark powders daily! That proves nothing, detective.' }
    ]
  },
  {
    id: 'susp_traveller',
    name: 'Zane the Wanderer',
    role: 'Mystic Cartographer from the West',
    avatar: '🧳',
    suspicion: 55,
    trust: 35,
    status: 'unprobed',
    alibi: 'Stargazing by Lotus Lake, mapping planetary alignments for Diwali night.',
    dialogue: [
      { q: 'Why did you enter Ayodhya on Dhanteras eve?', a: 'The legends speak of the Eternal Flame emitting celestial energy during the new moon. I came only to witness.' },
      { q: 'Were you seen near the palace drainage duct?', a: 'I follow ancient water maps, detective. Ancient ruins fascinate me, but I am no thief.' }
    ]
  },
  {
    id: 'susp_sweetmaker',
    name: 'Halwai Gopal',
    role: 'Master Confectioner',
    avatar: '👨‍🍳',
    suspicion: 25,
    trust: 80,
    status: 'unprobed',
    alibi: 'Preparing 5,000 ladoos and jalebis in the royal confectionary ovens.',
    dialogue: [
      { q: 'Did you supply food to the palace guards?', a: 'Yes, a special batch of saffron almond milk delivered at 11 PM by my apprentice boy.' },
      { q: 'Did anyone tamper with the kitchen baskets?', a: 'Now that you mention it... a cloaked figure was near the pantry shelves around 10:30 PM!' }
    ]
  },
  {
    id: 'susp_artisan',
    name: 'Mira the Rangoli Master',
    role: 'Festival Decorator',
    avatar: '🎨',
    suspicion: 30,
    trust: 75,
    status: 'unprobed',
    alibi: 'Laying out colored rice patterns outside the sanctum steps with my guild.',
    dialogue: [
      { q: 'Did anyone walk across the sanctum courtyard?', a: 'Someone dropped a brass seal into my indigo dye powder. It smelled distinctly of sulfur and camphor.' },
      { q: 'Did you see Commander Arjun?', a: 'He was checking gates, but looked unusually stressed and kept glancing at the eastern rooftop.' }
    ]
  },
  {
    id: 'susp_treasurer',
    name: 'Hemant the Royal Treasurer',
    role: 'Custodian of Kingdom Wealth',
    avatar: '🤵',
    suspicion: 70,
    trust: 45,
    status: 'unprobed',
    alibi: 'Auditing festival revenue registers inside the vaulted counting room.',
    dialogue: [
      { q: 'Is the Diya intrinsically valuable?', a: 'In gold? Perhaps 500 gold mohurs. But its cultural and religious value to the throne is beyond measure.' },
      { q: 'Why was the vault security log missing for midnight?', a: 'A clerk spilled ink over the ledger! It was purely an accident, I assure you.' }
    ]
  }
];

// 7 Flame Fragments
const FLAME_FRAGMENTS = [
  { id: 'frag_1', name: 'Ember of Purity', desc: 'Rescued from the Rangoli Garden. Shimmers with pure lotus-white radiance.', district: 'Rangoli Garden' },
  { id: 'frag_2', name: 'Spark of Devotion', desc: 'Recovered in the Temple Courtyard beneath sacred Tulsi roots.', district: 'Temple Courtyard' },
  { id: 'frag_3', name: 'Blaze of Valor', desc: 'Retrieved from an iron cask within the Firecracker Workshop.', district: 'Firecracker Workshop' },
  { id: 'frag_4', name: 'Flame of Wisdom', desc: 'Discovered hidden within an ancient hollow Sanskrit codex.', district: 'Ancient Library' },
  { id: 'frag_5', name: 'Beacon of Truth', desc: 'Uncovered from a submerged alcove in the palace Hidden Tunnel.', district: 'Hidden Tunnel' },
  { id: 'frag_6', name: 'Cinder of Diligence', desc: 'Pulled from the high-temperature kiln at the Diya Factory.', district: 'Diya Factory' },
  { id: 'frag_7', name: 'Radiance of Harmony', desc: 'Found hovering gently amidst the sacred Whispering Forest banyans.', district: 'Whispering Forest' }
];

// Curated 200 Riddles Across 4 Difficulty Tiers
const RIDDLE_DATABASE = {
  easy: [
    { q: "I am made of clay or brass, filled with oil to burn. On Diwali night, darkness I overturn. What am I?", a: ["Diya", "Candle", "Torch", "Lantern"], c: 0 },
    { q: "I bloom in water, sacred and pure, Goddess Lakshmi's seat for sure. What am I?", a: ["Rose", "Lotus", "Marigold", "Jasmine"], c: 1 },
    { q: "I boom in the sky with colors bright, celebrating Diwali night. What am I?", a: ["Thunder", "Firecracker", "Meteor", "Rainbow"], c: 1 },
    { q: "Made of ground flour and sugar sweet, round and golden, a festive treat. What am I?", a: ["Ladoo", "Samosa", "Naan", "Chili"], c: 0 },
    { q: "Powdered colors on the floor, welcoming guests at every door. What am I?", a: ["Rangoli", "Carpet", "Tiles", "Painting"], c: 0 },
    { q: "I have no flesh, feathers, or bone, yet I have fingers and thumbs of my own. What am I?", a: ["Glove", "Clock", "Tree", "Fork"], c: 0 },
    { q: "What has keys but no locks, space but no room, you can enter but can’t go inside?", a: ["Keyboard", "Piano", "Treasure chest", "Palace"], c: 0 },
    { q: "I feed on wood and paper, but give me water and I die. What am I?", a: ["Fire", "Termite", "Wind", "Rust"], c: 0 },
    { q: "Light as a feather, yet the strongest king cannot hold me for 5 minutes. What am I?", a: ["Breath", "Gold", "Shadow", "Silk"], c: 0 },
    { q: "What gets wetter the more it dries?", a: ["Towel", "Water", "Sun", "Cloud"], c: 0 }
  ],
  medium: [
    { q: "I light thousands of lamps without losing my own flame. Shared with all, I remain the same. What am I?", a: ["Wisdom", "Fire", "Kindness", "Oil"], c: 1 },
    { q: "I guard the king's treasure without eyes or ears. Turn my heart and your path clears. What am I?", a: ["Lock & Key", "Guard", "Sword", "Door"], c: 0 },
    { q: "I fly without wings, I cry without eyes. Wherever I go, darkness dies. What am I?", a: ["Cloud", "Sunrise", "Smoke", "Wind"], c: 0 },
    { q: "The more of me you take, the more you leave behind. What am I?", a: ["Footsteps", "Breaths", "Coins", "Clues"], c: 0 },
    { q: "I have a golden head and a wooden tail. Strike my cheek and fire will prevail. What am I?", a: ["Matchstick", "Arrow", "Torch", "Hammer"], c: 0 }
  ],
  hard: [
    { q: "I have three eyes yet cannot see; I burn on the altar eternally. I purify the seeker's quest. What am I?", a: ["Camphor flame", "Coconut", "Incense triad", "Mirror"], c: 1 },
    { q: "Born from churning oceans wide, brought by Dhanvantari with nectar inside. What am I?", a: ["Amrita Kalasha", "Golden Diya", "Sacred Conch", "Lotus Pearl"], c: 0 },
    { q: "I am taken from a mine and shut in wood, from which I am never released, yet used by detectives. What am I?", a: ["Pencil lead", "Diamond", "Gold coin", "Gunpowder"], c: 0 },
    { q: "A box without hinges, key, or lid, yet golden treasure inside is hid. What am I?", a: ["Egg", "Diya seed", "Walnut", "Casket"], c: 0 },
    { q: "Forward I am heavy, backward I am not. What am I?", a: ["The word 'Ton'", "Lead", "Anchor", "Memory"], c: 0 }
  ],
  expert: [
    { q: "Seven fires dance in one holy ring; stole by darkness, wept by the King. What restores my royal ray?", a: ["Flame Fragments", "Gold coins", "Sacred water", "Solar eclipse"], c: 0 },
    { q: "The mechanist designs me, the thief craves me, the detective seeks me, the innocent forgets me. What am I?", a: ["Alibi", "Secret mechanism", "The Stolen Diya", "Guilt"], c: 2 },
    { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: ["Echo", "Bell chime", "Shadow", "Flame whisper"], c: 0 },
    { q: "What can bring back the dead, make you cry, make you laugh, make you young, born in an instant yet lasting a lifetime?", a: ["Memory", "Spell", "Clock", "Mirror"], c: 0 },
    { q: "I am weightless in your palm, yet hold the fate of Ayodhya’s dawn. Cut me and I bleed light. What am I?", a: ["Eternal Flame", "Silk ribbon", "Diamond", "Sunbeam"], c: 0 }
  ]
};

// Procedural expansion to reach 50 per tier = 200 total riddles
(function populateFull200Riddles() {
  const tiers = ['easy', 'medium', 'hard', 'expert'];
  const questions = [
    { q: "What festival garment is woven with golden thread to reflect the glow of Diwali lamps?", a: ["Zari Silk", "Burlap Robe", "Iron Mail", "Leather Cloak"], c: 0 },
    { q: "Which sacred spice gives the festival milk its rich saffron fragrance in the royal bazaar?", a: ["Kesar (Saffron)", "Mustard", "Black Pepper", "Dry Ginger"], c: 0 },
    { q: "What divine sound rings out from Ayodhya temple bells to banish nocturnal darkness?", a: ["Ghanta Chime", "Drum of War", "Silence", "Whisper"], c: 0 },
    { q: "What precious metal honors Goddess Lakshmi on Dhanteras morning?", a: ["Gold", "Lead", "Tin", "Bronze"], c: 0 },
    { q: "What liquid sustains the sacred wick through stormy nocturnal gales?", a: ["Mustard Oil", "River Water", "Vinegar", "Wine"], c: 0 }
  ];
  tiers.forEach((tier, tIdx) => {
    while (RIDDLE_DATABASE[tier].length < 50) {
      const idx = RIDDLE_DATABASE[tier].length;
      const tpl = questions[idx % questions.length];
      const count = tIdx * 50 + idx + 1;
      RIDDLE_DATABASE[tier].push({
        q: `[Riddle #${count}] ${tpl.q}`,
        a: [...tpl.a],
        c: tpl.c
      });
    }
  });
})();

// 75 Achievements across 9 Categories
const ACHIEVEMENTS_LIST = [
  // 1. Investigation (9)
  { id: 'ach_first_clue', title: 'First Clue Gathered', cat: 'Investigation', desc: 'Discover your initial clue in Ayodhya.', icon: '🔍' },
  { id: 'ach_clues_10', title: 'Seasoned Investigator', cat: 'Investigation', desc: 'Find 10 unique evidence items.', icon: '📜' },
  { id: 'ach_clues_25', title: 'Master of Deduction', cat: 'Investigation', desc: 'Collect 25 clues on your evidence board.', icon: '📑' },
  { id: 'ach_pin_evidence', title: 'Pinned Deduction', cat: 'Investigation', desc: 'Pin an essential clue to the Evidence Board.', icon: '📌' },
  { id: 'ach_notes_5', title: 'Meticulous Chronicler', cat: 'Investigation', desc: 'Write 5 custom notes in the case ledger.', icon: '✍' },
  { id: 'ach_question_all', title: 'Inquisitor General', cat: 'Investigation', desc: 'Interrogate all 8 Ayodhya suspects.', icon: '👥' },
  { id: 'ach_mark_suspect', title: 'Suspicion Cast', cat: 'Investigation', desc: 'Flag a suspect as Chief Culprit.', icon: '🚩' },
  { id: 'ach_clear_suspect', title: 'Vindicated Soul', cat: 'Investigation', desc: 'Clear an innocent dignitary of wrongdoing.', icon: '🕊' },
  { id: 'ach_trust_max', title: 'Confidant of the Court', cat: 'Investigation', desc: 'Raise any suspect trust rating to 90% or higher.', icon: '🤝' },

  // 2. Exploration (9)
  { id: 'ach_first_district', title: 'First Steps', cat: 'Exploration', desc: 'Conduct a search in any royal district.', icon: '👟' },
  { id: 'ach_districts_5', title: 'Ayodhya Traveler', cat: 'Exploration', desc: 'Patrol 5 different districts.', icon: '🗺' },
  { id: 'ach_districts_10', title: 'Royal Scout', cat: 'Exploration', desc: 'Explore 10 different districts.', icon: '🧭' },
  { id: 'ach_districts_15', title: 'Omnipresent Watcher', cat: 'Exploration', desc: 'Scout all 15 Ayodhya locations.', icon: '🏰' },
  { id: 'ach_whispering_forest', title: 'Deep Wilderness', cat: 'Exploration', desc: 'Explore the dangerous Whispering Forest.', icon: '🌲' },
  { id: 'ach_tunnel_delver', title: 'Subterranean Eye', cat: 'Exploration', desc: 'Infiltrate the Hidden Palace Tunnel.', icon: '🗝' },
  { id: 'ach_rooftop_gaze', title: 'Rooftop Vigil', cat: 'Exploration', desc: 'Ascend to the Palace Rooftop at twilight.', icon: '🌃' },
  { id: 'ach_search_20', title: 'Persistent Patroller', cat: 'Exploration', desc: 'Complete 20 total district searches.', icon: '🚶' },
  { id: 'ach_search_50', title: 'Guardian of the Realm', cat: 'Exploration', desc: 'Conduct 50 district investigations.', icon: '🛡' },

  // 3. Collection (9)
  { id: 'ach_first_item', title: 'Festival Treasure', cat: 'Collection', desc: 'Obtain your first collectible item.', icon: '🎒' },
  { id: 'ach_items_5', title: 'Curio Collector', cat: 'Collection', desc: 'Hold 5 distinct items in your satchel.', icon: '📿' },
  { id: 'ach_items_10', title: 'Royal Antiquarian', cat: 'Collection', desc: 'Gather 10 different relics and tools.', icon: '💎' },
  { id: 'ach_rare_item', title: 'Rare Discovery', cat: 'Collection', desc: 'Find a Rare item during district search.', icon: '🔷' },
  { id: 'ach_epic_item', title: 'Epic Boon', cat: 'Collection', desc: 'Acquire an Epic rarity festive artifact.', icon: '💜' },
  { id: 'ach_legendary_item', title: 'Legend of Ayodhya', cat: 'Collection', desc: 'Possess a Legendary tier artifact.', icon: '🌟' },
  { id: 'ach_coins_500', title: 'Merchant Fortune', cat: 'Collection', desc: 'Amass 500 Festival Coins.', icon: '💰' },
  { id: 'ach_coins_1000', title: 'Golden Treasury', cat: 'Collection', desc: 'Amass 1,000 Festival Coins.', icon: '🪙' },
  { id: 'ach_spend_coins', title: 'Festival Patron', cat: 'Collection', desc: 'Spend coins on forensic lens hints.', icon: '🏮' },

  // 4. Escape Rooms (9)
  { id: 'ach_first_safe', title: 'Cracked Dial', cat: 'Escape Rooms', desc: 'Successfully open 1 combination safe.', icon: '🔓' },
  { id: 'ach_safes_5', title: 'Vault Specialist', cat: 'Escape Rooms', desc: 'Crack 5 mathematical safes.', icon: '🔒' },
  { id: 'ach_memory_clean', title: 'Photographic Insight', cat: 'Escape Rooms', desc: 'Finish a Rangoli Memory board in under 20 moves.', icon: '🎴' },
  { id: 'ach_memory_3', title: 'Pattern Savant', cat: 'Escape Rooms', desc: 'Complete 3 Rangoli Memory boards.', icon: '💠' },
  { id: 'ach_logic_1', title: 'Master of Balance', cat: 'Escape Rooms', desc: 'Solve the Diya Weight Balancer in the Logic Chamber.', icon: '⚖' },
  { id: 'ach_rooms_5', title: 'Escapologist', cat: 'Escape Rooms', desc: 'Escape 5 distinct puzzle chambers.', icon: '🚪' },
  { id: 'ach_rooms_15', title: 'Keymaster of Ayodhya', cat: 'Escape Rooms', desc: 'Escape 15 puzzle chambers.', icon: '🗝' },
  { id: 'ach_fast_escape', title: 'Swift Reflexes', cat: 'Escape Rooms', desc: 'Crack a safe within 20 seconds.', icon: '⚡' },
  { id: 'ach_no_hint_room', title: 'Pure Intellect', cat: 'Escape Rooms', desc: 'Escape a chamber without requesting a hint.', icon: '🧠' },

  // 5. Riddles (9)
  { id: 'ach_riddle_first', title: 'Wit Awakened', cat: 'Riddles', desc: 'Solve your first festival riddle correctly.', icon: '💡' },
  { id: 'ach_riddles_10', title: 'Sage Apprentice', cat: 'Riddles', desc: 'Solve 10 riddles.', icon: '📜' },
  { id: 'ach_riddles_25', title: 'Philosopher of Light', cat: 'Riddles', desc: 'Solve 25 riddles.', icon: '🕯' },
  { id: 'ach_riddles_50', title: 'Centurion of Riddles', cat: 'Riddles', desc: 'Solve 50 riddles.', icon: '📖' },
  { id: 'ach_riddle_streak_5', title: 'Unbroken Mind', cat: 'Riddles', desc: 'Achieve a 5-riddle correct streak.', icon: '🔥' },
  { id: 'ach_riddle_streak_10', title: 'Oracle Streak', cat: 'Riddles', desc: 'Achieve a 10-riddle correct streak.', icon: '⚡' },
  { id: 'ach_expert_riddle', title: 'Master Riddle Cracker', cat: 'Riddles', desc: 'Solve an Expert tier riddle.', icon: '👑' },
  { id: 'ach_all_tiers_riddle', title: 'Omniscient Scholar', cat: 'Riddles', desc: 'Solve at least 1 riddle from each of the 4 tiers.', icon: '🎓' },
  { id: 'ach_riddle_speed', title: 'Instant Epiphany', cat: 'Riddles', desc: 'Solve a riddle on your first attempt instantly.', icon: '✨' },

  // 6. Puzzles (8)
  { id: 'ach_math_puzzle', title: 'Royal Mathematician', cat: 'Puzzles', desc: 'Solve a numeric safe sequence.', icon: '🔢' },
  { id: 'ach_deduction_puzzle', title: 'Deductive Leap', cat: 'Puzzles', desc: 'Link suspect alibis to physical evidence.', icon: '🔗' },
  { id: 'ach_symbol_match', title: 'Glyph Whisperer', cat: 'Puzzles', desc: 'Decode a festival glyph sequence.', icon: '🔯' },
  { id: 'ach_quiz_perfect', title: 'Ayodhya Scholar', cat: 'Puzzles', desc: 'Answer 5 festival quiz puzzles without an error.', icon: '📜' },
  { id: 'ach_puzzles_20', title: 'Puzzle Grandmaster', cat: 'Puzzles', desc: 'Solve 20 varied puzzles across Ayodhya.', icon: '🧩' },
  { id: 'ach_puzzle_hard', title: 'Hard Chamber Triumphant', cat: 'Puzzles', desc: 'Conquer a puzzle on Hard difficulty.', icon: '🏆' },
  { id: 'ach_safe_reset', title: 'Tactical Realignment', cat: 'Puzzles', desc: 'Regenerate a vault safe mechanism.', icon: '🔄' },
  { id: 'ach_logic_sequence', title: 'Harmonic Alignment', cat: 'Puzzles', desc: 'Align all 4 sacred oils without misplacing one.', icon: '🪔' },

  // 7. Festival Mastery (8)
  { id: 'ach_fragment_1', title: 'First Ember', cat: 'Festival Mastery', desc: 'Recover your 1st Flame Fragment.', icon: '🔥' },
  { id: 'ach_fragments_4', title: 'Halfway Illuminated', cat: 'Festival Mastery', desc: 'Recover 4 Flame Fragments.', icon: '🪔' },
  { id: 'ach_fragments_all', title: 'Eternal Flame Restored', cat: 'Festival Mastery', desc: 'Gather all 7 Sacred Flame Fragments.', icon: '🎆' },
  { id: 'ach_tribunal_unlocked', title: 'Tribunal Summoner', cat: 'Festival Mastery', desc: 'Unlock the Royal Accusation Chamber.', icon: '⚖' },
  { id: 'ach_rank_up', title: 'Royal Promotion', cat: 'Festival Mastery', desc: 'Advance your Detective Rank beyond Novice.', icon: '🎖' },
  { id: 'ach_rank_max', title: 'Grand Royal Inquisitor', cat: 'Festival Mastery', desc: 'Attain the highest mystery rank in the kingdom.', icon: '👑' },
  { id: 'ach_daily_blessing', title: 'Blessed by Lakshmi', cat: 'Festival Mastery', desc: 'Claim a Daily Diwali Blessing.', icon: '🎁' },
  { id: 'ach_streak_3', title: 'Dedicated Pilgrim', cat: 'Festival Mastery', desc: 'Maintain a 3-day login streak.', icon: '📅' },

  // 8. Time Challenges (8)
  { id: 'ach_play_10min', title: 'Attentive Vigil', cat: 'Time Challenges', desc: 'Investigate Ayodhya for 10 minutes total.', icon: '⏳' },
  { id: 'ach_play_30min', title: 'Tireless Detective', cat: 'Time Challenges', desc: 'Investigate Ayodhya for 30 minutes total.', icon: '⌛' },
  { id: 'ach_play_60min', title: 'Guardian of the Night', cat: 'Time Challenges', desc: 'Investigate Ayodhya for 1 hour total.', icon: '🌙' },
  { id: 'ach_rapid_search', title: 'Lightning Patrol', cat: 'Time Challenges', desc: 'Search 3 locations within 60 seconds.', icon: '⚡' },
  { id: 'ach_swift_interrogation', title: 'Crisp Deposition', cat: 'Time Challenges', desc: 'Question 3 suspects back-to-back.', icon: '🗣' },
  { id: 'ach_midnight_detective', title: 'Midnight Operation', cat: 'Time Challenges', desc: 'Play during the sacred night hours.', icon: '🌌' },
  { id: 'ach_speed_clue', title: 'Keen Eye', cat: 'Time Challenges', desc: 'Uncover 2 clues within 2 minutes.', icon: '👁' },
  { id: 'ach_escape_dash', title: 'Speedy Lockbreaker', cat: 'Time Challenges', desc: 'Crack 2 safes within 3 minutes.', icon: '⏱' },

  // 9. Hidden Secrets (6)
  { id: 'ach_secret_gemini', title: 'Oracle Invoker', cat: 'Hidden Secrets', desc: 'Consult the Gemini AI Oracle for guidance.', icon: '✨' },
  { id: 'ach_secret_theme', title: 'Chameleon of Ayodhya', cat: 'Hidden Secrets', desc: 'Try all 6 festive visual ambiance themes.', icon: '🎨' },
  { id: 'ach_secret_export', title: 'Archive Scribe', cat: 'Hidden Secrets', desc: 'Export your royal case dossier to disk.', icon: '💾' },
  { id: 'ach_secret_backup', title: 'Fortified Memories', cat: 'Hidden Secrets', desc: 'Create a local memory backup.', icon: '🛡' },
  { id: 'ach_secret_mastermind', title: 'Divine Insight', cat: 'Hidden Secrets', desc: 'Accuse Tara the Mechanist with the mechanical blueprint.', icon: '🔮' },
  { id: 'ach_secret_grand_ending', title: 'Festival Savior', cat: 'Hidden Secrets', desc: 'Achieve the Master Detective Ending.', icon: '🪔' }
];

// Collectibles definitions
const COLLECTIBLES_CATALOG = [
  { name: 'Golden Diya', rarity: 'Legendary', desc: 'A masterwork terracotta vessel bathed in pure molten gold.', icon: '🪔' },
  { name: 'Silver Lantern', rarity: 'Rare', desc: 'An artisan lantern perforated with sacred geometrical rangoli.', icon: '🏮' },
  { name: 'Lotus Coin', rarity: 'Common', desc: 'Standard minted Ayodhya currency bearing the divine lotus crest.', icon: '🪙' },
  { name: 'Sacred Bell', rarity: 'Rare', desc: 'Carved temple bell tuned to resonant spiritual frequencies.', icon: '🔔' },
  { name: 'Royal Key', rarity: 'Epic', desc: 'A dual-bit master key granting passage to inner palace vaults.', icon: '🗝' },
  { name: 'Festival Scroll', rarity: 'Common', desc: 'Scripture detailing hymns for lighting the Eternal Diya.', icon: '📜' },
  { name: 'Crystal Oil Pot', rarity: 'Epic', desc: 'Pure quartz vessel containing consecrated sesame blend.', icon: '🏺' },
  { name: 'Divine Lotus', rarity: 'Legendary', desc: 'A rare blue lotus plucked from the temple lake sanctuary.', icon: '🪷' },
  { name: 'Ruby Flame', rarity: 'Legendary', desc: 'A gemstone that glows with perpetual inner infrared warmth.', icon: '💎' },
  { name: 'Lakshmi Token', rarity: 'Rare', desc: 'Blessed silver token bestowed during the midnight Dhanteras rite.', icon: '✨' }
];

// ==========================================
// 2. STATE MANAGER CLASS
// ==========================================

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.initSuspects();
    this.checkDailyStreak();
    this.startPlayTimer();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(APP_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...INITIAL_STATE,
          ...parsed,
          profile: { ...INITIAL_STATE.profile, ...(parsed.profile || {}) },
          stats: { ...INITIAL_STATE.stats, ...(parsed.stats || {}) },
          fragments: { ...INITIAL_STATE.fragments, ...(parsed.fragments || {}) }
        };
      }
    } catch (e) {
      console.warn('Storage read fallback:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  save() {
    try {
      this.recalculateCompletion();
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(this.state));
      const lbl = document.getElementById('last-save-time-label');
      if (lbl) lbl.textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
    } catch (e) {
      console.warn('Storage save fallback:', e);
    }
  }

  initSuspects() {
    if (!this.state.suspectsData || Object.keys(this.state.suspectsData).length === 0) {
      this.state.suspectsData = {};
      INITIAL_SUSPECTS.forEach(s => {
        this.state.suspectsData[s.id] = {
          suspicion: s.suspicion,
          trust: s.trust,
          status: s.status,
          notes: []
        };
      });
    }
  }

  checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.state.stats.lastLoginDate;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (last === yesterday) {
        this.state.stats.loginStreak += 1;
        if (this.state.stats.loginStreak > this.state.stats.longestStreak) {
          this.state.stats.longestStreak = this.state.stats.loginStreak;
        }
      } else {
        this.state.stats.loginStreak = 1;
      }
      this.state.stats.lastLoginDate = today;
      this.save();
    }
  }

  startPlayTimer() {
    setInterval(() => {
      this.state.stats.totalPlayTime += 1;
      if (this.state.stats.totalPlayTime % 30 === 0) {
        this.save();
      }
      this.checkTimeAchievements();
    }, 1000);
  }

  addXP(amount) {
    this.state.stats.totalXP += amount;
    if (this.state.stats.totalXP > this.state.stats.highestXP) {
      this.state.stats.highestXP = this.state.stats.totalXP;
    }
    this.addCaseLog(`Gained +${amount} XP from detective deeds.`);
    this.save();
    this.checkRankAchievements();
  }

  addCoins(amount) {
    this.state.stats.coinsEarned += amount;
    this.addCaseLog(`Collected +${amount} festival coins.`);
    this.save();
    this.checkCollectionAchievements();
  }

  spendCoins(amount) {
    if (this.state.stats.coinsEarned >= amount) {
      this.state.stats.coinsEarned -= amount;
      this.state.stats.coinsSpent += amount;
      this.save();
      if (window.App) window.App.triggerAchievement('ach_spend_coins');
      return true;
    }
    return false;
  }

  addCaseLog(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state.caseLogs.unshift({ text, time });
    if (this.state.caseLogs.length > 30) this.state.caseLogs.pop();
    if (window.App && typeof window.App.renderCaseFeed === 'function') {
      window.App.renderCaseFeed();
    }
  }

  recalculateCompletion() {
    const frags = Object.values(this.state.fragments).filter(Boolean).length;
    const locs = Object.values(this.state.locationsProgress).filter(l => l.searched).length;
    const clues = this.state.evidence.length;
    const achs = Object.keys(this.state.unlockedAchievements).length;
    
    const pFrags = (frags / 7) * 40;
    const pLocs = (locs / 15) * 20;
    const pClues = Math.min(20, (clues / 15) * 20);
    const pAchs = (achs / 75) * 20;
    this.state.stats.completionPercentage = Math.min(100, Math.round(pFrags + pLocs + pClues + pAchs));
    this.state.stats.fragmentsFound = frags;
    this.state.stats.locationsVisited = locs;
    this.state.stats.achievementsEarned = achs;
  }

  checkRankAchievements() {
    const xp = this.state.stats.totalXP;
    if (xp >= 200 && window.App) window.App.triggerAchievement('ach_rank_up');
    if (xp >= 1500 && window.App) window.App.triggerAchievement('ach_rank_max');
  }

  checkCollectionAchievements() {
    const coins = this.state.stats.coinsEarned;
    if (coins >= 500 && window.App) window.App.triggerAchievement('ach_coins_500');
    if (coins >= 1000 && window.App) window.App.triggerAchievement('ach_coins_1000');
    const itemsCount = this.state.inventory.length;
    if (itemsCount >= 1 && window.App) window.App.triggerAchievement('ach_first_item');
    if (itemsCount >= 5 && window.App) window.App.triggerAchievement('ach_items_5');
    if (itemsCount >= 10 && window.App) window.App.triggerAchievement('ach_items_10');
  }

  checkTimeAchievements() {
    const t = this.state.stats.totalPlayTime;
    if (t >= 600 && window.App) window.App.triggerAchievement('ach_play_10min');
    if (t >= 1800 && window.App) window.App.triggerAchievement('ach_play_30min');
    if (t >= 3600 && window.App) window.App.triggerAchievement('ach_play_60min');
    const hr = new Date().getHours();
    if (hr >= 0 && hr <= 3 && window.App) window.App.triggerAchievement('ach_midnight_detective');
  }
}

// ==========================================
// 3. SYNTHESIZED WEB AUDIO ENGINE
// ==========================================

class AudioSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
    if (!window.App || !window.App.stateManager.state.profile.audioEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio muted or blocked
    }
  }

  click() { this.playTone(600, 'triangle', 0.05, 0.04); }
  success() {
    this.playTone(523.25, 'sine', 0.1, 0.08);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.08), 90);
    setTimeout(() => this.playTone(783.99, 'sine', 0.22, 0.1), 180);
  }
  fail() {
    this.playTone(280, 'sawtooth', 0.15, 0.08);
    setTimeout(() => this.playTone(210, 'sawtooth', 0.22, 0.08), 110);
  }
  fragment() {
    [440, 554, 659, 880].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.18, 0.12), i * 85);
    });
  }
}

// ==========================================
// 4. GEMINI AI INTEGRATION ORACLE
// ==========================================

class GeminiOracle {
  constructor() {
    try {
      this.apiKey = localStorage.getItem(GEMINI_STORAGE_KEY) || '';
    } catch (e) {
      this.apiKey = '';
    }
  }

  setKey(key) {
    this.apiKey = (key || '').trim();
    try {
      localStorage.setItem(GEMINI_STORAGE_KEY, this.apiKey);
    } catch (e) {}
  }

  getKey() {
    return this.apiKey;
  }

  async callGemini(prompt, systemInstruction = '') {
    if (!this.apiKey) {
      throw new Error('API_KEY_MISSING');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(this.apiKey)}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 600
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('EMPTY_RESPONSE');
      if (window.App) window.App.triggerAchievement('ach_secret_gemini');
      return text.trim();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async generateSuspectDialogue(suspectId, userPrompt) {
    const suspect = INITIAL_SUSPECTS.find(s => s.id === suspectId);
    const suspectName = suspect ? suspect.name : 'Suspect';

    const systemPrompt = `You are roleplaying as ${suspectName} (${suspect?.role}) in ancient Ayodhya during Diwali. The sacred Eternal Diya was stolen. Answer concisely in 2 to 3 sentences in character.`;

    try {
      return await this.callGemini(userPrompt, systemPrompt);
    } catch (e) {
      const offlineReplies = [
        `"By the sacred flames, detective, I have told you everything I witnessed near the sanctum corridor!"`,
        `"You gaze upon me with suspicion, yet my hands are occupied only with festival devotions."`,
        `"Listen closely: examine the lock mechanisms and the sulfur traces in the courtyard before accusing me."`,
        `"The true thief moves like smoke through the palace ducts. Do not squander precious time interrogating me!"`
      ];
      return offlineReplies[Math.floor(Math.random() * offlineReplies.length)];
    }
  }

  async generateHint(districtName) {
    const prompt = `Provide a cryptic detective hint for finding clues in ${districtName} during Diwali. Maximum 2 sentences.`;
    try {
      return await this.callGemini(prompt, 'You are the Royal Astrologer and festival oracle of Ayodhya.');
    } catch (e) {
      return `The stars reveal that searching the shadowed corners and questioning the artisans of ${districtName} will unearth crucial relics.`;
    }
  }

  async generateRiddle(difficulty) {
    const prompt = `Generate 1 unique Diwali festival riddle of ${difficulty} difficulty. Format strictly: Riddle: <text> | Answer: <word>`;
    try {
      return await this.callGemini(prompt, 'You are an ancient Sanskrit riddle master.');
    } catch (e) {
      return `Riddle: Born in clay, fed on ghee, I shine my brightest for all to see. | Answer: Diya`;
    }
  }

  async generateEnding(suspectName, motive, evidenceTitle, isCorrect) {
    const prompt = `Write a short dramatic conclusion (150 words) for the mystery of the Eternal Diya. Detective accused ${suspectName} for motive of ${motive} with evidence '${evidenceTitle}'. The accusation was ${isCorrect ? 'ACCURATE AND TRIUMPHANT' : 'FALSE AND DISASTROUS'}.`;
    try {
      return await this.callGemini(prompt, 'You are the grand royal chronicler of Ayodhya.');
    } catch (e) {
      if (isCorrect) {
        return `As the High Tribunal convened under the golden canopy of Ayodhya, Detective ${window.App.stateManager.state.profile.name} presented ${evidenceTitle}. ${suspectName} could deny the truth no longer! The motive of ${motive} was laid bare before the court. With the recovery of the Eternal Diya, hundreds of thousands of terracotta lamps flared into dazzling radiance across the kingdom. Darkness fled, and eternal prosperity was restored for Diwali!`;
      } else {
        return `Silence descended over the royal sanctum as Detective ${window.App.stateManager.state.profile.name} accused ${suspectName}. But the proof faltered; ${evidenceTitle} was revealed to be a clever decoy. As the wrong suspect was released, shadows lengthened over Ayodhya, and the true mastermind slipped into the mist of the Whispering Forest. The kingdom must remain vigilant!`;
      }
    }
  }
}

// ==========================================
// 5. MASTER APP ENGINE & CONTROLLER
// ==========================================

const App = {
  stateManager: null,
  audio: null,
  gemini: null,

  currentSafeCode: [1, 2, 3, 4],
  currentSafeDialValues: [0, 0, 0, 0],
  currentRiddleTier: 'easy',
  currentRiddleIndex: 0,
  activeInterrogateSuspectId: null,
  memoryBoard: [],
  memoryRevealed: [],
  memoryMatches: 0,
  memoryMoves: 0,
  memoryLocked: false,
  logicSelectedItems: [],

  init() {
    this.stateManager = new StateManager();
    this.audio = new AudioSynth();
    this.gemini = new GeminiOracle();

    this.applyTheme(this.stateManager.state.profile.theme);
    this.applyFontSize(this.stateManager.state.profile.fontSize);
    this.initSparkles();
    this.bindEvents();
    this.updateHeaderStats();
    this.renderCaseFeed();
    this.renderLocations();
    this.renderFragments();
    this.renderEvidence();
    this.renderSuspects();
    this.renderInventory();
    this.renderAchievements();
    this.renderStatistics();
    this.renderAnalytics();
    this.initSafePuzzle();
    this.initMemoryPuzzle();
    this.loadRiddle(0);
    this.initLogicChamber();
    this.syncSettingsUI();
    this.registerPWA();
  },

  // Global Fail-Safe Event Delegation
  bindEvents() {
    document.addEventListener('click', (e) => {
      // 1. Navigation links
      const navBtn = e.target.closest('[data-section]');
      if (navBtn) {
        const secId = navBtn.getAttribute('data-section');
        this.switchSection(secId);
        return;
      }

      // 2. Jump buttons
      const jumpBtn = e.target.closest('[data-jump]');
      if (jumpBtn) {
        const secId = jumpBtn.getAttribute('data-jump');
        this.switchSection(secId);
        return;
      }

      // 3. Modal close buttons
      const closeBtn = e.target.closest('[data-close-modal]');
      if (closeBtn) {
        const modalId = closeBtn.getAttribute('data-close-modal');
        this.closeModal(modalId);
        return;
      }

      // 4. Data Action buttons
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        const act = actionBtn.getAttribute('data-action');
        this.handleAction(act, actionBtn);
        return;
      }

      // 5. Puzzle sub-tabs
      const tabBtn = e.target.closest('[data-ptab]');
      if (tabBtn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.puzzle-subview').forEach(v => v.classList.remove('active'));
        tabBtn.classList.add('active');
        const target = tabBtn.getAttribute('data-ptab');
        const view = document.getElementById(target);
        if (view) view.classList.add('active');
        this.audio.click();
        return;
      }

      // 6. Riddle tier chips
      const rTierChip = e.target.closest('[data-rtier]');
      if (rTierChip) {
        document.querySelectorAll('[data-rtier]').forEach(c => c.classList.remove('chip-active'));
        rTierChip.classList.add('chip-active');
        this.currentRiddleTier = rTierChip.getAttribute('data-rtier');
        this.loadRiddle(0);
        this.audio.click();
        return;
      }

      // 7. Inventory rarity chips
      const iRarityChip = e.target.closest('[data-irarity]');
      if (iRarityChip) {
        document.querySelectorAll('[data-irarity]').forEach(c => c.classList.remove('chip-active'));
        iRarityChip.classList.add('chip-active');
        this.renderInventory(iRarityChip.getAttribute('data-irarity'));
        this.audio.click();
        return;
      }

      // 8. Achievement category chips
      const aCatChip = e.target.closest('[data-acat]');
      if (aCatChip) {
        document.querySelectorAll('[data-acat]').forEach(c => c.classList.remove('chip-active'));
        aCatChip.classList.add('chip-active');
        this.renderAchievements(aCatChip.getAttribute('data-acat'));
        this.audio.click();
        return;
      }

      // 9. Mobile menu toggle
      if (e.target.closest('#mobile-menu-btn')) {
        const nav = document.getElementById('main-nav');
        if (nav) nav.classList.toggle('mobile-open');
        this.audio.click();
        return;
      }

      // 10. Avatar sigil picker
      const avatarBtn = e.target.closest('.avatar-option');
      if (avatarBtn) {
        document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('active'));
        avatarBtn.classList.add('active');
        this.stateManager.state.profile.sigil = avatarBtn.getAttribute('data-sigil') || '🕵';
        this.audio.click();
        return;
      }
    });

    // Form inputs and change listeners
    document.getElementById('loc-search-input')?.addEventListener('input', () => this.renderLocations());
    document.getElementById('loc-filter-status')?.addEventListener('change', () => this.renderLocations());
    document.getElementById('loc-sort-order')?.addEventListener('change', () => this.renderLocations());
    document.getElementById('evidence-search')?.addEventListener('input', () => this.renderEvidence());
    document.getElementById('evidence-filter-tag')?.addEventListener('change', () => this.renderEvidence());
    document.getElementById('import-file-input')?.addEventListener('change', (e) => this.handleImportFile(e));

    // Settings
    document.getElementById('setting-theme-select')?.addEventListener('change', (e) => {
      this.applyTheme(e.target.value);
      this.stateManager.state.profile.theme = e.target.value;
      this.stateManager.save();
      this.triggerAchievement('ach_secret_theme');
    });
    document.getElementById('setting-font-size')?.addEventListener('change', (e) => {
      this.applyFontSize(e.target.value);
      this.stateManager.state.profile.fontSize = e.target.value;
      this.stateManager.save();
    });
    document.getElementById('setting-difficulty')?.addEventListener('change', (e) => {
      this.stateManager.state.profile.difficulty = e.target.value;
      this.stateManager.save();
      this.showToast(`Investigation rigor: ${e.target.value.toUpperCase()}`);
    });
    document.getElementById('setting-audio-toggle')?.addEventListener('change', (e) => {
      this.stateManager.state.profile.audioEnabled = e.target.checked;
      this.stateManager.save();
    });
    document.getElementById('setting-hints-toggle')?.addEventListener('change', (e) => {
      this.stateManager.state.profile.hintsEnabled = e.target.checked;
      this.stateManager.save();
    });
    document.getElementById('setting-notifications-toggle')?.addEventListener('change', (e) => {
      this.stateManager.state.profile.notificationsEnabled = e.target.checked;
      this.stateManager.save();
    });
    document.getElementById('setting-sparkles-toggle')?.addEventListener('change', (e) => {
      this.stateManager.state.profile.sparklesEnabled = e.target.checked;
      this.stateManager.save();
      this.initSparkles();
    });
  },

  handleAction(actionName, triggerEl) {
    this.audio.click();
    switch (actionName) {
      case 'open-profile':
        this.openProfileModal();
        break;
      case 'daily-blessing':
        this.claimDailyBlessing();
        break;
      case 'clear-log':
        this.stateManager.state.caseLogs = [{ text: 'Case log cleared by royal decree.', time: 'Just now' }];
        this.renderCaseFeed();
        break;
      case 'submit-safe':
        this.checkSafeCombination();
        break;
      case 'new-safe':
        this.initSafePuzzle(true);
        break;
      case 'safe-hint':
        this.useSafeHint();
        break;
      case 'reset-memory':
        this.initMemoryPuzzle();
        break;
      case 'next-riddle':
        this.nextRiddle();
        break;
      case 'open-tribunal':
        this.openTribunalModal();
        break;
      case 'open-note-modal':
        this.openNoteModal();
        break;
      case 'manual-save':
        this.stateManager.save();
        this.showToast('💾 Checkpoint secured in palace records!');
        this.audio.success();
        break;
      case 'quick-load':
        this.stateManager.state = this.stateManager.loadState();
        this.init();
        this.showToast('🔄 Case dossier reloaded from storage!');
        break;
      case 'backup-save':
        try {
          sessionStorage.setItem('ETERNAL_DIYA_BACKUP', JSON.stringify(this.stateManager.state));
          this.triggerAchievement('ach_secret_backup');
          this.showToast('📦 In-memory emergency backup created.');
          this.audio.success();
        } catch (e) {
          this.showToast('⚠️ Backup session storage unavailable.');
        }
        break;
      case 'reset-save':
        if (confirm('⚠️ Are you certain? This will completely erase all investigation progress, items, and fragments!')) {
          try { localStorage.removeItem(APP_STORAGE_KEY); } catch(e) {}
          location.reload();
        }
        break;
      case 'export-all':
        this.exportJSON(this.stateManager.state, 'Ayodhya_Dossier_Complete.json');
        break;
      case 'export-profile':
        this.exportJSON(this.stateManager.state.profile, 'Detective_Profile.json');
        break;
      case 'export-evidence':
        this.exportJSON(this.stateManager.state.evidence, 'Evidence_Ledger.json');
        break;
      case 'export-inventory':
        this.exportJSON(this.stateManager.state.inventory, 'Satchel_Inventory.json');
        break;
      case 'export-stats':
        this.exportJSON(this.stateManager.state.stats, 'Investigation_Stats.json');
        break;
      case 'save-profile':
        this.saveProfile();
        break;
      case 'save-note':
        this.saveUserNote();
        break;
      case 'toggle-suspect-mark':
        this.toggleChiefSuspect();
        break;
      case 'clear-suspect':
        this.clearSuspectVindication();
        break;
      case 'ask-oracle':
        this.askSuspectCustomQuery();
        break;
      case 'execute-verdict':
        this.executeVerdict();
        break;
      case 'close-ending':
        this.closeModal('modal-ending');
        this.switchSection('sec-home');
        break;
      case 'test-gemini':
        this.testGeminiConnection();
        break;
      default:
        break;
    }
  },

  switchSection(sectionId) {
    document.querySelectorAll('.game-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const targetSec = document.getElementById(sectionId);
    if (targetSec) {
      targetSec.classList.add('active');
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    }

    const mainNav = document.getElementById('main-nav');
    if (mainNav) mainNav.classList.remove('mobile-open');

    this.audio.click();

    if (sectionId === 'sec-statistics') this.renderStatistics();
    if (sectionId === 'sec-analytics') this.renderAnalytics();
    if (sectionId === 'sec-fragments') this.renderFragments();
    if (sectionId === 'sec-evidence') this.renderEvidence();
    if (sectionId === 'sec-achievements') this.renderAchievements();
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove('active');
      el.style.display = 'none';
    }
    this.audio.click();
  },

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.style.display = 'flex';
      el.classList.add('active');
    }
  },

  applyTheme(themeKey) {
    document.body.setAttribute('data-theme', themeKey);
    const sel = document.getElementById('setting-theme-select');
    if (sel) sel.value = themeKey;
  },

  applyFontSize(sizeKey) {
    document.body.classList.remove('font-large', 'font-xlarge');
    if (sizeKey === 'large') document.body.classList.add('font-large');
    if (sizeKey === 'xlarge') document.body.classList.add('font-xlarge');
    const sel = document.getElementById('setting-font-size');
    if (sel) sel.value = sizeKey;
  },

  initSparkles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    if (!this.stateManager.state.profile.sparklesEnabled) return;

    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      dot.className = 'sparkle-dot';
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.animationDelay = `${Math.random() * 10}s`;
      dot.style.animationDuration = `${7 + Math.random() * 8}s`;
      canvas.appendChild(dot);
    }
  },

  showToast(message) {
    if (!this.stateManager.state.profile.notificationsEnabled) return;
    const shelf = document.getElementById('toast-container');
    if (!shelf) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
    shelf.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  updateHeaderStats() {
    const s = this.stateManager.state;
    const lvl = Math.floor(s.stats.totalXP / 100) + 1;
    const frags = Object.values(s.fragments).filter(Boolean).length;

    const hdrLvl = document.getElementById('hdr-level');
    const hdrCoins = document.getElementById('hdr-coins');
    const hdrFrags = document.getElementById('hdr-fragments');
    if (hdrLvl) hdrLvl.textContent = `Lvl ${lvl}`;
    if (hdrCoins) hdrCoins.textContent = s.stats.coinsEarned;
    if (hdrFrags) hdrFrags.textContent = `${frags}/7`;

    const dashAvatar = document.getElementById('dash-avatar');
    const dashName = document.getElementById('dash-name');
    const dashRank = document.getElementById('dash-rank');
    const dashXP = document.getElementById('dash-xp');
    const dashComp = document.getElementById('dash-completion');
    const dashStreak = document.getElementById('dash-streak');

    if (dashAvatar) dashAvatar.textContent = s.profile.sigil;
    if (dashName) dashName.textContent = s.profile.name;
    if (dashRank) dashRank.textContent = this.calculateRankTitle(s.stats.totalXP);
    if (dashXP) dashXP.textContent = `${s.stats.totalXP} XP`;
    if (dashComp) dashComp.textContent = `${s.stats.completionPercentage}%`;
    if (dashStreak) dashStreak.textContent = `${s.stats.loginStreak} Day${s.stats.loginStreak > 1 ? 's' : ''}`;

    const curXPInLvl = s.stats.totalXP % 100;
    const xpFill = document.getElementById('xp-progress-fill');
    const xpCurLbl = document.getElementById('xp-current-label');
    const xpNxtLbl = document.getElementById('xp-next-label');

    if (xpFill) xpFill.style.width = `${curXPInLvl}%`;
    if (xpCurLbl) xpCurLbl.textContent = `Level ${lvl} Progress: ${curXPInLvl} / 100 XP`;
    if (xpNxtLbl) xpNxtLbl.textContent = `Next: Level ${lvl + 1}`;
  },

  calculateRankTitle(xp) {
    if (xp < 100) return 'Palace Novice';
    if (xp < 250) return 'Ayodhya Scout';
    if (xp < 500) return 'Festival Investigator';
    if (xp < 900) return 'Royal Detective';
    if (xp < 1500) return 'Chief Inquisitor';
    return 'Grand Master of Light';
  },

  renderCaseFeed() {
    const list = document.getElementById('live-case-feed');
    if (!list) return;
    list.innerHTML = '';
    this.stateManager.state.caseLogs.slice(0, 10).forEach(log => {
      const item = document.createElement('div');
      item.className = 'feed-item';
      item.innerHTML = `<span>${log.text}</span> <span class="feed-time">${log.time}</span>`;
      list.appendChild(item);
    });
  },

  claimDailyBlessing() {
    const today = new Date().toISOString().split('T')[0];
    if (this.stateManager.state.dailyClaimedDate === today) {
      this.showToast('🪔 You have already received Goddess Lakshmi’s blessing today!');
      return;
    }

    const bonusCoins = 50 * this.stateManager.state.stats.loginStreak;
    const bonusXP = 40;
    this.stateManager.state.dailyClaimedDate = today;
    this.stateManager.addCoins(bonusCoins);
    this.stateManager.addXP(bonusXP);
    this.triggerAchievement('ach_daily_blessing');
    this.triggerAchievement('ach_streak_3');
    this.showToast(`🎁 Daily Blessing: +${bonusCoins} coins & +${bonusXP} XP!`);
    this.audio.success();
    this.updateHeaderStats();
  },

  // ------------------------------------------
  // Locations & Exploration
  // ------------------------------------------
  renderLocations() {
    const grid = document.getElementById('locations-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const query = (document.getElementById('loc-search-input')?.value || '').toLowerCase();
    const filter = document.getElementById('loc-filter-status')?.value || 'all';
    const sort = document.getElementById('loc-sort-order')?.value || 'name';

    let list = GAME_LOCATIONS.filter(loc => {
      const prog = this.stateManager.state.locationsProgress[loc.id] || { searched: false, count: 0 };
      const hasFrag = loc.fragmentId && this.stateManager.state.fragments[loc.fragmentId];
      if (filter === 'unvisited' && prog.searched) return false;
      if (filter === 'searched' && !prog.searched) return false;
      if (filter === 'cleared' && !hasFrag) return false;
      if (query && !loc.name.toLowerCase().includes(query) && !loc.story.toLowerCase().includes(query)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === 'threat') return b.threat.localeCompare(a.threat);
      if (sort === 'xp') return b.xpYield - a.xpYield;
      return a.name.localeCompare(b.name);
    });

    list.forEach(loc => {
      const prog = this.stateManager.state.locationsProgress[loc.id] || { count: 0, searched: false };
      const fragRecovered = loc.fragmentId && this.stateManager.state.fragments[loc.fragmentId];

      const card = document.createElement('div');
      card.className = 'card card-ornate location-card';
      card.innerHTML = `
        <div>
          <div class="location-header">
            <h3 class="location-title"><span>${loc.symbol}</span> ${loc.name}</h3>
            <span class="location-badge">${loc.badge}</span>
          </div>
          <p class="location-story">${loc.story}</p>
        </div>
        <div class="location-meta-row">
          <span class="meta-tag">Danger: <strong>${loc.threat}</strong></span>
          <span class="meta-tag">XP: <strong>+${loc.xpYield}</strong></span>
          <span class="meta-tag">Searches: <strong>${prog.count}</strong></span>
          ${fragRecovered ? '<span class="meta-tag" style="color:var(--accent-gold-light)">🔥 Fragment Salvaged</span>' : ''}
        </div>
        <div>
          <button type="button" class="btn btn-primary" style="width:100%;" onclick="window.App.searchLocation('${loc.id}')">
            🔍 Search District
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  searchLocation(locId) {
    const loc = GAME_LOCATIONS.find(l => l.id === locId);
    if (!loc) return;

    if (!this.stateManager.state.locationsProgress[loc.id]) {
      this.stateManager.state.locationsProgress[loc.id] = { count: 0, searched: false };
    }

    const prog = this.stateManager.state.locationsProgress[loc.id];
    prog.count += 1;
    prog.searched = true;

    this.stateManager.addXP(loc.xpYield);
    const coinsFound = Math.floor(15 + Math.random() * 25);
    this.stateManager.addCoins(coinsFound);

    const randLootName = loc.lootPool[Math.floor(Math.random() * loc.lootPool.length)];
    const catalogItem = COLLECTIBLES_CATALOG.find(c => c.name === randLootName);
    if (catalogItem && Math.random() < 0.65) {
      this.addToInventory(catalogItem);
    }

    if (Math.random() < 0.6) {
      this.discoverClue(loc);
    }

    if (loc.fragmentId && !this.stateManager.state.fragments[loc.fragmentId]) {
      this.recoverFlameFragment(loc.fragmentId);
    }

    const totalSearches = Object.values(this.stateManager.state.locationsProgress).reduce((acc, cur) => acc + cur.count, 0);
    const uniqueVisited = Object.keys(this.stateManager.state.locationsProgress).length;

    this.triggerAchievement('ach_first_district');
    if (uniqueVisited >= 5) this.triggerAchievement('ach_districts_5');
    if (uniqueVisited >= 10) this.triggerAchievement('ach_districts_10');
    if (uniqueVisited >= 15) this.triggerAchievement('ach_districts_15');
    if (totalSearches >= 20) this.triggerAchievement('ach_search_20');
    if (totalSearches >= 50) this.triggerAchievement('ach_search_50');

    if (loc.id === 'loc_whispering_forest') this.triggerAchievement('ach_whispering_forest');
    if (loc.id === 'loc_hidden_tunnel') this.triggerAchievement('ach_tunnel_delver');
    if (loc.id === 'loc_palace_rooftop') this.triggerAchievement('ach_rooftop_gaze');

    this.audio.success();
    this.showToast(`🔍 Explored ${loc.name}! (+${loc.xpYield} XP, +${coinsFound} coins)`);
    this.updateHeaderStats();
    this.renderLocations();
  },

  discoverClue(loc) {
    const clueTitles = [
      `Powder residue from ${loc.name}`,
      `Witness testimony logged at ${loc.name}`,
      `Unidentified footprint near ${loc.name} gate`,
      `Altar blueprint fragment found at ${loc.name}`
    ];
    const pickedTitle = clueTitles[Math.floor(Math.random() * clueTitles.length)];

    const exists = this.stateManager.state.evidence.some(e => e.title === pickedTitle);
    if (!exists) {
      const newClue = {
        id: 'clue_' + Date.now(),
        title: pickedTitle,
        category: Math.random() < 0.5 ? 'Physical' : 'Statement',
        desc: `Discovered during an extensive royal search of ${loc.name}. May correlate with suspect alibis.`,
        pinned: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.stateManager.state.evidence.push(newClue);
      this.stateManager.state.stats.cluesFound += 1;
      this.stateManager.state.stats.evidenceCollected += 1;
      this.stateManager.save();
      this.triggerAchievement('ach_first_clue');
      if (this.stateManager.state.evidence.length >= 10) this.triggerAchievement('ach_clues_10');
      if (this.stateManager.state.evidence.length >= 25) this.triggerAchievement('ach_clues_25');
      this.showToast(`📜 New clue: "${pickedTitle}"`);
    }
  },

  addToInventory(catalogItem) {
    const existing = this.stateManager.state.inventory.find(i => i.name === catalogItem.name);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      this.stateManager.state.inventory.push({
        id: 'item_' + Date.now() + Math.random().toString(36).substring(2, 6),
        name: catalogItem.name,
        rarity: catalogItem.rarity,
        desc: catalogItem.desc,
        icon: catalogItem.icon,
        count: 1
      });
    }

    if (catalogItem.rarity === 'Rare') this.triggerAchievement('ach_rare_item');
    if (catalogItem.rarity === 'Epic') this.triggerAchievement('ach_epic_item');
    if (catalogItem.rarity === 'Legendary') this.triggerAchievement('ach_legendary_item');

    this.stateManager.save();
    this.showToast(`🎒 Received: ${catalogItem.icon} ${catalogItem.name}!`);
  },

  // ------------------------------------------
  // Vault Safe Escape Chamber
  // ------------------------------------------
  initSafePuzzle(forceNew = false) {
    if (forceNew || !this.currentSafeCode) {
      this.currentSafeCode = [
        Math.floor(1 + Math.random() * 8),
        Math.floor(1 + Math.random() * 8),
        Math.floor(1 + Math.random() * 8),
        Math.floor(1 + Math.random() * 8)
      ];
      this.currentSafeDialValues = [0, 0, 0, 0];
      this.triggerAchievement('ach_safe_reset');
    }

    const c = this.currentSafeCode;
    const clueText = document.getElementById('vault-clue-text');
    if (clueText) {
      clueText.textContent = `Dial Formula: (I + II = ${c[0] + c[1]}) | (III × IV = ${c[2] * c[3]}) | (Sum of all 4 = ${c[0] + c[1] + c[2] + c[3]})`;
    }

    const dialsContainer = document.getElementById('safe-dials-container');
    if (!dialsContainer) return;
    dialsContainer.innerHTML = '';

    for (let i = 0; i < 4; i++) {
      const dialCol = document.createElement('div');
      dialCol.className = 'dial-column';
      dialCol.innerHTML = `
        <button type="button" class="dial-btn" onclick="window.App.adjustDial(${i}, 1)">▲</button>
        <div class="dial-value" id="dial-val-${i}">${this.currentSafeDialValues[i]}</div>
        <button type="button" class="dial-btn" onclick="window.App.adjustDial(${i}, -1)">▼</button>
      `;
      dialsContainer.appendChild(dialCol);
    }
  },

  adjustDial(index, delta) {
    let val = this.currentSafeDialValues[index] + delta;
    if (val > 9) val = 0;
    if (val < 0) val = 9;
    this.currentSafeDialValues[index] = val;
    const el = document.getElementById(`dial-val-${index}`);
    if (el) el.textContent = val;
    this.audio.click();
  },

  checkSafeCombination() {
    const isCorrect = this.currentSafeDialValues.every((val, idx) => val === this.currentSafeCode[idx]);

    if (isCorrect) {
      this.audio.success();
      this.stateManager.addXP(100);
      this.stateManager.addCoins(50);
      this.stateManager.state.stats.roomsEscaped += 1;
      this.stateManager.state.stats.puzzlesSolved += 1;
      this.triggerAchievement('ach_first_safe');
      this.triggerAchievement('ach_math_puzzle');
      if (this.stateManager.state.stats.roomsEscaped >= 5) this.triggerAchievement('ach_safes_5');
      if (this.stateManager.state.stats.roomsEscaped >= 15) this.triggerAchievement('ach_rooms_15');
      this.showToast('🔓 Safe Unlocked! Recovered 50 Coins and +100 XP!');
      this.initSafePuzzle(true);
    } else {
      this.audio.fail();
      this.showToast('❌ The gears grind to a halt. Incorrect combination!');
    }
  },

  useSafeHint() {
    if (this.stateManager.spendCoins(30)) {
      this.audio.click();
      const hintIdx = Math.floor(Math.random() * 4);
      this.showToast(`💡 Forensic Lens reveals: Dial #${hintIdx + 1} is '${this.currentSafeCode[hintIdx]}'`);
    } else {
      this.showToast('💰 Not enough coins! 30 festival coins required.');
      this.audio.fail();
    }
  },

  // ------------------------------------------
  // Rangoli Memory Match (4x4)
  // ------------------------------------------
  initMemoryPuzzle() {
    const symbols = ['🪔', '🏮', '✨', '🌸', '👑', '🪙', '🛕', '🔥'];
    this.memoryBoard = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    this.memoryRevealed = [];
    this.memoryMatches = 0;
    this.memoryMoves = 0;
    this.memoryLocked = false;

    const pairsLbl = document.getElementById('memory-pairs-count');
    const movesLbl = document.getElementById('memory-moves-count');
    if (pairsLbl) pairsLbl.textContent = '0 / 8';
    if (movesLbl) movesLbl.textContent = '0';

    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.memoryBoard.forEach((sym, idx) => {
      const tile = document.createElement('div');
      tile.className = 'memory-tile';
      tile.setAttribute('data-idx', idx);
      tile.textContent = '❓';
      tile.addEventListener('click', () => this.flipMemoryTile(idx, tile));
      grid.appendChild(tile);
    });
  },

  flipMemoryTile(index, tileEl) {
    if (this.memoryLocked || this.memoryRevealed.includes(index) || tileEl.classList.contains('matched')) return;

    this.audio.click();
    tileEl.textContent = this.memoryBoard[index];
    tileEl.classList.add('revealed');
    this.memoryRevealed.push(index);

    if (this.memoryRevealed.length === 2) {
      this.memoryMoves += 1;
      const movesLbl = document.getElementById('memory-moves-count');
      if (movesLbl) movesLbl.textContent = this.memoryMoves;

      const [firstIdx, secondIdx] = this.memoryRevealed;
      if (this.memoryBoard[firstIdx] === this.memoryBoard[secondIdx]) {
        this.memoryMatches += 1;
        const pairsLbl = document.getElementById('memory-pairs-count');
        if (pairsLbl) pairsLbl.textContent = `${this.memoryMatches} / 8`;

        document.querySelectorAll(`.memory-tile[data-idx="${firstIdx}"], .memory-tile[data-idx="${secondIdx}"]`).forEach(t => {
          t.classList.add('matched');
        });
        this.memoryRevealed = [];
        this.audio.success();

        if (this.memoryMatches === 8) {
          this.stateManager.addXP(120);
          this.stateManager.addCoins(60);
          this.stateManager.state.stats.puzzlesSolved += 1;
          this.triggerAchievement('ach_memory_3');
          if (this.memoryMoves <= 20) this.triggerAchievement('ach_memory_clean');
          this.showToast('🎴 Rangoli Memory complete! (+120 XP, +60 Coins)');
        }
      } else {
        this.memoryLocked = true;
        setTimeout(() => {
          document.querySelectorAll(`.memory-tile[data-idx="${firstIdx}"], .memory-tile[data-idx="${secondIdx}"]`).forEach(t => {
            t.classList.remove('revealed');
            t.textContent = '❓';
          });
          this.memoryRevealed = [];
          this.memoryLocked = false;
        }, 900);
      }
    }
  },

  // ------------------------------------------
  // 200 Riddles Engine
  // ------------------------------------------
  loadRiddle(index) {
    const tierList = RIDDLE_DATABASE[this.currentRiddleTier] || RIDDLE_DATABASE.easy;
    this.currentRiddleIndex = index % tierList.length;
    const riddle = tierList[this.currentRiddleIndex];

    const tag = document.getElementById('riddle-id-tag');
    const prompt = document.getElementById('riddle-prompt-text');
    const optContainer = document.getElementById('riddle-options-container');

    if (tag) tag.textContent = `Tier: ${this.currentRiddleTier.toUpperCase()} • Riddle #${this.currentRiddleIndex + 1} of ${tierList.length}`;
    if (prompt) prompt.textContent = `"${riddle.q}"`;
    if (!optContainer) return;

    optContainer.innerHTML = '';
    riddle.a.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'riddle-opt-btn';
      btn.textContent = `${String.fromCharCode(65 + optIdx)}. ${opt}`;
      btn.addEventListener('click', () => this.answerRiddle(optIdx, riddle.c, btn));
      optContainer.appendChild(btn);
    });
  },

  answerRiddle(chosenIdx, correctIdx, btnEl) {
    const allBtns = document.querySelectorAll('.riddle-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (chosenIdx === correctIdx) {
      btnEl.classList.add('correct');
      this.audio.success();
      this.stateManager.state.stats.riddlesSolved += 1;
      this.stateManager.state.riddleStreak += 1;
      this.stateManager.addXP(40);
      this.stateManager.addCoins(20);

      const rSolv = document.getElementById('riddles-solved-counter');
      const rStrk = document.getElementById('riddles-streak-counter');
      if (rSolv) rSolv.textContent = this.stateManager.state.stats.riddlesSolved;
      if (rStrk) rStrk.textContent = this.stateManager.state.riddleStreak;

      this.triggerAchievement('ach_riddle_first');
      if (this.stateManager.state.stats.riddlesSolved >= 10) this.triggerAchievement('ach_riddles_10');
      if (this.stateManager.state.stats.riddlesSolved >= 25) this.triggerAchievement('ach_riddles_25');
      if (this.stateManager.state.stats.riddlesSolved >= 50) this.triggerAchievement('ach_riddles_50');
      if (this.stateManager.state.riddleStreak >= 5) this.triggerAchievement('ach_riddle_streak_5');
      if (this.stateManager.state.riddleStreak >= 10) this.triggerAchievement('ach_riddle_streak_10');
      if (this.currentRiddleTier === 'expert') this.triggerAchievement('ach_expert_riddle');

      this.showToast('✨ Correct Answer! (+40 XP, +20 Coins)');
    } else {
      btnEl.classList.add('wrong');
      if (allBtns[correctIdx]) allBtns[correctIdx].classList.add('correct');
      this.audio.fail();
      this.stateManager.state.riddleStreak = 0;
      const rStrk = document.getElementById('riddles-streak-counter');
      if (rStrk) rStrk.textContent = '0';
      this.showToast('❌ Incorrect answer!');
    }
  },

  nextRiddle() {
    this.audio.click();
    this.loadRiddle(this.currentRiddleIndex + 1);
  },

  // ------------------------------------------
  // Logic Chamber (Oil density balancer)
  // ------------------------------------------
  initLogicChamber() {
    const stage = document.getElementById('logic-puzzle-stage');
    if (!stage) return;

    const oils = [
      { id: 'mustard', name: 'Mustard Extract', weight: 4 },
      { id: 'sesame', name: 'Black Sesame', weight: 3 },
      { id: 'sandalwood', name: 'Sandalwood Essence', weight: 2 },
      { id: 'camphor', name: 'Liquid Camphor', weight: 1 }
    ];

    stage.innerHTML = `
      <p style="color:var(--text-muted); margin-bottom:1rem;">
        Click oils in order from <strong>HEAVIEST (4)</strong> to <strong>LIGHTEST (1)</strong> to open the Sanctum Siphon.
      </p>
      <div class="logic-items-shelf" id="logic-oils-shelf">
        ${oils.sort(() => Math.random() - 0.5).map(o => `
          <div class="logic-draggish-item" data-oil="${o.id}" data-w="${o.weight}" onclick="window.App.clickLogicOil(this)">
            🫙 ${o.name}
          </div>
        `).join('')}
      </div>
      <div>
        <button type="button" class="btn btn-primary" onclick="window.App.verifyLogicChamber()">⚖ Verify Oil Density Sequence</button>
        <button type="button" class="btn btn-outline" onclick="window.App.initLogicChamber()">Reset Sequence</button>
      </div>
    `;
    this.logicSelectedItems = [];
  },

  clickLogicOil(el) {
    this.audio.click();
    el.classList.toggle('selected');
    const oil = el.getAttribute('data-oil');
    if (this.logicSelectedItems.includes(oil)) {
      this.logicSelectedItems = this.logicSelectedItems.filter(o => o !== oil);
    } else {
      this.logicSelectedItems.push(oil);
    }
  },

  verifyLogicChamber() {
    const correctSeq = ['mustard', 'sesame', 'sandalwood', 'camphor'];
    const isCorrect = this.logicSelectedItems.length === 4 && this.logicSelectedItems.every((val, idx) => val === correctSeq[idx]);

    if (isCorrect) {
      this.audio.success();
      this.stateManager.addXP(150);
      this.stateManager.addCoins(75);
      this.triggerAchievement('ach_logic_1');
      this.triggerAchievement('ach_logic_sequence');
      this.showToast('⚖ The sanctum scale balances in perfect equilibrium! (+150 XP, +75 Coins)');
    } else {
      this.audio.fail();
      this.showToast('❌ The oils separate chaotically. Balance failed! Try again.');
      this.initLogicChamber();
    }
  },

  // ------------------------------------------
  // Flame Fragments System
  // ------------------------------------------
  renderFragments() {
    const shelf = document.getElementById('fragments-shelf');
    if (!shelf) return;
    shelf.innerHTML = '';

    const recoveredCount = Object.values(this.stateManager.state.fragments).filter(Boolean).length;
    const flameEl = document.getElementById('altar-core-flame');
    const captionEl = document.getElementById('altar-flame-status');
    const tribunalBtn = document.getElementById('btn-summon-tribunal');

    if (flameEl) {
      flameEl.className = recoveredCount === 7 ? 'altar-flame fully-lit' : 'altar-flame';
    }
    if (captionEl) {
      captionEl.textContent = recoveredCount === 7 ? '✨ Sanctum Radiant: All 7 Flame Fragments Unified! ✨' : `Sanctum Dimmed (${recoveredCount}/7 Relics Restored)`;
    }
    if (tribunalBtn) {
      tribunalBtn.disabled = recoveredCount < 7;
    }

    FLAME_FRAGMENTS.forEach(frag => {
      const isFound = this.stateManager.state.fragments[frag.id];
      const card = document.createElement('div');
      card.className = `fragment-card ${isFound ? 'recovered' : ''}`;
      card.innerHTML = `
        <span class="fragment-status ${isFound ? 'found' : 'missing'}">${isFound ? 'RECOVERED' : 'MISSING'}</span>
        <div class="fragment-top">
          <span class="fragment-icon">${isFound ? '🔥' : '🪔'}</span>
          <span class="fragment-name">${frag.name}</span>
        </div>
        <p class="fragment-desc">${frag.desc}</p>
        <span class="status-label" style="display:block; margin-top:0.5rem;">District: ${frag.district}</span>
      `;
      shelf.appendChild(card);
    });
  },

  recoverFlameFragment(fragId) {
    this.stateManager.state.fragments[fragId] = true;
    this.audio.fragment();
    this.stateManager.addXP(250);
    this.stateManager.addCaseLog(`Recovered Flame Fragment: ${fragId.toUpperCase()}!`);
    this.showToast('🔥 DIVINE RELIC RECOVERED! A Sacred Flame Fragment is restored to Ayodhya!');

    const count = Object.values(this.stateManager.state.fragments).filter(Boolean).length;
    if (count >= 1) this.triggerAchievement('ach_fragment_1');
    if (count >= 4) this.triggerAchievement('ach_fragments_4');
    if (count === 7) {
      this.triggerAchievement('ach_fragments_all');
      this.triggerAchievement('ach_tribunal_unlocked');
      this.showToast('👑 ALL 7 FLAME FRAGMENTS UNITED! The High Royal Tribunal is now unlocked!');
    }

    this.renderFragments();
    this.updateHeaderStats();
  },

  // ------------------------------------------
  // Evidence Board
  // ------------------------------------------
  renderEvidence() {
    const grid = document.getElementById('evidence-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const query = (document.getElementById('evidence-search')?.value || '').toLowerCase();
    const filterTag = document.getElementById('evidence-filter-tag')?.value || 'all';

    let list = this.stateManager.state.evidence.filter(e => {
      if (filterTag !== 'all' && e.category !== filterTag) return false;
      if (query && !e.title.toLowerCase().includes(query) && !e.desc.toLowerCase().includes(query)) return false;
      return true;
    });

    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = `evidence-card ${item.pinned ? 'pinned' : ''}`;
      card.innerHTML = `
        <span class="evidence-pin-badge" onclick="window.App.togglePinEvidence('${item.id}')">${item.pinned ? '📌' : '📍'}</span>
        <div>
          <h4 class="evidence-title">${item.title}</h4>
          <span class="badge" style="margin: 0.35rem 0;">${item.category}</span>
          <p class="evidence-desc">${item.desc}</p>
        </div>
        <div class="evidence-footer">
          <span>Logged: ${item.timestamp || 'Unknown'}</span>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.App.deleteEvidence('${item.id}')">Delete</button>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  togglePinEvidence(id) {
    const e = this.stateManager.state.evidence.find(i => i.id === id);
    if (e) {
      e.pinned = !e.pinned;
      this.stateManager.save();
      this.triggerAchievement('ach_pin_evidence');
      this.renderEvidence();
      this.audio.click();
    }
  },

  deleteEvidence(id) {
    this.stateManager.state.evidence = this.stateManager.state.evidence.filter(i => i.id !== id);
    this.stateManager.save();
    this.renderEvidence();
    this.audio.click();
    this.showToast('Note discarded from ledger.');
  },

  openNoteModal() {
    this.openModal('modal-note');
  },

  saveUserNote() {
    const title = document.getElementById('note-title-input')?.value.trim();
    const cat = document.getElementById('note-category-select')?.value || 'Physical';
    const desc = document.getElementById('note-desc-input')?.value.trim();

    if (!title) {
      this.showToast('Please provide a clue title.');
      return;
    }

    const newNote = {
      id: 'note_' + Date.now(),
      title,
      category: cat,
      desc: desc || 'Detective custom deduction.',
      pinned: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.stateManager.state.evidence.push(newNote);
    this.stateManager.save();
    this.triggerAchievement('ach_notes_5');
    this.closeModal('modal-note');
    if (document.getElementById('note-title-input')) document.getElementById('note-title-input').value = '';
    if (document.getElementById('note-desc-input')) document.getElementById('note-desc-input').value = '';
    this.renderEvidence();
    this.audio.success();
    this.showToast('📌 Custom note pinned to evidence board.');
  },

  // ------------------------------------------
  // Suspects & Interrogation
  // ------------------------------------------
  renderSuspects() {
    const grid = document.getElementById('suspects-card-grid');
    if (!grid) return;
    grid.innerHTML = '';

    INITIAL_SUSPECTS.forEach(s => {
      const data = this.stateManager.state.suspectsData[s.id] || { suspicion: s.suspicion, trust: s.trust, status: 'unprobed' };
      const card = document.createElement('div');
      card.className = 'card card-ornate suspect-card';
      card.innerHTML = `
        <div>
          <div class="suspect-header-row">
            <div class="suspect-avatar">${s.avatar}</div>
            <div class="suspect-main-info">
              <h4>${s.name}</h4>
              <span class="suspect-role">${s.role}</span>
              <div>
                <span class="suspect-status-tag status-${data.status}">${data.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div class="ratings-block" style="margin: 0.85rem 0;">
            <div class="rating-line">
              <span>Suspicion:</span>
              <div class="rating-fill-wrap"><div class="rating-bar" style="width:${data.suspicion}%; background:var(--accent-red);"></div></div>
              <span>${data.suspicion}%</span>
            </div>
            <div class="rating-line">
              <span>Trust:</span>
              <div class="rating-fill-wrap"><div class="rating-bar" style="width:${data.trust}%; background:#2ec4b6;"></div></div>
              <span>${data.trust}%</span>
            </div>
          </div>
          <p class="alibi-preview">"${s.alibi}"</p>
        </div>
        <div>
          <button type="button" class="btn btn-primary" style="width:100%;" onclick="window.App.openInterrogationModal('${s.id}')">
            🗣 Interrogate Suspect
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  openInterrogationModal(suspectId) {
    this.activeInterrogateSuspectId = suspectId;
    const suspect = INITIAL_SUSPECTS.find(s => s.id === suspectId);
    const data = this.stateManager.state.suspectsData[suspectId];
    if (!suspect || !data) return;

    this.stateManager.state.stats.suspectsQuestioned += 1;
    this.stateManager.save();
    this.triggerAchievement('ach_question_all');

    const modalTitle = document.getElementById('interrogate-modal-title');
    const modalAvatar = document.getElementById('interrogate-avatar');
    const modalName = document.getElementById('interrogate-name');
    const modalRole = document.getElementById('interrogate-role');
    const modalSusp = document.getElementById('interrogate-suspicion');
    const modalTrust = document.getElementById('interrogate-trust');
    const modalAlibi = document.getElementById('interrogate-alibi');

    if (modalTitle) modalTitle.textContent = `Interrogating: ${suspect.name}`;
    if (modalAvatar) modalAvatar.textContent = suspect.avatar;
    if (modalName) modalName.textContent = suspect.name;
    if (modalRole) modalRole.textContent = suspect.role;
    if (modalSusp) modalSusp.textContent = `Suspicion: ${data.suspicion}%`;
    if (modalTrust) modalTrust.textContent = `Trust: ${data.trust}%`;
    if (modalAlibi) modalAlibi.textContent = `"${suspect.alibi}"`;

    const transcript = document.getElementById('interrogate-transcript');
    if (transcript) {
      transcript.innerHTML = `
        <div class="chat-bubble suspect">
          <strong>${suspect.name}:</strong> State your inquiries, Royal Detective. The festival bells toll soon.
        </div>
      `;
    }

    const shelf = document.getElementById('interrogate-questions-shelf');
    if (shelf) {
      shelf.innerHTML = '';
      suspect.dialogue.forEach(d => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline';
        btn.textContent = d.q;
        btn.addEventListener('click', () => {
          this.appendChatMessage('player', d.q);
          setTimeout(() => this.appendChatMessage('suspect', d.a, suspect.name), 400);
        });
        shelf.appendChild(btn);
      });
    }

    this.openModal('modal-interrogation');
    this.audio.click();
  },

  appendChatMessage(role, text, sender = '') {
    const transcript = document.getElementById('interrogate-transcript');
    if (!transcript) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.innerHTML = sender ? `<strong>${sender}:</strong> ${text}` : text;
    transcript.appendChild(bubble);
    transcript.scrollTop = transcript.scrollHeight;
    this.audio.click();
  },

  async askSuspectCustomQuery() {
    const input = document.getElementById('interrogate-custom-input');
    const query = input?.value.trim();
    if (!query || !this.activeInterrogateSuspectId) return;

    input.value = '';
    this.appendChatMessage('player', query);

    const suspect = INITIAL_SUSPECTS.find(s => s.id === this.activeInterrogateSuspectId);
    this.appendChatMessage('oracle', `Consulting Gemini AI Oracle...`);

    const reply = await this.gemini.generateSuspectDialogue(this.activeInterrogateSuspectId, query);
    const transcript = document.getElementById('interrogate-transcript');
    if (transcript && transcript.lastElementChild && transcript.lastElementChild.classList.contains('oracle')) {
      transcript.lastElementChild.remove();
    }

    this.appendChatMessage('suspect', reply, suspect?.name);
  },

  toggleChiefSuspect() {
    if (!this.activeInterrogateSuspectId) return;
    const s = this.stateManager.state.suspectsData[this.activeInterrogateSuspectId];
    s.status = s.status === 'suspicious' ? 'unprobed' : 'suspicious';
    this.stateManager.save();
    this.renderSuspects();
    this.triggerAchievement('ach_mark_suspect');
    this.showToast(`Suspect status: ${s.status.toUpperCase()}`);
    this.audio.click();
  },

  clearSuspectVindication() {
    if (!this.activeInterrogateSuspectId) return;
    const s = this.stateManager.state.suspectsData[this.activeInterrogateSuspectId];
    s.status = 'cleared';
    this.stateManager.save();
    this.renderSuspects();
    this.triggerAchievement('ach_clear_suspect');
    this.showToast('Suspect cleared of immediate suspicion.');
    this.audio.click();
  },

  // ------------------------------------------
  // Satchel Inventory
  // ------------------------------------------
  renderInventory(filterRarity = 'all') {
    const grid = document.getElementById('inventory-grid');
    const counter = document.getElementById('inventory-counter-label');
    if (!grid) return;
    grid.innerHTML = '';

    const list = this.stateManager.state.inventory.filter(i => {
      if (filterRarity !== 'all' && i.rarity !== filterRarity) return false;
      return true;
    });

    if (counter) counter.textContent = `Items Owned: ${this.stateManager.state.inventory.length}`;

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card item-card';
      card.innerHTML = `
        <div class="item-top">
          <div class="item-icon-box">${item.icon}</div>
          <div>
            <div class="item-name">${item.name} ${item.count > 1 ? `(x${item.count})` : ''}</div>
            <span class="item-rarity-pill rarity-${item.rarity}">${item.rarity}</span>
          </div>
        </div>
        <p class="item-desc">${item.desc}</p>
      `;
      grid.appendChild(card);
    });
  },

  // ------------------------------------------
  // 75 Achievements
  // ------------------------------------------
  renderAchievements(filterCat = 'all') {
    const shelf = document.getElementById('achievements-card-shelf');
    if (!shelf) return;
    shelf.innerHTML = '';

    const list = ACHIEVEMENTS_LIST.filter(a => {
      if (filterCat !== 'all' && a.cat !== filterCat) return false;
      return true;
    });

    const unlockedMap = this.stateManager.state.unlockedAchievements;
    const unlockedCount = Object.keys(unlockedMap).length;
    const percent = Math.round((unlockedCount / ACHIEVEMENTS_LIST.length) * 100);

    const uLbl = document.getElementById('achieve-unlocked-count');
    const pBar = document.getElementById('achieve-progress-bar');
    const pLbl = document.getElementById('achieve-percent-label');

    if (uLbl) uLbl.textContent = `${unlockedCount} / 75`;
    if (pBar) pBar.style.width = `${percent}%`;
    if (pLbl) pLbl.textContent = `${percent}%`;

    list.forEach(a => {
      const isUnlocked = !!unlockedMap[a.id];
      const card = document.createElement('div');
      card.className = `card achieve-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="achieve-icon">${a.icon}</div>
        <div class="achieve-body">
          <h4>${a.title}</h4>
          <p>${a.desc}</p>
          <span class="achieve-cat-tag">${a.cat} • ${isUnlocked ? 'CLAIMED' : 'LOCKED'}</span>
        </div>
      `;
      shelf.appendChild(card);
    });
  },

  triggerAchievement(id) {
    if (!this.stateManager.state.unlockedAchievements[id]) {
      const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
      if (ach) {
        this.stateManager.state.unlockedAchievements[id] = new Date().toISOString();
        this.stateManager.addXP(50);
        this.showToast(`🏆 ACCOLADE UNLOCKED: ${ach.title}! (+50 XP)`);
        this.audio.success();
        this.stateManager.save();
        this.renderAchievements();
      }
    }
  },

  // ------------------------------------------
  // Statistics & Analytics
  // ------------------------------------------
  renderStatistics() {
    const grid = document.getElementById('stats-table-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const s = this.stateManager.state.stats;
    const metrics = [
      { name: 'Total XP Gathered', val: s.totalXP },
      { name: 'Festival Coins in Hand', val: s.coinsEarned },
      { name: 'Coins Expended', val: s.coinsSpent },
      { name: 'Clues Discovered', val: s.cluesFound },
      { name: 'Evidence Items Held', val: this.stateManager.state.evidence.length },
      { name: 'Districts Scouted', val: `${s.locationsVisited} / 15` },
      { name: 'Flame Embers Recovered', val: `${s.fragmentsFound} / 7` },
      { name: 'Riddles Decoded', val: s.riddlesSolved },
      { name: 'Escape Safes Cracked', val: s.roomsEscaped },
      { name: 'Puzzles Solved', val: s.puzzlesSolved },
      { name: 'Suspect Deposition Count', val: s.suspectsQuestioned },
      { name: 'Tribunal Verdicts Executed', val: s.accusationsMade },
      { name: 'Correct Verdicts', val: s.correctAccusations },
      { name: 'Daily Login Streak', val: `${s.loginStreak} Days` },
      { name: 'Longest Record Streak', val: `${s.longestStreak} Days` },
      { name: 'Total Vigil Time', val: `${Math.floor(s.totalPlayTime / 60)}m ${s.totalPlayTime % 60}s` },
      { name: 'Grand Royal Completion', val: `${s.completionPercentage}%` }
    ];

    metrics.forEach(m => {
      const tile = document.createElement('div');
      tile.className = 'stat-metric-card';
      tile.innerHTML = `
        <span class="metric-name">${m.name}</span>
        <strong class="metric-val">${m.val}</strong>
      `;
      grid.appendChild(tile);
    });
  },

  renderAnalytics() {
    const skillsList = document.getElementById('analytics-skills-list');
    if (skillsList) {
      skillsList.innerHTML = '';
      const s = this.stateManager.state.stats;
      const skills = [
        { name: 'Deductive Reasoning', val: Math.min(100, (s.cluesFound * 5) + (s.riddlesSolved * 2)) },
        { name: 'Mechanical Lockpicking', val: Math.min(100, s.roomsEscaped * 10) },
        { name: 'Ayodhya Territorial Recon', val: Math.min(100, Math.round((s.locationsVisited / 15) * 100)) },
        { name: 'Interrogation Acumen', val: Math.min(100, s.suspectsQuestioned * 12) },
        { name: 'Festival Lore Mastery', val: Math.min(100, s.fragmentsFound * 14) }
      ];

      skills.forEach(sk => {
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
          <div class="bar-row-label">
            <span>${sk.name}</span>
            <strong>${sk.val}%</strong>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${sk.val}%;"></div>
          </div>
        `;
        skillsList.appendChild(row);
      });
    }

    const columns = document.getElementById('analytics-districts-columns');
    if (columns) {
      columns.innerHTML = '';
      const prog = this.stateManager.state.locationsProgress;
      GAME_LOCATIONS.slice(0, 8).forEach(loc => {
        const count = prog[loc.id]?.count || 0;
        const heightPct = Math.min(100, Math.max(8, count * 15));
        const col = document.createElement('div');
        col.className = 'column-item';
        col.innerHTML = `
          <div class="column-bar" style="height: ${heightPct}%;"></div>
          <span class="column-label" title="${loc.name}">${loc.name.split(' ')[0]}</span>
        `;
        columns.appendChild(col);
      });
    }

    const heatmap = document.getElementById('analytics-heatmap-grid');
    if (heatmap) {
      heatmap.innerHTML = '';
      for (let day = 1; day <= 28; day++) {
        const intensity = day % 7 === 0 ? 4 : (day % 3 === 0 ? 3 : (day % 2 === 0 ? 2 : 1));
        const tile = document.createElement('div');
        tile.className = `heatmap-day-tile heat-${intensity}`;
        tile.innerHTML = `<span>D${day}</span>`;
        heatmap.appendChild(tile);
      }
    }

    const catProg = document.getElementById('analytics-category-progress');
    if (catProg) {
      catProg.innerHTML = '';
      const cats = ['Investigation', 'Exploration', 'Collection', 'Escape Rooms', 'Riddles', 'Puzzles', 'Festival Mastery'];
      const unMap = this.stateManager.state.unlockedAchievements;

      cats.forEach(c => {
        const totalInCat = ACHIEVEMENTS_LIST.filter(a => a.cat === c).length;
        const unlockedInCat = ACHIEVEMENTS_LIST.filter(a => a.cat === c && unMap[a.id]).length;
        const pct = Math.round((unlockedInCat / totalInCat) * 100);

        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
          <div class="bar-row-label">
            <span>${c}</span>
            <span>${unlockedInCat}/${totalInCat} (${pct}%)</span>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${pct}%;"></div>
          </div>
        `;
        catProg.appendChild(row);
      });
    }

    const wealthPairs = document.getElementById('analytics-wealth-pairs');
    if (wealthPairs) {
      const s = this.stateManager.state.stats;
      wealthPairs.innerHTML = `
        <div class="metric-big-box">
          <span class="status-label">Total Coins Earned</span>
          <div class="big-val">💰 ${s.coinsEarned}</div>
        </div>
        <div class="metric-big-box">
          <span class="status-label">Coins Spent</span>
          <div class="big-val">🪙 ${s.coinsSpent}</div>
        </div>
      `;
    }
  },

  // ------------------------------------------
  // Final Tribunal & Endings
  // ------------------------------------------
  openTribunalModal() {
    const sSelect = document.getElementById('tribunal-suspect-select');
    const eSelect = document.getElementById('tribunal-evidence-select');
    if (!sSelect || !eSelect) return;

    sSelect.innerHTML = '';
    INITIAL_SUSPECTS.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.role})`;
      sSelect.appendChild(opt);
    });

    eSelect.innerHTML = '';
    this.stateManager.state.evidence.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = e.title;
      eSelect.appendChild(opt);
    });

    this.openModal('modal-tribunal');
    this.audio.click();
  },

  async executeVerdict() {
    const suspectId = document.getElementById('tribunal-suspect-select')?.value;
    const motive = document.getElementById('tribunal-motive-select')?.value;
    const evidenceId = document.getElementById('tribunal-evidence-select')?.value;

    const suspect = INITIAL_SUSPECTS.find(s => s.id === suspectId);
    const evidence = this.stateManager.state.evidence.find(e => e.id === evidenceId);

    this.closeModal('modal-tribunal');
    this.stateManager.state.stats.accusationsMade += 1;

    const isCulpritCorrect = suspectId === 'susp_inventor';
    const isMotiveCorrect = motive === 'experiment' || motive === 'power';

    let endingTitle = '';
    let symbol = '🪔';

    if (isCulpritCorrect && isMotiveCorrect) {
      endingTitle = 'Master Detective Ending';
      symbol = '👑';
      this.stateManager.state.stats.correctAccusations += 1;
      this.triggerAchievement('ach_secret_grand_ending');
      this.triggerAchievement('ach_secret_mastermind');
      this.audio.success();
    } else if (isCulpritCorrect) {
      endingTitle = 'Festival Savior Ending';
      symbol = '🎆';
      this.stateManager.state.stats.correctAccusations += 1;
      this.audio.success();
    } else if (suspectId === 'susp_merchant' || suspectId === 'susp_treasurer') {
      endingTitle = 'Partial Success Ending';
      symbol = '⚖';
      this.audio.click();
    } else {
      endingTitle = 'Wrong Accusation Ending';
      symbol = '🌑';
      this.audio.fail();
    }

    const narrative = await this.gemini.generateEnding(
      suspect?.name || 'Unknown',
      motive,
      evidence?.title || 'Decisive Artifact',
      isCulpritCorrect
    );

    const endSymbol = document.getElementById('ending-symbol');
    const endTitle = document.getElementById('ending-title');
    const endStory = document.getElementById('ending-story-text');
    const endStats = document.getElementById('ending-stats-box');

    if (endSymbol) endSymbol.textContent = symbol;
    if (endTitle) endTitle.textContent = endingTitle;
    if (endStory) endStory.textContent = narrative;

    if (endStats) {
      endStats.innerHTML = `
        <div class="status-grid">
          <div class="status-tile"><span class="status-label">Total XP:</span> <strong>${this.stateManager.state.stats.totalXP}</strong></div>
          <div class="status-tile"><span class="status-label">Completion:</span> <strong>${this.stateManager.state.stats.completionPercentage}%</strong></div>
          <div class="status-tile"><span class="status-label">Riddles:</span> <strong>${this.stateManager.state.stats.riddlesSolved}</strong></div>
        </div>
      `;
    }

    this.openModal('modal-ending');
    this.stateManager.save();
  },

  // ------------------------------------------
  // Save, Import & Export
  // ------------------------------------------
  exportJSON(data, filename) {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", filename);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    this.triggerAchievement('ach_secret_export');
    this.showToast(`📥 Exported: ${filename}`);
    this.audio.success();
  },

  handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.profile && imported.stats && imported.fragments) {
          this.stateManager.state = imported;
          this.stateManager.save();
          this.init();
          this.showToast('✅ Dossier successfully validated and loaded!');
          this.audio.success();
        } else {
          throw new Error('Save structure missing vital fields.');
        }
      } catch (err) {
        this.showToast('⚠️ Invalid JSON file format!');
        this.audio.fail();
      }
    };
    reader.readAsText(file);
  },

  syncSettingsUI() {
    const p = this.stateManager.state.profile;
    const key = this.gemini.getKey();
    if (document.getElementById('setting-gemini-key')) document.getElementById('setting-gemini-key').value = key;
    if (document.getElementById('setting-theme-select')) document.getElementById('setting-theme-select').value = p.theme;
    if (document.getElementById('setting-font-size')) document.getElementById('setting-font-size').value = p.fontSize;
    if (document.getElementById('setting-difficulty')) document.getElementById('setting-difficulty').value = p.difficulty;
    if (document.getElementById('setting-audio-toggle')) document.getElementById('setting-audio-toggle').checked = p.audioEnabled;
    if (document.getElementById('setting-hints-toggle')) document.getElementById('setting-hints-toggle').checked = p.hintsEnabled;
    if (document.getElementById('setting-notifications-toggle')) document.getElementById('setting-notifications-toggle').checked = p.notificationsEnabled;
    if (document.getElementById('setting-sparkles-toggle')) document.getElementById('setting-sparkles-toggle').checked = p.sparklesEnabled;
  },

  openProfileModal() {
    const p = this.stateManager.state.profile;
    if (document.getElementById('prof-input-name')) document.getElementById('prof-input-name').value = p.name;
    if (document.getElementById('prof-select-difficulty')) document.getElementById('prof-select-difficulty').value = p.difficulty;
    document.querySelectorAll('.avatar-option').forEach(btn => {
      if (btn.getAttribute('data-sigil') === p.sigil) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    this.openModal('modal-profile');
    this.audio.click();
  },

  saveProfile() {
    const name = document.getElementById('prof-input-name')?.value.trim() || 'Kavi the Vigilant';
    const diff = document.getElementById('prof-select-difficulty')?.value || 'normal';
    this.stateManager.state.profile.name = name;
    this.stateManager.state.profile.difficulty = diff;
    this.stateManager.save();
    this.updateHeaderStats();
    this.closeModal('modal-profile');
    this.showToast('👑 Royal Detective Dossier updated.');
    this.audio.success();
  },

  async testGeminiConnection() {
    const keyInput = document.getElementById('setting-gemini-key');
    const key = keyInput?.value.trim() || '';
    this.gemini.setKey(key);
    this.showToast('📡 Testing connection to Gemini Oracle...');
    try {
      const reply = await this.gemini.callGemini('Greet the Royal Detective of Ayodhya in 1 sentence.');
      this.showToast(`✨ Oracle Connected: "${reply.slice(0, 50)}..."`);
      this.audio.success();
    } catch (err) {
      this.showToast(`⚠️ Oracle test: ${err.message}`);
      this.audio.fail();
    }
  },

  registerPWA() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.protocol === 'http:')) {
      navigator.serviceWorker.register('service-worker.js')
        .catch(err => console.log('PWA Service Worker note:', err));
    }
  }
};

// ==========================================
// 6. SAFE GLOBAL BOOTSTRAPPER
// ==========================================
window.App = App;

function bootstrapApp() {
  window.App = App;
  App.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
