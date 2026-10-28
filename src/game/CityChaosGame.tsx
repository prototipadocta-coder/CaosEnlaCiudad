import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from './audio';
import {
  HazardItem,
  BonusItem,
  CoinItem,
  ImpactEffect,
  FloatingText,
  WarningIndicator,
  GameScreen,
  GameDifficulty,
  ScoreRecord,
  MapId,
  GameMap,
  SkinItem,
  UpgradeItem,
} from './types';
import {
  drawPlayer,
  drawHorn,
  drawDrill,
  drawAlarm,
  drawMegaphone,
  drawCat,
  drawJackhammer,
  drawSchoolBell,
  drawBall,
  drawSubwaySpeaker,
  drawSmallCar,
  drawSmallTruck,
  drawLawnmower,
  drawWhistle,
  drawBoombox,
  drawMotorcycle,
  drawBird,
  drawPress,
  drawSteamPipe,
  drawCircularSaw,
  drawTrainWheel,
  drawJetTurbine,
  drawRockGuitar,
  drawFoghorn,
  drawHelicopter,
  drawExitPortal,
  drawCoin,
  drawEnergyCan,
  drawHeadphones,
  drawCoffee,
  drawHeart,
  drawComicTag,
  drawImpact,
} from './sprites';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Trophy,
  HelpCircle,
  Radio,
  ShoppingBag,
  Flame,
  Zap,
  Shield,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Coins,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';

// 8 REAL USER PIXEL ART CAMPUS RECREATIONS + 2 NOISY INDUSTRIAL MAPS (10 TOTAL)
const MAP1_SCHOOL_PAVILION = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110141_3e6429dc.png';
const MAP2_BRICK_FACADE = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110227_98932001.png';
const MAP3_SLOPED_ROAD = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110245_183504fc.png';
const MAP4_SPORTS_COURT = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110253_2a90551d.png';
const MAP5_ROOFTOPS_VIEW = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110305_cc347d23.png';
const MAP6_BALCONY_CORRIDOR = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110327_7f894ba6.png';
const MAP7_BRICK_ALLEY = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110339_fab7d78b.png';
const MAP8_COURTYARD_RAMP = '/assets/aistudio/Captura_de_pantalla_2026-10-21_110349_cfe649af.png';
const MAP9_FACTORY_METAL = '/assets/factory_metal.jpg';
const MAP10_CONSTRUCTION_MEGACITY = '/assets/construction_site.jpg';

// 10 PROGRESSIVE NOISE POLLUTION MAPS
export const MAPS: Record<MapId, GameMap> = {
  MAP_SCHOOL_PAVILION: {
    id: 'MAP_SCHOOL_PAVILION',
    level: 1,
    name: 'PABELLÓN Y AULAS DE LADRILLO',
    subtitle: 'Nivel 1: Ruido escolar suave · Trinos, rastrillos y soplador de patio',
    image: MAP1_SCHOOL_PAVILION,
    hazards: ['BIRD', 'RATTLE', 'LEAF_BLOWER'],
    groundColor: '#15803d',
    curbColor: '#86efac',
    ambientNoise: 'Bajo (Susurro de hojas y soplador)',
    noiseIntensity: '12%',
  },
  MAP_BRICK_FACADE: {
    id: 'MAP_BRICK_FACADE',
    level: 2,
    name: 'FACHADA PRINCIPAL Y CALZADA',
    subtitle: 'Nivel 2: Mantenimiento exterior · Cortacésped, alarmas y gatos',
    image: MAP2_BRICK_FACADE,
    hazards: ['LAWNMOWER', 'ALARM', 'CAT'],
    groundColor: '#475569',
    curbColor: '#cbd5e1',
    ambientNoise: 'Moderado (Motor podador y maullidos)',
    noiseIntensity: '24%',
  },
  MAP_SLOPED_ROAD: {
    id: 'MAP_SLOPED_ROAD',
    level: 3,
    name: 'CUESTA Y CANCHA DE FÚTBOL',
    subtitle: 'Nivel 3: Tráfico vehicular · Autos pequeños, motos y cláxones',
    image: MAP3_SLOPED_ROAD,
    hazards: ['CAR_SMALL', 'MOTORCYCLE', 'HORN'],
    groundColor: '#334155',
    curbColor: '#fbbf24',
    ambientNoise: 'Medio (Acelerones y pitidos)',
    noiseIntensity: '36%',
  },
  MAP_SPORTS_COURT: {
    id: 'MAP_SPORTS_COURT',
    level: 4,
    name: 'PISTA POLIDEPORTIVA',
    subtitle: 'Nivel 4: Algazara deportiva · Silbatos agudos, balones y megáfonos',
    image: MAP4_SPORTS_COURT,
    hazards: ['WHISTLE', 'BALL', 'MEGAPHONE'],
    groundColor: '#1e293b',
    curbColor: '#38bdf8',
    ambientNoise: 'Alto (Silbatos de árbitro y barras)',
    noiseIntensity: '48%',
  },
  MAP_ROOFTOPS_VIEW: {
    id: 'MAP_ROOFTOPS_VIEW',
    level: 5,
    name: 'MIRADOR DE TEJAS Y AZOTEAS',
    subtitle: 'Nivel 5: Eco urbano · Camiones de reparto y sirenas distantes',
    image: MAP5_ROOFTOPS_VIEW,
    hazards: ['TRUCK_SMALL', 'SIREN', 'THUNDER'],
    groundColor: '#78350f',
    curbColor: '#f97316',
    ambientNoise: 'Intenso (Sirenas y camiones pesados)',
    noiseIntensity: '60%',
  },
  MAP_BALCONY_CORRIDOR: {
    id: 'MAP_BALCONY_CORRIDOR',
    level: 6,
    name: 'PASILLO BALCÓN DEL 2° PISO',
    subtitle: 'Nivel 6: Pasillo cerrado · Timbre ensordecedor y bocinas de aire',
    image: MAP6_BALCONY_CORRIDOR,
    hazards: ['SCHOOL_BELL', 'AIR_HORN', 'MEGAPHONE'],
    groundColor: '#831843',
    curbColor: '#f472b6',
    ambientNoise: 'Fuerte (Campana de cambio de clase)',
    noiseIntensity: '72%',
  },
  MAP_BRICK_ALLEY: {
    id: 'MAP_BRICK_ALLEY',
    level: 7,
    name: 'CALLEJÓN Y MURO TRASERO',
    subtitle: 'Nivel 7: Eco estridente · Taladros de percusión y radiocaseteras',
    image: MAP7_BRICK_ALLEY,
    hazards: ['DRILL', 'RADIO_BOOMBOX', 'CAT_SCREAM'],
    groundColor: '#1e1b4b',
    curbColor: '#a855f7',
    ambientNoise: 'Muy Alto (Taladros en pared y bajos)',
    noiseIntensity: '82%',
  },
  MAP_COURTYARD_RAMP: {
    id: 'MAP_COURTYARD_RAMP',
    level: 8,
    name: 'PLAZA CENTRAL Y RAMPA BLANCA',
    subtitle: 'Nivel 8: Remodelación escolar · Martillos neumáticos y bocinas',
    image: MAP8_COURTYARD_RAMP,
    hazards: ['JACKHAMMER', 'AIR_HORN', 'WHISTLE'],
    groundColor: '#0f172a',
    curbColor: '#ef4444',
    ambientNoise: 'Crítico (Martilleo de losas de concreto)',
    noiseIntensity: '90%',
  },
  MAP_FACTORY_METAL: {
    id: 'MAP_FACTORY_METAL',
    level: 9,
    name: 'FÁBRICA METALÚRGICA INDUSTRIAL',
    subtitle: 'Nivel 9: Ruido siderúrgico · Prensas pesadas, vapor y sierras circulares',
    image: MAP9_FACTORY_METAL,
    hazards: ['PRESS', 'STEAM_PIPE', 'CIRCULAR_SAW'],
    groundColor: '#1c1917',
    curbColor: '#f97316',
    ambientNoise: 'Extremo (Golpeteo de prensa y vapor hirviente)',
    noiseIntensity: '96%',
  },
  MAP_CONSTRUCTION_MEGACITY: {
    id: 'MAP_CONSTRUCTION_MEGACITY',
    level: 10,
    name: 'MEGACONSTRUCCIÓN Y DEMOLICIÓN',
    subtitle: 'Nivel 10: ¡CAOS TOTAL! · Turbinas gigantes, helicópteros y martillo',
    image: MAP10_CONSTRUCTION_MEGACITY,
    hazards: ['JACKHAMMER', 'JET_TURBINE', 'HELICOPTER'],
    groundColor: '#030712',
    curbColor: '#dc2626',
    ambientNoise: '¡MÁXIMO DECIBEL (115 dB)! ¡CAOS AUDITIVO!',
    noiseIntensity: '100%',
  },
  // Legacy aliases
  MAP_PARK_LAWN: {
    id: 'MAP_SCHOOL_PAVILION',
    level: 1,
    name: 'PABELLÓN Y AULAS DE LADRILLO',
    subtitle: 'Nivel 1: Ruido escolar suave · Trinos, rastrillos y soplador de patio',
    image: MAP1_SCHOOL_PAVILION,
    hazards: ['BIRD', 'RATTLE', 'LEAF_BLOWER'],
    groundColor: '#15803d',
    curbColor: '#86efac',
    ambientNoise: 'Bajo (Susurro de hojas y soplador)',
    noiseIntensity: '12%',
  },
  MAP_BRICK_HOUSE: {
    id: 'MAP_BRICK_FACADE',
    level: 2,
    name: 'FACHADA PRINCIPAL Y CALZADA',
    subtitle: 'Nivel 2: Mantenimiento exterior · Cortacésped, alarmas y gatos',
    image: MAP2_BRICK_FACADE,
    hazards: ['LAWNMOWER', 'ALARM', 'CAT'],
    groundColor: '#475569',
    curbColor: '#cbd5e1',
    ambientNoise: 'Moderado (Motor podador y maullidos)',
    noiseIntensity: '24%',
  },
  MAP_ROOFTOPS: {
    id: 'MAP_ROOFTOPS_VIEW',
    level: 5,
    name: 'MIRADOR DE TEJAS Y AZOTEAS',
    subtitle: 'Nivel 5: Eco urbano · Camiones de reparto y sirenas distantes',
    image: MAP5_ROOFTOPS_VIEW,
    hazards: ['TRUCK_SMALL', 'SIREN', 'THUNDER'],
    groundColor: '#78350f',
    curbColor: '#f97316',
    ambientNoise: 'Intenso (Sirenas y camiones pesados)',
    noiseIntensity: '60%',
  },
  MAP_COURTYARD: {
    id: 'MAP_COURTYARD_RAMP',
    level: 8,
    name: 'PLAZA CENTRAL Y RAMPA BLANCA',
    subtitle: 'Nivel 8: Remodelación escolar · Martillos neumáticos y bocinas',
    image: MAP8_COURTYARD_RAMP,
    hazards: ['JACKHAMMER', 'AIR_HORN', 'WHISTLE'],
    groundColor: '#0f172a',
    curbColor: '#ef4444',
    ambientNoise: 'Crítico (Martilleo de losas de concreto)',
    noiseIntensity: '90%',
  },
};

export const MAP_ORDER: MapId[] = [
  'MAP_SCHOOL_PAVILION',
  'MAP_BRICK_FACADE',
  'MAP_SLOPED_ROAD',
  'MAP_SPORTS_COURT',
  'MAP_ROOFTOPS_VIEW',
  'MAP_BALCONY_CORRIDOR',
  'MAP_BRICK_ALLEY',
  'MAP_COURTYARD_RAMP',
  'MAP_FACTORY_METAL',
  'MAP_CONSTRUCTION_MEGACITY',
];

// SKINS CATALOG
const SKINS: SkinItem[] = [
  {
    id: 'DEFAULT',
    name: 'CHICO CLÁSICO',
    description: 'Chaqueta verde y gorra azul marino. Listo para el día a día.',
    price: 0,
    capColor: '#1e293b',
    jacketColor: '#16a34a',
    jacketHighlight: '#22c55e',
    pantsColor: '#2563eb',
    perk: 'Equilibrado y fiel',
  },
  {
    id: 'RETRO_RED',
    name: 'HERMANO FONTANERO',
    description: 'Rojo vibrante y peto azul. ¡Inspirado en el fontanero de bigote!',
    price: 25,
    capColor: '#dc2626',
    jacketColor: '#ef4444',
    jacketHighlight: '#f87171',
    pantsColor: '#1d4ed8',
    perk: '+15% Duración de lata energética',
  },
  {
    id: 'NEON_CYBER',
    name: 'CYBERPUNK DJ',
    description: 'Gorra violeta y chaqueta de neón brillante resistente al ruido.',
    price: 50,
    capColor: '#7c3aed',
    jacketColor: '#06b6d4',
    jacketHighlight: '#67e8f9',
    pantsColor: '#3b82f6',
    perk: 'Escudo dura 3 segundos extra',
  },
  {
    id: 'GOLDEN_CHAMP',
    name: 'CAMPEÓN DORADO',
    description: 'Traje de oro resplandeciente. Solo para los reyes de la racha.',
    price: 100,
    capColor: '#ca8a04',
    jacketColor: '#eab308',
    jacketHighlight: '#fef08a',
    pantsColor: '#78350f',
    perk: 'Monedas x2 de valor',
  },
];

// UPGRADES CATALOG
const INITIAL_UPGRADES: UpgradeItem[] = [
  {
    id: 'MAGNET',
    name: 'IMÁN DE MONEDAS',
    description: 'Atrae monedas automáticamente hacia el jugador.',
    price: 30,
    level: 0,
    maxLevel: 3,
    icon: '🧲',
    effect: 'Radio de atracción +40px/nivel',
  },
  {
    id: 'SHIELD_BOOST',
    name: 'AURICULARES BLINDADOS',
    description: 'Permite que el escudo de silencio resista un segundo impacto.',
    price: 45,
    level: 0,
    maxLevel: 2,
    icon: '🎧',
    effect: 'Resiste golpes extra',
  },
  {
    id: 'DASH_COOLDOWN',
    name: 'ZAPATILLAS TURBO',
    description: 'Reduce el tiempo de enfriamiento del Dash esquivador.',
    price: 35,
    level: 0,
    maxLevel: 3,
    icon: '👟',
    effect: 'Recarga de Dash -25%',
  },
  {
    id: 'EXTRA_LIFE',
    name: 'CONTENEDOR DE VIDA',
    description: 'Empieza cada partida con 4 vidas en lugar de 3.',
    price: 70,
    level: 0,
    maxLevel: 1,
    icon: '❤️',
    effect: 'Comienza con 4 vidas',
  },
];

