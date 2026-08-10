// PROTOTYPE — smart-zone diagram for wayfinder ticket #42. Throwaway. v2: quality curve carries the claim.
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.env.CLAUDE_PLUGIN_ROOT;
if (!root) throw new Error("run with CLAUDE_PLUGIN_ROOT=<path to aiworx-excalidraw plugin>");
const { authorDiagram } = await import(pathToFileURL(join(root, "tools/author.js")).href);

const OUT = process.env.OUT || "smart-zone.prototype.excalidraw";

await authorDiagram({
  out: OUT,
  register: { roughness: 1, fillStyle: "solid", strokeWidth: 2 },
  build: async ({ measure, palette: p, PROSE, CODE }) => {
    const els = [];
    const text = async (t, o = {}) => {
      const [m] = await measure([{ text: t, fontSize: o.fontSize ?? 16, fontFamily: o.fontFamily ?? PROSE }]);
      return { type: "text", text: t, width: m.width, height: m.height,
               fontSize: o.fontSize ?? 16, fontFamily: o.fontFamily ?? PROSE,
               strokeColor: p.ink, ...o };
    };

    // ---------- title ----------
    els.push(await text("Quality falls long before the window fills", { id: "title", fontSize: 28, x: 40, y: 30 }));
    els.push(await text("plan to the smart zone, not the limit", { id: "subtitle", fontSize: 18, x: 40, y: 74, strokeColor: p.grey.stroke }));

    // ---------- section A: quality curve over the session bar ----------
    const BAR_X = 40, BAR_Y = 360, BAR_H = 40;
    const segs = [
      { id: "seg-setup",  w: 130, stroke: p.grey.stroke,           fill: p.grey.fill },
      { id: "seg-smart",  w: 330, stroke: p.roles.pass.stroke,     fill: p.roles.pass.fill },
      { id: "seg-signal", w: 200, stroke: p.roles.decision.stroke, fill: p.roles.decision.fill },
      { id: "seg-dumb",   w: 220, stroke: p.roles.fail.stroke,     fill: p.roles.fail.fill },
    ];
    let x = BAR_X;
    for (const s of segs) {
      els.push({ type: "rectangle", id: s.id, x, y: BAR_Y, width: s.w, height: BAR_H,
                 strokeColor: s.stroke, backgroundColor: s.fill, opacity: 80 });
      s.x = x; x += s.w;
    }
    const EMPTY_W = 240;
    els.push({ type: "rectangle", id: "seg-empty", x, y: BAR_Y, width: EMPTY_W, height: BAR_H,
               strokeColor: p.grey.faint, backgroundColor: "transparent", strokeStyle: "dashed" });
    const emptyX = x; x += EMPTY_W;
    const WALL_X = x + 20;

    // the wall — tall, spanning curve + bar
    els.push({ type: "line", id: "wall", x: WALL_X, y: 150, width: 0, height: BAR_Y + BAR_H + 12 - 150,
               points: [[0, 0], [0, BAR_Y + BAR_H + 12 - 150]], strokeColor: p.ink, strokeWidth: 4, roundness: null });
    const wallLbl = await text("window limit", { id: "wall-lbl", fontSize: 16 });
    wallLbl.x = WALL_X - wallLbl.width / 2; wallLbl.y = 150 - wallLbl.height - 8;
    els.push(wallLbl);

    // the quality curve — the claim, drawn. High through the smart zone,
    // knees down where signals appear, dead flat long before the wall.
    const CURVE_TOP = 180, CURVE_LOW = BAR_Y - 14;
    const pts = [
      [170, CURVE_TOP + 4], [340, CURVE_TOP + 10], [470, CURVE_TOP + 22],
      [560, CURVE_TOP + 52], [650, CURVE_TOP + 96], [740, CURVE_LOW - 42],
      [860, CURVE_LOW - 10], [980, CURVE_LOW], [1160, CURVE_LOW],
    ];
    const [ox, oy] = pts[0];
    els.push({ type: "line", id: "quality-curve", x: ox, y: oy,
               width: pts[pts.length - 1][0] - ox, height: CURVE_LOW - oy,
               points: pts.map(([px, py]) => [px - ox, py - oy]),
               strokeColor: p.ink, strokeWidth: 3, roundness: { type: 2 } });
    const qLbl = await text("output quality", { id: "q-lbl", fontSize: 14, strokeColor: p.grey.stroke });
    qLbl.x = 170; qLbl.y = CURVE_TOP - qLbl.height - 10;
    els.push(qLbl);

    // felt signals — stacked at the knee, dashed leader down to the curve
    const sigTexts = ["relitigates settled decisions", "forgets instructions", "sloppier edits"];
    let sigY = 92;
    for (let i = 0; i < sigTexts.length; i++) {
      const s = await text(sigTexts[i], { id: `sig-${i}`, fontSize: 14 });
      s.x = 700; s.y = sigY; sigY += s.height + 6;
      els.push(s);
    }
    els.push({ type: "arrow", id: "sig-leader", x: 690, y: 160, width: -35, height: 95,
               points: [[0, 0], [-35, 95]], strokeColor: p.roles.decision.stroke,
               strokeStyle: "dashed", endArrowhead: "arrow", startArrowhead: null, roundness: null });

    // zone labels under the bar
    const under = async (t, seg, o = {}) => {
      const lbl = await text(t, o);
      lbl.x = seg.x + (seg.w - lbl.width) / 2; lbl.y = BAR_Y + BAR_H + 12;
      return lbl;
    };
    els.push(await under("setup", segs[0], { id: "lbl-setup", fontSize: 14, strokeColor: p.grey.stroke }));
    els.push(await under("smart zone", segs[1], { id: "lbl-smart", fontSize: 16 }));
    els.push(await under("signals appear", segs[2], { id: "lbl-signal", fontSize: 16 }));
    els.push(await under("dumb zone", segs[3], { id: "lbl-dumb", fontSize: 16 }));
    const freeLbl = await text("window still free", { id: "lbl-free", fontSize: 14, strokeColor: p.grey.stroke });
    freeLbl.x = emptyX + (EMPTY_W - freeLbl.width) / 2; freeLbl.y = BAR_Y + BAR_H + 12;
    els.push(freeLbl);

    // the gap bracket — dumb-zone start to wall
    const bStart = segs[3].x;
    els.push({ type: "arrow", id: "gap-span", x: bStart, y: BAR_Y + BAR_H + 46, width: WALL_X - bStart, height: 0,
               points: [[0, 0], [WALL_X - bStart, 0]], strokeColor: p.grey.stroke,
               startArrowhead: "bar", endArrowhead: "bar", roundness: null });
    const gapLbl = await text("quality is gone long before here", { id: "gap-lbl", fontSize: 16 });
    gapLbl.x = (bStart + WALL_X) / 2 - gapLbl.width / 2; gapLbl.y = BAR_Y + BAR_H + 58;
    els.push(gapLbl);

    // ---------- section B: controls, ranked ----------
    els.push(await text("The controls, ranked", { id: "secb-title", fontSize: 20, x: 40, y: 520 }));

    const MB_Y = 660, MB_H = 36, MB_W = 300, GAP = 110;
    const minis = [
      { key: "clear", name: "/clear", rank: "1", stroke: p.roles.pass.stroke, fill: p.roles.pass.fill,
        caption: "free — nothing carries, fresh start" },
      { key: "compact", name: "/compact", rank: "2", stroke: p.roles.decision.stroke, fill: p.roles.decision.fill,
        caption: "lossy — but you pick the boundary" },
      { key: "auto", name: "autocompact", rank: "3", stroke: p.roles.fail.stroke, fill: p.roles.fail.fill,
        caption: "lossy — at a moment you didn't pick" },
    ];
    let mx = 40;
    for (const m of minis) {
      const bx = mx;
      const rank = await text(m.rank, { id: `mb-${m.key}-rank`, fontSize: 32, strokeColor: p.grey.stroke });
      rank.x = bx; rank.y = MB_Y - rank.height - 62;
      els.push(rank);
      const name = await text(m.name, { id: `mb-${m.key}-name`, fontSize: 18, fontFamily: CODE });
      name.x = bx + rank.width + 14; name.y = MB_Y - name.height - 68;
      els.push(name);

      els.push({ type: "rectangle", id: `mb-${m.key}-setup`, x: bx, y: MB_Y, width: 40, height: MB_H,
                 strokeColor: p.grey.stroke, backgroundColor: p.grey.fill });
      const fillW = m.key === "auto" ? MB_W - 40 : 160;
      els.push({ type: "rectangle", id: `mb-${m.key}-fill`, x: bx + 40, y: MB_Y, width: fillW, height: MB_H,
                 strokeColor: m.stroke, backgroundColor: m.fill });

      if (m.key === "compact") {
        els.push({ type: "rectangle", id: "mb-compact-summary", x: bx + 40, y: MB_Y + MB_H + 22, width: 56, height: 20,
                   strokeColor: p.roles.decision.stroke, backgroundColor: p.roles.decision.fill });
        const sum = await text("summary survives", { id: "mb-compact-sum-lbl", fontSize: 12 });
        sum.x = bx + 104; sum.y = MB_Y + MB_H + 24;
        els.push(sum);
      }
      if (m.key === "auto") {
        els.push({ type: "line", id: "mb-auto-wall", x: bx + MB_W + 8, y: MB_Y - 12, width: 0, height: MB_H + 24,
                   points: [[0, 0], [0, MB_H + 24]], strokeColor: p.ink, strokeWidth: 4, roundness: null });
        els.push({ type: "arrow", id: "mb-auto-hit", x: bx + 40 + fillW - 70, y: MB_Y + MB_H / 2,
                   width: 74, height: 0, points: [[0, 0], [74, 0]],
                   strokeColor: m.stroke, endArrowhead: "bar", startArrowhead: null, roundness: null });
      }

      // curved loop-back: leaves the fill's end, arcs over the bar, lands at the reset point
      const fromX = bx + 40 + fillW;
      const toX = m.key === "clear" ? bx + 4 : m.key === "compact" ? bx + 44 : null;
      if (toX !== null) {
        const dx = toX - fromX;
        els.push({ type: "arrow", id: `mb-${m.key}-loop`, x: fromX, y: MB_Y - 6,
                   width: dx, height: -36,
                   points: [[0, 0], [dx * 0.2, -32], [dx * 0.8, -32], [dx, -4]],
                   strokeColor: m.stroke, endArrowhead: "triangle", startArrowhead: null,
                   roundness: { type: 2 } });
      }

      const cap = await text(m.caption, { id: `mb-${m.key}-cap`, fontSize: 13, strokeColor: p.grey.stroke });
      cap.x = bx; cap.y = MB_Y + MB_H + (m.key === "compact" ? 52 : 16);
      els.push(cap);
      mx += MB_W + GAP;
    }

    els.push({ type: "frame", id: "f1", name: "plan to the smart zone, not the limit",
               children: els.filter((e) => e.id && e.type !== "frame").map((e) => e.id) });
    return els;
  },
});
console.log("wrote", OUT);
