import { useState, useEffect, useRef, useCallback } from "react";

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Dancing+Script:wght@600&family=Bebas+Neue&family=Raleway:wght@300;700&family=Shadows+Into+Light&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');`;

const FONTS = [
  { label: "Montserrat",      value: "Montserrat",         style: "bold 38px Montserrat" },
  { label: "Playfair",        value: "Playfair Display",   style: "400 38px 'Playfair Display'" },
  { label: "El Yazısı",       value: "Dancing Script",     style: "600 42px 'Dancing Script'" },
  { label: "Bebas (Büyük)",   value: "Bebas Neue",         style: "400 44px 'Bebas Neue'" },
  { label: "Raleway İnce",    value: "Raleway",            style: "300 38px Raleway" },
  { label: "Karakalem",       value: "Shadows Into Light", style: "400 40px 'Shadows Into Light'" },
  { label: "Great Vibes",     value: "Great Vibes",        style: "400 46px 'Great Vibes'" },
  { label: "Cormorant",       value: "Cormorant Garamond", style: "300 40px 'Cormorant Garamond'" },
];

const BACKGROUNDS = [
  { label: "Orijinal",    id: "none",    icon: "🎬" },
  { label: "Karartma",    id: "dark",    icon: "🌑" },
  { label: "Bulanık",     id: "blur",    icon: "🌫️" },
  { label: "Mavi Ton",    id: "blue",    icon: "💙" },
  { label: "Mor Ton",     id: "purple",  icon: "💜" },
  { label: "Siyah Beyaz", id: "bw",      icon: "🎞️" },
  { label: "Gece Moru",   id: "night",   icon: "🌌" },
  { label: "Sıcak Sepia", id: "sepia",   icon: "🍂" },
];

