/**
 * Pixel Art Sprite Rendering Engine for Caos en la Ciudad
 * Draws crisp, stylized 8/16-bit arcade sprites directly to HTML5 Canvas
 */

export interface SpritePoint {
  x: number;
  y: number;
}

// Draw a single "pixel" block (scaled)
export function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
}

// Draw the Player Character with custom Skin colors support
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number, // 0..3 for run cycle, -1 for jump, -2 for slide, -3 for hurt
  facingRight: boolean,
  hasShield: boolean,
  hasSpeedBoost: boolean,
  invulnerable: boolean,
  skinColors?: {
    capColor: string;
    jacketColor: string;
    jacketHighlight: string;
    pantsColor: string;
  }
) {
  const capColor = skinColors?.capColor || '#1e293b';
  const jacketColor = skinColors?.jacketColor || '#16a34a';
  const jacketHighlight = skinColors?.jacketHighlight || '#22c55e';
  const pantsColor = skinColors?.pantsColor || '#2563eb';

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  
  // Blink if invulnerable
  if (invulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.globalAlpha = 0.35;
  }

  // Flip horizontally if facing left
  if (!facingRight) {
    ctx.scale(-1, 1);
  }

  // Energy aura if speed boosted
  if (hasSpeedBoost) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -20, 24 + Math.sin(Date.now() / 60) * 4, 0, Math.PI * 2);
    ctx.stroke();

    // Electric sparks
    for (let i = 0; i < 3; i++) {
      const sparkX = (Math.random() - 0.5) * 40;
      const sparkY = -35 + Math.random() * 40;
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(sparkX, sparkY, 3, 3);
    }
  }

  // Cyan protective shield aura
  if (hasShield) {
    ctx.save();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.arc(0, -22, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fill();
    ctx.restore();
  }

  // --- DRAWING BOY SPRITE (32x48 virtual grid) ---
  
  // SLIDE / DUCK FRAME
  if (frame === -2) {
    // Crouched low
    // Head & Cap
    ctx.fillStyle = '#0f172a'; // Cap brim outline
    ctx.fillRect(-12, -18, 20, 4);
    ctx.fillStyle = capColor; // Cap body
    ctx.fillRect(-8, -24, 16, 8);
    // Face & Skin
    ctx.fillStyle = '#fed7aa'; // Skin tone
    ctx.fillRect(-8, -16, 14, 8);
    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -14, 4, 4);
    // Jacket crouched
    ctx.fillStyle = jacketColor;
    ctx.fillRect(-16, -10, 26, 10);
    ctx.fillStyle = jacketHighlight;
    ctx.fillRect(-12, -8, 18, 4);
    // Jeans sliding
    ctx.fillStyle = pantsColor;
    ctx.fillRect(-22, -4, 24, 6);
    // Sneakers
    ctx.fillStyle = '#f87171'; // Red sneaker
    ctx.fillRect(-26, -4, 6, 6);
    ctx.fillStyle = '#ffffff'; // White sole
    ctx.fillRect(-26, 0, 24, 3);

    // Slide dust
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-30 + Math.random() * 5, 0, 4, 3);
    ctx.fillRect(-36 + Math.random() * 5, -2, 5, 4);

    ctx.restore();
    return;
  }

  // JUMP FRAME
  if (frame === -1) {
    const bob = -4;
    // Cap
    ctx.fillStyle = capColor;
    ctx.fillRect(-10, -42 + bob, 20, 10);
    ctx.fillStyle = '#0f172a'; // Visor
    ctx.fillRect(0, -36 + bob, 14, 4);
    // Hair
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-12, -34 + bob, 6, 8);
    // Face
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -34 + bob, 16, 12);
    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, -30 + bob, 4, 4);
    // Hoodie
    ctx.fillStyle = jacketColor;
    ctx.fillRect(-12, -22 + bob, 22, 16);
    ctx.fillStyle = jacketHighlight;
    ctx.fillRect(-8, -20 + bob, 14, 12);
    // Arms angled up
    ctx.fillStyle = jacketColor;
    ctx.fillRect(-16, -20 + bob, 6, 10);
    ctx.fillRect(10, -24 + bob, 6, 10);
    ctx.fillStyle = '#fed7aa'; // hands
    ctx.fillRect(12, -26 + bob, 4, 4);
    // Legs bent in air
    ctx.fillStyle = pantsColor;
    ctx.fillRect(-10, -6 + bob, 8, 8);
    ctx.fillRect(2, -4 + bob, 8, 8);
    // Red sneakers
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-12, 0 + bob, 10, 5);
    ctx.fillRect(2, 2 + bob, 10, 5);
    ctx.fillStyle = '#ffffff'; // White soles
    ctx.fillRect(-12, 3 + bob, 10, 2);
    ctx.fillRect(2, 5 + bob, 10, 2);

    ctx.restore();
    return;
  }

  // RUNNING / IDLE CYCLE (frames 0, 1, 2, 3)
  const legOffsets = [
    { leftY: 0, leftX: -6, rightY: 0, rightX: 4, bob: 0 },
    { leftY: -4, leftX: -10, rightY: 2, rightX: 8, bob: -2 },
    { leftY: 0, leftX: -4, rightY: 0, rightX: 2, bob: 0 },
    { leftY: 2, leftX: 8, rightY: -4, rightX: -10, bob: -2 },
  ];
  const anim = legOffsets[Math.abs(frame) % 4];

  // Head Cap
  ctx.fillStyle = capColor; // Cap crown
  ctx.fillRect(-10, -40 + anim.bob, 18, 9);
  ctx.fillStyle = '#0f172a'; // Cap brim / visor sticking out front
  ctx.fillRect(2, -34 + anim.bob, 14, 4);

  // Hair
  ctx.fillStyle = '#78350f'; // Brown hair
  ctx.fillRect(-12, -32 + anim.bob, 6, 8);
  ctx.fillRect(-8, -32 + anim.bob, 4, 4);

  // Face
  ctx.fillStyle = '#fed7aa'; // Peach skin
  ctx.fillRect(-6, -32 + anim.bob, 16, 12);

  // Eyes & Eyebrow
  if (frame === -3) {
    // Dizzy / Hurt X eye
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(2, -28 + anim.bob);
    ctx.lineTo(8, -22 + anim.bob);
    ctx.moveTo(8, -28 + anim.bob);
    ctx.lineTo(2, -22 + anim.bob);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, -28 + anim.bob, 4, 4);
    // Eyebrow
    ctx.fillStyle = '#78350f';
    ctx.fillRect(3, -31 + anim.bob, 6, 2);
  }

  // Jacket / hoodie
  ctx.fillStyle = jacketColor;
  ctx.fillRect(-12, -20 + anim.bob, 22, 16);
  ctx.fillStyle = jacketHighlight;
  ctx.fillRect(-6, -18 + anim.bob, 10, 14);
  ctx.fillStyle = '#ffffff'; // Inner white t-shirt collar
  ctx.fillRect(-2, -20 + anim.bob, 4, 4);

  // Arms
  const armSwing = (Math.abs(frame) % 2 === 1) ? 4 : -2;
  ctx.fillStyle = jacketColor;
  ctx.fillRect(-16, -18 + anim.bob - armSwing, 5, 12);
  ctx.fillRect(8, -18 + anim.bob + armSwing, 5, 12);
  ctx.fillStyle = '#fed7aa'; // Hands
  ctx.fillRect(-16, -6 + anim.bob - armSwing, 4, 4);
  ctx.fillRect(9, -6 + anim.bob + armSwing, 4, 4);

  // Left Leg
  ctx.fillStyle = pantsColor;
  ctx.fillRect(anim.leftX, -5 + anim.leftY, 6, 9);
  // Left Sneaker
  ctx.fillStyle = '#ef4444'; // Red sneaker
  ctx.fillRect(anim.leftX - 2, 4 + anim.leftY, 10, 5);
  ctx.fillStyle = '#ffffff'; // White sole
  ctx.fillRect(anim.leftX - 2, 7 + anim.leftY, 10, 2);

  // Right Leg
  ctx.fillStyle = pantsColor;
  ctx.fillRect(anim.rightX, -5 + anim.rightY, 6, 9);
  // Right Sneaker
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(anim.rightX - 2, 4 + anim.rightY, 10, 5);
  ctx.fillStyle = '#ffffff'; // White sole
  ctx.fillRect(anim.rightX - 2, 7 + anim.rightY, 10, 2);

  // Footstep dust when running on ground
  if (anim.bob === -2) {
    ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
    ctx.fillRect(-18, 6, 4, 3);
  }

  ctx.restore();
}