export const CityChaosGame: React.FC = () => {
  // Game state
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('NORMAL');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('caos_ciudad_highscore') || '0', 10);
  });
  const [lives, setLives] = useState<number>(3);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [noiseLevel, setNoiseLevel] = useState<number>(15);
  const [speedLevel, setSpeedLevel] = useState<number>(1);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentMap, setCurrentMap] = useState<MapId>('MAP_SCHOOL_PAVILION');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [isSpeedBoostActive, setIsSpeedBoostActive] = useState<boolean>(false);
  const [showMapSelect, setShowMapSelect] = useState<boolean>(false);
  const [stats, setStats] = useState({ dodged: 0, nearMisses: 0, powerups: 0, coins: 0 });

  // Squid Game "Luz Roja, Luz Verde" mechanic
  const [redLightPhase, setRedLightPhase] = useState<'IDLE' | 'WARNING' | 'RED' | 'CAUGHT'>('IDLE');
  const [redLightTimer, setRedLightTimer] = useState<number>(0);

  // Bank & Shop
  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('caos_ciudad_coins') || '10', 10);
  });
  const [selectedSkin, setSelectedSkin] = useState<string>(() => {
    return localStorage.getItem('caos_ciudad_selected_skin') || 'DEFAULT';
  });
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('caos_ciudad_unlocked_skins');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['DEFAULT'];
  });
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(() => {
    try {
      const saved = localStorage.getItem('caos_ciudad_upgrades');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_UPGRADES;
  });

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('caos_ciudad_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { name: 'SUPER_MARIO', score: 24500, streak: 120, date: '2026-10-10', difficulty: 'NORMAL', levelReached: 10 },
      { name: 'DODGE_KING', score: 18800, streak: 92, date: '2026-10-11', difficulty: 'CAOTICO', levelReached: 8 },
      { name: 'PIXEL_CHAMP', score: 14450, streak: 88, date: '2026-10-12', difficulty: 'NORMAL', levelReached: 7 },
      { name: 'STREET_BOY', score: 8200, streak: 54, date: '2026-10-13', difficulty: 'NORMAL', levelReached: 5 },
      { name: 'NOISE_DODGER', score: 5150, streak: 35, date: '2026-10-14', difficulty: 'INFALIBLE', levelReached: 3 },
    ];
  });
  const [playerName, setPlayerName] = useState<string>('JUGADOR_1');

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Background images loaded
  const bgImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Active skin data
  const activeSkin = SKINS.find((s) => s.id === selectedSkin) || SKINS[0];

  // Gameplay mutable state
  const stateRef = useRef({
    screen: 'TITLE' as GameScreen,
    difficulty: 'NORMAL' as GameDifficulty,
    currentLevel: 1,
    currentMap: 'MAP_SCHOOL_PAVILION' as MapId,
    levelTimer: 0,
    levelDuration: 28, // Map advance duration
    player: {
      x: 70, // Start on the left entrance of the map
      y: 380,
      baseY: 380,
      vx: 0,
      vy: 0,
      isGrounded: true,
      isJumping: false,
      isSliding: false,
      facingRight: true,
      animFrame: 0,
      animTimer: 0,
      lives: 3,
      maxLives: 3,
      invulnerableTimer: 0,
      shieldActive: false,
      shieldTimer: 0,
      shieldHitsRemaining: 1,
      speedBoostTimer: 0,
      dashCooldown: 0,
      dashActive: 0,
    },
    hazards: [] as HazardItem[],
    bonuses: [] as BonusItem[],
    coinsList: [] as CoinItem[],
    impacts: [] as ImpactEffect[],
    floatingTexts: [] as FloatingText[],
    warnings: [] as WarningIndicator[],
    score: 0,
    coinsEarnedThisRun: 0,
    streak: 0,
    maxStreak: 0,
    multiplier: 1,
    noiseLevel: 12,
    speedLevel: 1,
    dodged: 0,
    nearMisses: 0,
    powerups: 0,
    lastSpawnTime: 0,
    lastBonusTime: 0,
    lastCoinSpawnTime: 0,
    gameTime: 0,
    screenShake: 0,
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
      dash: false,
    },
    redLight: {
      phase: 'IDLE' as 'IDLE' | 'WARNING' | 'RED' | 'CAUGHT',
      timer: 0,
      hasTriggeredThisLevel: false,
      willTriggerThisLevel: true,
      targetTriggerTime: 7.0,
      gracePeriod: 0,
    },
  });

  // Preload all 10 user maps & backgrounds
  useEffect(() => {
    const urls = [
      { id: 'TITLE', src: MAP1_SCHOOL_PAVILION },
      { id: 'MAP_SCHOOL_PAVILION', src: MAP1_SCHOOL_PAVILION },
      { id: 'MAP_BRICK_FACADE', src: MAP2_BRICK_FACADE },
      { id: 'MAP_SLOPED_ROAD', src: MAP3_SLOPED_ROAD },
      { id: 'MAP_SPORTS_COURT', src: MAP4_SPORTS_COURT },
      { id: 'MAP_ROOFTOPS_VIEW', src: MAP5_ROOFTOPS_VIEW },
      { id: 'MAP_BALCONY_CORRIDOR', src: MAP6_BALCONY_CORRIDOR },
      { id: 'MAP_BRICK_ALLEY', src: MAP7_BRICK_ALLEY },
      { id: 'MAP_COURTYARD_RAMP', src: MAP8_COURTYARD_RAMP },
      { id: 'MAP_FACTORY_METAL', src: MAP9_FACTORY_METAL },
      { id: 'MAP_CONSTRUCTION_MEGACITY', src: MAP10_CONSTRUCTION_MEGACITY },
      // Aliases
      { id: 'MAP_PARK_LAWN', src: MAP1_SCHOOL_PAVILION },
      { id: 'MAP_BRICK_HOUSE', src: MAP2_BRICK_FACADE },
      { id: 'MAP_ROOFTOPS', src: MAP5_ROOFTOPS_VIEW },
      { id: 'MAP_COURTYARD', src: MAP8_COURTYARD_RAMP },
    ];

    urls.forEach((item) => {
      const img = new Image();
      img.src = item.src;
      img.onload = () => {
        bgImagesRef.current[item.id] = img;
      };
    });
  }, []);

  // Sync Audio mute
  useEffect(() => {
    sounds.setMuted(isMuted);
  }, [isMuted]);

  // High score saver
  const updateHighScore = useCallback(
    (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('caos_ciudad_highscore', newScore.toString());
      }
    },
    [highScore]
  );

  // Bank Coin Saver
  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const updated = prev + amount;
      localStorage.setItem('caos_ciudad_coins', updated.toString());
      return updated;
    });
  };

  // Start or Restart game (can start at specific map/level)
  const startGame = (
    diff: GameDifficulty = difficulty,
    targetMapId: MapId = 'MAP_SCHOOL_PAVILION',
    targetLevel: number = 1
  ) => {
    const extraLifeUpgrade = upgrades.find((u) => u.id === 'EXTRA_LIFE');
    const startingLives = extraLifeUpgrade && extraLifeUpgrade.level > 0 ? 4 : 3;

    const s = stateRef.current;
    s.screen = 'PLAYING';
    s.difficulty = diff;
    s.currentLevel = targetLevel;
    s.currentMap = targetMapId;
    s.levelTimer = 0;
    s.levelDuration = diff === 'CAOTICO' ? 22 : 28;
    s.player = {
      x: 65, // Start on the left entrance
      y: 380,
      baseY: 380,
      vx: 0,
      vy: 0,
      isGrounded: true,
      isJumping: false,
      isSliding: false,
      facingRight: true,
      animFrame: 0,
      animTimer: 0,
      lives: startingLives,
      maxLives: startingLives,
      invulnerableTimer: 1.5,
      shieldActive: false,
      shieldTimer: 0,
      shieldHitsRemaining: 1,
      speedBoostTimer: 0,
      dashCooldown: 0,
      dashActive: 0,
    };
    s.hazards = [];
    s.bonuses = [];
    s.coinsList = [];
    s.impacts = [];
    s.floatingTexts = [];
    s.warnings = [];
    s.score = (targetLevel - 1) * 1000;
    s.coinsEarnedThisRun = 0;
    s.streak = 0;
    s.maxStreak = 0;
    s.multiplier = 1;
    s.noiseLevel = 10 + targetLevel * 8;
    s.speedLevel = Math.min(8, 1 + Math.floor(targetLevel / 2));
    s.dodged = 0;
    s.nearMisses = 0;
    s.powerups = 0;
    s.lastSpawnTime = 0;
    s.lastBonusTime = 0;
    s.lastCoinSpawnTime = 0;
    s.gameTime = 0;
    s.screenShake = 0;
    s.redLight = {
      phase: 'IDLE',
      timer: 0,
      hasTriggeredThisLevel: false,
      willTriggerThisLevel: true,
      targetTriggerTime: 6.5 + Math.random() * 3.5,
      gracePeriod: 0,
    };

    setScreen('PLAYING');
    setDifficulty(diff);
    setCurrentLevel(targetLevel);
    setCurrentMap(targetMapId);
    setScore(s.score);
    setLives(startingLives);
    setStreak(0);
    setMaxStreak(0);
    setMultiplier(1);
    setNoiseLevel(s.noiseLevel);
    setSpeedLevel(s.speedLevel);
    setIsShieldActive(false);
    setIsSpeedBoostActive(false);
    setShowMapSelect(false);
    setRedLightPhase('IDLE');
    setRedLightTimer(0);

    sounds.stopMusic(true);
    sounds.startMusic(1, true);
  };

  // Canvas direct touch gestures for mobile devices
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (stateRef.current.screen !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };

    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    if (touchX < rect.width * 0.42) {
      stateRef.current.keys.left = true;
      stateRef.current.keys.right = false;
    } else if (touchX > rect.width * 0.58) {
      stateRef.current.keys.right = true;
      stateRef.current.keys.left = false;
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (stateRef.current.screen !== 'PLAYING') return;
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaX = touch.clientX - touchStartRef.current.x;

    if (deltaY < -28) {
      stateRef.current.keys.up = true;
    } else if (deltaY > 28) {
      stateRef.current.keys.down = true;
    }

    if (Math.abs(deltaX) > 35) {
      if (deltaX > 0) {
        stateRef.current.keys.right = true;
        stateRef.current.keys.left = false;
      } else {
        stateRef.current.keys.left = true;
        stateRef.current.keys.right = false;
      }
    }
  };

  const handleCanvasTouchEnd = () => {
    touchStartRef.current = null;
    stateRef.current.keys.left = false;
    stateRef.current.keys.right = false;
    stateRef.current.keys.up = false;
    stateRef.current.keys.down = false;
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = stateRef.current.keys;
      const curScreen = stateRef.current.screen;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        keys.up = true;
        if (curScreen === 'PLAYING') e.preventDefault();
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keys.down = true;
        if (curScreen === 'PLAYING') e.preventDefault();
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keys.dash = true;
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (curScreen === 'PLAYING') {
          stateRef.current.screen = 'PAUSED';
          setScreen('PAUSED');
          sounds.stopMusic();
        } else if (curScreen === 'PAUSED') {
          stateRef.current.screen = 'PLAYING';
          setScreen('PLAYING');
          sounds.startMusic(1 + (stateRef.current.speedLevel - 1) * 0.04);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = stateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keys.dash = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Save score to leaderboard
  const saveScoreToLeaderboard = () => {
    const finalScore = stateRef.current.score;
    const finalStreak = stateRef.current.maxStreak;
    const finalLevel = stateRef.current.currentLevel;
    const newRecord: ScoreRecord = {
      name: playerName.trim().toUpperCase() || 'JUGADOR',
      score: finalScore,
      streak: finalStreak,
      date: new Date().toISOString().split('T')[0],
      difficulty: stateRef.current.difficulty,
      levelReached: finalLevel,
    };
    const updated = [...leaderboard, newRecord]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem('caos_ciudad_leaderboard', JSON.stringify(updated));
    setScreen('LEADERBOARD');
  };

  // Buy Skin
  const buySkin = (skin: SkinItem) => {
    if (unlockedSkins.includes(skin.id)) {
      setSelectedSkin(skin.id);
      localStorage.setItem('caos_ciudad_selected_skin', skin.id);
      sounds.playBuy();
      return;
    }
    if (coins >= skin.price) {
      const newCoins = coins - skin.price;
      const newUnlocked = [...unlockedSkins, skin.id];
      setCoins(newCoins);
      setUnlockedSkins(newUnlocked);
      setSelectedSkin(skin.id);
      localStorage.setItem('caos_ciudad_coins', newCoins.toString());
      localStorage.setItem('caos_ciudad_unlocked_skins', JSON.stringify(newUnlocked));
      localStorage.setItem('caos_ciudad_selected_skin', skin.id);
      sounds.playBuy();
    }
  };

  // Buy Upgrade
  const buyUpgrade = (upgrade: UpgradeItem) => {
    if (upgrade.level >= upgrade.maxLevel) return;
    if (coins >= upgrade.price) {
      const newCoins = coins - upgrade.price;
      const updatedUpgrades = upgrades.map((u) => {
        if (u.id === upgrade.id) {
          return { ...u, level: u.level + 1, price: Math.floor(u.price * 1.5) };
        }
        return u;
      });
      setCoins(newCoins);
      setUpgrades(updatedUpgrades);
      localStorage.setItem('caos_ciudad_coins', newCoins.toString());
      localStorage.setItem('caos_ciudad_upgrades', JSON.stringify(updatedUpgrades));
      sounds.playBuy();
    }
  };

  // MAIN GAME LOOP (Canvas RequestAnimationFrame)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTimestamp = performance.now();

    // Spawning Hazards tailored to current map (NO REPETITION BETWEEN MAPS!)
    const spawnHazard = (width: number) => {
      const s = stateRef.current;
      const currentMapConfig = MAPS[s.currentMap] || MAPS.MAP_PARK_LAWN;
      const allowedHazards = currentMapConfig.hazards;

      // Exhaustive hazard database with individual sounds and pixel dimensions
      const allHazardConfigs: Record<
        HazardItem['type'],
        {
          type: HazardItem['type'];
          text: string;
          bg: string;
          textColor: string;
          w: number;
          h: number;
          sound: () => void;
        }
      > = {
        // Level 1: Gentle Park
        BIRD: { type: 'BIRD', text: '¡PÍO!', bg: '#0284c7', textColor: '#ffffff', w: 24, h: 22, sound: () => sounds.playBird() },
        RATTLE: { type: 'RATTLE', text: '¡CRAC!', bg: '#15803d', textColor: '#ffffff', w: 26, h: 26, sound: () => sounds.playRattle() },
        LEAF_BLOWER: { type: 'LEAF_BLOWER', text: '¡FUUU!', bg: '#059669', textColor: '#ffffff', w: 32, h: 26, sound: () => sounds.playLeafBlower() },

        // Level 2: Brick House Entrance
        LAWNMOWER: { type: 'LAWNMOWER', text: '¡BRRRR!', bg: '#dc2626', textColor: '#ffffff', w: 34, h: 26, sound: () => sounds.playLawnmower() },
        ALARM: { type: 'ALARM', text: '¡RING!', bg: '#ea580c', textColor: '#ffffff', w: 28, h: 28, sound: () => sounds.playAlarm() },
        CAT: { type: 'CAT', text: '¡MIAU!', bg: '#f97316', textColor: '#ffffff', w: 34, h: 28, sound: () => sounds.playCat() },

        // Level 3: Sloped Campus Road (Vehicles!)
        CAR_SMALL: { type: 'CAR_SMALL', text: '¡VROOOM!', bg: '#eab308', textColor: '#0f172a', w: 38, h: 28, sound: () => sounds.playSmallCar() },
        MOTORCYCLE: { type: 'MOTORCYCLE', text: '¡BRAAP!', bg: '#dc2626', textColor: '#ffffff', w: 34, h: 28, sound: () => sounds.playMotorcycle() },
        HORN: { type: 'HORN', text: '¡BEEP!', bg: '#ef4444', textColor: '#ffffff', w: 30, h: 26, sound: () => sounds.playHorn() },

        // Level 4: Sports Court
        WHISTLE: { type: 'WHISTLE', text: '¡FIIII!', bg: '#0284c7', textColor: '#ffffff', w: 28, h: 24, sound: () => sounds.playWhistle() },
        BALL: { type: 'BALL', text: '¡PELOTA!', bg: '#16a34a', textColor: '#ffffff', w: 28, h: 28, sound: () => sounds.playBallBounce() },
        MEGAPHONE: { type: 'MEGAPHONE', text: '¡ALTA!', bg: '#f97316', textColor: '#ffffff', w: 32, h: 26, sound: () => sounds.playMegaphone() },

        // Level 5: Brick Alley
        DRILL: { type: 'DRILL', text: '¡TRRR!', bg: '#ca8a04', textColor: '#ffffff', w: 36, h: 30, sound: () => sounds.playDrill() },
        RADIO_BOOMBOX: { type: 'RADIO_BOOMBOX', text: '¡BASS!', bg: '#475569', textColor: '#ffffff', w: 36, h: 28, sound: () => sounds.playBoombox() },
        CAT_SCREAM: { type: 'CAT_SCREAM', text: '¡GRRR!', bg: '#c2410c', textColor: '#ffffff', w: 34, h: 28, sound: () => sounds.playCat() },

        // Level 6: Rooftops
        TRUCK_SMALL: { type: 'TRUCK_SMALL', text: '¡RUUUUMBLE!', bg: '#f97316', textColor: '#ffffff', w: 42, h: 32, sound: () => sounds.playTruck() },
        SIREN: { type: 'SIREN', text: '¡WEE-WOO!', bg: '#ef4444', textColor: '#ffffff', w: 32, h: 28, sound: () => sounds.playSiren() },
        THUNDER: { type: 'THUNDER', text: '¡BOOOOM!', bg: '#6366f1', textColor: '#ffffff', w: 34, h: 32, sound: () => sounds.playThunder() },

        // Level 7: Courtyard Chaos
        JACKHAMMER: { type: 'JACKHAMMER', text: '¡DOK-DOK!', bg: '#0284c7', textColor: '#ffffff', w: 26, h: 42, sound: () => sounds.playJackhammer() },
        SCHOOL_BELL: { type: 'SCHOOL_BELL', text: '¡TIMBRE!', bg: '#b91c1c', textColor: '#ffffff', w: 32, h: 32, sound: () => sounds.playSchoolBell() },
        AIR_HORN: { type: 'AIR_HORN', text: '¡HOOOONK!', bg: '#ea580c', textColor: '#ffffff', w: 34, h: 28, sound: () => sounds.playAirHorn() },

        // Additional Industrial & City Noise Hazards
        PRESS: { type: 'PRESS', text: '¡CLANG!', bg: '#475569', textColor: '#ffffff', w: 36, h: 36, sound: () => sounds.playJackhammer() },
        STEAM_PIPE: { type: 'STEAM_PIPE', text: '¡PSSSH!', bg: '#0284c7', textColor: '#ffffff', w: 32, h: 28, sound: () => sounds.playLeafBlower() },
        CIRCULAR_SAW: { type: 'CIRCULAR_SAW', text: '¡ZZZZT!', bg: '#eab308', textColor: '#0f172a', w: 34, h: 34, sound: () => sounds.playDrill() },
        TRAIN_WHEEL: { type: 'TRAIN_WHEEL', text: '¡CHUUU!', bg: '#334155', textColor: '#ffffff', w: 36, h: 36, sound: () => sounds.playTruck() },
        JET_TURBINE: { type: 'JET_TURBINE', text: '¡ROOOAR!', bg: '#0284c7', textColor: '#ffffff', w: 40, h: 36, sound: () => sounds.playThunder() },
        ROCK_GUITAR: { type: 'ROCK_GUITAR', text: '¡SOLO!', bg: '#ec4899', textColor: '#ffffff', w: 34, h: 34, sound: () => sounds.playBoombox() },
        FOG_HORN: { type: 'FOG_HORN', text: '¡BUUUUM!', bg: '#0369a1', textColor: '#ffffff', w: 38, h: 32, sound: () => sounds.playAirHorn() },
        HELICOPTER: { type: 'HELICOPTER', text: '¡TUC-TUC!', bg: '#475569', textColor: '#ffffff', w: 42, h: 34, sound: () => sounds.playThunder() },
      };

      const availableKeys = allowedHazards.length > 0 ? allowedHazards : (['BIRD'] as HazardItem['type'][]);
      const chosenType = availableKeys[Math.floor(Math.random() * availableKeys.length)];
      const config = allHazardConfigs[chosenType] || allHazardConfigs.BIRD;

      const margin = 50;
      const x = margin + Math.random() * (width - margin * 2);

      // Warning indicator at ceiling
      s.warnings.push({
        id: Math.random().toString(),
        x,
        type: config.type,
        life: 0.55,
      });

      // PROGRESSIVE SPEED: Early levels (1-2) are slower & calmer, later levels (5-7) drop fast!
      const levelSpeedFactor = 160 + s.currentLevel * 30 + s.speedLevel * 20;
      const vy = (levelSpeedFactor + (Math.random() - 0.5) * 40) * (s.difficulty === 'CAOTICO' ? 1.25 : 1);
      const vx = (Math.random() - 0.5) * (20 + s.currentLevel * 10);

      s.hazards.push({
        id: Math.random().toString(),
        x,
        y: -40,
        vx,
        vy,
        type: config.type,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 2,
        comicText: config.text,
        comicBgColor: config.bg,
        comicTextColor: config.textColor,
        soundPlayed: false,
        width: config.w,
        height: config.h,
        wobble: 0,
      });

      config.sound();

      // SPAWN COINS ALONGSIDE FALLING HAZARDS
      if (Math.random() < 0.65) {
        const coinMargin = 40;
        const coinX = coinMargin + Math.random() * (width - coinMargin * 2);
        s.coinsList.push({
          id: Math.random().toString(),
          x: coinX,
          y: -30,
          vy: 160 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 30,
          value: selectedSkin === 'GOLDEN_CHAMP' ? 2 : 1,
          frame: Math.floor(Math.random() * 30),
        });
      }
    };

    const spawnBonus = (width: number) => {
      const s = stateRef.current;
      const bonusTypes: Array<{ type: BonusItem['type']; tag: string }> = [
        { type: 'ENERGY_CAN', tag: '¡ENERGÍA!' },
        { type: 'HEADPHONES', tag: '¡SILENCIO!' },
        { type: 'COFFEE', tag: '¡CAFÉ VELOZ!' },
        { type: 'HEART', tag: '+1 VIDA' },
      ];

      const rand = Math.random();
      let chosen = bonusTypes[0];
      if (rand < 0.4) chosen = bonusTypes[0];
      else if (rand < 0.7) chosen = bonusTypes[1];
      else if (rand < 0.9) chosen = bonusTypes[2];
      else chosen = bonusTypes[3];

      const margin = 60;
      const x = margin + Math.random() * (width - margin * 2);

      s.bonuses.push({
        id: Math.random().toString(),
        x,
        y: -30,
        vy: 140 + Math.random() * 40,
        type: chosen.type,
        width: 24,
        height: 32,
        tag: chosen.tag,
      });
    };

    // LEVEL UP / MAP ADVANCE HANDLER
    const triggerLevelUp = (w: number, crossedPortal: boolean = false) => {
      const s = stateRef.current;

      // If finished level 10: VICTORY!
      if (s.currentLevel >= 10) {
        s.screen = 'VICTORY';
        setScreen('VICTORY');
        sounds.stopMusic();
        sounds.playYujuLevelUp();
        updateHighScore(s.score + 5000);
        setScore((sc) => sc + 5000);
        setStats({
          dodged: s.dodged,
          nearMisses: s.nearMisses,
          powerups: s.powerups,
          coins: s.coinsEarnedThisRun + 50,
        });
        addCoins(50);
        return;
      }

      s.currentLevel += 1;
      s.levelTimer = 0;

      // Cycle maps through all 10 locations!
      const nextMapIndex = (s.currentLevel - 1) % MAP_ORDER.length;
      const nextMapId = MAP_ORDER[nextMapIndex];
      s.currentMap = nextMapId;

      // Schedule "Luz Roja, Luz Verde" event every 1-2 levels
      const willTriggerThisLevel = s.currentLevel % 2 === 0 || Math.random() < 0.7;
      s.redLight = {
        phase: 'IDLE',
        timer: 0,
        hasTriggeredThisLevel: false,
        willTriggerThisLevel,
        targetTriggerTime: 6.0 + Math.random() * 4.0,
        gracePeriod: 0,
      };
      setRedLightPhase('IDLE');
      setRedLightTimer(0);

      setCurrentLevel(s.currentLevel);
      setCurrentMap(nextMapId);

      // MARIO BROS "¡YUJU!" SOUND!
      sounds.playYujuLevelUp();

      // Reset player to the left entrance of the new map, facing right!
      s.player.x = 65;
      s.player.vx = 0;
      s.player.facingRight = true;
      s.player.invulnerableTimer = 1.8; // Brief shield when arriving at new stage

      // Screen shake and celebratory message
      s.screenShake = 0.55;
      const mapName = MAPS[nextMapId]?.name || 'NUEVA ÁREA';
      s.floatingTexts.push({
        id: Math.random().toString(),
        text: crossedPortal ? `¡CRUZASTE LA META! Nv.${s.currentLevel}` : `¡YUJU! ¡NIVEL ${s.currentLevel}!`,
        x: w / 2,
        y: 110,
        color: '#facc15',
        alpha: 1.6,
        scale: 1.5,
      });
      s.floatingTexts.push({
        id: Math.random().toString(),
        text: `ENTRANDO: ${mapName}`,
        x: w / 2,
        y: 145,
        color: '#38bdf8',
        alpha: 1.5,
        scale: 1.2,
      });

      const levelBonus = (crossedPortal ? 1800 : 1200) * s.multiplier;
      s.score += levelBonus;
      setScore(s.score);

      // Rain down coins
      for (let c = 0; c < 8; c++) {
        s.coinsList.push({
          id: Math.random().toString(),
          x: 70 + c * 90,
          y: -20 - c * 25,
          vy: 180,
          vx: (Math.random() - 0.5) * 20,
          value: selectedSkin === 'GOLDEN_CHAMP' ? 2 : 1,
          frame: c * 5,
        });
      }
    };

    const gameLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const w = canvas.width;
      const h = canvas.height;
      const s = stateRef.current;

      // Screen shake
      ctx.save();
      if (s.screenShake > 0) {
        const shakeMagnitude = s.screenShake * 8;
        const ox = (Math.random() - 0.5) * shakeMagnitude;
        const oy = (Math.random() - 0.5) * shakeMagnitude;
        ctx.translate(ox, oy);
        s.screenShake = Math.max(0, s.screenShake - dt * 2.5);
      }

      // --- 1. RENDER CURRENT MAP (16-BIT RETRO PIXEL ART RESOLUTION & FILTERING) ---
      const activeMapConfig = MAPS[s.currentMap] || MAPS.MAP_SCHOOL_PAVILION;
      const mapBgImg = bgImagesRef.current[s.currentMap];

      ctx.save();
      // Crisp 16-bit retro pixel sampling (no blurry bilinear interpolation)
      ctx.imageSmoothingEnabled = false;

      if (mapBgImg && mapBgImg.complete) {
        // Draw the exact 16:9 pixel background cleanly, preserving the composition, perspective and red brick
        ctx.drawImage(mapBgImg, 0, 0, w, h);
      } else {
        // Fallback gradient while loading
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.5, '#1e293b');
        skyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // Ground plane reference (y = 385)
      const groundY = 385;
      const exitPortalX = w - 65; // At x = 775 (right end of canvas)

      // Soft ambient ground shadow to integrate 2D arcade sprites into the background
      const groundGrad = ctx.createLinearGradient(0, groundY - 20, 0, h);
      groundGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      groundGrad.addColorStop(0.3, 'rgba(15, 23, 42, 0.12)');
      groundGrad.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY - 20, w, h - (groundY - 20));

      // Subtle dashed golden lane guide along the pathway
      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();
      ctx.restore();

      // Draw Grand 16-Bit Exit Archway at the right end of the map!
      // (User request: "hacer que el jugador avanza... y llegue al final del mapa y cuando cruse que cambie de mapa")
      drawExitPortal(ctx, exitPortalX, groundY, s.currentLevel, s.gameTime);

      // --- 2. GAMEPLAY UPDATE ---
      if (s.screen === 'PLAYING') {
        s.gameTime += dt;
        s.levelTimer += dt;

        // Dynamic speed scale
        const newSpeedLevel = Math.min(10, Math.floor(1 + s.score / 2200 + s.gameTime / 24));
        if (newSpeedLevel !== s.speedLevel) {
          s.speedLevel = newSpeedLevel;
          setSpeedLevel(newSpeedLevel);
          sounds.startMusic(1 + (newSpeedLevel - 1) * 0.04);
        }

        // Progressive Noise Level that scales with Map & level
        const baseNoise = 10 + s.currentLevel * 9;
        s.noiseLevel = Math.min(100, Math.max(baseNoise, s.noiseLevel + dt * (1.1 + s.currentLevel * 0.25)));
        setNoiseLevel(Math.round(s.noiseLevel));

        // PROGRESSIVE SPAWN RATE (INCREASED FREQUENCY OF FALLING NOISE OBJECTS FOR EXTRA RETRO CHALLENGE)
        const difficultyBonus = s.difficulty === 'CAOTICO' ? 0.25 : s.difficulty === 'INFALIBLE' ? 0.35 : 0;
        const baseSpawnInterval = Math.max(0.25, 1.4 - s.currentLevel * 0.11 - difficultyBonus);
        if (s.gameTime - s.lastSpawnTime > baseSpawnInterval && s.redLight.phase !== 'RED') {
          spawnHazard(w);

          // Double drop: starting at level 2, frequent staggered hazard pairs
          const doubleChance = 0.35 + s.currentLevel * 0.04 + (s.difficulty === 'CAOTICO' ? 0.15 : 0);
          if (s.currentLevel >= 2 && Math.random() < doubleChance) {
            setTimeout(() => spawnHazard(w), 140);
          }

          // Triple drop: on level 5+, occasional 3-hazard wave barrage
          const tripleChance = 0.2 + (s.currentLevel - 5) * 0.05 + (s.difficulty === 'CAOTICO' ? 0.1 : 0);
          if (s.currentLevel >= 5 && Math.random() < tripleChance) {
            setTimeout(() => spawnHazard(w), 280);
          }

          s.lastSpawnTime = s.gameTime;
        }

        // Spawning Bonuses
        const bonusInterval = 8.0;
        if (s.gameTime - s.lastBonusTime > bonusInterval && s.redLight.phase !== 'RED') {
          spawnBonus(w);
          s.lastBonusTime = s.gameTime;
        }

        // --- PLAYER UPDATE & LUZ ROJA / VERDE STATE MACHINE ---
        const p = s.player;
        const rl = s.redLight;

        // Process Luz Roja state transitions
        if (rl.phase === 'IDLE') {
          if (rl.willTriggerThisLevel && !rl.hasTriggeredThisLevel && s.levelTimer >= rl.targetTriggerTime) {
            rl.phase = 'WARNING';
            rl.timer = 2.0;
            setRedLightPhase('WARNING');
            setRedLightTimer(2.0);
            sounds.playSquidDollChime();
            sounds.playRedLightWarning();
            s.floatingTexts.push({
              id: Math.random().toString(),
              text: '⚠️ ¡ATENTO! ¡LUZ ROJA EN CAMINO! ⚠️',
              x: w / 2,
              y: 95,
              color: '#facc15',
              alpha: 2.0,
              scale: 1.4,
            });
          }
        } else if (rl.phase === 'WARNING') {
          rl.timer -= dt;
          setRedLightTimer(Math.max(0, rl.timer));
          if (rl.timer <= 0) {
            rl.phase = 'RED';
            rl.timer = 3.6;
            rl.gracePeriod = 0.22; // Brief grace period for inertia
            setRedLightPhase('RED');
            setRedLightTimer(3.6);
            sounds.playRedLightWarning();
            s.screenShake = 0.35;
            s.floatingTexts.push({
              id: Math.random().toString(),
              text: '🔴 ¡¡LUZ ROJA!! ¡QUÉDATE QUIETO! 🔴',
              x: w / 2,
              y: 95,
              color: '#ef4444',
              alpha: 2.2,
              scale: 1.6,
            });
          }
        } else if (rl.phase === 'RED') {
          rl.timer -= dt;
          if (rl.gracePeriod > 0) {
            rl.gracePeriod -= dt;
          }
          setRedLightTimer(Math.max(0, rl.timer));

          // Check if player moves during Red Light!
          if (rl.gracePeriod <= 0) {
            const isPressingKey = s.keys.left || s.keys.right || s.keys.up || s.keys.down || s.keys.dash;
            const hasSignificantSpeed = Math.abs(p.vx) > 18 || Math.abs(p.vy) > 25 || !p.isGrounded;

            if (isPressingKey || hasSignificantSpeed) {
              // CAUGHT MOVING DURING RED LIGHT!
              // "si se mueve que empieza a hacer mucho ruido y caiga muchisimos objetos, y haya mucho ruido"
              rl.phase = 'CAUGHT';
              rl.timer = 3.5;
              rl.hasTriggeredThisLevel = true;
              setRedLightPhase('CAUGHT');
              setRedLightTimer(3.5);

              // Maximize noise to 100 dB and trigger massive screen shake
              s.noiseLevel = 100;
              setNoiseLevel(100);
              s.screenShake = 1.4;

              // Blare intense alarms, klaxon, siren, airhorn, jackhammer
              sounds.playCaughtAlarm();
              sounds.playSiren();
              sounds.playAirHorn();
              sounds.playJackhammer();

              s.floatingTexts.push({
                id: Math.random().toString(),
                text: '🚨 ¡¡MOVIMIENTO DETECTADO!! 🚨',
                x: p.x,
                y: p.y - 65,
                color: '#ef4444',
                alpha: 2.5,
                scale: 1.7,
              });
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: '💥 ¡¡AVALANCHA DE RUIDO Y OBJETOS!! 💥',
                x: w / 2,
                y: 110,
                color: '#f97316',
                alpha: 2.2,
                scale: 1.5,
              });

              // Rapid deluge avalanche of 18 noise hazard objects raining down
              for (let k = 0; k < 18; k++) {
                setTimeout(() => {
                  if (stateRef.current.screen === 'PLAYING') {
                    spawnHazard(w);
                    if (k % 4 === 0) {
                      sounds.playAirHorn();
                      stateRef.current.screenShake = Math.max(stateRef.current.screenShake, 0.45);
                    }
                  }
                }, k * 115);
              }
            }
          }

          if (rl.timer <= 0 && rl.phase === 'RED') {
            // Player successfully stayed still!
            rl.phase = 'IDLE';
            rl.hasTriggeredThisLevel = true;
            setRedLightPhase('IDLE');
            setRedLightTimer(0);

            sounds.playPowerup();
            s.score += 1500 * s.multiplier;
            setScore(s.score);
            addCoins(5);
            s.noiseLevel = Math.max(10, s.noiseLevel - 35);
            setNoiseLevel(Math.round(s.noiseLevel));

            s.floatingTexts.push({
              id: Math.random().toString(),
              text: '🟢 ¡LUZ VERDE! ¡SILENCIO EXITOSO! +1500',
              x: w / 2,
              y: 95,
              color: '#22c55e',
              alpha: 2.2,
              scale: 1.6,
            });
          }
        } else if (rl.phase === 'CAUGHT') {
          rl.timer -= dt;
          setRedLightTimer(Math.max(0, rl.timer));
          if (rl.timer <= 0) {
            rl.phase = 'IDLE';
            setRedLightPhase('IDLE');
            setRedLightTimer(0);
          }
        }
        const playerSpeed = p.speedBoostTimer > 0 ? 390 : 270;

        const dashUpgrade = upgrades.find((u) => u.id === 'DASH_COOLDOWN');
        const dashCdMultiplier = dashUpgrade ? Math.max(0.3, 1 - dashUpgrade.level * 0.25) : 1;

        if (s.keys.left) {
          p.vx = -playerSpeed;
          p.facingRight = false;
        } else if (s.keys.right) {
          p.vx = playerSpeed;
          p.facingRight = true;
        } else {
          p.vx *= 0.6;
        }

        // Dash mechanics
        if (p.dashCooldown > 0) p.dashCooldown -= dt;
        if (p.dashActive > 0) p.dashActive -= dt;

        if (s.keys.dash && p.dashCooldown <= 0) {
          p.dashCooldown = (p.speedBoostTimer > 0 ? 0.35 : 1.1) * dashCdMultiplier;
          p.dashActive = 0.2;
          p.vx = p.facingRight ? playerSpeed * 2.2 : -playerSpeed * 2.2;
          sounds.playSlide();
          s.screenShake = 0.2;
        }

        if (p.dashActive > 0) {
          p.vx = p.facingRight ? playerSpeed * 2.2 : -playerSpeed * 2.2;
        }

        p.x += p.vx * dt;
        p.x = Math.max(30, Math.min(w - 20, p.x));

        // --- PLAYER ADVANCES AND REACHES THE END OF THE MAP! ---
        // (Crossing the portal triggers instant advancement to next map)
        if (p.x >= exitPortalX - 25) {
          triggerLevelUp(w, true);
        } else if (s.levelTimer >= s.levelDuration + 12) {
          // Fallback auto-advance if player stays dodging without crossing
          triggerLevelUp(w, false);
        }

        // Jump mechanics
        const gravity = 1200;
        if (s.keys.up && p.isGrounded && !p.isSliding) {
          p.vy = -450;
          p.isGrounded = false;
          p.isJumping = true;
          sounds.playJump();
        }

        p.isSliding = s.keys.down && p.isGrounded;

        if (!p.isGrounded) {
          p.vy += gravity * dt;
          p.y += p.vy * dt;

          if (p.y >= p.baseY) {
            p.y = p.baseY;
            p.vy = 0;
            p.isGrounded = true;
            p.isJumping = false;
          }
        }

        // Animation frame update
        p.animTimer += dt;
        if (Math.abs(p.vx) > 20 && p.isGrounded) {
          if (p.animTimer > 0.12) {
            p.animFrame = (p.animFrame + 1) % 4;
            p.animTimer = 0;
          }
        } else if (p.isGrounded) {
          p.animFrame = 0;
        }

        if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
        if (p.shieldTimer > 0) {
          p.shieldTimer -= dt;
          if (p.shieldTimer <= 0) {
            p.shieldActive = false;
            setIsShieldActive(false);
          }
        }
        if (p.speedBoostTimer > 0) {
          p.speedBoostTimer -= dt;
          if (p.speedBoostTimer <= 0) {
            setIsSpeedBoostActive(false);
          }
        }

        // Magnet upgrade
        const magnetUpgrade = upgrades.find((u) => u.id === 'MAGNET');
        const magnetRadius = magnetUpgrade && magnetUpgrade.level > 0 ? 50 + magnetUpgrade.level * 45 : 0;

        // --- COINS UPDATE & COLLECTION ---
        for (let cIdx = s.coinsList.length - 1; cIdx >= 0; cIdx--) {
          const coin = s.coinsList[cIdx];
          coin.y += coin.vy * dt;
          coin.x += coin.vx * dt;
          coin.frame += 1;

          if (magnetRadius > 0) {
            const dx = p.x - coin.x;
            const dy = p.y - 15 - coin.y;
            const dist = Math.hypot(dx, dy);
            if (dist < magnetRadius) {
              coin.x += (dx / dist) * 320 * dt;
              coin.y += (dy / dist) * 320 * dt;
            }
          }

          if (coin.y >= groundY - 6) {
            s.coinsList.splice(cIdx, 1);
            continue;
          }

          const distToPlayer = Math.hypot(coin.x - p.x, coin.y - (p.y - 18));
          if (distToPlayer < 30) {
            sounds.playCoin();
            s.coinsEarnedThisRun += coin.value;
            addCoins(coin.value);
            s.score += 75 * s.multiplier;
            setScore(s.score);

            s.floatingTexts.push({
              id: Math.random().toString(),
              text: `+${coin.value} 🪙`,
              x: coin.x,
              y: coin.y - 15,
              color: '#facc15',
              alpha: 1,
              scale: 1.0,
            });

            s.coinsList.splice(cIdx, 1);
          }
        }

        // --- HAZARDS UPDATE & COLLISION ---
        for (let i = s.hazards.length - 1; i >= 0; i--) {
          const hItem = s.hazards[i];
          hItem.y += hItem.vy * dt;
          hItem.x += hItem.vx * dt;
          hItem.rotation += hItem.rotSpeed * dt;
          hItem.wobble += dt * 6;

          // Ground hit
          if (hItem.y >= groundY - 10) {
            s.impacts.push({
              id: Math.random().toString(),
              x: hItem.x,
              y: groundY - 4,
              age: 0,
              scale: 1,
            });
            sounds.playPavementHit();

            if (
              hItem.type === 'JACKHAMMER' ||
              hItem.type === 'CAR_SMALL' ||
              hItem.type === 'TRUCK_SMALL' ||
              hItem.type === 'THUNDER' ||
              hItem.type === 'AIR_HORN'
            ) {
              s.screenShake = 0.3;
            }

            s.streak += 1;
            s.dodged += 1;
            if (s.streak > s.maxStreak) {
              s.maxStreak = s.streak;
              setMaxStreak(s.maxStreak);
            }

            let newMultiplier = 1;
            if (s.streak >= 100) newMultiplier = 10;
            else if (s.streak >= 75) newMultiplier = 8;
            else if (s.streak >= 50) newMultiplier = 5;
            else if (s.streak >= 25) newMultiplier = 3;
            else if (s.streak >= 10) newMultiplier = 2;

            if (newMultiplier > s.multiplier) {
              s.multiplier = newMultiplier;
              setMultiplier(newMultiplier);
              sounds.playStreakUp();
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: `¡RACHA x${newMultiplier}!`,
                x: p.x,
                y: p.y - 60,
                color: '#f97316',
                alpha: 1,
                scale: 1.3,
              });
            }

            const pointsAwarded = 50 * s.multiplier;
            s.score += pointsAwarded;
            setScore(s.score);
            setStreak(s.streak);
            s.noiseLevel = Math.max(5, s.noiseLevel - 0.8);

            s.hazards.splice(i, 1);
            continue;
          }

          // Near-Miss
          if (!hItem.nearMissChecked && Math.abs(hItem.y - p.y) < 25) {
            const distanceX = Math.abs(hItem.x - p.x);
            if (distanceX >= 26 && distanceX <= 54) {
              hItem.nearMissChecked = true;
              s.nearMisses += 1;
              const bonusScore = 150 * s.multiplier;
              s.score += bonusScore;
              setScore(s.score);
              sounds.playNearMiss();
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: `¡ESQUIVE! +${bonusScore}`,
                x: hItem.x,
                y: hItem.y - 20,
                color: '#38bdf8',
                alpha: 1,
                scale: 1.0,
              });
            }
          }

          // Collision Box
          const playerBox = {
            x: p.x - (p.isSliding ? 18 : 12),
            y: p.y - (p.isSliding ? 14 : 36),
            w: p.isSliding ? 36 : 24,
            h: p.isSliding ? 14 : 36,
          };

          const hazardBox = {
            x: hItem.x - hItem.width / 2,
            y: hItem.y - hItem.height / 2,
            w: hItem.width,
            h: hItem.height,
          };

          const isColliding =
            playerBox.x < hazardBox.x + hazardBox.w &&
            playerBox.x + playerBox.w > hazardBox.x &&
            playerBox.y < hazardBox.y + hazardBox.h &&
            playerBox.y + playerBox.h > hazardBox.y;

          if (isColliding && p.invulnerableTimer <= 0) {
            if (p.shieldActive) {
              p.shieldHitsRemaining -= 1;
              if (p.shieldHitsRemaining <= 0) {
                p.shieldActive = false;
                setIsShieldActive(false);
              }
              p.invulnerableTimer = 1.0;
              s.screenShake = 0.4;
              sounds.playHurt();
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: p.shieldActive ? '¡ESCUDO AGUANTA!' : '¡ESCUDO ROTO!',
                x: p.x,
                y: p.y - 50,
                color: '#06b6d4',
                alpha: 1,
                scale: 1.2,
              });
              s.hazards.splice(i, 1);
              continue;
            }

            p.lives -= 1;
            p.invulnerableTimer = 1.8;
            s.streak = 0;
            s.multiplier = 1;
            setMultiplier(1);
            setStreak(0);
            setLives(p.lives);
            s.screenShake = 0.6;
            s.noiseLevel = Math.min(100, s.noiseLevel + 25);
            sounds.playHurt();

            s.floatingTexts.push({
              id: Math.random().toString(),
              text: '¡GOLPE!',
              x: p.x,
              y: p.y - 50,
              color: '#ef4444',
              alpha: 1,
              scale: 1.4,
            });

            s.hazards.splice(i, 1);

            if (p.lives <= 0) {
              s.screen = 'GAME_OVER';
              setScreen('GAME_OVER');
              sounds.stopMusic();
              sounds.playGameOver();
              updateHighScore(s.score);
              setStats({
                dodged: s.dodged,
                nearMisses: s.nearMisses,
                powerups: s.powerups,
                coins: s.coinsEarnedThisRun,
              });
              break;
            }
          }
        }

        // --- BONUSES UPDATE & COLLECTION ---
        for (let j = s.bonuses.length - 1; j >= 0; j--) {
          const b = s.bonuses[j];
          b.y += b.vy * dt;

          if (b.y >= groundY - 6) {
            s.bonuses.splice(j, 1);
            continue;
          }

          const dist = Math.hypot(b.x - p.x, b.y - (p.y - 18));
          if (dist < 32) {
            sounds.playPowerup();
            s.powerups += 1;

            if (b.type === 'ENERGY_CAN') {
              const boostDuration = selectedSkin === 'RETRO_RED' ? 10 : 8;
              p.speedBoostTimer = boostDuration;
              setIsSpeedBoostActive(true);
              s.score += 500 * s.multiplier;
              setScore(s.score);
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: '¡ENERGÍA TURBO! +500',
                x: p.x,
                y: p.y - 55,
                color: '#38bdf8',
                alpha: 1,
                scale: 1.3,
              });
              s.hazards = s.hazards.filter((hz) => {
                if (Math.hypot(hz.x - p.x, hz.y - p.y) < 140) {
                  s.impacts.push({
                    id: Math.random().toString(),
                    x: hz.x,
                    y: hz.y,
                    age: 0,
                    scale: 0.8,
                  });
                  return false;
                }
                return true;
              });
            } else if (b.type === 'HEADPHONES') {
              const shieldUpgrade = upgrades.find((u) => u.id === 'SHIELD_BOOST');
              const extraHits = shieldUpgrade ? shieldUpgrade.level : 0;
              p.shieldActive = true;
              p.shieldTimer = selectedSkin === 'NEON_CYBER' ? 13 : 10;
              p.shieldHitsRemaining = 1 + extraHits;
              setIsShieldActive(true);
              s.noiseLevel = Math.max(0, s.noiseLevel - 30);
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: '¡SILENCIO TOTAL!',
                x: p.x,
                y: p.y - 55,
                color: '#06b6d4',
                alpha: 1,
                scale: 1.3,
              });
            } else if (b.type === 'COFFEE') {
              p.dashCooldown = 0;
              p.speedBoostTimer = 6;
              setIsSpeedBoostActive(true);
              s.score += 300 * s.multiplier;
              setScore(s.score);
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: '¡CAFÉ VELOZ!',
                x: p.x,
                y: p.y - 55,
                color: '#f59e0b',
                alpha: 1,
                scale: 1.2,
              });
            } else if (b.type === 'HEART') {
              if (p.lives < p.maxLives) {
                p.lives += 1;
                setLives(p.lives);
              }
              s.floatingTexts.push({
                id: Math.random().toString(),
                text: '+1 VIDA',
                x: p.x,
                y: p.y - 55,
                color: '#ef4444',
                alpha: 1,
                scale: 1.3,
              });
            }

            s.bonuses.splice(j, 1);
          }
        }
      }

      // --- 3. RENDER WARNINGS AT CEILING ---
      for (let wIdx = s.warnings.length - 1; wIdx >= 0; wIdx--) {
        const warn = s.warnings[wIdx];
        warn.life -= dt;
        if (warn.life <= 0) {
          s.warnings.splice(wIdx, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = Math.floor(timestamp / 100) % 2 === 0 ? '#ef4444' : '#facc15';
        ctx.fillRect(warn.x - 10, 4, 20, 20);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.strokeRect(warn.x - 10, 4, 20, 20);

        ctx.fillStyle = '#0f172a';
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', warn.x, 18);
        ctx.restore();
      }

      // --- 4. RENDER COINS ---
      s.coinsList.forEach((coin) => {
        drawCoin(ctx, coin.x, coin.y, coin.frame);
      });

      // --- 5. RENDER BONUSES ---
      const nowTime = timestamp / 1000;
      s.bonuses.forEach((b) => {
        if (b.type === 'ENERGY_CAN') {
          drawEnergyCan(ctx, b.x, b.y, nowTime);
        } else if (b.type === 'HEADPHONES') {
          drawHeadphones(ctx, b.x, b.y, nowTime);
        } else if (b.type === 'COFFEE') {
          drawCoffee(ctx, b.x, b.y, nowTime);
        } else if (b.type === 'HEART') {
          drawHeart(ctx, b.x, b.y, 1.2 + Math.sin(nowTime * 6) * 0.2);
        }
        drawComicTag(ctx, b.tag, b.x, b.y - 24, '#0284c7', '#ffffff');
      });

      // --- 6. RENDER FALLING HAZARDS & ONOMATOPOEIA ---
      s.hazards.forEach((hItem) => {
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hItem.x, Math.max(0, hItem.y - 40));
        ctx.lineTo(hItem.x, hItem.y - 15);
        ctx.stroke();
        ctx.restore();

        // RENDER CUSTOM PIXEL ART SPRITES PER HAZARD
        if (hItem.type === 'BIRD') {
          drawBird(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'CAR_SMALL') {
          drawSmallCar(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'TRUCK_SMALL') {
          drawSmallTruck(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'LAWNMOWER') {
          drawLawnmower(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'WHISTLE') {
          drawWhistle(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'RADIO_BOOMBOX') {
          drawBoombox(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'MOTORCYCLE') {
          drawMotorcycle(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'HORN' || hItem.type === 'AIR_HORN') {
          drawHorn(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'DRILL') {
          drawDrill(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'ALARM') {
          drawAlarm(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'MEGAPHONE') {
          drawMegaphone(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'CAT' || hItem.type === 'CAT_SCREAM') {
          drawCat(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'JACKHAMMER') {
          drawJackhammer(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'SCHOOL_BELL') {
          drawSchoolBell(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'BALL') {
          drawBall(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'PRESS') {
          drawPress(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'STEAM_PIPE') {
          drawSteamPipe(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'CIRCULAR_SAW') {
          drawCircularSaw(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'TRAIN_WHEEL') {
          drawTrainWheel(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'JET_TURBINE') {
          drawJetTurbine(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'ROCK_GUITAR') {
          drawRockGuitar(ctx, hItem.x, hItem.y, hItem.rotation);
        } else if (hItem.type === 'FOG_HORN') {
          drawFoghorn(ctx, hItem.x, hItem.y, hItem.wobble);
        } else if (hItem.type === 'HELICOPTER') {
          drawHelicopter(ctx, hItem.x, hItem.y, hItem.wobble);
        } else {
          // Fallback megaphone
          drawMegaphone(ctx, hItem.x, hItem.y, hItem.rotation);
        }

        const tagOffsetY = -22 + Math.sin(hItem.wobble) * 2;
        drawComicTag(
          ctx,
          hItem.comicText,
          hItem.x,
          hItem.y + tagOffsetY,
          hItem.comicBgColor,
          hItem.comicTextColor
        );
      });

      // --- 7. RENDER IMPACT SPARKS ---
      for (let k = s.impacts.length - 1; k >= 0; k--) {
        const imp = s.impacts[k];
        imp.age += dt * 3.5;
        if (imp.age >= 1) {
          s.impacts.splice(k, 1);
          continue;
        }
        drawImpact(ctx, imp.x, imp.y, imp.age, imp.scale);
      }

      // --- 8. RENDER PLAYER WITH GROUND CONTACT SHADOW ON REAL PHOTO ---
      const p = s.player;
      let frame = p.animFrame;
      if (p.isSliding) frame = -2;
      else if (!p.isGrounded) frame = -1;
      else if (p.invulnerableTimer > 0) frame = -3;

      // Soft contact shadow on the real photo surface
      ctx.save();
      const shadowW = p.isSliding ? 22 : 15;
      const shadowH = 5;
      const shadowY = p.baseY + 1;
      const shadowAlpha = p.isGrounded ? 0.45 : Math.max(0.12, 0.45 - (p.baseY - p.y) * 0.003);
      ctx.fillStyle = `rgba(15, 23, 42, ${shadowAlpha})`;
      ctx.beginPath();
      ctx.ellipse(p.x, shadowY, shadowW, shadowH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      drawPlayer(
        ctx,
        p.x,
        p.y,
        frame,
        p.facingRight,
        p.shieldActive,
        p.speedBoostTimer > 0,
        p.invulnerableTimer > 0,
        {
          capColor: activeSkin.capColor,
          jacketColor: activeSkin.jacketColor,
          jacketHighlight: activeSkin.jacketHighlight,
          pantsColor: activeSkin.pantsColor,
        }
      );

      // --- 8.5. RENDER LUZ ROJA / VERDE FULL-CANVAS SCREEN OVERLAYS ---
      const rlState = s.redLight;
      if (rlState.phase === 'WARNING') {
        ctx.save();
        const warnAlpha = 0.16 + Math.sin(s.gameTime * 10) * 0.08;
        ctx.fillStyle = `rgba(245, 158, 11, ${warnAlpha})`;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      } else if (rlState.phase === 'RED') {
        ctx.save();
        // Red screen tint wash
        const redAlpha = 0.40 + Math.sin(s.gameTime * 9) * 0.12;
        ctx.fillStyle = `rgba(220, 38, 38, ${redAlpha})`;
        ctx.fillRect(0, 0, w, h);

        // Menacing red alert border vignette
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 14;
        ctx.strokeRect(0, 0, w, h);

        // Squid Game surveillance scanning laser beam sweeping vertically
        const beamY = (s.gameTime * 220) % h;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(0, beamY, w, 4);

        // Red spotlight focused on player to highlight stillness
        const spotGrad = ctx.createRadialGradient(p.x, p.y - 20, 10, p.x, p.y - 20, 95);
        spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        spotGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y - 20, 95, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (rlState.phase === 'CAUGHT') {
        ctx.save();
        const strobe = Math.floor(s.gameTime * 16) % 2 === 0 ? 'rgba(239, 68, 68, 0.58)' : 'rgba(0, 0, 0, 0.38)';
        ctx.fillStyle = strobe;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, w, h);
        ctx.restore();
      }

      // --- 9. RENDER FLOATING TEXT POPUPS ---
      for (let tIdx = s.floatingTexts.length - 1; tIdx >= 0; tIdx--) {
        const ft = s.floatingTexts[tIdx];
        ft.y -= 45 * dt;
        ft.alpha -= dt * 1.2;
        if (ft.alpha <= 0) {
          s.floatingTexts.splice(tIdx, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeSkin, selectedSkin, upgrades]);

  const formatScore = (num: number) => {
    return num.toString().padStart(6, '0');
  };

  const renderSpeedBar = () => {
    const filled = Math.min(10, Math.max(1, speedLevel));
    const empty = 10 - filled;
    return `[${'>'.repeat(filled)}${'-'.repeat(empty)}]`;
  };

  return (
    <div
      className={`relative w-full min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:justify-center p-1 sm:p-3 md:p-4 select-none touch-manipulation ${
        crtEnabled ? 'crt' : ''
      }`}
    >
      {/* Top Header / Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-1.5 sm:py-2 px-2 sm:px-3 bg-slate-900/90 border-2 border-yellow-500/50 rounded-t-lg mb-1 font-pixel text-[10px] sm:text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-yellow-400 font-bold truncate max-w-[120px] sm:max-w-none">CAOS EN LA CIUDAD</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-cyan-400 hidden sm:inline flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 inline shrink-0" /> {MAPS[currentMap]?.name} (NV.{currentLevel}/10)
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Map Selector Button */}
          <button
            onClick={() => setShowMapSelect(true)}
            className="px-1.5 sm:px-2 py-1 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold border border-yellow-200 text-[8px] sm:text-[10px] flex items-center gap-1 shadow active:translate-y-0.5"
            title="Seleccionar entre los 10 mapas"
          >
            <MapPin className="w-3 h-3" />
            <span>10 MAPAS</span>
          </button>

          {/* Coin Vault */}
          <div className="flex items-center gap-1 bg-yellow-950/80 border border-yellow-400 px-1.5 sm:px-2 py-0.5 rounded text-yellow-300 text-[9px] sm:text-xs">
            <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 animate-spin" />
            <span className="font-mono font-bold">{coins}</span>
          </div>

          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className={`hidden md:inline-flex px-2 py-1 border transition-colors text-[9px] sm:text-[10px] ${
              crtEnabled
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800 border-slate-600 text-slate-400'
            }`}
            title="Efecto CRT Arcade"
          >
            CRT {crtEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 sm:p-1.5 border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded touch-manipulation"
            title="Alternar Sonido"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Arcade Cabinet Screen (Strict 16:9 proportional scaling without distorting min-h) */}
      <div className="relative w-full max-w-5xl bg-black border-2 sm:border-4 border-yellow-500/60 rounded-b-lg shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
        {/* The Game Canvas with Direct Touch Gestures for mobile play */}
        <canvas
          ref={canvasRef}
          width={840}
          height={460}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
          onTouchCancel={handleCanvasTouchEnd}
          className="w-full h-full object-contain sm:object-cover pixelated block touch-none cursor-pointer"
        />

        {/* --- HUD OVERLAY DURING PLAYING & PAUSED --- */}
        {(screen === 'PLAYING' || screen === 'PAUSED') && (
          <div className="absolute top-0 left-0 right-0 p-1.5 sm:p-3 flex justify-between items-start pointer-events-none font-pixel text-[8px] sm:text-xs z-20">
            {/* Left HUD: Score, Lives, Speed, Coins */}
            <div className="flex flex-col gap-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
              <div className="text-yellow-400 flex items-center gap-1 sm:gap-2 tracking-wider">
                <span>SCORE:</span>
                <span className="text-white font-mono">{formatScore(score)}</span>
              </div>

              {/* LIVES with pixel boy head icons */}
              <div className="flex items-center gap-1">
                <span className="text-red-400">LIVES:</span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(stateRef.current.player.maxLives)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 sm:w-5 sm:h-5 border border-yellow-400 rounded-sm flex items-center justify-center text-[8px] sm:text-[10px] ${
                        idx < lives ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      {idx < lives ? '👦' : '💀'}
                    </div>
                  ))}
                </div>
              </div>

              {/* SPEED METER */}
              <div className="text-emerald-400 flex items-center gap-1">
                <span>SPEED:</span>
                <span className="font-mono text-cyan-300 tracking-tighter text-[7px] sm:text-[10px]">{renderSpeedBar()}</span>
              </div>

              {/* IN-GAME COINS */}
              <div className="text-yellow-300 flex items-center gap-1 text-[8px] sm:text-[10px]">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span>MONEDAS:</span>
                <span className="font-mono text-white">{coins}</span>
              </div>
            </div>

            {/* Center HUD Mobile Badge */}
            <div className="flex md:hidden flex-col items-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
              <span className="text-yellow-300 font-pixel text-[8px] bg-slate-950/85 px-2 py-0.5 border border-yellow-400 rounded">
                NV.{currentLevel}/10
              </span>
              <span className="text-[7px] text-emerald-300 font-mono mt-0.5 bg-slate-900/80 px-1 rounded border border-emerald-500/40">
                META: {Math.round(Math.min(100, Math.max(0, ((stateRef.current.player.x - 65) / (840 - 65 - 85)) * 100)))}% ➔
              </span>
            </div>

            {/* Center HUD Desktop: Map & Level banner + Advance Progress to Exit */}
            <div className="hidden md:flex flex-col items-center drop-shadow-[0_3px_0_#b45309]">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300 font-pixel tracking-wider text-xs bg-slate-950/85 px-3 py-1 border-2 border-yellow-400 shadow">
                  NIVEL {currentLevel}/10 · {MAPS[currentMap]?.name}
                </span>
                <button
                  onClick={() => setShowMapSelect(true)}
                  className="pointer-events-auto bg-amber-500 hover:bg-yellow-400 text-slate-950 px-2 py-0.5 text-[9px] font-bold border border-yellow-200 shadow active:translate-y-0.5 transition-all"
                >
                  MAPAS
                </button>
              </div>
              <span className="text-[9px] text-amber-200 mt-0.5 bg-slate-900/80 px-2 py-0.5 border border-yellow-600">
                {MAPS[currentMap]?.subtitle}
              </span>
              <div className="mt-1 flex items-center gap-2 text-[9px] bg-slate-950/85 px-2.5 py-0.5 border border-emerald-400 text-emerald-300 rounded shadow">
                <span>AVANCE:</span>
                <span className="text-yellow-400 font-mono font-bold">
                  {Math.round(Math.min(100, Math.max(0, ((stateRef.current.player.x - 65) / (840 - 65 - 85)) * 100)))}%
                </span>
                <span className="text-cyan-300">· ¡CRUZA LA SALIDA A LA DERECHA! ➔</span>
              </div>
            </div>

            {/* Right HUD: Streak Combo, Noise, Active Buffs */}
            <div className="flex flex-col items-end gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
              {/* STREAK */}
              <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 border border-yellow-400 rounded">
                <Flame className={`w-3.5 h-3.5 ${streak >= 10 ? 'text-yellow-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-slate-300">RACHA:</span>
                <span className="text-yellow-400 font-bold font-mono">{streak}x</span>
                {multiplier > 1 && (
                  <span className="text-slate-950 font-bold text-[10px] bg-yellow-400 px-1 rounded animate-bounce">
                    x{multiplier}
                  </span>
                )}
              </div>

              {/* NOISE LEVEL */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className={noiseLevel > 75 ? 'text-red-400 font-bold animate-pulse' : 'text-yellow-300'}>
                  RUIDO: {noiseLevel > 75 ? '¡CRÍTICO!' : `${noiseLevel}%`}
                </span>
                <div className="w-16 h-2 bg-slate-900 border border-yellow-500 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      noiseLevel > 75 ? 'bg-red-500' : noiseLevel > 50 ? 'bg-amber-500' : 'bg-yellow-400'
                    }`}
                    style={{ width: `${noiseLevel}%` }}
                  />
                </div>
              </div>

              {/* BUFF STATUS */}
              <div className="flex items-center gap-1">
                {isShieldActive && (
                  <span className="flex items-center gap-1 bg-cyan-950/80 text-cyan-300 border border-cyan-400 px-1.5 py-0.5 rounded text-[9px]">
                    <Shield className="w-3 h-3" /> SILENCIO
                  </span>
                )}
                {isSpeedBoostActive && (
                  <span className="flex items-center gap-1 bg-amber-950/80 text-yellow-300 border border-yellow-400 px-1.5 py-0.5 rounded text-[9px]">
                    <Zap className="w-3 h-3" /> TURBO
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SQUID GAME "LUZ ROJA, LUZ VERDE" HUD ALERT BANNER */}
        {screen === 'PLAYING' && redLightPhase !== 'IDLE' && (
          <div className="absolute top-16 sm:top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center max-w-[92%]">
            {redLightPhase === 'WARNING' && (
              <div className="bg-amber-500/95 text-slate-950 px-3 sm:px-5 py-1.5 border-4 border-yellow-300 font-pixel text-[11px] sm:text-xs font-bold shadow-[0_0_25px_rgba(245,158,11,0.9)] flex items-center gap-2 rounded animate-bounce text-center">
                <span className="text-sm sm:text-base animate-pulse">🟡</span>
                <span>¡ATENTO! LUZ ROJA EN {redLightTimer.toFixed(1)}s</span>
                <span className="text-[9px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded border border-yellow-400">
                  ¡PREPÁRATE A FRENAR!
                </span>
              </div>
            )}

            {redLightPhase === 'RED' && (
              <div className="bg-red-600/95 text-white px-4 sm:px-6 py-2 border-4 border-red-300 font-pixel text-xs sm:text-sm font-bold shadow-[0_0_35px_rgba(239,68,68,1)] flex flex-col items-center gap-1 rounded animate-pulse text-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-300 rounded-full animate-ping inline-block" />
                  <span className="text-yellow-300 tracking-wider">🔴 ¡¡LUZ ROJA!! ¡QUÉDATE QUIETO! 🔴</span>
                </div>
                <div className="text-[10px] sm:text-xs text-white/95 tracking-wide flex flex-wrap justify-center items-center gap-2">
                  <span>¡NO TE MUEVAS!</span>
                  <span className="bg-black/85 text-yellow-300 px-2.5 py-0.5 border border-yellow-400 font-mono text-xs sm:text-sm">
                    {redLightTimer.toFixed(1)}s
                  </span>
                  <span>¡SI TE MUEVES CAERÁ UNA AVALANCHA!</span>
                </div>
              </div>
            )}

            {redLightPhase === 'CAUGHT' && (
              <div className="bg-red-950/95 text-yellow-300 px-4 sm:px-6 py-2 border-4 border-yellow-400 font-pixel text-xs sm:text-sm font-bold shadow-[0_0_40px_rgba(239,68,68,1)] flex flex-col items-center gap-1 rounded animate-bounce text-center">
                <div className="flex items-center gap-2 text-red-500 text-sm sm:text-base animate-pulse">
                  <span>🚨</span>
                  <span className="text-yellow-400 font-black">¡¡MOVIMIENTO DETECTADO!!</span>
                  <span>🚨</span>
                </div>
                <div className="text-[10px] text-red-200">
                  ¡¡AVALANCHA DE RUIDO Y OBJETOS AL MÁXIMO (100 dB)!!
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TITLE SCREEN (YELLOW ARCADE LETTERS & VIBRANT STYLING) --- */}
        {screen === 'TITLE' && (
          <div
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-between p-2 sm:p-5 z-30 overflow-y-auto"
            style={{ backgroundImage: `url(${MAP1_SCHOOL_PAVILION})` }}
          >
            <div className="absolute inset-0 bg-slate-950/60" />

            {/* Top Bar with Coins & Score */}
            <div className="relative w-full flex justify-between items-center text-[9px] sm:text-xs font-pixel z-10 text-white drop-shadow-[0_2px_2px_#b45309]">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 font-bold">RÉCORD:</span>
                <span className="font-mono text-yellow-200">{formatScore(highScore)}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-950/90 border-2 border-yellow-400 px-2 py-0.5 rounded text-yellow-300 shadow">
                  <Coins className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                  <span className="font-mono font-bold text-[9px] sm:text-xs">{coins} 🪙</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-yellow-400 font-bold">
                  <span>10 MAPAS:</span>
                  <span className="text-slate-950 bg-yellow-400 px-1 py-0.5 border border-yellow-600 font-bold text-[9px]">
                    8 CAMPUS + 2 INDUSTRIA
                  </span>
                </div>
              </div>
            </div>

            {/* VIBRANT GLOWING TITLE: REPLACED BLACK WITH PURE YELLOW & GOLD */}
            <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center my-auto py-1 sm:py-2">
              <div className="hidden sm:flex w-full justify-around text-[10px] font-pixel mb-1 sm:mb-2">
                <span className="bg-yellow-400 text-slate-950 font-bold px-2 py-1 border-2 border-yellow-300 transform -rotate-6 animate-bounce">
                  ¡PÍO!
                </span>
                <span className="bg-amber-400 text-slate-950 font-bold px-2 py-1 border-2 border-yellow-200 transform rotate-3">
                  ¡VROOOM!
                </span>
                <span className="bg-yellow-500 text-slate-950 font-bold px-2 py-1 border-2 border-yellow-300 transform -rotate-3">
                  ¡YUJU!
                </span>
              </div>

              {/* PURE VIBRANT YELLOW ARCADE TITLE */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-pixel text-yellow-300 arcade-title tracking-wider py-1 drop-shadow-[0_5px_0_#ca8a04]">
                CAOS EN LA
                <br />
                CIUDAD
              </h1>

              <div className="hidden sm:flex w-full justify-around text-[10px] font-pixel mt-1 sm:mt-2">
                <span className="bg-yellow-400 text-slate-950 font-bold px-2 py-1 border-2 border-yellow-300 transform rotate-6">
                  ¡FIIII!
                </span>
                <span className="bg-amber-300 text-slate-950 font-bold px-2 py-1 border-2 border-yellow-400 transform -rotate-6">
                  ¡TIMBRE!
                </span>
                <span className="bg-yellow-400 text-slate-950 font-bold px-2 py-1 border-2 border-yellow-200 transform rotate-2">
                  ¡HOOOONK!
                </span>
              </div>

              {/* Skin & Music Active indicators */}
              <div className="mt-1 sm:mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 sm:px-3 py-0.5 sm:py-1 border border-yellow-400 text-[8px] sm:text-[10px] font-pixel">
                  <span className="text-yellow-400">SKIN:</span>
                  <span className="text-white font-bold">{activeSkin.name}</span>
                  <span className="text-yellow-500">|</span>
                  <span className="text-emerald-400">{activeSkin.perk}</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 sm:py-1 border border-cyan-400 text-[8px] sm:text-[9px] font-pixel text-cyan-300">
                  <span>🎵</span>
                  <span className="text-yellow-300 font-bold">Pac Baby (Pac-Man CE 2)</span>
                </div>
              </div>

              {/* Difficulty selector */}
              <div className="flex items-center gap-1.5 mt-1 sm:mt-2 bg-slate-900/90 p-1 sm:p-1.5 border border-yellow-500 font-pixel text-[8px] sm:text-[10px]">
                <span className="text-yellow-400 mr-0.5">DIFICULTAD:</span>
                {(['NORMAL', 'CAOTICO', 'INFALIBLE'] as GameDifficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 transition-all ${
                      difficulty === d
                        ? 'bg-yellow-400 text-slate-950 font-bold border border-yellow-200 shadow'
                        : 'text-yellow-200 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Buttons (Play, 10 Maps, Shop, How-To, Records) */}
            <div className="relative z-10 w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 font-pixel">
              <button
                onClick={() => startGame(difficulty)}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-300 border-2 sm:border-4 border-yellow-200 text-slate-950 text-sm sm:text-base font-pixel font-bold tracking-widest uppercase shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 text-slate-950" />
                ¡JUGAR!
              </button>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap w-full sm:w-auto gap-1.5 sm:gap-2">
                <button
                  onClick={() => setShowMapSelect(true)}
                  className="px-2.5 sm:px-4 py-2 bg-cyan-500 hover:bg-cyan-400 border border-cyan-200 text-slate-950 font-bold text-[9px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-[0_2px_0_#0891b2] active:translate-y-0.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span className="truncate">10 MAPAS</span>
                </button>

                <button
                  onClick={() => setScreen('SHOP')}
                  className="px-2.5 sm:px-4 py-2 bg-yellow-400 hover:bg-yellow-300 border border-yellow-200 text-slate-950 font-bold text-[9px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-[0_2px_0_#b45309] active:translate-y-0.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span className="truncate">TIENDA</span>
                </button>

                <button
                  onClick={() => setScreen('HOW_TO_PLAY')}
                  className="px-2.5 sm:px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-yellow-500 text-yellow-300 text-[9px] sm:text-xs flex items-center justify-center gap-1 transition-all active:translate-y-0.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="truncate">AYUDA</span>
                </button>

                <button
                  onClick={() => setScreen('LEADERBOARD')}
                  className="px-2.5 sm:px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-yellow-500 text-yellow-300 text-[9px] sm:text-xs flex items-center justify-center gap-1 transition-all active:translate-y-0.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="truncate">RÉCORDS</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SHOP MODAL (Skins & Accessories/Upgrades) --- */}
        {screen === 'SHOP' && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-between p-3 sm:p-5 z-30 font-pixel text-xs overflow-y-auto">
            <div className="w-full flex justify-between items-center border-b-2 border-yellow-500 pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm">TIENDA RETRO ARCADE</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-yellow-950 border border-yellow-400 px-3 py-1 rounded text-yellow-300">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-mono text-sm">{coins} 🪙</span>
                </div>

                <button
                  onClick={() => setScreen('TITLE')}
                  className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 border border-yellow-200 text-slate-950 font-bold"
                >
                  VOLVER
                </button>
              </div>
            </div>

            {/* Shop Sections: Skins & Upgrades */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              {/* SKINS COLUMN */}
              <div className="bg-slate-900 border-2 border-yellow-500/50 p-3 rounded">
                <span className="text-yellow-400 font-bold block mb-2 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" /> SKINS Y ATUENDOS
                </span>

                <div className="flex flex-col gap-2.5">
                  {SKINS.map((skin) => {
                    const isUnlocked = unlockedSkins.includes(skin.id);
                    const isEquipped = selectedSkin === skin.id;

                    return (
                      <div
                        key={skin.id}
                        className={`p-2.5 border-2 rounded flex items-center justify-between transition-all ${
                          isEquipped
                            ? 'bg-amber-950/70 border-yellow-400'
                            : isUnlocked
                            ? 'bg-slate-800/80 border-slate-600'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-0.5">
                            <div className="w-4 h-2 rounded-t" style={{ backgroundColor: skin.capColor }} />
                            <div className="w-4 h-3" style={{ backgroundColor: skin.jacketColor }} />
                            <div className="w-4 h-3 rounded-b" style={{ backgroundColor: skin.pantsColor }} />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-yellow-300 font-bold text-[10px]">{skin.name}</span>
                            <span className="text-slate-300 text-[8px] max-w-[200px] leading-tight">
                              {skin.description}
                            </span>
                            <span className="text-emerald-400 text-[8px] mt-0.5">✨ {skin.perk}</span>
                          </div>
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="px-2 py-1 bg-yellow-400 text-slate-950 font-bold text-[9px] rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> EQUIPADO
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => buySkin(skin)}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-yellow-300 text-[9px] rounded border border-yellow-500"
                            >
                              EQUIPAR
                            </button>
                          ) : (
                            <button
                              onClick={() => buySkin(skin)}
                              disabled={coins < skin.price}
                              className={`px-3 py-1 font-bold text-[9px] rounded border flex items-center gap-1 ${
                                coins >= skin.price
                                  ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-yellow-200'
                                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                              }`}
                            >
                              COMPRAR {skin.price} 🪙
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* UPGRADES / ACCESSORIES COLUMN */}
              <div className="bg-slate-900 border-2 border-yellow-500/50 p-3 rounded">
                <span className="text-yellow-400 font-bold block mb-2 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-yellow-400" /> MEJORAS DE SUPERVIVENCIA
                </span>

                <div className="flex flex-col gap-2.5">
                  {upgrades.map((upg) => {
                    const isMax = upg.level >= upg.maxLevel;

                    return (
                      <div
                        key={upg.id}
                        className="p-2.5 bg-slate-800/80 border-2 border-slate-600 rounded flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{upg.icon}</span>
                          <div className="flex flex-col">
                            <span className="text-yellow-300 font-bold text-[10px]">{upg.name}</span>
                            <span className="text-slate-300 text-[8px] max-w-[200px] leading-tight">
                              {upg.description}
                            </span>
                            <span className="text-cyan-300 text-[8px] mt-0.5">
                              Nivel {upg.level}/{upg.maxLevel} · {upg.effect}
                            </span>
                          </div>
                        </div>

                        <div>
                          {isMax ? (
                            <span className="px-2 py-1 bg-emerald-600 text-white font-bold text-[9px] rounded">
                              ¡MÁXIMO!
                            </span>
                          ) : (
                            <button
                              onClick={() => buyUpgrade(upg)}
                              disabled={coins < upg.price}
                              className={`px-3 py-1 font-bold text-[9px] rounded border flex items-center gap-1 ${
                                coins >= upg.price
                                  ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-yellow-200'
                                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                              }`}
                            >
                              MEJORAR {upg.price} 🪙
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => startGame(difficulty)}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border-2 border-yellow-200 text-xs shadow-[0_3px_0_#b45309]"
            >
              ¡PROBAR MEJORAS EN PARTIDA!
            </button>
          </div>
        )}

        {/* --- HOW TO PLAY MODAL --- */}
        {screen === 'HOW_TO_PLAY' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-between p-4 sm:p-6 z-30 font-pixel text-xs overflow-y-auto">
            <div className="w-full flex justify-between items-center border-b-2 border-yellow-500 pb-2">
              <span className="text-yellow-400 text-sm">10 MAPAS PIXELADOS Y AVANCE POR LA SALIDA</span>
              <button
                onClick={() => setScreen('TITLE')}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 border border-yellow-200 text-slate-950 font-bold"
              >
                VOLVER
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto w-full max-w-3xl text-[10px] leading-relaxed">
              <div className="bg-slate-900 border-2 border-yellow-500/50 p-3">
                <span className="text-yellow-400 font-bold block mb-2">🎮 CONTROLES Y AVANCE:</span>
                <p className="text-slate-200 mb-1">◀ ▶ / A, D: Moverse izquierda / avanzar derecha</p>
                <p className="text-slate-200 mb-1">▲ / ESPACIO / W: Saltar peligros auditivos</p>
                <p className="text-slate-200 mb-1">▼ / S: Agacharse / Deslizarse bajo ruidos</p>
                <p className="text-slate-200 mb-1">SHIFT / J: Impulso Dash veloz</p>
                <p className="text-emerald-400 font-bold mt-1">🚩 ¡AVANZA A LA DERECHA PARA CRUZAR LA SALIDA!</p>
              </div>

              <div className="bg-slate-900 border-2 border-yellow-500/50 p-3">
                <span className="text-yellow-400 font-bold block mb-2">📈 10 NIVELES DE CONTAMINACIÓN:</span>
                <p className="text-slate-300 mb-1">
                  • <strong className="text-emerald-400">Nv. 1-4 (Campus):</strong> Pabellón, fachada, cuesta y canchas (pájaros, podadoras, autos, silbatos).
                </p>
                <p className="text-slate-300 mb-1">
                  • <strong className="text-yellow-400">Nv. 5-8 (Campus):</strong> Techos, balcón 2° piso, callejón y rampa (timbre escolar, taladros, camiones).
                </p>
                <p className="text-slate-300 mb-1">
                  • <strong className="text-orange-400">Nv. 9 (Fábrica):</strong> Choque de prensas hidráulicas, vapor y sierras.
                </p>
                <p className="text-slate-300">
                  • <strong className="text-red-400">Nv. 10 (Construcción):</strong> ¡Caos total! Turbinas gigantes, martillos y helicópteros.
                </p>
              </div>

              <div className="bg-slate-900 border-2 border-yellow-500/50 p-3">
                <span className="text-yellow-400 font-bold block mb-2">🪙 MONEDAS Y OBJETOS ÚNICOS:</span>
                <p className="text-slate-300 mb-1">
                  Al cambiar de mapa, <strong>ningún objeto se repite</strong>. ¡Cada escenario tiene sus propios ruidos!
                </p>
                <p className="text-slate-300 mb-1">
                  Cada objeto emite su sonido 8-bit realista sintetizado al caer.
                </p>
                <p className="text-slate-300">¡Recoge monedas doradas que caen del cielo para la tienda!</p>
              </div>

              <div className="bg-slate-900 border-2 border-yellow-500/50 p-3">
                <span className="text-yellow-400 font-bold block mb-2">⭐ CELEBRACIÓN «¡YUJU!»:</span>
                <p className="text-slate-300 mb-1">
                  Al completar cada nivel, escucharás el triunfante grito estilo Mario Bros <strong>«¡YUJU!»</strong>.
                </p>
                <p className="text-slate-300 mb-1">Recibirás lluvia de monedas extra y bonificación de puntos.</p>
                <p className="text-slate-300">¡Mantén la racha alta pasando rozando objetos para multiplicar puntos!</p>
              </div>
            </div>

            <button
              onClick={() => startGame(difficulty)}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border-2 border-yellow-200"
            >
              ¡ENTENDIDO, A JUGAR!
            </button>
          </div>
        )}

        {/* --- SOUNDBOARD MODAL --- */}
        {screen === 'SOUNDBOARD' && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-between p-4 sm:p-6 z-30 font-pixel text-xs overflow-y-auto">
            <div className="w-full flex justify-between items-center border-b-2 border-yellow-500 pb-2">
              <span className="text-yellow-400 text-sm">PROBADOR DE RUIDOS (GRADUAL POR NIVEL)</span>
              <button
                onClick={() => setScreen('TITLE')}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 border border-yellow-200 text-slate-950 font-bold"
              >
                VOLVER
              </button>
            </div>

            <p className="text-slate-300 text-[10px] text-center max-w-md my-1">
              Prueba los sonidos ordenados de menor a mayor intensidad de decibelios:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-auto w-full max-w-3xl text-[10px]">
              <button
                onClick={() => sounds.playBird()}
                className="p-2.5 bg-slate-900 border-2 border-emerald-500 hover:bg-slate-800 text-emerald-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🐦</span>
                <span>¡PÍO! (Nv. 1)</span>
                <span className="text-[8px] text-slate-400">Pabellón escolar</span>
              </button>

              <button
                onClick={() => sounds.playLawnmower()}
                className="p-2.5 bg-slate-900 border-2 border-amber-500 hover:bg-slate-800 text-amber-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🚜</span>
                <span>¡BRRRR! (Nv. 2)</span>
                <span className="text-[8px] text-slate-400">Fachada principal</span>
              </button>

              <button
                onClick={() => sounds.playSmallCar()}
                className="p-2.5 bg-slate-900 border-2 border-yellow-400 hover:bg-slate-800 text-yellow-300 flex flex-col items-center gap-1 active:scale-95 transition-all shadow"
              >
                <span className="text-base">🚗</span>
                <span>¡VROOOM! (Nv. 3)</span>
                <span className="text-[8px] text-slate-400">Cuesta asfaltada</span>
              </button>

              <button
                onClick={() => sounds.playWhistle()}
                className="p-2.5 bg-slate-900 border-2 border-cyan-400 hover:bg-slate-800 text-cyan-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">⚽</span>
                <span>¡FIIII! (Nv. 4)</span>
                <span className="text-[8px] text-slate-400">Polideportivo</span>
              </button>

              <button
                onClick={() => sounds.playTruck()}
                className="p-2.5 bg-slate-900 border-2 border-orange-500 hover:bg-slate-800 text-orange-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🚚</span>
                <span>¡RUMBLE! (Nv. 5)</span>
                <span className="text-[8px] text-slate-400">Mirador de techos</span>
              </button>

              <button
                onClick={() => sounds.playSchoolBell()}
                className="p-2.5 bg-slate-900 border-2 border-pink-500 hover:bg-slate-800 text-pink-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🔔</span>
                <span>¡TIMBRE! (Nv. 6)</span>
                <span className="text-[8px] text-slate-400">Pasillo 2° piso</span>
              </button>

              <button
                onClick={() => sounds.playDrill()}
                className="p-2.5 bg-slate-900 border-2 border-purple-500 hover:bg-slate-800 text-purple-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🔩</span>
                <span>¡ZZZZT! (Nv. 7)</span>
                <span className="text-[8px] text-slate-400">Callejón trasero</span>
              </button>

              <button
                onClick={() => sounds.playJackhammer()}
                className="p-2.5 bg-slate-900 border-2 border-red-500 hover:bg-slate-800 text-red-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🔨</span>
                <span>¡RAT-TAT! (Nv. 8)</span>
                <span className="text-[8px] text-slate-400">Plaza y rampa</span>
              </button>

              <button
                onClick={() => sounds.playJackhammer()}
                className="p-2.5 bg-slate-900 border-2 border-amber-600 hover:bg-slate-800 text-amber-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">🏭</span>
                <span>¡CLANG! (Nv. 9)</span>
                <span className="text-[8px] text-slate-400">Fábrica metalúrgica</span>
              </button>

              <button
                onClick={() => sounds.playThunder()}
                className="p-2.5 bg-slate-900 border-2 border-rose-600 hover:bg-slate-800 text-rose-300 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="text-base">💥</span>
                <span>¡CAOS! (Nv. 10)</span>
                <span className="text-[8px] text-slate-400">Megaconstrucción</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center items-center">
              <button
                onClick={() => {
                  if (sounds.isPlayingMusic()) {
                    sounds.stopMusic();
                  } else {
                    sounds.startMusic(1);
                  }
                }}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] border border-cyan-300 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <span>🎵 Pac Baby - Pac-Man CE 2</span>
              </button>
              <button
                onClick={() => sounds.playCoin()}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-[10px]"
              >
                🪙 Moneda
              </button>
              <button
                onClick={() => sounds.playStreakUp()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px]"
              >
                🔥 Racha Up
              </button>
            </div>
          </div>
        )}

        {/* --- LEADERBOARD MODAL --- */}
        {screen === 'LEADERBOARD' && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-between p-4 sm:p-6 z-30 font-pixel text-xs">
            <div className="w-full flex justify-between items-center border-b-2 border-yellow-500 pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm">TABLA DE RÉCORDS</span>
              </div>
              <button
                onClick={() => setScreen('TITLE')}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 border border-yellow-200 text-slate-950 font-bold"
              >
                VOLVER
              </button>
            </div>

            <div className="w-full max-w-xl my-auto">
              <div className="bg-slate-900 border-2 border-yellow-500/50 p-2">
                <div className="grid grid-cols-5 text-[9px] text-yellow-400 border-b border-slate-800 pb-1 mb-2 font-bold">
                  <span># NOMBRE</span>
                  <span className="text-right">PUNTOS</span>
                  <span className="text-right">RACHA</span>
                  <span className="text-right">NIVEL</span>
                  <span className="text-right">DIFICULTAD</span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto">
                  {leaderboard.map((item, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-5 text-[10px] items-center p-1.5 rounded ${
                        idx === 0
                          ? 'bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-400'
                          : 'bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {item.name}
                      </span>
                      <span className="text-right font-mono text-white">{formatScore(item.score)}</span>
                      <span className="text-right font-mono text-yellow-400">{item.streak}x</span>
                      <span className="text-right text-cyan-300">Nv.{item.levelReached || 1}</span>
                      <span className="text-right text-[8px] text-slate-400">{item.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => startGame(difficulty)}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border-2 border-yellow-200"
            >
              ¡JUGAR AHORA!
            </button>
          </div>
        )}

        {/* --- PAUSE MODAL --- */}
        {screen === 'PAUSED' && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 z-30 font-pixel text-xs">
            <h2 className="text-2xl text-yellow-400 mb-4 arcade-title">PAUSA</h2>
            <div className="flex flex-col gap-3 w-48">
              <button
                onClick={() => {
                  stateRef.current.screen = 'PLAYING';
                  setScreen('PLAYING');
                  sounds.startMusic(1 + (stateRef.current.speedLevel - 1) * 0.04);
                }}
                className="p-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border-2 border-yellow-200"
              >
                CONTINUAR
              </button>
              <button
                onClick={() => startGame(difficulty)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-yellow-300 border-2 border-yellow-500"
              >
                REINICIAR
              </button>
              <button
                onClick={() => {
                  stateRef.current.screen = 'TITLE';
                  setScreen('TITLE');
                }}
                className="p-2.5 bg-red-700 hover:bg-red-600 text-white border-2 border-black"
              >
                SALIR AL MENÚ
              </button>
            </div>
          </div>
        )}

        {/* --- GAME OVER SCREEN --- */}
        {screen === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-red-950/85 flex flex-col items-center justify-center p-4 sm:p-6 z-30 font-pixel text-xs animate-in fade-in duration-300">
            <h2 className="text-3xl sm:text-4xl text-yellow-400 mb-2 font-black arcade-title tracking-wider animate-pulse">
              ¡EL RUIDO TE VENCIÓ!
            </h2>
            <p className="text-yellow-200 text-[10px] mb-3">Los decibelios superaron el límite permitido</p>

            {/* Scorecard */}
            <div className="w-full max-w-sm bg-slate-900 border-4 border-yellow-500 p-4 mb-3 flex flex-col gap-2 text-[11px]">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-yellow-400">PUNTUACIÓN FINAL:</span>
                <span className="font-mono text-white text-sm">{formatScore(score)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-cyan-400">NIVEL ALCANZADO:</span>
                <span className="font-mono text-white">
                  NIVEL {currentLevel}/10 ({MAPS[currentMap]?.name})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-yellow-400">MEJOR RACHA:</span>
                <span className="font-mono text-white">{maxStreak}x</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-yellow-300">MONEDAS CONSEGUIDAS:</span>
                <span className="font-mono text-white">+{stats.coins} 🪙</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">OBJETOS ESQUIVADOS:</span>
                <span className="font-mono text-white">{stats.dodged}</span>
              </div>

              {/* Record Name Input */}
              <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-2">
                <span className="text-[10px] text-yellow-400">TU APODO:</span>
                <input
                  type="text"
                  maxLength={10}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-slate-950 border border-yellow-400 px-2 py-1 text-yellow-300 text-xs font-pixel uppercase w-28 text-center focus:border-yellow-200 focus:outline-none"
                />
                <button
                  onClick={saveScoreToLeaderboard}
                  className="px-2 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border border-yellow-200 text-[9px]"
                >
                  GUARDAR
                </button>
              </div>
            </div>

            {/* Replay action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => startGame(difficulty)}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border-2 border-yellow-200 flex items-center gap-2 text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                ¡REINTENTAR!
              </button>

              <button
                onClick={() => setShowMapSelect(true)}
                className="px-3.5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold border-2 border-cyan-300 text-xs flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                MAPAS
              </button>

              <button
                onClick={() => setScreen('SHOP')}
                className="px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold border-2 border-yellow-200 text-xs flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                TIENDA ({coins} 🪙)
              </button>

              <button
                onClick={() => {
                  stateRef.current.screen = 'TITLE';
                  setScreen('TITLE');
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-yellow-300 border-2 border-yellow-500 text-xs"
              >
                MENÚ
              </button>
            </div>
          </div>
        )}

        {/* --- VICTORY SCREEN (BEAT ALL 10 LEVELS) --- */}
        {screen === 'VICTORY' && (
          <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-4 sm:p-6 z-30 font-pixel text-xs animate-in zoom-in-95 duration-300">
            <div className="text-4xl sm:text-5xl mb-1 animate-bounce">🏆</div>
            <h2 className="text-2xl sm:text-4xl text-yellow-300 mb-1 font-black arcade-title tracking-wider text-center drop-shadow-[0_4px_0_#ca8a04]">
              ¡CAMPEÓN DE LA CIUDAD!
            </h2>
            <p className="text-emerald-200 text-[10px] sm:text-xs mb-3 text-center max-w-md">
              ¡Has cruzado con éxito los 10 mapas y vencido la contaminación auditiva!
            </p>

            <div className="w-full max-w-sm bg-slate-900 border-4 border-yellow-400 p-4 mb-3 flex flex-col gap-2 text-[11px] shadow-2xl">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-yellow-400 font-bold">PUNTUACIÓN FINAL:</span>
                <span className="font-mono text-white text-sm font-bold">{formatScore(score)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-emerald-400">MAPAS COMPLETADOS:</span>
                <span className="font-mono text-cyan-300">¡10 / 10 ZONAS!</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-yellow-400">MEJOR RACHA:</span>
                <span className="font-mono text-white">{maxStreak}x</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-yellow-300">PREMIO DE VICTORIA:</span>
                <span className="font-mono text-yellow-400 font-bold">+50 🪙 MONEDAS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => startGame(difficulty)}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold border-2 border-yellow-200 flex items-center gap-2 text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                ¡JUGAR DE NUEVO!
              </button>

              <button
                onClick={() => setShowMapSelect(true)}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold border-2 border-cyan-300 text-xs flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                10 MAPAS
              </button>

              <button
                onClick={() => {
                  stateRef.current.screen = 'TITLE';
                  setScreen('TITLE');
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-yellow-300 border-2 border-yellow-500 text-xs"
              >
                MENÚ
              </button>
            </div>
          </div>
        )}

        {/* --- MAP SELECTOR MODAL (10 LEVELS WITH 8 USER PIXEL ART CAMPUS IMAGES) --- */}
        {showMapSelect && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-between p-3 sm:p-5 z-40 font-pixel text-xs overflow-hidden">
            <div className="w-full flex justify-between items-center border-b-2 border-yellow-500 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm">SELECTOR DE MAPAS (10 NIVELES PIXELADOS)</span>
              </div>
              <button
                onClick={() => setShowMapSelect(false)}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 border border-yellow-200 text-slate-950 font-bold text-xs"
              >
                CERRAR
              </button>
            </div>

            {/* Scrollable Grid of 10 Maps */}
            <div className="w-full my-auto max-h-[360px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
              {MAP_ORDER.map((mapId) => {
                const mapInfo = MAPS[mapId];
                if (!mapInfo) return null;
                const isSelected = currentMap === mapId;
                return (
                  <div
                    key={mapId}
                    className={`relative flex gap-3 p-2 border-2 transition-all ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-500/15 ring-2 ring-yellow-400/50'
                        : 'border-slate-700 bg-slate-900/90 hover:border-yellow-500/60'
                    }`}
                  >
                    {/* Thumbnail preview with 16:9 pixel crisp display */}
                    <div className="w-28 h-18 sm:w-32 sm:h-20 bg-black flex-shrink-0 border border-yellow-500/40 overflow-hidden relative">
                      <img
                        src={mapInfo.image}
                        alt={mapInfo.name}
                        className="w-full h-full object-cover pixelated"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <span className="absolute top-1 left-1 bg-slate-950/85 text-yellow-300 font-bold px-1.5 py-0.5 text-[8px] border border-yellow-400">
                        NV.{mapInfo.level}
                      </span>
                    </div>

                    {/* Map Info & Play button */}
                    <div className="flex flex-col justify-between flex-grow min-w-0">
                      <div>
                        <h4 className="text-yellow-300 font-bold text-[10px] sm:text-xs truncate">{mapInfo.name}</h4>
                        <p className="text-slate-400 text-[8px] sm:text-[9px] line-clamp-2 mt-0.5">
                          {mapInfo.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                        <span className="text-[8px] text-amber-300 font-mono">
                          Ruido: {mapInfo.noiseIntensity}
                        </span>
                        <button
                          onClick={() => startGame(difficulty, mapInfo.id, mapInfo.level)}
                          className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-[9px] border border-yellow-200 shadow active:translate-y-0.5 transition-all"
                        >
                          ¡JUGAR AQUÍ! ➔
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full text-center text-[9px] text-slate-400 border-t border-slate-800 pt-1.5">
              💡 Tip: Cada mapa cuenta con su propia salida a la derecha. ¡Avanza hacia la meta para cambiar de escenario!
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE / TOUCH ARCADE CONTROLS BAR --- */}
      <div className="w-full max-w-5xl mt-1.5 sm:mt-2.5 p-2 sm:p-3 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-yellow-500/60 rounded-xl flex items-center justify-between font-pixel text-xs select-none touch-none shadow-xl">
        {/* D-Pad (Left / Right Movement) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onPointerDown={() => { stateRef.current.keys.left = true; }}
            onPointerUp={() => { stateRef.current.keys.left = false; }}
            onPointerLeave={() => { stateRef.current.keys.left = false; }}
            onPointerCancel={() => { stateRef.current.keys.left = false; }}
            onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys.left = true; }}
            onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys.left = false; }}
            onTouchCancel={(e) => { e.preventDefault(); stateRef.current.keys.left = false; }}
            className="w-13 h-13 sm:w-16 sm:h-14 bg-slate-800/95 active:bg-yellow-400 active:text-slate-950 border-2 border-yellow-500/80 rounded-xl flex flex-col items-center justify-center text-yellow-300 shadow-[0_3px_0_#334155] active:translate-y-0.5 active:shadow-none transition-all touch-none select-none touch-control-btn cursor-pointer"
            aria-label="Izquierda"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[7px] sm:text-[8px] font-bold mt-0.5">IZQ</span>
          </button>

          <button
            onPointerDown={() => { stateRef.current.keys.right = true; }}
            onPointerUp={() => { stateRef.current.keys.right = false; }}
            onPointerLeave={() => { stateRef.current.keys.right = false; }}
            onPointerCancel={() => { stateRef.current.keys.right = false; }}
            onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys.right = true; }}
            onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys.right = false; }}
            onTouchCancel={(e) => { e.preventDefault(); stateRef.current.keys.right = false; }}
            className="w-13 h-13 sm:w-16 sm:h-14 bg-slate-800/95 active:bg-yellow-400 active:text-slate-950 border-2 border-yellow-500/80 rounded-xl flex flex-col items-center justify-center text-yellow-300 shadow-[0_3px_0_#334155] active:translate-y-0.5 active:shadow-none transition-all touch-none select-none touch-control-btn cursor-pointer"
            aria-label="Derecha"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[7px] sm:text-[8px] font-bold mt-0.5">DER</span>
          </button>
        </div>

        {/* Center Mobile Pause & Status */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => {
              if (stateRef.current.screen === 'PLAYING') {
                stateRef.current.screen = 'PAUSED';
                setScreen('PAUSED');
                sounds.stopMusic();
              } else if (stateRef.current.screen === 'PAUSED') {
                stateRef.current.screen = 'PLAYING';
                setScreen('PLAYING');
                sounds.startMusic(1 + (stateRef.current.speedLevel - 1) * 0.04);
              }
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-yellow-400 text-yellow-300 active:text-slate-950 border border-yellow-500/70 rounded-lg text-[8px] sm:text-[9px] font-bold shadow active:translate-y-0.5 transition-all"
            title="Pausar o reanudar partida"
          >
            {screen === 'PAUSED' ? '▶ REANUDAR' : '⏸ PAUSA'}
          </button>
          <span className="text-[7px] text-yellow-500/70 mt-1 hidden xs:inline">MANDO TÁCTIL</span>
        </div>

        {/* Action Buttons Cluster (Slide, Dash, Jump) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Duck / Slide button */}
          <button
            onPointerDown={() => { stateRef.current.keys.down = true; }}
            onPointerUp={() => { stateRef.current.keys.down = false; }}
            onPointerLeave={() => { stateRef.current.keys.down = false; }}
            onPointerCancel={() => { stateRef.current.keys.down = false; }}
            onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys.down = true; }}
            onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys.down = false; }}
            onTouchCancel={(e) => { e.preventDefault(); stateRef.current.keys.down = false; }}
            className="w-11 h-13 sm:w-13 sm:h-14 bg-sky-950/90 active:bg-cyan-400 active:text-slate-950 border-2 border-cyan-500/80 rounded-xl flex flex-col items-center justify-center text-[7px] sm:text-[8px] text-cyan-300 shadow-[0_3px_0_#0369a1] active:translate-y-0.5 active:shadow-none transition-all touch-none select-none touch-control-btn cursor-pointer"
            aria-label="Agacharse o deslizarse"
          >
            <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-bold">ABAJO</span>
          </button>

          {/* Dash / Turbo button */}
          <button
            onPointerDown={() => { stateRef.current.keys.dash = true; }}
            onPointerUp={() => { stateRef.current.keys.dash = false; }}
            onPointerLeave={() => { stateRef.current.keys.dash = false; }}
            onPointerCancel={() => { stateRef.current.keys.dash = false; }}
            onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys.dash = true; }}
            onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys.dash = false; }}
            onTouchCancel={(e) => { e.preventDefault(); stateRef.current.keys.dash = false; }}
            className="w-11 h-13 sm:w-13 sm:h-14 bg-amber-950/90 active:bg-amber-400 active:text-slate-950 border-2 border-amber-500/80 rounded-xl flex flex-col items-center justify-center text-[7px] sm:text-[8px] text-amber-300 shadow-[0_3px_0_#b45309] active:translate-y-0.5 active:shadow-none transition-all touch-none select-none touch-control-btn cursor-pointer"
            aria-label="Acelerón dash"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span className="font-bold">DASH</span>
          </button>

          {/* Jump button */}
          <button
            onPointerDown={() => { stateRef.current.keys.up = true; }}
            onPointerUp={() => { stateRef.current.keys.up = false; }}
            onPointerLeave={() => { stateRef.current.keys.up = false; }}
            onPointerCancel={() => { stateRef.current.keys.up = false; }}
            onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys.up = true; }}
            onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys.up = false; }}
            onTouchCancel={(e) => { e.preventDefault(); stateRef.current.keys.up = false; }}
            className="w-14 h-13 sm:w-18 sm:h-14 bg-gradient-to-b from-yellow-400 to-amber-500 active:from-yellow-300 active:to-yellow-400 text-slate-950 border-2 border-yellow-200 rounded-xl flex flex-col items-center justify-center text-[8px] sm:text-[9px] font-black shadow-[0_4px_0_#b45309] active:translate-y-0.5 active:shadow-none transition-all touch-none select-none touch-control-btn cursor-pointer"
            aria-label="Saltar"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            <span>SALTAR</span>
          </button>
        </div>
      </div>

      <footer className="mt-1.5 text-yellow-500/70 text-[8px] sm:text-[10px] font-pixel text-center px-2">
        📱 Toca la pantalla o usa el mando virtual · [Espacio / Flechas] en teclado
      </footer>
    </div>
  );
};