const CSS = `
${GFONTS}
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080b13;--s1:#0d1020;--s2:#121520;--s3:#181c2c;
  --b:rgba(255,255,255,0.07);--b2:rgba(255,255,255,0.13);
  --a:#7c9cff;--a2:#b47fff;--t:#e0e4f5;--m:#5a6580;
  --ok:#4ade80;
}
body{background:var(--bg);font-family:'Montserrat',sans-serif;color:var(--t);min-height:100vh;}
.app{
  min-height:100vh;
  background:
    radial-gradient(ellipse 80% 60% at 5% -5%,rgba(100,60,220,.12) 0%,transparent 55%),
    radial-gradient(ellipse 60% 50% at 95% 105%,rgba(60,80,200,.10) 0%,transparent 50%),
    var(--bg);
}
/* NAV */
.nav{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 22px;border-bottom:1px solid var(--b);
  backdrop-filter:blur(12px);position:sticky;top:0;z-index:10;
  background:rgba(8,11,19,.85);
}
.logo{font-size:15px;font-weight:700;letter-spacing:.05em;}
.logo span{background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
/* MAIN */
.main{max-width:1060px;margin:0 auto;padding:22px 16px 60px;}
/* UPLOAD */
.upload-wrap{max-width:500px;margin:40px auto;}
.upload-title{text-align:center;margin-bottom:28px;}
.upload-title h1{font-size:clamp(28px,4vw,44px);font-weight:700;line-height:1.1;margin-bottom:8px;}
.upload-title h1 span{background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.upload-title p{color:var(--m);font-size:13px;}
.drop-zone{
  border:2px dashed var(--b2);border-radius:20px;padding:52px 24px;
  text-align:center;cursor:pointer;transition:all .22s;background:var(--s1);
}
.drop-zone:hover,.drop-zone.drag{border-color:var(--a);background:rgba(124,156,255,.05);transform:scale(1.01);}
.drop-icon{font-size:48px;margin-bottom:14px;display:block;}
.drop-zone h3{font-size:17px;font-weight:600;margin-bottom:6px;}
.drop-zone p{color:var(--m);font-size:12px;}
/* EDITOR */
.editor{display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start;}
@media(max-width:760px){.editor{grid-template-columns:1fr;}}
/* VIDEO */
.video-col{}
.canvas-wrap{
  position:relative;border-radius:16px;overflow:hidden;background:#000;
  aspect-ratio:9/16;max-height:78vh;box-shadow:0 20px 60px rgba(0,0,0,.7);
}
.canvas-wrap canvas{width:100%;height:100%;object-fit:contain;display:block;}
.canvas-wrap video{display:none;}
.controls{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(transparent,rgba(0,0,0,.75));
  padding:24px 14px 14px;
}
.ctrl-row{display:flex;align-items:center;gap:10px;}
.play-btn{
  width:34px;height:34px;border-radius:50%;
  background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);
  color:#fff;font-size:13px;cursor:pointer;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;transition:all .15s;
}
.play-btn:hover{background:rgba(255,255,255,.3);}
.pbar{flex:1;height:3px;background:rgba(255,255,255,.2);border-radius:3px;cursor:pointer;}
.pfill{height:100%;background:var(--a);border-radius:3px;pointer-events:none;}
.ttime{color:rgba(255,255,255,.65);font-size:10px;flex-shrink:0;font-family:monospace;}
/* PANEL */
.panel{display:flex;flex-direction:column;gap:10px;}
.tabs{display:flex;background:var(--s2);border-radius:10px;padding:3px;border:1px solid var(--b);}
.tab{
  flex:1;padding:8px 4px;border:none;border-radius:7px;
  background:transparent;color:var(--m);font-family:'Montserrat',sans-serif;
  font-size:10px;font-weight:600;letter-spacing:.06em;cursor:pointer;transition:all .15s;
}
.tab.on{background:var(--s3);color:var(--t);border:1px solid var(--b2);}
.card{background:var(--s1);border:1px solid var(--b);border-radius:14px;padding:18px;}
.clabel{
  font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
  color:var(--a);margin-bottom:12px;display:flex;align-items:center;gap:7px;
}
.clabel::after{content:'';flex:1;height:1px;background:var(--b);}
/* TEXT CONTROLS */
textarea{
  width:100%;background:var(--s3);border:1px solid var(--b);border-radius:9px;
  padding:11px 12px;color:var(--t);font-family:'Montserrat',sans-serif;font-size:13px;
  line-height:1.6;outline:none;resize:none;transition:border-color .2s;margin-bottom:10px;
}
textarea:focus{border-color:rgba(124,156,255,.4);}
textarea::placeholder{color:var(--m);}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;}
.fld label{display:block;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--m);margin-bottom:5px;}
select,input[type=range]{
  width:100%;background:var(--s3);border:1px solid var(--b);border-radius:8px;
  padding:8px 10px;color:var(--t);font-family:'Montserrat',sans-serif;font-size:11px;
  outline:none;appearance:none;cursor:pointer;
}
input[type=range]{padding:4px 0;accent-color:var(--a);background:none;border:none;}
.color-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.cchip{
  width:26px;height:26px;border-radius:50%;cursor:pointer;border:2px solid transparent;
  transition:all .15s;flex-shrink:0;
}
.cchip.sel{border-color:#fff;transform:scale(1.15);}
.toggle-btn{
  width:100%;background:var(--s3);border:1px solid var(--b);border-radius:8px;
  padding:8px;color:var(--m);font-family:'Montserrat',sans-serif;font-size:11px;
  cursor:pointer;transition:all .15s;
}
.toggle-btn.on{background:rgba(124,156,255,.1);border-color:var(--a);color:var(--a);}
/* FONT PICKER */
.font-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.font-chip{
  background:var(--s3);border:1px solid var(--b);border-radius:8px;
  padding:8px 10px;cursor:pointer;transition:all .15s;text-align:center;font-size:12px;
}
.font-chip.sel{border-color:var(--a);background:rgba(124,156,255,.1);color:var(--a);}
.font-chip:hover{border-color:var(--b2);}
/* BG GRID */
.bg-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
.bg-chip{
  background:var(--s3);border:1px solid var(--b);border-radius:9px;
  padding:8px 4px;cursor:pointer;transition:all .15s;text-align:center;
}
.bg-chip .bg-icon{font-size:18px;display:block;margin-bottom:3px;}
.bg-chip .bg-lbl{font-size:9px;color:var(--m);}
.bg-chip.sel{border-color:var(--a);background:rgba(124,156,255,.1);}
.bg-chip.sel .bg-lbl{color:var(--a);}
/* HASHTAG */
.hcloud{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.htag{
  background:rgba(124,156,255,.07);border:1px solid rgba(124,156,255,.18);
  border-radius:6px;padding:4px 9px;font-size:11px;color:var(--a);
  cursor:pointer;transition:all .15s;user-select:none;
}
.htag:hover{background:rgba(124,156,255,.15);}
.htag.cp{background:rgba(74,222,128,.08);border-color:rgba(74,222,128,.25);color:var(--ok);}
.desc-input{
  width:100%;background:var(--s3);border:1px solid var(--b);border-radius:9px;
  padding:10px 12px;color:var(--t);font-family:'Montserrat',sans-serif;font-size:12px;
  outline:none;transition:border-color .2s;margin-bottom:10px;
}
.desc-input:focus{border-color:rgba(124,156,255,.4);}
.desc-input::placeholder{color:var(--m);}
/* BUTTONS */
.btn-ai{
  width:100%;padding:11px;background:linear-gradient(135deg,#4b6dff,#8b4fff);
  border:none;border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;
  font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.04em;
}
.btn-ai:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(75,109,255,.35);}
.btn-ai:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-copy{
  background:var(--s3);border:1px solid var(--b);border-radius:8px;
  padding:7px 12px;color:var(--m);font-family:'Montserrat',sans-serif;font-size:10px;
  cursor:pointer;transition:all .15s;font-weight:600;letter-spacing:.05em;
}
.btn-copy:hover{border-color:var(--a);color:var(--a);}
.top-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
/* LOADER */
.lbar{width:100%;height:2px;background:var(--b);border-radius:2px;overflow:hidden;margin:8px 0;}
.lbar-f{height:100%;background:linear-gradient(90deg,var(--a),var(--a2));animation:lb 1.3s ease-in-out infinite;}
@keyframes lb{0%{width:0;margin-left:0;}50%{width:55%;margin-left:20%;}100%{width:0;margin-left:100%;}}
/* DOWNLOAD */
.dl-btn{
  width:100%;padding:15px;background:linear-gradient(135deg,#22c55e,#16a34a);
  border:none;border-radius:12px;color:#fff;font-family:'Montserrat',sans-serif;
  font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;
  letter-spacing:.05em;margin-top:4px;
}
.dl-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(34,197,94,.35);}
.dl-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.dl-prog{background:var(--s1);border:1px solid var(--b);border-radius:12px;padding:16px;text-align:center;margin-top:4px;}
.dl-pbar{width:100%;height:5px;background:var(--b);border-radius:3px;overflow:hidden;margin:10px 0;}
.dl-pfill{height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:3px;transition:width .3s;}
.note{font-size:10px;color:var(--m);line-height:1.5;padding:8px;background:rgba(255,255,255,.02);border-radius:7px;border-left:2px solid var(--b2);margin-top:8px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.fade{animation:fadeUp .3s ease;}
`;