// Draw the Red Car Horn ("¡BEEP!")
export function drawHorn(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  // Red rubber bulb / back pump
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-14, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#991b1b';
  ctx.stroke();

  // Highlight on bulb
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(-17, -4, 4, 4);

  // Metal tube connection
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-6, -3, 8, 6);
  ctx.fillStyle = '#475569';
  ctx.strokeRect(-6, -3, 8, 6);

  // Flared horn trumpet
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(2, -4);
  ctx.lineTo(16, -14);
  ctx.lineTo(16, 14);
  ctx.lineTo(2, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bell rim
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(16, 0, 3, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw the Electric Power Drill ("¡TRRR!")
export function drawDrill(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  // Yellow drill body
  ctx.fillStyle = '#facc15'; // Vibrant yellow
  ctx.fillRect(-12, -14, 22, 16);
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(-12, 0, 22, 4);

  // Black vents and grip
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-8, -10, 3, 8);
  ctx.fillRect(-3, -10, 3, 8);
  ctx.fillRect(2, -10, 3, 8);

  // Pistol grip handle
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-10, 4, 10, 14);
  ctx.fillStyle = '#ef4444'; // Red trigger button
  ctx.fillRect(0, 6, 4, 5);

  // Silver chuck
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(10, -10, 7, 10);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, -10, 7, 10);

  // Spiral drill bit pointing down-right
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(17, -7);
  ctx.lineTo(29, -5);
  ctx.lineTo(17, -3);
  ctx.fill();
  ctx.stroke();

  // Electric vibration sparks at tip
  if (Math.random() > 0.4) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(29, -5);
    ctx.lineTo(34 + Math.random() * 4, -8 + Math.random() * 6);
    ctx.stroke();
  }

  ctx.restore();
}

