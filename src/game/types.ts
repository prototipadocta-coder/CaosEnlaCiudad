export type HazardType =
  // 1. Fábrica Metalúrgica e Industrial
  | 'PRESS'
  | 'STEAM_PIPE'
  | 'DRILL'
  // 2. Zona de Construcción Urbana
  | 'JACKHAMMER'
  | 'THUNDER'
  | 'RATTLE'
  // 3. Escuela y Patio de Recreo
  | 'SCHOOL_BELL'
  | 'WHISTLE'
  | 'MEGAPHONE'
  // 4. Taller Mecánico & Herrería
  | 'CIRCULAR_SAW'
  | 'LAWNMOWER'
  | 'CAT_SCREAM'
  // 5. Autopista y Tráfico Pesado
  | 'HORN'
  | 'CAR_SMALL'
  | 'MOTORCYCLE'
  // 6. Estación de Metro Subterráneo
  | 'TRAIN_WHEEL'
  | 'ALARM'
  | 'RADIO_BOOMBOX'
  // 7. Pista de Aeropuerto & Turbinas Jet
  | 'JET_TURBINE'
  | 'SIREN'
  | 'AIR_HORN'
  // 8. Concierto de Rock Callejero
  | 'ROCK_GUITAR'
  | 'BALL'
  | 'LEAF_BLOWER'
  // 9. Puerto de Carga y Astillero Naval
  | 'FOG_HORN'
  | 'TRUCK_SMALL'
  | 'BIRD'
  // 10. Megaurbe & Times Square Caótico
  | 'HELICOPTER'
  | 'CAT';

export type BonusType = 'ENERGY_CAN' | 'HEADPHONES' | 'COFFEE' | 'HEART';

export type MapId =
  | 'MAP_SCHOOL_PAVILION'
  | 'MAP_BRICK_FACADE'
  | 'MAP_SLOPED_ROAD'
  | 'MAP_SPORTS_COURT'
  | 'MAP_ROOFTOPS_VIEW'
  | 'MAP_BALCONY_CORRIDOR'
  | 'MAP_BRICK_ALLEY'
  | 'MAP_COURTYARD_RAMP'
  | 'MAP_FACTORY_METAL'
  | 'MAP_CONSTRUCTION_MEGACITY'
  | 'MAP_PARK_LAWN'
  | 'MAP_BRICK_HOUSE'
  | 'MAP_ROOFTOPS'
  | 'MAP_COURTYARD';

export interface GameMap {
  id: MapId;
  level: number;
  name: string;
  subtitle: string;
  image: string;
  hazards: HazardType[];
  groundColor: string;
  curbColor: string;
  ambientNoise: string;
  noiseIntensity: string;
}

export interface HazardItem {
  id: string;
  x: number;
  y: number;
  vy: number;
  vx: number;
  type: HazardType;
  rotation: number;
  rotSpeed: number;
  comicText: string;
  comicBgColor: string;
  comicTextColor: string;
  soundPlayed: boolean;
  width: number;
  height: number;
  wobble: number;
  nearMissChecked?: boolean;
}

export interface BonusItem {
  id: string;
  x: number;
  y: number;
  vy: number;
  type: BonusType;
  width: number;
  height: number;
  tag: string;
}

export interface CoinItem {
  id: string;
  x: number;
  y: number;
  vy: number;
  vx: number;
  value: number;
  frame: number;
  collected?: boolean;
}

export interface ImpactEffect {
  id: string;
  x: number;
  y: number;
  age: number; // 0 to 1
  scale: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  scale: number;
}

export interface WarningIndicator {
  id: string;
  x: number;
  type: HazardType;
  life: number;
}

export type GameScreen =
  | 'TITLE'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'HOW_TO_PLAY'
  | 'SOUNDBOARD'
  | 'LEADERBOARD'
  | 'SHOP'
  | 'VICTORY';

export type GameDifficulty = 'NORMAL' | 'CAOTICO' | 'INFALIBLE';

export interface ScoreRecord {
  score: number;
  streak: number;
  date: string;
  name: string;
  difficulty: string;
  levelReached: number;
}

export interface SkinItem {
  id: string;
  name: string;
  description: string;
  price: number;
  capColor: string;
  jacketColor: string;
  jacketHighlight: string;
  pantsColor: string;
  perk: string;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  level: number;
  maxLevel: number;
  icon: string;
  effect: string;
}