const TEXT_COLORS = ["#ffffff","#000000","#f8d7ff","#d0e8ff","#ffe4c4","#c8ffd4","#ffecb3","#ffb3b3"];
const POS_OPTIONS = [{ v: "top", l: "Üst" },{ v: "center", l: "Orta" },{ v: "bottom", l: "Alt" }];

export default function App() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [tab, setTab] = useState("text"); // text | bg | hash
  // text
  const [text, setText] = useState("");
  const [fontIdx, setFontIdx] = useState(0);
  const [textPos, setTextPos] = useState("bottom");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(38);
  const [showBg, setShowBg] = useState(true);
  // background
  const [bgEffect, setBgEffect] = useState("none");
  // hashtags
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(false);
  const [copied, setCopied] = useState("");
  // playback
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const [curT, setCurT] = useState(0);
  const [dur, setDur] = useState(0);
  // download
  const [dlActive, setDlActive] = useState(false);
  const [dlProg, setDlProg] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const fileRef = useRef(null);

  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

  // Canvas draw loop
  const draw = useCallback(() => {
    const cv = canvasRef.current, vd = videoRef.current;
    if (!cv || !vd) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;

    // --- Background Effect ---
    if (bgEffect === "blur") {
      ctx.filter = "blur(8px)";
      ctx.drawImage(vd, -12, -12, W+24, H+24);
      ctx.filter = "none";
      ctx.fillStyle = "rgba(0,0,0,.15)";
      ctx.fillRect(0,0,W,H);
    } else if (bgEffect === "bw") {
      ctx.filter = "grayscale(100%)";
      ctx.drawImage(vd, 0, 0, W, H);
      ctx.filter = "none";
    } else if (bgEffect === "sepia") {
      ctx.filter = "sepia(80%) brightness(.9)";
      ctx.drawImage(vd, 0, 0, W, H);
      ctx.filter = "none";
    } else {
      ctx.drawImage(vd, 0, 0, W, H);
    }

    // Color overlays
    if (bgEffect === "dark") {
      ctx.fillStyle = "rgba(0,0,0,.45)";
      ctx.fillRect(0,0,W,H);
    } else if (bgEffect === "blue") {
      ctx.fillStyle = "rgba(20,40,180,.35)";
      ctx.fillRect(0,0,W,H);
    } else if (bgEffect === "purple") {
      ctx.fillStyle = "rgba(80,20,160,.38)";
      ctx.fillRect(0,0,W,H);
    } else if (bgEffect === "night") {
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,"rgba(10,0,40,.5)");
      g.addColorStop(1,"rgba(40,10,80,.45)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    }

    // --- Text Overlay ---
    if (text.trim()) {
      const font = FONTS[fontIdx];
      const fs = Math.max(14, Math.min(Number(fontSize), 90));
      // Derive actual font string with correct size
      const fStr = font.style.replace(/\d+px/, `${fs}px`);
      ctx.font = fStr;
      ctx.textAlign = "center";
      const lines = text.split("\n");
      const lh = fs * 1.45;
      const tot = lines.length * lh;
      let sy = textPos === "top" ? fs + 50 : textPos === "center" ? (H - tot)/2 + fs : H - tot - 60;

      lines.forEach((ln, i) => {
        if (!ln.trim()) return;
        const y = sy + i * lh;
        const w = ctx.measureText(ln).width;
        if (showBg) {
          const p = 16, r = 10;
          const rx = W/2 - w/2 - p, ry = y - fs, rw = w + p*2, rh = fs + 12;
          ctx.fillStyle = "rgba(0,0,0,.55)";
          ctx.beginPath();
          ctx.moveTo(rx+r,ry); ctx.lineTo(rx+rw-r,ry);
          ctx.arcTo(rx+rw,ry,rx+rw,ry+r,r); ctx.lineTo(rx+rw,ry+rh-r);
          ctx.arcTo(rx+rw,ry+rh,rx+rw-r,ry+rh,r); ctx.lineTo(rx+r,ry+rh);
          ctx.arcTo(rx,ry+rh,rx,ry+rh-r,r); ctx.lineTo(rx,ry+r);
          ctx.arcTo(rx,ry,rx+r,ry,r); ctx.closePath(); ctx.fill();
        }
        ctx.shadowColor = "rgba(0,0,0,.95)"; ctx.shadowBlur = 12;
        ctx.fillStyle = textColor;
        ctx.fillText(ln, W/2, y);
        ctx.shadowBlur = 0;
      });
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [text, fontIdx, textPos, textColor, fontSize, showBg, bgEffect]);

  useEffect(() => {
    if (videoUrl) { rafRef.current = requestAnimationFrame(draw); }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [videoUrl, draw]);

  useEffect(() => {
    const vd = videoRef.current;
    if (!vd || !videoUrl) return;
    const onMeta = () => {
      setDur(vd.duration);
      if (canvasRef.current) {
        canvasRef.current.width = vd.videoWidth || 1080;
        canvasRef.current.height = vd.videoHeight || 1920;
      }
    };
    const onTime = () => { setCurT(vd.currentTime); setProg(vd.currentTime/(vd.duration||1)); };
    const onEnd = () => setPlaying(false);
    vd.addEventListener("loadedmetadata", onMeta);
    vd.addEventListener("timeupdate", onTime);
    vd.addEventListener("ended", onEnd);
    return () => { vd.removeEventListener("loadedmetadata",onMeta); vd.removeEventListener("timeupdate",onTime); vd.removeEventListener("ended",onEnd); };
  }, [videoUrl]);

  const loadVideo = (f) => {
    if (!f || !f.type.startsWith("video/")) return;
    setVideoFile(f);
    setVideoUrl(URL.createObjectURL(f));
  };

  const togglePlay = () => {
    const vd = videoRef.current;
    if (!vd) return;
    if (playing) { vd.pause(); setPlaying(false); }
    else { vd.play(); setPlaying(true); }
  };

  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - r.left) / r.width;
    if (videoRef.current) videoRef.current.currentTime = ratio * (videoRef.current.duration||0);
  };

  const generateTags = async () => {
    setTagLoading(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:600,
          system:"Sadece JSON yanıt ver, başka hiçbir şey yazma.",
          messages:[{ role:"user", content:`TikTok/Instagram uzmanısın. 2025-2026 viral Türkçe hüzünlü içerik için hashtag üret.
Video: "${desc||'hüzünlü duygusal video'}"
Sadece JSON: {"tags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10","#tag11","#tag12","#tag13","#tag14","#tag15"]}` }]
        })
      });
      const d = await r.json();
      const parsed = JSON.parse((d.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
      setTags(parsed.tags || []);
    } catch { alert("Hata oluştu"); }
    setTagLoading(false);
  };

  const cp = (txt, key) => {
    navigator.clipboard.writeText(txt);
    setCopied(key);
    setTimeout(()=>setCopied(""),1600);
  };

  const download = async () => {
    const cv = canvasRef.current, vd = videoRef.current;
    if (!cv || !vd) return;
    setDlActive(true); setDlProg(0);
    try {
      const cvStream = cv.captureStream(30);
      const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      try {
        const vs = vd.captureStream ? vd.captureStream() : null;
        if (vs?.getAudioTracks().length) {
          const src = audioCtx.createMediaStreamSource(vs);
          src.connect(dest);
        }
      } catch(e) { console.warn(e); }

      const final = new MediaStream([...cvStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus" : "video/webm";
      const rec = new MediaRecorder(final, { mimeType: mime, videoBitsPerSecond: 9_000_000 });
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data.size>0) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href=url;
        a.download=`video_${Date.now()}.webm`; a.click();
        URL.revokeObjectURL(url);
        setDlActive(false); setDlProg(0); audioCtx.close();
      };
      vd.currentTime = 0; await vd.play(); setPlaying(true);
      rec.start(100);
      const duration = (vd.duration||10) * 1000;
      const t0 = Date.now();
      const iv = setInterval(()=>setDlProg(Math.min(92,((Date.now()-t0)/duration)*100)),250);
      setTimeout(()=>{ clearInterval(iv); rec.stop(); vd.pause(); setPlaying(false); }, duration+700);
    } catch(err) {
      alert("İndirme hatası: "+err.message); setDlActive(false);
    }
  };