// Draw the Alarm Clock ("¡RING!")
export function drawAlarm(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble) * 0.15);

  // Twin bells on top
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(-11, -12, 6, 0, Math.PI * 2);
  ctx.arc(11, -12, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hammer between bells
  ctx.fillStyle = '#334155';
  ctx.fillRect(-2, -17, 4, 6);

  // Clock legs
  ctx.fillStyle = '#475569';
  ctx.fillRect(-12, 10, 4, 6);
  ctx.fillRect(8, 10, 4, 6);

  // Round orange clock body
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  ctx.stroke();

  // White face
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  // Clock hands (pointing to 7:00 / wake up time!)
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -6);
  ctx.moveTo(0, 0);
  ctx.lineTo(-4, 3);
  ctx.stroke();

  // Ring sound vibration waves
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-16, -14, 4, Math.PI * 0.6, Math.PI * 1.4);
  ctx.arc(16, -14, 4, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  ctx.restore();
}

// Draw the Megaphone / Loudspeaker ("¡ALTA!")
export function drawMegaphone(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  // Handle
  ctx.fillStyle = '#475569';
  ctx.fillRect(-6, 4, 6, 12);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, 6, 3, 4); // Trigger

  // Cone (Orange & White bands)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-10, -6);
  ctx.lineTo(14, -14);
  ctx.lineTo(14, 14);
  ctx.lineTo(-10, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  ctx.stroke();

  // White center stripe
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-2, -9);
  ctx.lineTo(5, -11);
  ctx.lineTo(5, 11);
  ctx.lineTo(-2, 9);
  ctx.closePath();
  ctx.fill();

  // Back cylinder
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-15, -6, 5, 12);

  // Front sound grill
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(14, 0, 3, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw the Screaming Alley Cat ("¡MIAU!")
export function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  // Orange fur with stripes
  ctx.fillStyle = '#f97316';

  // Arched body
  ctx.fillRect(-12, -8, 24, 14);
  // Darker orange stripes
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-6, -8, 3, 14);
  ctx.fillRect(2, -8, 3, 14);

  // Puffed curved tail
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-18, -14, 6, 8);
  ctx.fillRect(-16, -20, 6, 8);

  // 4 Legs sticking out in panic
  ctx.fillRect(-14, 6, 4, 8);
  ctx.fillRect(-8, 6, 4, 8);
  ctx.fillRect(4, 6, 4, 8);
  ctx.fillRect(10, 6, 4, 8);

  // Cat Head with pointed ears
  ctx.fillStyle = '#f97316';
  ctx.fillRect(10, -14, 14, 14);
  // Ears
  ctx.beginPath();
  ctx.moveTo(12, -14);
  ctx.lineTo(15, -22);
  ctx.lineTo(18, -14);
  ctx.moveTo(18, -14);
  ctx.lineTo(21, -22);
  ctx.lineTo(24, -14);
  ctx.fill();

  // Screaming wide open mouth
  ctx.fillStyle = '#881337';
  ctx.fillRect(16, -6, 8, 6);
  ctx.fillStyle = '#f43f5e'; // Tongue
  ctx.fillRect(18, -4, 4, 3);
  // Little sharp fangs
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(17, -6, 2, 2);
  ctx.fillRect(21, -6, 2, 2);

  // Scared wide eyes
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(13, -12, 4, 4);
  ctx.fillRect(19, -12, 4, 4);
  ctx.fillStyle = '#0f172a'; // Pupils
  ctx.fillRect(15, -11, 2, 2);
  ctx.fillRect(21, -11, 2, 2);

  // Whiskers
  ctx.strokeStyle = '#fed7aa';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(22, -8);
  ctx.lineTo(30, -10);
  ctx.moveTo(22, -6);
  ctx.lineTo(30, -5);
  ctx.stroke();

  ctx.restore();
}

