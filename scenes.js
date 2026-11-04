/* Hand-drawn SVG scenes: people doing the action in each example sentence. */
const SCENES = (() => {
  const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" role="img">${inner}</svg>`;
  const rect = (x, y, w, h, f, rx = 0, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${ex}/>`;
  const circ = (x, y, r, f, ex = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${ex}/>`;
  const line = (x1, y1, x2, y2, c, w = 4, ex = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${ex}/>`;
  const text = (x, y, t, size, fill, ex = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="'Trebuchet MS',Arial,sans-serif" font-weight="800" text-anchor="middle" ${ex}>${t}</text>`;

  /* ---------- people ---------- */
  function person(o) {
    const d = Object.assign({
      x: 300, y: 350, s: 1, flip: false, skin: '#f6d2b0', hair: '#3a2a20', hs: 'short',
      shirt: '#4f8ef7', pants: '#3d4a63', dress: null, shoe: '#2b2b2b',
      l: [-42, -72], r: [42, -72], mouth: 'smile', look: 0, glasses: false
    }, o);
    const arm = (sx, h) => {
      const X = sx * 29, Y = -140, mx = X + (h[0] - X) * 0.45, my = Y + (h[1] - Y) * 0.45;
      return line(X, Y, mx, my, d.shirt, 19) + line(mx, my, h[0], h[1], d.skin, 14) + circ(h[0], h[1], 9, d.skin);
    };
    let legs, skirt = '';
    if (d.dress) {
      legs = line(-13, -70, -14, -12, d.skin, 13) + line(13, -70, 14, -12, d.skin, 13);
      skirt = `<path d="M-32 -96 L32 -96 L48 -46 L-48 -46Z" fill="${d.dress}" stroke="${d.dress}" stroke-width="8" stroke-linejoin="round"/>`;
    } else {
      legs = line(-14, -88, -15, -14, d.pants, 23) + line(14, -88, 15, -14, d.pants, 23);
    }
    const shoes = `<ellipse cx="-17" cy="-6" rx="16" ry="8" fill="${d.shoe}"/><ellipse cx="17" cy="-6" rx="16" ry="8" fill="${d.shoe}"/>`;
    const torso = rect(-31, -156, 62, 80, d.shirt, 20);
    const neck = rect(-8, -162, 16, 16, d.skin);
    const fringe = `<path d="M-30 -186 Q-35 -219 0 -219 Q35 -219 30 -186 Q17 -203 -2 -198 Q-18 -196 -30 -186Z" fill="${d.hair}"/>`;
    let back = '', front = '';
    if (d.hs === 'long') {
      back = `<path d="M-37 -180 Q-42 -224 0 -224 Q42 -224 37 -180 L40 -138 Q30 -130 24 -140 L24 -180 L-24 -180 L-24 -140 Q-30 -130 -40 -138Z" fill="${d.hair}"/>`;
      front = fringe;
    } else if (d.hs === 'bun') {
      back = circ(0, -226, 13, d.hair); front = fringe;
    } else if (d.hs === 'short') { front = fringe; }
    const head = circ(0, -184, 29, d.skin);
    const ex = d.look * 3;
    const eyes = circ(-10 + ex, -185, 3.4, '#222') + circ(10 + ex, -185, 3.4, '#222');
    const cheeks = circ(-18, -173, 5, '#ff8f8f', 'opacity=".45"') + circ(18, -173, 5, '#ff8f8f', 'opacity=".45"');
    const mouths = {
      smile: `<path d="M-9 -173 Q0 -164 9 -173" fill="none" stroke="#8a3b2b" stroke-width="3" stroke-linecap="round"/>`,
      talk: `<path d="M-10 -174 Q0 -156 10 -174Z" fill="#8e2f2f"/>`,
      open: `<ellipse cx="0" cy="-170" rx="6" ry="7.5" fill="#8e2f2f"/>`
    };
    const glasses = d.glasses ? `<g fill="none" stroke="#444" stroke-width="2.5"><circle cx="-10" cy="-185" r="8"/><circle cx="10" cy="-185" r="8"/><line x1="-2" y1="-185" x2="2" y2="-185"/></g>` : '';
    const tf = `translate(${d.x} ${d.y}) scale(${d.flip ? -d.s : d.s} ${d.s})`;
    return `<g transform="${tf}">${legs}${shoes}${back}${torso}${skirt}${neck}${head}${front}${eyes}${cheeks}${mouths[d.mouth] || mouths.smile}${glasses}${arm(-1, d.l)}${arm(1, d.r)}</g>`;
  }

  /* ---------- small helpers / props ---------- */
  const heart = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -4 C-10 -16 -22 -2 0 14 C22 -2 10 -16 0 -4Z" fill="${c}"/>`;
  const gift = (x, y, s = 1, c = '#ef476f') => `<g transform="translate(${x} ${y}) scale(${s})">${rect(-26, -20, 52, 42, c, 4)}${rect(-29, -26, 58, 14, '#d62f58', 4)}${rect(-6, -26, 12, 48, '#ffd166')}<ellipse cx="-9" cy="-33" rx="10" ry="7" fill="#ffd166"/><ellipse cx="9" cy="-33" rx="10" ry="7" fill="#ffd166"/>${circ(0, -30, 4, '#f4a300')}</g>`;
  const book = (x, y, s = 1, c = '#3a86ff', rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${rect(-24, -30, 48, 60, c, 4)}${rect(-24, -30, 9, 60, '#1d3f8f', 3)}${rect(-10, -18, 28, 5, '#fff', 2, 'opacity=".85"')}${rect(-10, -8, 22, 5, '#fff', 2, 'opacity=".85"')}</g>`;
  const bowl = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 -10 L34 -10 Q30 20 0 22 Q-30 20 -34 -10Z" fill="#4ea3d9"/><ellipse cx="0" cy="-10" rx="34" ry="8" fill="#2f7fb5"/>${circ(-18, -14, 5, '#8b5a2b')}${circ(-4, -17, 5, '#8b5a2b')}${circ(10, -14, 5, '#8b5a2b')}${circ(22, -12, 4, '#8b5a2b')}${circ(2, -11, 5, '#a86a35')}</g>`;
  const dog = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M52 -52 Q82 -74 70 -100" fill="none" stroke="#d9993f" stroke-width="12" stroke-linecap="round"/>
    ${rect(-36, -30, 14, 30, '#b9773a', 6)}${rect(-14, -30, 14, 30, '#b9773a', 6)}${rect(20, -30, 14, 30, '#d9993f', 6)}${rect(40, -30, 14, 30, '#d9993f', 6)}
    <ellipse cx="4" cy="-44" rx="52" ry="26" fill="#d9993f"/>
    <circle cx="-54" cy="-60" r="23" fill="#d9993f"/>
    <ellipse cx="-74" cy="-54" rx="14" ry="10" fill="#f3d6a4"/>
    ${circ(-85, -57, 5, '#222')}
    <ellipse cx="-44" cy="-78" rx="9" ry="16" fill="#9b5f26" transform="rotate(20 -44 -78)"/>
    ${circ(-56, -66, 3.5, '#222')}
    <path d="M-78 -46 Q-72 -34 -66 -46Z" fill="#ff7b9c"/></g>`;
  const battery = (x, y, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${rect(-5, -40, 10, 8, '#c9c9c9', 2)}${rect(-14, -34, 28, 66, '#f2a900', 5)}${rect(-14, -34, 28, 24, '#2b2b2b', 5)}${rect(-14, -18, 28, 8, '#2b2b2b')}${text(0, -14, '+', 20, '#fff')}${rect(-14, 20, 28, 5, '#fff', 0, 'opacity=".6"')}</g>`;
  const car = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${rect(-72, -40, 144, 32, '#e84a5f', 12)}<path d="M-26 -40 L-14 -68 L30 -68 L46 -40Z" fill="#e84a5f"/><path d="M-18 -42 L-10 -62 L8 -62 L8 -42Z" fill="#bde0fe"/><path d="M14 -42 L14 -62 L28 -62 L40 -42Z" fill="#bde0fe"/>${rect(-64, -47, 40, 10, '#1c1c1c', 3)}${text(-44, -38, '+', 13, '#ffd166')}${circ(-42, -6, 15, '#222')}${circ(-42, -6, 6, '#aaa')}${circ(42, -6, 15, '#222')}${circ(42, -6, 6, '#aaa')}</g>`;
  const phone = (x, y, s = 1, rot = 0, bat = '#ef476f') => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${rect(-14, -24, 28, 48, '#222', 6)}${rect(-11, -20, 22, 40, '#e8f1ff', 3)}${rect(-5, -4, 10, 6, bat, 1)}</g>`;
  const clock = (x, y, r, hh, mm) => {
    let s = circ(x, y, r + 6, '#8b5a2b') + circ(x, y, r, '#fff');
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      s += line(x + Math.sin(a) * (r - 4), y - Math.cos(a) * (r - 4), x + Math.sin(a) * (r - 10), y - Math.cos(a) * (r - 10), '#333', 2.5);
    }
    const ha = ((hh % 12) + mm / 60) * Math.PI / 6, ma = mm * Math.PI / 30;
    return s + line(x, y, x + Math.sin(ha) * r * 0.5, y - Math.cos(ha) * r * 0.5, '#222', 4) + line(x, y, x + Math.sin(ma) * r * 0.78, y - Math.cos(ma) * r * 0.78, '#222', 3) + circ(x, y, 3, '#222');
  };
  const win = (x, y, w, h, sky, inner = '') => rect(x - 6, y - 6, w + 12, h + 12, '#fff') + rect(x, y, w, h, sky) + inner + line(x + w / 2, y, x + w / 2, y + h, '#fff', 5) + line(x, y + h / 2, x + w, y + h / 2, '#fff', 5) + rect(x - 6, y - 6, w + 12, h + 12, 'none', 0, 'stroke="#b08968" stroke-width="5"');
  const shelf = (x, y, w, h) => {
    let s = rect(x, y, w, h, '#8b5a2b', 6);
    const rows = 3, rh = (h - 16) / rows, cols = ['#e63946', '#f4a261', '#2a9d8f', '#457b9d', '#e9c46a', '#9b5de5', '#06d6a0'];
    for (let r = 0; r < rows; r++) {
      const ry = y + 8 + r * rh;
      s += rect(x + 6, ry, w - 12, rh - 4, '#5e3a1a');
      let bx = x + 9, i = 0;
      while (bx < x + w - 20) {
        const bw = 9 + ((i * 7) % 7), bh = rh - 14 - ((i * 5) % 12);
        s += rect(bx, ry + rh - 4 - bh, bw, bh, cols[(i + r) % cols.length], 1);
        bx += bw + 2; i++;
      }
    }
    return s;
  };
  const sofa = (x, y, w) => rect(x, y, w, 90, '#e07a5f', 22) + rect(x - 14, y + 40, 34, 74, '#c96a50', 14) + rect(x + w - 20, y + 40, 34, 74, '#c96a50', 14) + rect(x + 16, y + 52, w - 32, 50, '#f08a6c', 12);
  const desk = (x, y, w) => rect(x, y, w, 12, '#c58b4a', 3) + rect(x + 8, y + 12, 10, 50, '#9a6b36') + rect(x + w - 18, y + 12, 10, 50, '#9a6b36');
  const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse cx="0" cy="0" rx="40" ry="16"/><ellipse cx="-20" cy="-10" rx="22" ry="16"/><ellipse cx="14" cy="-14" rx="26" ry="18"/></g>`;
  const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${rect(-10, -70, 20, 70, '#8b5a2b')}${circ(0, -100, 46, '#3fa34d')}${circ(-30, -80, 32, '#4caf50')}${circ(30, -80, 32, '#4caf50')}</g>`;
  const bubble = (x, y, w, h, lines, tx, ty, size = 22) => {
    const bx = Math.min(Math.max(tx, x + 22), x + w - 22), lh = size * 1.2, n = lines.length;
    let t = '';
    lines.forEach((ln, i) => { t += text(x + w / 2, y + h / 2 + (i - (n - 1) / 2) * lh + size * 0.35, ln, size, '#222'); });
    return `<polygon points="${bx - 12},${y + h - 1} ${bx + 12},${y + h - 1} ${tx},${ty}" fill="#fff" stroke="#333" stroke-width="3" stroke-linejoin="round"/>` +
      rect(x, y, w, h, '#fff', Math.min(24, h / 2), 'stroke="#333" stroke-width="3"') + rect(bx - 10, y + h - 3, 20, 6, '#fff') + t;
  };

  /* ---------- backgrounds ---------- */
  const room = (wall, floor) => rect(0, 0, 600, 300, wall) + rect(0, 300, 600, 100, floor) + rect(0, 294, 600, 10, '#000', 0, 'opacity=".12"');
  const park = (sx, sy, sc) => rect(0, 0, 600, 300, '#bfe6ff') + circ(sx, sy, 34, sc) + cloud(120, 70) + cloud(430, 50, 0.8) + rect(0, 290, 600, 110, '#7fcf6b') + rect(0, 290, 600, 8, '#6bbd58') + tree(510, 300) + tree(60, 310, 0.9);
  const classroom = (bx, by, bw, bh, chalk) => room('#e6f3e8', '#d9b98a') + rect(bx - 8, by - 8, bw + 16, bh + 16, '#a9743f', 6) + rect(bx, by, bw, bh, '#2f6b4f', 4) + chalk;

  /* ---------- scenes ---------- */
  return {
    /* ===== GIVE ===== */
    give1() {
      const g = { x: 200, y: 352, s: 0.85, hs: 'bun', hair: '#5a3825', shirt: '#ff8fb1', dress: '#ffcf5c', r: [106, -112], l: [-42, -72], look: 1 };
      const m = { x: 395, y: 352, s: 1, hs: 'long', hair: '#2d1f1a', shirt: '#5cc08f', pants: '#4a5c85', l: [-80, -98], r: [42, -72], look: -1 };
      return svg(room('#ffe9c7', '#d9a066') + win(60, 60, 120, 110, '#bfe6ff', circ(150, 95, 22, '#ffd23f')) +
        rect(400, 70, 90, 70, '#fff', 4, 'stroke="#b08968" stroke-width="6"') + heart(445, 105, 1.6, '#ff8fa3') +
        '<ellipse cx="300" cy="352" rx="240" ry="26" fill="#f4a3a3"/>' +
        person(m) + person(g) + gift(300, 250, 1) + heart(300, 170, 1.2, '#ff6b8b') + heart(338, 196, 0.8, '#ff8fa3') + heart(264, 200, 0.7, '#ffb3c1'));
    },
    give2() {
      const b = { x: 190, y: 352, s: 0.9, hair: '#2b1d14', shirt: '#f5a623', pants: '#3a5a8c', r: [92, -72], l: [-40, -72], look: 1 };
      return svg(park(500, 70, '#ffb347') + person(b) + dog(410, 352) + bowl(300, 298) + bubble(330, 190, 100, 44, ['Woof!'], 356, 266));
    },
    give3() {
      const b = { x: 205, y: 352, s: 0.8, hair: '#1f1f1f', shirt: '#4f8ef7', pants: '#2d3b55', r: [112, -100], l: [-42, -72], look: 1 };
      const t = { x: 415, y: 352, s: 1, hs: 'bun', hair: '#6b4a3a', shirt: '#a56cd9', pants: '#3d4a63', glasses: true, l: [-84, -100], r: [42, -72], look: -1 };
      return svg(classroom(50, 50, 260, 130, text(180, 128, 'Monday', 46, '#fff')) + shelf(490, 130, 90, 170) + person(t) + person(b) + book(312, 262, 1, '#3a86ff', -8));
    },

    /* ===== SPEAK ===== */
    speak1() {
      const g = { x: 300, y: 352, hs: 'long', hair: '#4a2c20', shirt: '#ff7aa8', pants: '#4b5d8a', mouth: 'talk', l: [-62, -128], r: [44, -72] };
      return svg(classroom(30, 40, 230, 120, text(145, 116, 'ABC', 54, '#fff')) + desk(430, 300, 150) + book(500, 286, 0.5, '#e76f51') + person(g) + bubble(345, 40, 225, 80, ['Hello! I am Amy.'], 322, 172));
    },
    speak2() {
      let s = rect(0, 0, 600, 400, '#2b1b3d');
      s += `<path d="M0 0 L120 0 Q80 160 110 330 L0 330Z" fill="#a8324a"/><path d="M600 0 L480 0 Q520 160 490 330 L600 330Z" fill="#a8324a"/>`;
      s += `<polygon points="260,0 340,0 420,330 180,330" fill="#fff6b0" opacity=".16"/>`;
      s += rect(0, 310, 600, 90, '#8a5a34') + rect(0, 310, 600, 8, '#a8734a');
      const w = { x: 300, y: 335, hs: 'long', hair: '#7a3b1d', skin: '#e0ac82', shirt: '#f2b134', dress: '#f2b134', mouth: 'talk', r: [34, -166], l: [-48, -100] };
      s += person(w) + rect(331, 150, 8, 26, '#222', 4) + circ(335, 148, 9, '#bbb');
      for (let x = 20; x < 620; x += 64) s += circ(x, 392 + (x % 3) * 4, 28, '#1a1128');
      s += bubble(355, 30, 225, 90, ['Good evening,', 'everyone!'], 338, 140);
      return svg(s);
    },
    speak3() {
      const stars = circ(90, 90, 2, '#fff') + circ(150, 130, 2, '#fff') + circ(80, 150, 1.5, '#fff') + circ(145, 80, 1.5, '#fff');
      const b = { x: 215, y: 352, s: 0.8, hair: '#2b1d14', shirt: '#7fd1ae', pants: '#7fd1ae', mouth: 'talk', r: [52, -178], l: [-42, -72], look: 1 };
      const gm = { x: 420, y: 352, s: 0.95, hs: 'bun', hair: '#dcdcdc', glasses: true, shirt: '#e58fb0', dress: '#8e6bbf', mouth: 'smile', look: -1, l: [-42, -72], r: [42, -72] };
      return svg(room('#2f3e6b', '#5c4a3a') + win(60, 60, 120, 120, '#12204a', stars + circ(125, 115, 26, '#ffe9a8')) +
        person(gm) + person(b) + bubble(240, 30, 275, 70, ['Good night, Grandma!'], 228, 205));
    },

    /* ===== QUESTION ===== */
    question1() {
      const st = { x: 210, y: 352, s: 0.9, hair: '#2b1d14', shirt: '#4f8ef7', pants: '#3a4a68', r: [44, -228], l: [-42, -72], mouth: 'open' };
      const t = { x: 470, y: 352, flip: true, hs: 'bun', hair: '#8a5a3a', shirt: '#a56cd9', pants: '#3d4a63', l: [-42, -72], r: [44, -72], look: 1 };
      return svg(classroom(350, 20, 220, 100, text(460, 84, '1 + 1 = ?', 38, '#fff')) + desk(20, 290, 120) + person(t) + person(st) + bubble(30, 20, 190, 84, ['May I ask', 'a question?'], 205, 160));
    },
    question2() {
      const b = { x: 200, y: 352, s: 0.8, hair: '#2b1d14', shirt: '#f48c06', pants: '#3a5a8c', r: [48, -142], l: [-42, -72], mouth: 'open', look: 1 };
      const dad = { x: 440, y: 352, flip: true, hair: '#2b1d14', shirt: '#3fa796', pants: '#4a4a5a', l: [-42, -72], r: [46, -90], look: 1 };
      return svg(room('#ffe1c2', '#c98f5a') + win(400, 30, 120, 100, '#ff8c5a', circ(460, 118, 26, '#ffd23f')) + sofa(320, 215, 250) + person(dad) + person(b) + bubble(40, 195 - 150, 210, 90, ['Dad, why is', 'the sky red?'], 208, 214));
    },
    question3() {
      const g = { x: 210, y: 352, s: 0.85, hs: 'long', hair: '#3b2a20', shirt: '#9b7bea', dress: '#f48fb1', mouth: 'open', r: [60, -130], l: [-48, -96], look: 1 };
      const lib = { x: 430, y: 352, flip: true, hs: 'bun', hair: '#8a6a4a', glasses: true, shirt: '#2a9d8f', pants: '#3d4a63', l: [-42, -100], r: [42, -100], look: 1 };
      return svg(room('#f3e5c8', '#b98a5a') + shelf(20, 60, 120, 230) + shelf(470, 50, 110, 170) + clock(410, 70, 30, 3, 0) + person(lib) + rect(330, 285, 250, 67, '#8b5a2b', 4) + rect(330, 285, 250, 10, '#a9743f', 4) + person(g) + book(168, 268, 0.8, '#e76f51', -10) + bubble(190, 30, 170, 96, ['Where is', 'this book?'], 214, 196));
    },

    /* ===== BATTERY ===== */
    battery1() {
      const stars = circ(70, 80, 2, '#fff') + circ(130, 140, 2, '#fff') + circ(145, 75, 1.5, '#fff');
      const b = { x: 215, y: 352, s: 0.95, hair: '#2b1d14', shirt: '#ffd166', pants: '#2d3b55', r: [80, -120], l: [-42, -72], look: 1 };
      return svg(room('#2c3a63', '#6b4f3a') + win(50, 50, 110, 120, '#13214a', stars + circ(105, 105, 24, '#ffe9a8')) +
        rect(330, 278, 250, 14, '#a9743f', 4) + rect(345, 292, 12, 60, '#8a5a2b') + rect(553, 292, 12, 60, '#8a5a2b') +
        car(455, 268, 1.1) + person(b) + battery(298, 228, 1, 25) +
        '<path d="M318 205 Q360 140 412 200" fill="none" stroke="#ffd166" stroke-width="4" stroke-dasharray="8 8" stroke-linecap="round"/><polygon points="420,214 404,206 414,194" fill="#ffd166"/>');
    },
    battery2() {
      const dad = { x: 300, y: 322, hair: '#2b1d14', shirt: '#e76f51', pants: '#3d4a63', r: [104, -205], l: [-42, -72], look: 1 };
      return svg(room('#ffeccc', '#cf9b65') + sofa(20, 215, 210) +
        rect(70, 60, 80, 90, '#fff', 6) + rect(70, 60, 80, 28, '#e63946', 6) + text(110, 81, 'SUN', 19, '#fff') + text(110, 134, '8', 44, '#e63946') +
        clock(440, 95, 44, 10, 10) +
        rect(255, 320, 90, 14, '#a9743f', 5) + rect(268, 332, 10, 20, '#8a5a2b') + rect(322, 332, 10, 20, '#8a5a2b') +
        person(dad) + battery(406, 128, 0.45, 20));
    },
    battery3() {
      const g = { x: 170, y: 352, hs: 'long', hair: '#2d1f1a', shirt: '#ffffff', dress: '#2f5da8', r: [74, -158], l: [-42, -72], look: 1 };
      let s = rect(0, 0, 600, 300, '#bfe6ff') + circ(150, 55, 30, '#ffd23f') + rect(0, 300, 600, 100, '#9bd17f') + rect(0, 296, 600, 8, '#86c06a');
      s += rect(20, 150, 250, 150, '#f2b56b') + rect(10, 126, 270, 26, '#c0553a') + text(82, 146, 'SCHOOL', 17, '#fff');
      s += rect(40, 175, 44, 44, '#bde0fe', 4) + rect(100, 175, 44, 44, '#bde0fe', 4) + rect(225, 175, 36, 44, '#bde0fe', 4) + rect(228, 235, 40, 65, '#8b5a2b', 4);
      s += clock(60, 62, 28, 12, 0);
      s += person(g) + phone(252, 186, 1, -10);
      s += '<line x1="266" y1="176" x2="334" y2="146" stroke="#555" stroke-width="3" stroke-dasharray="6 6"/>';
      s += circ(445, 190, 120, '#fff', 'stroke="#555" stroke-width="5"');
      s += rect(397, 100, 96, 180, '#222', 14) + rect(403, 112, 84, 156, '#eef4ff', 6);
      s += rect(412, 160, 60, 30, '#fff', 6, 'stroke="#333" stroke-width="4"') + rect(472, 169, 6, 12, '#333', 2) + rect(417, 165, 12, 20, '#ef476f', 2);
      s += text(445, 228, '10%', 30, '#ef476f') + text(445, 254, 'Low', 18, '#666');
      return svg(s);
    }
  };
})();
if (typeof module !== 'undefined') module.exports = SCENES;