if (!videoUrl) return (
    <div className="app">
      <style>{CSS}</style>
      <nav className="nav">
        <div className="logo">Hisset <span>&amp; Viral Ol</span></div>
      </nav>
      <div className="main">
        <div className="upload-wrap fade">
          <div className="upload-title">
            <h1>Video <span>Editörü</span></h1>
            <p>Videoyu yükle — arka plan, metin, hashtag, indir</p>
          </div>
          <div
            className={`drop-zone ${drag?"drag":""}`}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);loadVideo(e.dataTransfer.files[0]);}}
            onClick={()=>fileRef.current?.click()}
          >
            <span className="drop-icon">🎬</span>
            <h3>Videoyu buraya sürükle</h3>
            <p>veya tıkla • MP4, MOV, WEBM</p>
          </div>
          <input ref={fileRef} type="file" accept="video/*" style={{display:"none"}}
            onChange={e=>loadVideo(e.target.files[0])} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <style>{CSS}</style>
      <nav className="nav">
        <div className="logo">Hisset <span>&amp; Viral Ol</span></div>
        <button
          className="btn-copy"
          style={{padding:"8px 14px"}}
          onClick={()=>{setVideoUrl(null);setVideoFile(null);setTags([]);setText("");}}
        >↩ Yeni Video</button>
      </nav>

      <div className="main fade">
        <div className="editor">
          {/* VIDEO */}
          <div className="video-col">
            <div className="canvas-wrap">
              <video ref={videoRef} src={videoUrl} playsInline preload="auto" />
              <canvas ref={canvasRef} />
              <div className="controls">
                <div className="ctrl-row">
                  <button className="play-btn" onClick={togglePlay}>{playing?"⏸":"▶"}</button>
                  <div className="pbar" onClick={seek}>
                    <div className="pfill" style={{width:`${prog*100}%`}} />
                  </div>
                  <span className="ttime">{fmt(curT)} / {fmt(dur)}</span>
                </div>
              </div>
            </div>

            {/* DOWNLOAD */}
            <div style={{marginTop:12}}>
              {dlActive ? (
                <div className="dl-prog">
                  <p style={{fontSize:13,fontWeight:600}}>🎬 Video kaydediliyor...</p>
                  <div className="dl-pbar"><div className="dl-pfill" style={{width:`${dlProg}%`}} /></div>
                  <p style={{fontSize:11,color:"var(--m)"}}>Video otomatik oynatılıyor, bitince indirilecek</p>
                </div>
              ) : (
                <>
                  <button className="dl-btn" onClick={download}>⬇ Videoyu İndir</button>
                  <p className="note">📱 Android Chrome'da direkt açılır. iPhone'da CapCut veya Dosyalar uygulamasında aç.</p>
                </>
              )}
            </div>
          </div>

          {/* PANEL */}
          <div className="panel">
            <div className="tabs">
              {[["text","📝 METİN"],["bg","🎨 ARKA PLAN"],["hash","# HASHTAG"]].map(([k,l])=>(
                <button key={k} className={`tab ${tab===k?"on":""}`} onClick={()=>setTab(k)}>{l}</button>
              ))}
            </div>

            {/* TEXT TAB */}
            {tab === "text" && (
              <div className="card">
                <div className="clabel">Metin</div>
                <textarea rows={3} placeholder="Videoya eklenecek yazı..." value={text} onChange={e=>setText(e.target.value)} />

                <div className="clabel">Yazı Tipi</div>
                <div className="font-grid" style={{marginBottom:10}}>
                  {FONTS.map((f,i)=>(
                    <div key={i} className={`font-chip ${fontIdx===i?"sel":""}`}
                      style={{fontFamily:f.value,fontSize:13}}
                      onClick={()=>setFontIdx(i)}>
                      {f.label}
                    </div>
                  ))}
                </div>

                <div className="row2">
                  <div className="fld">
                    <label>Konum</label>
                    <select value={textPos} onChange={e=>setTextPos(e.target.value)}>
                      {POS_OPTIONS.map(p=><option key={p.v} value={p.v}>{p.l}</option>)}
                    </select>
                  </div>
                  <div className="fld">
                    <label>Boyut — {fontSize}px</label>
                    <input type="range" min={16} max={80} value={fontSize} onChange={e=>setFontSize(e.target.value)} />
                  </div>
                </div>

                <div className="clabel" style={{marginTop:4}}>Renk</div>
                <div className="color-row">
                  {TEXT_COLORS.map(c=>(
                    <div key={c} className={`cchip ${textColor===c?"sel":""}`}
                      style={{background:c,boxShadow:`0 0 0 1px rgba(255,255,255,.15)`}}
                      onClick={()=>setTextColor(c)} />
                  ))}
                  <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)}
                    style={{width:26,height:26,border:"1px solid var(--b)",borderRadius:"50%",cursor:"pointer",padding:1,background:"none"}} />
                </div>

                <button className={`toggle-btn ${showBg?"on":""}`} onClick={()=>setShowBg(!showBg)} style={{marginTop:6}}>
                  {showBg ? "✓ Metin Arka Planı Açık" : "Metin Arka Planı Kapalı"}
                </button>
              </div>
            )}

            {/* BG TAB */}
            {tab === "bg" && (
              <div className="card">
                <div className="clabel">Arka Plan Efekti</div>
                <div className="bg-grid">
                  {BACKGROUNDS.map(b=>(
                    <div key={b.id} className={`bg-chip ${bgEffect===b.id?"sel":""}`} onClick={()=>setBgEffect(b.id)}>
                      <span className="bg-icon">{b.icon}</span>
                      <span className="bg-lbl">{b.label}</span>
                    </div>
                  ))}
                </div>
                <p className="note" style={{marginTop:10}}>Efekt anında önizlemede görünür</p>
              </div>
            )}

            {/* HASHTAG TAB */}
            {tab === "hash" && (
              <div className="card">
                <div className="clabel">Hashtag Üret</div>
                <input
                  className="desc-input"
                  placeholder="Video ne hakkında? Ör: gece yağmur, özlem..."
                  value={desc} onChange={e=>setDesc(e.target.value)}
                />
                <button className="btn-ai" onClick={generateTags} disabled={tagLoading}>
                  {tagLoading ? "Üretiliyor..." : "✦ Hashtag Üret"}
                </button>
                {tagLoading && <div className="lbar"><div className="lbar-f"/></div>}

                {tags.length > 0 && (
                  <>
                    <div className="top-row" style={{marginTop:14}}>
                      <span style={{fontSize:10,color:"var(--m)",letterSpacing:".08em",textTransform:"uppercase"}}>{tags.length} hashtag</span>
                      <button className="btn-copy" onClick={()=>cp(tags.join(" "),"all")}>
                        {copied==="all"?"✓ Kopyalandı":"Hepsini Kopyala"}
                      </button>
                    </div>
                    <div className="hcloud">
                      {tags.map((h,i)=>(
                        <span key={i} className={`htag ${copied===h?"cp":""}`} onClick={()=>cp(h,h)}>
                          {copied===h?"✓":h}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