// Draw the Jackhammer ("¡DOK-DOK!")
export function drawJackhammer(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 4) * 0.08);

  // T-Bar Handle
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-14, -18, 28, 5);

  // Piston body (teal/black)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-6, -13, 12, 18);
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(-2, -13, 8, 18);

  // Heavy steel chisel tip
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(-4, 5);
  ctx.lineTo(4, 5);
  ctx.lineTo(1, 22);
  ctx.lineTo(-1, 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// Draw the Glowing Energy Drink Can ("¡ENERGÍA!")
export function drawEnergyCan(ctx: CanvasRenderingContext2D, x: number, y: number, time: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const pulse = Math.sin(time * 6) * 3;

  // Golden glowing outer halo
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(-16 - pulse/2, -22 - pulse/2, 32 + pulse, 44 + pulse);
  ctx.setLineDash([]);

  // Sparks around can
  ctx.fillStyle = '#fde047';
  for (let i = 0; i < 4; i++) {
    const sparkAngle = time * 4 + (i * Math.PI) / 2;
    const sx = Math.cos(sparkAngle) * 20;
    const sy = Math.sin(sparkAngle) * 22;
    ctx.fillRect(sx, sy, 3, 3);
  }

  // Can Body (Electric Blue metallic cylinder)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-10, -18, 20, 36);

  // Silver rim top and bottom
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-10, -20, 20, 3);
  ctx.fillRect(-9, 17, 18, 3);
  // Pull tab
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-3, -22, 6, 2);

  // Shading highlight
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-7, -17, 5, 34);

  // Golden Lightning Bolt insignia
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(3, -12);
  ctx.lineTo(-4, -1);
  ctx.lineTo(1, -1);
  ctx.lineTo(-3, 12);
  ctx.lineTo(5, 1);
  ctx.lineTo(0, 1);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// Draw Noise-Cancelling Headphones ("¡SILENCIO!")
export function drawHeadphones(ctx: CanvasRenderingContext2D, x: number, y: number, time: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const floatY = Math.sin(time * 5) * 3;
  ctx.translate(0, floatY);

  // Headband
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -6, 16, Math.PI, 0);
  ctx.stroke();

  // Earcups
  ctx.fillStyle = '#0891b2';
  ctx.fillRect(-18, -4, 8, 14);
  ctx.fillRect(10, -4, 8, 14);

  // Soft cushions
  ctx.fillStyle = '#164e63';
  ctx.fillRect(-14, -2, 4, 10);
  ctx.fillRect(10, -2, 4, 10);

  // Cyan soundwave ring
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 2, 22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Draw Golden Coffee Cup ("¡CAFÉ VELOZ!")
export function drawCoffee(ctx: CanvasRenderingContext2D, x: number, y: number, time: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Cup body
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-9, -8, 18, 16);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-7, -6, 14, 12);

  // Handle
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, -4, 5, 8);

  // Steam waves
  const steamOffset = (time * 4) % 6;
  ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
  ctx.fillRect(-4, -14 - steamOffset, 2, 4);
  ctx.fillRect(2, -16 - steamOffset, 2, 4);

  ctx.restore();
}

// Draw Heart (+1 Life)
export function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.scale(scale, scale);

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(-8, -4);
  ctx.arc(-4, -8, 4, Math.PI, 0);
  ctx.arc(4, -8, 4, Math.PI, 0);
  ctx.lineTo(8, -4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5, -9, 2, 2);

  ctx.restore();
}

// Draw Comic Sound Bubble ("¡BEEP!", "¡TRRR!", "¡RING!", "¡MIAU!", "¡ALTA!")
export function drawComicTag(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  bgColor: string = '#ef4444',
  textColor: string = '#ffffff'
) {
  ctx.save();
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textWidth = ctx.measureText(text).width;
  const padX = 6;
  const padY = 4;
  const boxW = textWidth + padX * 2;
  const boxH = 18;
  const bx = Math.floor(x - boxW / 2);
  const by = Math.floor(y - boxH / 2);

  // Black drop shadow
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(bx + 2, by + 2, boxW, boxH);

  // Main badge box
  ctx.fillStyle = bgColor;
  ctx.fillRect(bx, by, boxW, boxH);

  // 1px black border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, by, boxW, boxH);

  // Text with outline
  ctx.fillStyle = textColor;
  ctx.fillText(text, Math.floor(x), Math.floor(y));

  ctx.restore();
}

// Draw Asphalt Ground Impact Sparks and Crack
export function drawImpact(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  age: number, // 0..1
  scale: number = 1
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Sparks flying horizontally
  const numSparks = 8;
  for (let i = 0; i < numSparks; i++) {
    const angle = (i / numSparks) * Math.PI; // Upwards fan
    const dist = age * 26 * scale;
    const sx = Math.cos(angle) * dist * 1.5;
    const sy = -Math.sin(angle) * dist * 0.8;
    const alpha = Math.max(0, 1 - age);

    ctx.fillStyle = i % 2 === 0 ? `rgba(250, 204, 21, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
    ctx.fillRect(sx, sy, 3, 3);
  }

  // Shockwave ring on ground
  const ringW = age * 40 * scale;
  ctx.strokeStyle = `rgba(254, 240, 138, ${Math.max(0, 1 - age)})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, ringW, ringW * 0.25, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Draw Spinning Golden Arcade Coin
export function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Spin perspective calculation: cycle width 14 -> 2 -> 14
  const spinFactor = Math.abs(Math.cos(frame * 0.1));
  const w = Math.max(3, 14 * spinFactor);
  const h = 16;

  // Outer golden glow
  ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 0, w + 4, h / 2 + 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Coin rim
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, 0, w, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Coin body
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(1, w - 2), h / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Center star / symbol if wide enough
  if (w > 8) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2, -3, 4, 6);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-1, -2, 2, 4);
  }

  ctx.restore();
}

// Draw School Bell (Escuela Hazard: "¡TIMBRE!")
export function drawSchoolBell(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 5) * 0.18);

  // Red industrial bell wall box
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(-12, -18, 24, 10);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-10, -16, 20, 6);

  // Hammer striker
  ctx.fillStyle = '#334155';
  ctx.fillRect(8, -8, 4, 10);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(10, 0, 4, 4);

  // Heavy silver gong dome
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(0, 2, 14, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center brass bolt
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Sound rings
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 2, 20, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.stroke();

  ctx.restore();
}

// Draw Soccer / Playground Ball (Parque Hazard: "¡PELOTA!")
export function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation * 2);

  // Ball sphere
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Black pentagon patches
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // Side patches
  [-8, 8].forEach((ox) => {
    ctx.beginPath();
    ctx.arc(ox, -6, 3, 0, Math.PI * 2);
    ctx.arc(ox, 6, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Draw Subway Public Address Speaker (Metro Hazard: "¡ATENCIÓN!")
export function drawSubwaySpeaker(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 2) * 0.08);

  // Hanging ceiling bracket
  ctx.fillStyle = '#334155';
  ctx.fillRect(-2, -22, 4, 10);

  // Dual angled horn speakers box
  ctx.fillStyle = '#475569';
  ctx.fillRect(-16, -12, 32, 20);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-14, -10, 28, 16);

  // Speaker cones
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(-7, -2, 5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(7, -2, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Yellow warning stripes on top
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-16, -14, 8, 2);
  ctx.fillRect(0, -14, 8, 2);

  ctx.restore();
}

// Draw Small Yellow Taxi / Car (Vehicle Hazard: "¡VROOOM!")
export function drawSmallCar(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation * 0.5);

  // Car chassis (Yellow retro cab / micro car)
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-16, -6, 32, 14);

  // Roof / Cabin
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(-10, -14, 20, 8);

  // Blue tinted glass windshields
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-8, -12, 8, 6);
  ctx.fillRect(2, -12, 6, 6);

  // Wheels
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-10, 8, 5, 0, Math.PI * 2);
  ctx.arc(10, 8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-11, 7, 2, 2);
  ctx.fillRect(9, 7, 2, 2);

  // Headlights
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(14, -2, 3, 4);
  // Red tail light
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-17, -2, 2, 4);

  // Taxi sign on roof
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4, -18, 8, 4);
  ctx.fillStyle = '#000000';
  ctx.fillRect(-2, -17, 4, 2);

  ctx.restore();
}

// Draw Small Delivery Truck (Loud Heavy Hazard: "¡RUUUUMBLE!")
export function drawSmallTruck(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation * 0.4);

  // Cargo box (White with red hazard stripe)
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(-18, -18, 22, 24);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-18, -6, 22, 4);

  // Cab (Orange)
  ctx.fillStyle = '#f97316';
  ctx.fillRect(4, -10, 14, 16);
  // Window
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(7, -8, 8, 6);

  // 3 Wheels
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-12, 8, 5, 0, Math.PI * 2);
  ctx.arc(-2, 8, 5, 0, Math.PI * 2);
  ctx.arc(11, 8, 5, 0, Math.PI * 2);
  ctx.fill();

  // Exhaust puff
  if (Math.random() > 0.4) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.beginPath();
    ctx.arc(-22, 2, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw Lawnmower (Campus Garden Hazard: "¡BRRRR!")
export function drawLawnmower(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 6) * 0.1);

  // Red motor deck
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-14, -6, 28, 12);
  // Engine block
  ctx.fillStyle = '#334155';
  ctx.fillRect(-8, -14, 16, 8);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-4, -16, 8, 3);

  // Handlebar angled back
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -6);
  ctx.lineTo(-20, -22);
  ctx.lineTo(-24, -20);
  ctx.stroke();

  // 4 Small Wheels
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-12, 5, 6, 6);
  ctx.fillRect(6, 5, 6, 6);

  // Grass clipping sparks
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(15 + Math.random() * 4, -2 + Math.random() * 6, 3, 2);

  ctx.restore();
}

// Draw Referee Whistle (Sports Hazard: "¡FIIII!")
export function drawWhistle(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  // Chrome silver metal chamber
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(-6, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Mouthpiece tube
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-2, -4, 16, 8);
  ctx.strokeRect(-2, -4, 16, 8);

  // Sound opening slit
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(3, -4, 4, 3);

  // Lanyard loop
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(-18, -2, 5, 4);

  ctx.restore();
}

// Draw Street Boombox (Alley Hazard: "¡BASS!")
export function drawBoombox(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 3) * 0.08);

  // Boombox grey body
  ctx.fillStyle = '#334155';
  ctx.fillRect(-16, -10, 32, 20);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-14, -8, 28, 16);

  // Carry handle on top
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(-10, -15, 20, 5);

  // Dual speakers pumping with bass
  const pump = Math.abs(Math.sin(wobble * 8)) * 2;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-7, 0, 5 + pump, 0, Math.PI * 2);
  ctx.arc(7, 0, 5 + pump, 0, Math.PI * 2);
  ctx.fill();

  // Speaker cones
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(-7, 0, 2, 0, Math.PI * 2);
  ctx.arc(7, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // Cassette deck center
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-3, -4, 6, 8);

  ctx.restore();
}

// Draw Motorcycle (Campus Road Hazard: "¡BRAAP!")
export function drawMotorcycle(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation * 0.4);

  // Wheels
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-11, 6, 6, 0, Math.PI * 2);
  ctx.arc(11, 6, 6, 0, Math.PI * 2);
  ctx.fill();

  // Frame (Bright Red)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-6, -2, 14, 6);
  // Fuel tank
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-4, -8, 10, 6);
  // Handlebars
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(4, -14, 3, 7);

  // Chrome exhaust pipe
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-12, 1, 10, 3);

  ctx.restore();
}

// Draw Quiet Park Bird (Level 1 Gentle Hazard: "¡PÍO!")
export function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 4) * 0.12);

  // Blue plumage body
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // Flapping Wing
  const wingY = Math.sin(wobble * 8) * 4;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(-2, wingY, 6, 4, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Beak
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(6, -2);
  ctx.lineTo(12, 0);
  ctx.lineTo(6, 2);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(4, -3, 2, 2);

  ctx.restore();
}

// Draw Heavy Industrial Hydraulic Press (Fábrica Hazard: "¡KLANG!")
export function drawPress(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 3) * 0.05);

  // Hydraulic cylinder on top
  ctx.fillStyle = '#334155';
  ctx.fillRect(-6, -20, 12, 12);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-3, -8, 6, 8);

  // Heavy steel crushing ram block
  ctx.fillStyle = '#475569';
  ctx.fillRect(-18, 0, 36, 18);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.strokeRect(-18, 0, 36, 18);

  // Yellow and black warning stripes
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-16, 4, 32, 6);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-12, 4, 5, 6);
  ctx.fillRect(-2, 4, 5, 6);
  ctx.fillRect(8, 4, 5, 6);

  ctx.restore();
}

// Draw Factory Steam Release Pipe (Fábrica Hazard: "¡PSSSH!")
export function drawSteamPipe(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Cast iron pipe body
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-8, -14, 16, 22);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-6, -14, 4, 22);

  // Red brass pressure valve wheel
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(12, -4, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(12, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Pipe nozzle flange
  ctx.fillStyle = '#475569';
  ctx.fillRect(-12, 8, 24, 6);

  // Billowing white steam puffs
  const steamPuff = Math.sin(wobble * 6) * 3;
  ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
  ctx.beginPath();
  ctx.arc(-8, 18 + steamPuff, 7, 0, Math.PI * 2);
  ctx.arc(6, 20 - steamPuff, 8, 0, Math.PI * 2);
  ctx.arc(0, 24, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Workshop Circular Saw (Taller Hazard: "¡ZZZZ!")
export function drawCircularSaw(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation * 4);

  // Silver circular saw blade
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sharp saw teeth around perimeter
  ctx.fillStyle = '#94a3b8';
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const tx = Math.cos(angle) * 18;
    const ty = Math.sin(angle) * 18;
    ctx.fillRect(tx - 2, ty - 2, 4, 4);
  }

  // Center arbor bolt
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Subway Train Steel Wheel (Metro Hazard: "¡SKREEECH!")
export function drawTrainWheel(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation * 2.5);

  // Heavy steel wheel flange
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();

  // Wheel rim
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();

  // Wheel axle hub
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  // Yellow friction sparks
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-15, 12, 3, 3);
  ctx.fillRect(12, 14, 3, 3);

  ctx.restore();
}

// Draw Jet Aircraft Turbine (Aeropuerto Hazard: "¡WHOOOOSH!")
export function drawJetTurbine(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 2) * 0.08);

  // Nacelle outer engine cowl (Grey & Blue stripe)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-18, -14, 36, 28);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(-18, -14, 36, 28);

  // Turbine air intake opening (Dark circle)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(-14, 0, 6, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spinning intake fan cone
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-14, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Rear exhaust jet blast
  const blastW = 10 + Math.sin(wobble * 10) * 4;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.beginPath();
  ctx.moveTo(18, -8);
  ctx.lineTo(18 + blastW, 0);
  ctx.lineTo(18, 8);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Draw Flying-V Rock Electric Guitar (Concierto Hazard: "¡WAAAH!")
export function drawRockGuitar(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  // Flying V Guitar Body (Vibrant crimson red)
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-14, 14);
  ctx.lineTo(-6, 8);
  ctx.lineTo(0, 10);
  ctx.lineTo(6, 8);
  ctx.lineTo(14, 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // White pickguard
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-5, 4);
  ctx.lineTo(5, 4);
  ctx.closePath();
  ctx.fill();

  // Guitar Neck & Headstock
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(-2, -30, 4, 16);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-3, -34, 6, 6);

  // Volume knobs
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-4, 0, 2, 2);
  ctx.fillRect(2, 0, 2, 2);

  ctx.restore();
}

// Draw Ship Foghorn (Puerto Hazard: "¡BWOOOM!")
export function drawFoghorn(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 2) * 0.1);

  // Heavy brass ship horn trumpet
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(-16, -6);
  ctx.lineTo(12, -16);
  ctx.lineTo(12, 16);
  ctx.lineTo(-16, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Trumpet bell flare
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(12, 0, 4, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Air pipe mount
  ctx.fillStyle = '#334155';
  ctx.fillRect(-20, -4, 6, 8);

  // Acoustic blast ripples
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(14, 0, 12, -Math.PI * 0.35, Math.PI * 0.35);
  ctx.stroke();

  ctx.restore();
}

// Draw News Helicopter (Megaciudad Hazard: "¡CHOP-CHOP!")
export function drawHelicopter(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(Math.sin(wobble * 4) * 0.08);

  // Blue & White helicopter fuselage
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-16, -8, 28, 16);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-16, 2, 28, 6);

  // Cockpit glass bubble
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(8, -8, 8, 10);

  // Tail boom and small tail rotor
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(-28, -4, 14, 5);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-29, -10, 3, 16);

  // Landing skids
  ctx.fillStyle = '#475569';
  ctx.fillRect(-12, 10, 24, 2);
  ctx.fillRect(-8, 8, 2, 3);
  ctx.fillRect(8, 8, 2, 3);

  // Spinning top main rotor blade
  const bladeW = 28 + Math.sin(wobble * 16) * 4;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-bladeW / 2, -14, bladeW, 3);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-2, -12, 4, 4);

  // Flashing red beacon on top
  if (Math.floor(Date.now() / 150) % 2 === 0) {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-2, -16, 4, 3);
  }

  ctx.restore();
}

// Draw the Grand Level Exit Gate / Finish Meta Archway
export function drawExitPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  levelNum: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(groundY));

  // Portal dimensions
  const portalW = 90;
  const portalH = 150;
  const leftColX = -portalW / 2;
  const rightColX = portalW / 2 - 14;

  // Ground checkered finish strip
  for (let c = 0; c < 6; c++) {
    ctx.fillStyle = (c % 2 === 0) ? '#facc15' : '#0f172a';
    ctx.fillRect(-portalW / 2 + c * 15, -6, 15, 6);
  }

  // Left & Right Checkerboard Industrial Support Pillars
  for (let colX of [leftColX, rightColX]) {
    // Metal column shadow & frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(colX, -portalH, 14, portalH);

    // Hazard stripes
    for (let sy = 0; sy < portalH - 20; sy += 16) {
      ctx.fillStyle = ((sy / 16) % 2 === 0) ? '#facc15' : '#0f172a';
      ctx.fillRect(colX + 2, -portalH + 20 + sy, 10, 14);
    }

    // Top flashing beacon lamp
    const flash = Math.floor(time * 4) % 2 === 0;
    ctx.fillStyle = flash ? '#22c55e' : '#15803d';
    ctx.beginPath();
    ctx.arc(colX + 7, -portalH - 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Beacon glow
    if (flash) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.beginPath();
      ctx.arc(colX + 7, -portalH - 4, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Overhead Banner Header
  const bannerY = -portalH + 2;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-portalW / 2 - 4, bannerY, portalW + 8, 32);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.strokeRect(-portalW / 2 - 4, bannerY, portalW + 8, 32);

  // Animated glowing sign: "SALIDA ➔" / "EXIT"
  const glow = 0.8 + Math.sin(time * 6) * 0.2;
  ctx.save();
  ctx.globalAlpha = glow;
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#22c55e';
  ctx.fillText('¡SALIDA! ➔', 0, bannerY + 12);
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#facc15';
  ctx.fillText(`FIN NIVEL ${levelNum}`, 0, bannerY + 24);
  ctx.restore();

  // Floating Green Energy Arrow pointing through the portal
  const arrowBob = Math.sin(time * 5) * 6;
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.moveTo(10 + arrowBob, -75);
  ctx.lineTo(-8 + arrowBob, -90);
  ctx.lineTo(-8 + arrowBob, -60);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}


