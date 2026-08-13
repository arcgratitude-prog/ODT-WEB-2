<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ODT — Official Dance Theory</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Syne:wght@300;400;600&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#030303;--surface:#0a0a0a;--surface2:#0f0f0f;
  --border:rgba(255,255,255,0.06);--white:#f0f0f0;
  --muted:rgba(240,240,240,0.62);--dim:rgba(240,240,240,0.38);
  --neon-blue:#00cfff;--neon-red:#ff2d55;--neon-gold:#ffb800;
  --invasion:#00cfff;--invasion-glow:rgba(0,207,255,0.15);
  --locura:#ff2d55;--locura-glow:rgba(255,45,85,0.15);
  --accent:var(--invasion);--accent-glow:var(--invasion-glow);
}

html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--white);font-family:'Syne',sans-serif;font-weight:300;min-height:100vh;overflow-x:hidden}

body::after{content:'';position:fixed;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.028;pointer-events:none;z-index:999}

/* ── PAGE SWITCHING ── */
.page{display:none}
.page.active{display:block}

/* ── NAV ── */
nav{
  position:fixed;top:0;left:0;right:0;z-index:50;
  padding:1.2rem 5vw;
  display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px solid var(--border);
  background:rgba(3,3,3,0.94);
  backdrop-filter:blur(20px);
}
.nav-logo{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:.25em;color:var(--white);text-decoration:none;text-shadow:0 0 20px rgba(0,207,255,.5);transition:text-shadow .3s}
.nav-logo:hover{text-shadow:0 0 30px rgba(0,207,255,.9),0 0 60px rgba(0,207,255,.4)}
.nav-right{display:flex;align-items:center;gap:0}

/* Nav page switcher tabs */
.nav-tab{
  font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--dim);padding:0.45rem 1.1rem;
  background:none;border:none;cursor:pointer;
  position:relative;transition:color .25s;
  font-family:'Syne',sans-serif;font-weight:300;
}
.nav-tab::after{
  content:'';position:absolute;bottom:-1px;left:0;right:0;
  height:1px;background:var(--neon-blue);
  transform:scaleX(0);transform-origin:left;transition:transform .3s ease;
  box-shadow:0 0 6px var(--neon-blue);
}
.nav-tab.active{color:var(--white)}
.nav-tab.active::after{transform:scaleX(1)}

.nav-pill{
  font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;
  border:1px solid rgba(0,207,255,.3);color:var(--neon-blue);
  padding:.4rem .9rem;text-decoration:none;margin-left:1.5rem;
  transition:all .25s;text-shadow:0 0 8px rgba(0,207,255,.4);
  box-shadow:0 0 8px rgba(0,207,255,.1) inset;
}
.nav-pill:hover{background:rgba(0,207,255,.08);box-shadow:0 0 20px rgba(0,207,255,.2) inset,0 0 20px rgba(0,207,255,.15)}

/* ── HERO ── */
.hero{
  min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  padding:8rem 5vw 5rem;position:relative;overflow:hidden;
}
.hero::before{
  content:'';position:absolute;inset:0;
  background-image:linear-gradient(rgba(0,207,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,207,255,.04) 1px,transparent 1px);
  background-size:70px 70px;pointer-events:none;z-index:0;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%);
  -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%);
}
.orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(60px)}
.orb-1{width:50vw;height:50vw;background:radial-gradient(circle,rgba(0,207,255,.12) 0%,transparent 70%);bottom:-10%;right:-10%;z-index:0;animation:drift1 9s ease-in-out infinite}
.orb-2{width:30vw;height:30vw;background:radial-gradient(circle,rgba(255,45,85,.08) 0%,transparent 70%);top:20%;left:-5%;z-index:0;animation:drift2 12s ease-in-out infinite}
@keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(-3%,3%)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(3%,-4%)}}
.hero-sweep{position:absolute;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,rgba(0,207,255,.25),transparent);animation:sweep 12s ease-in-out infinite;pointer-events:none;z-index:2}
@keyframes sweep{0%{top:5%;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:95%;opacity:0}}
.hud{position:absolute;width:28px;height:28px;pointer-events:none;z-index:3}
.hud.tl{top:7rem;left:5vw;border-top:1px solid rgba(0,207,255,.2);border-left:1px solid rgba(0,207,255,.2)}
.hud.tr{top:7rem;right:5vw;border-top:1px solid rgba(0,207,255,.2);border-right:1px solid rgba(0,207,255,.2)}
.hud.bl{bottom:4rem;left:5vw;border-bottom:1px solid rgba(0,207,255,.2);border-left:1px solid rgba(0,207,255,.2)}
.hud.br{bottom:4rem;right:5vw;border-bottom:1px solid rgba(0,207,255,.2);border-right:1px solid rgba(0,207,255,.2)}
.hero-content{position:relative;z-index:4;max-width:900px}
.hero-eyebrow{font-size:.58rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-blue);margin-bottom:1.5rem;text-shadow:0 0 12px rgba(0,207,255,.6);animation:fadeUp .8s ease both}
.hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(3.5rem,9vw,8.5rem);line-height:.92;letter-spacing:.02em;margin-bottom:2.5rem;animation:fadeUp .8s .1s ease both}
.t-solid{display:block;color:var(--white)}
.t-neon{display:block;-webkit-text-stroke:1.5px var(--neon-blue);color:transparent;transition:color .6s,filter .6s;filter:none}
.t-neon.lit{color:var(--neon-blue);filter:drop-shadow(0 0 12px rgba(0,207,255,.8)) drop-shadow(0 0 30px rgba(0,207,255,.4))}
.hero-sub{max-width:46ch;font-size:.88rem;line-height:2;color:var(--muted);margin-bottom:3rem;animation:fadeUp .8s .2s ease both}
.hero-ctas{display:flex;gap:1rem;flex-wrap:wrap;animation:fadeUp .8s .3s ease both}
.btn-primary{font-family:'Bebas Neue',sans-serif;font-size:.9rem;letter-spacing:.2em;padding:.85rem 2rem;text-decoration:none;background:transparent;color:var(--neon-blue);border:1px solid var(--neon-blue);text-shadow:0 0 10px rgba(0,207,255,.5);box-shadow:0 0 15px rgba(0,207,255,.1) inset,0 0 15px rgba(0,207,255,.08);transition:all .3s;position:relative;overflow:hidden}
.btn-primary::before{content:'';position:absolute;inset:0;background:var(--neon-blue);opacity:0;transition:opacity .3s}
.btn-primary:hover::before{opacity:.1}
.btn-primary:hover{box-shadow:0 0 30px rgba(0,207,255,.25) inset,0 0 30px rgba(0,207,255,.2);text-shadow:0 0 20px rgba(0,207,255,.9)}
.btn-primary span{position:relative;z-index:1}
.btn-ghost{font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--dim);text-decoration:none;display:flex;align-items:center;gap:.8rem;transition:color .2s;align-self:center}
.btn-ghost:hover{color:var(--white)}
.ghost-line{width:2.5rem;height:1px;background:var(--dim);transition:background .2s}
.btn-ghost:hover .ghost-line{background:var(--white)}

/* ── MANIFESTO ── */
.manifesto{padding:7rem 5vw;position:relative;overflow:hidden;border-top:1px solid var(--border)}
.manifesto::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(255,45,85,.04) 0%,transparent 100%);pointer-events:none}
.manifesto-inner{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1.4fr;gap:6rem;align-items:center}
.manifesto-label{font-size:.56rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-red);margin-bottom:1.5rem;text-shadow:0 0 12px rgba(255,45,85,.5)}
.manifesto-left h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,5vw,4.5rem);line-height:.95;letter-spacing:.03em;color:var(--white)}
.neon-word{display:inline-block;-webkit-text-stroke:1px var(--neon-red);color:transparent;transition:color .7s,filter .7s;filter:none}
.neon-word.lit{color:var(--neon-red);filter:drop-shadow(0 0 10px rgba(255,45,85,.9)) drop-shadow(0 0 25px rgba(255,45,85,.4))}
.manifesto-right{}
.manifesto-text{font-size:.88rem;line-height:2;color:var(--muted);margin-bottom:2rem}
.glow-word{color:var(--white);font-weight:400;transition:color .5s,text-shadow .5s}
.glow-word.lit{color:var(--neon-gold);text-shadow:0 0 12px rgba(255,184,0,.7),0 0 25px rgba(255,184,0,.3)}
.manifesto-quote{border-left:2px solid var(--neon-red);padding-left:1.5rem;font-family:'Instrument Serif',serif;font-style:italic;font-size:1.05rem;line-height:1.7;color:rgba(240,240,240,.75);box-shadow:-8px 0 20px rgba(255,45,85,.08)}

/* ── EVENTS SECTION ── */
.events{padding:0 5vw 8rem}
.section-header{margin-bottom:3rem;display:flex;align-items:baseline;gap:1.5rem}
.section-label{font-size:.56rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-blue);text-shadow:0 0 10px rgba(0,207,255,.5)}
.section-line{flex:1;height:1px;background:var(--border)}
.tab-row{display:flex;border-bottom:1px solid var(--border);margin-bottom:4rem;position:sticky;top:60px;background:var(--bg);z-index:40}
.ev-tab{flex:1;padding:1.4rem 1rem;background:none;border:none;font-family:'Bebas Neue',sans-serif;font-size:clamp(1.1rem,3vw,1.75rem);letter-spacing:.12em;color:var(--dim);cursor:pointer;transition:color .3s,text-shadow .3s;position:relative;text-align:left}
.ev-tab::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent);box-shadow:0 0 8px var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .35s ease}
.ev-tab.active{color:var(--white)}
.ev-tab.active::after{transform:scaleX(1)}
.ev-tab-sub{display:block;font-family:'Syne',sans-serif;font-size:.5rem;letter-spacing:.25em;text-transform:uppercase;font-weight:300;color:rgba(240,240,240,.38);margin-top:.2rem}
.ev-tab.active .ev-tab-sub{color:var(--muted)}
#tab-invasion.active{text-shadow:0 0 20px rgba(0,207,255,.4)}
#tab-locura.active{text-shadow:0 0 20px rgba(255,45,85,.4)}
.panel{display:none}.panel.active{display:block}
.panel-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:5rem;align-items:start}

/* Hollow neon event name */
.ev-name{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,7vw,6.5rem);
  letter-spacing:.04em;line-height:.88;margin-bottom:2.5rem;
  -webkit-text-stroke:1.5px var(--accent);color:transparent;
  transition:filter .6s;filter:none;
}
.ev-name.lit{filter:drop-shadow(0 0 8px rgba(0,207,255,.7)) drop-shadow(0 0 25px rgba(0,207,255,.4)) drop-shadow(0 0 50px rgba(0,207,255,.2))}

.info-grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border);margin-bottom:2.5rem}
.info-cell{padding:1.1rem 1.4rem;border-right:1px solid var(--border);border-bottom:1px solid var(--border)}
.info-cell:nth-child(even){border-right:none}
.info-cell.full{grid-column:1/-1;border-right:none;border-bottom:none}
.info-cell:nth-last-child(2):not(.full){border-bottom:none}
.info-lbl{font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--dim);margin-bottom:.35rem}
.info-val{font-size:.86rem;color:rgba(240,240,240,.92);letter-spacing:.03em}
.ev-desc{font-size:.82rem;line-height:1.9;color:var(--muted);max-width:44ch}

/* ── CLASSES PAGE ── */
.classes-page{padding:8rem 5vw 6rem}

.classes-hero{
  padding-bottom:5rem;border-bottom:1px solid var(--border);margin-bottom:5rem;
  display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:end;
}
.classes-eyebrow{font-size:.58rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-gold);margin-bottom:1.2rem;text-shadow:0 0 12px rgba(255,184,0,.5)}
.classes-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,8vw,7rem);line-height:.9;letter-spacing:.02em}
.classes-title .ct-outline{-webkit-text-stroke:1.5px var(--neon-gold);color:transparent;transition:filter .6s;filter:none}
.classes-title .ct-outline.lit{filter:drop-shadow(0 0 10px rgba(255,184,0,.8)) drop-shadow(0 0 30px rgba(255,184,0,.4))}
.classes-sub{font-size:.85rem;line-height:1.9;color:var(--muted);max-width:38ch;align-self:end}

/* Instructors */
.instructors-label{font-size:.56rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-gold);text-shadow:0 0 10px rgba(255,184,0,.4);margin-bottom:2rem}
.instructors-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-bottom:5rem}

.instructor-card{
  background:var(--surface);
  padding:2.5rem 2rem;
  border:1px solid var(--border);
  position:relative;overflow:hidden;
  transition:border-color .3s;
}
.instructor-card:hover{border-color:rgba(255,184,0,.25)}
.instructor-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(to right,transparent,var(--neon-gold),transparent);
  opacity:0;transition:opacity .3s;
}
.instructor-card:hover::before{opacity:1}

/* Neon initial/avatar */
.instructor-avatar{
  width:64px;height:64px;
  border:1px solid rgba(255,184,0,.3);
  display:flex;align-items:center;justify-content:center;
  font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.05em;
  color:var(--neon-gold);
  text-shadow:0 0 15px rgba(255,184,0,.6);
  box-shadow:0 0 20px rgba(255,184,0,.08) inset;
  margin-bottom:1.5rem;
  transition:box-shadow .3s,text-shadow .3s;
}
.instructor-card:hover .instructor-avatar{
  box-shadow:0 0 25px rgba(255,184,0,.2) inset;
  text-shadow:0 0 25px rgba(255,184,0,.9);
}
.instructor-name{font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:.06em;color:var(--white);margin-bottom:.4rem}
.instructor-role{font-size:.58rem;letter-spacing:.25em;text-transform:uppercase;color:var(--neon-gold);text-shadow:0 0 8px rgba(255,184,0,.4);margin-bottom:1rem}
.instructor-bio{font-size:.78rem;line-height:1.8;color:var(--muted)}

/* Schedule */
.schedule-label{font-size:.56rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-blue);text-shadow:0 0 10px rgba(0,207,255,.4);margin-bottom:2rem}
.schedule-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1px;margin-bottom:5rem}

.class-card{
  background:var(--surface);border:1px solid var(--border);
  padding:1.75rem;
  position:relative;overflow:hidden;
  transition:border-color .3s,background .3s;
  cursor:default;
}
.class-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--neon-blue);opacity:0;transition:opacity .3s}
.class-card:hover{border-color:rgba(0,207,255,.2);background:rgba(0,207,255,.03)}
.class-card:hover::before{opacity:1}

.class-day{font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:var(--neon-blue);text-shadow:0 0 8px rgba(0,207,255,.5);margin-bottom:.5rem}
.class-name{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:.08em;color:var(--white);margin-bottom:.3rem}
.class-time{font-size:.65rem;color:var(--muted);margin-bottom:.8rem;letter-spacing:.05em}
.class-instructor{font-size:.58rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,184,0,.7);text-shadow:0 0 6px rgba(255,184,0,.3)}
.class-level{
  display:inline-block;margin-top:.8rem;
  font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;
  border:1px solid var(--border);padding:.25rem .7rem;color:var(--dim);
}

/* Class registration form */
.class-register{
  background:var(--surface);border:1px solid var(--border);max-width:560px;
}
.register-label{font-size:.56rem;letter-spacing:.4em;text-transform:uppercase;color:var(--neon-gold);text-shadow:0 0 10px rgba(255,184,0,.4);margin-bottom:2rem}
.register-head{padding:1.4rem 1.8rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.register-head-title{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:.15em}
.register-head-sub{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.register-body{padding:1.75rem}

.register-layout{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;margin-bottom:5rem}

/* ── SHARED FORM STYLES ── */
.form-wrap{background:var(--surface);border:1px solid var(--border)}
.form-head{padding:1.4rem 1.8rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.form-head-title{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:.15em}
.form-head-ev{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.form-body{padding:1.75rem}
.tier-list{display:flex;flex-direction:column;gap:3px;margin-bottom:1.5rem}
.tier-opt{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:var(--surface2);border:1px solid var(--border);cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s;gap:.9rem;user-select:none;-webkit-tap-highlight-color:rgba(0,207,255,.15);touch-action:manipulation;min-height:56px}
.tier-opt:hover{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.03)}
.tier-opt.sel{border-color:var(--accent);background:var(--accent-glow,rgba(0,207,255,.08));box-shadow:0 0 12px rgba(0,0,0,0.2) inset}
.tier-dot{width:11px;height:11px;border:1px solid rgba(255,255,255,.2);border-radius:50%;flex-shrink:0;position:relative;transition:border-color .2s,box-shadow .2s}
.tier-opt.sel .tier-dot{border-color:var(--accent);box-shadow:0 0 6px var(--accent)}
.tier-opt.sel .tier-dot::after{content:'';position:absolute;inset:2px;border-radius:50%;background:var(--accent);box-shadow:0 0 4px var(--accent)}
.tier-txt{flex:1}
.tier-n{font-size:.86rem;letter-spacing:.05em;color:rgba(240,240,240,.88);transition:color .2s}
.tier-opt.sel .tier-n{color:var(--white)}
.tier-d{font-size:.68rem;color:var(--dim);margin-top:.2rem}
.tier-p{font-family:'Instrument Serif',serif;font-size:1.5rem;color:var(--muted);white-space:nowrap;transition:color .2s,text-shadow .2s}
.tier-opt.sel .tier-p{color:var(--accent);text-shadow:0 0 12px rgba(0,207,255,.4)}
.f-row{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.f-group{margin-bottom:.7rem;display:flex;flex-direction:column;gap:.38rem}
.f-label{font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
.f-input{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--white);font-family:'Syne',sans-serif;font-size:.84rem;font-weight:300;padding:.75rem .9rem;outline:none;transition:border-color .2s,box-shadow .2s}
.f-input:focus{border-color:var(--accent);box-shadow:0 0 10px rgba(0,207,255,.12)}
.f-input::placeholder{color:rgba(240,240,240,.16)}
.qty-wrap{display:flex;align-items:center;border:1px solid var(--border);background:var(--bg)}
.qty-btn{background:none;border:none;color:var(--muted);width:40px;height:40px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .2s,background .2s}
.qty-btn:hover{color:var(--white);background:rgba(255,255,255,.04)}
.qty-n{flex:1;text-align:center;font-size:.78rem;color:rgba(240,240,240,.82)}
.card-wrap{background:var(--bg);border:1px solid var(--border);padding:.75rem .9rem;transition:border-color .2s,box-shadow .2s;margin-bottom:.7rem}
.card-wrap.focused{border-color:var(--accent);box-shadow:0 0 10px rgba(0,207,255,.12)}
.card-err{font-size:.58rem;color:#ff6b88;min-height:1rem;letter-spacing:.04em}
.summary{background:var(--bg);border:1px solid var(--border);padding:.9rem 1.1rem;margin-bottom:1.1rem}
.s-row{display:flex;justify-content:space-between;font-size:.68rem;color:var(--muted);margin-bottom:.35rem;letter-spacing:.04em}
.s-total{display:flex;justify-content:space-between;align-items:baseline;padding-top:.65rem;border-top:1px solid var(--border);margin-top:.5rem}
.s-total-lbl{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
.s-total-amt{font-family:'Instrument Serif',serif;font-size:1.45rem;color:var(--white)}
.alert{font-size:.6rem;letter-spacing:.04em;padding:.7rem .9rem;margin-bottom:.9rem;display:none;line-height:1.6}
.alert.err{background:rgba(255,45,85,.08);border:1px solid rgba(255,45,85,.2);color:#ff6b88;display:block}
.submit{width:100%;background:transparent;border:1px solid var(--accent);color:var(--accent);font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:.25em;padding:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;position:relative;overflow:hidden;transition:box-shadow .3s,transform .2s;text-shadow:0 0 8px rgba(0,207,255,.4);box-shadow:0 0 12px rgba(0,207,255,.08) inset}
.submit::before{content:'';position:absolute;inset:0;background:var(--accent);opacity:0;transition:opacity .3s}
.submit:hover:not(:disabled)::before{opacity:.1}
.submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 25px rgba(0,207,255,.18) inset,0 0 25px rgba(0,207,255,.12)}
.submit:disabled{opacity:.3;cursor:not-allowed}
.submit .sp{width:13px;height:13px;border:1.5px solid rgba(240,240,240,.2);border-top-color:var(--white);border-radius:50%;animation:spin .6s linear infinite;display:none;position:relative;z-index:1}
.submit .sl{position:relative;z-index:1}
.submit.ld .sp{display:block}
.submit.ld .sl{opacity:.5}
.secure{display:flex;align-items:center;justify-content:center;gap:.4rem;font-size:.5rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-top:.8rem}
.success-panel{display:none;padding:3rem 1.8rem;text-align:center;flex-direction:column;align-items:center;gap:1rem}
.success-panel.show{display:flex}
.success-icon{width:46px;height:46px;border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:1rem;margin-bottom:.4rem;box-shadow:0 0 20px rgba(0,207,255,.18)}
.success-panel h3{font-family:'Bebas Neue',sans-serif;font-size:1.9rem;letter-spacing:.1em}
.success-panel p{font-size:.66rem;color:var(--muted);line-height:1.8;max-width:30ch}

/* ── FOOTER ── */
footer{border-top:1px solid var(--border);padding:2rem 5vw;display:flex;justify-content:space-between;align-items:center}
.foot-logo{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:.22em;color:var(--neon-blue);text-shadow:0 0 15px rgba(0,207,255,.4)}
.foot-r{font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim)}

/* ══════════════════════════════════════
   CLASSES PAGE
══════════════════════════════════════ */

#page-classes { background: var(--bg); }
#page-events  { background: var(--bg); }

.cl-page-wrap { padding: 8rem 5vw 6rem; }

/* ── Hero ── */
.cl-hero-simple {
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4rem;
}
.cl-eyebrow {
  font-size: .56rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--neon-gold); text-shadow: 0 0 10px rgba(255,184,0,.4);
  margin-bottom: 1.2rem; display: block;
}
.cl-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: .9; letter-spacing: .03em;
  color: var(--white);
  margin-bottom: .8rem;
}
.cl-hero-title .cl-hollow {
  -webkit-text-stroke: 1.5px var(--neon-blue);
  color: transparent;
  transition: filter .6s;
}
.cl-hollow.lit {
  filter: drop-shadow(0 0 10px rgba(0,207,255,.9)) drop-shadow(0 0 30px rgba(0,207,255,.4));
}
.cl-hero-sub {
  font-size: .75rem; line-height: 1.9;
  color: var(--muted); max-width: 48ch;
}

/* ── Course meta strip ── */
.cl-meta-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--border);
  margin-bottom: 4rem;
}
.cl-meta-cell {
  padding: 1.4rem 1.6rem;
  border-right: 1px solid var(--border);
}
.cl-meta-cell:last-child { border-right: none; }
.cl-meta-lbl {
  font-size: .5rem; letter-spacing: .3em; text-transform: uppercase;
  color: var(--dim); margin-bottom: .4rem;
}
.cl-meta-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem; letter-spacing: .06em;
  color: var(--white);
}
.cl-meta-val.accent { color: var(--neon-gold); text-shadow: 0 0 10px rgba(255,184,0,.4); }

/* ── Class cards ── */
.cl-cards-label {
  font-size: .56rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--neon-blue); text-shadow: 0 0 10px rgba(0,207,255,.4);
  margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;
}
.cl-cards-label::after { content:''; flex:1; height:1px; background: var(--border); }

.cl-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 4rem; }

.cl-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 2.5rem;
  position: relative; overflow: hidden;
  transition: border-color .25s;
}
.cl-card:hover { border-color: rgba(255,255,255,.12); }

/* Color accent bar */
.cl-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  opacity: 0; transition: opacity .3s;
}
.cl-card:hover::before { opacity: 1; }
.cl-card-blue::before  { background: var(--neon-blue); box-shadow: 0 0 8px var(--neon-blue); }
.cl-card-red::before   { background: var(--neon-red);  box-shadow: 0 0 8px var(--neon-red); }

.cl-card-time {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem; letter-spacing: .06em;
  margin-bottom: .2rem; line-height: 1;
}
.cl-card-blue .cl-card-time { color: var(--neon-blue); text-shadow: 0 0 15px rgba(0,207,255,.5); }
.cl-card-red  .cl-card-time { color: var(--neon-red);  text-shadow: 0 0 15px rgba(255,45,85,.5); }

.cl-card-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem; letter-spacing: .04em;
  color: var(--white); line-height: .95;
  margin-bottom: .3rem;
}
.cl-card-level {
  font-size: .54rem; letter-spacing: .25em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 1.4rem;
}
.cl-card-desc { font-size: .8rem; line-height: 1.85; color: var(--muted); max-width: 34ch; margin-bottom: 1.4rem; }
.cl-card-tags { display: flex; gap: .5rem; flex-wrap: wrap; }
.cl-card-tag {
  font-size: .5rem; letter-spacing: .15em; text-transform: uppercase;
  border: 1px solid var(--border); padding: .25rem .7rem; color: var(--dim);
}

/* ── Open house callout ── */
.cl-oh-callout {
  display: flex; align-items: flex-start; gap: 1.5rem;
  border: 1px solid rgba(0,207,255,.25);
  background: rgba(0,207,255,.04);
  padding: 1.5rem 2rem;
  margin-bottom: 4rem;
  position: relative;
}
.cl-oh-callout::before {
  content: ''; position: absolute; inset: -3px;
  border: 1px dashed rgba(0,207,255,.15); pointer-events: none;
}
.cl-oh-pill {
  font-family: 'Bebas Neue', sans-serif;
  font-size: .85rem; letter-spacing: .15em;
  color: var(--neon-blue); text-shadow: 0 0 10px rgba(0,207,255,.7);
  border: 1px solid rgba(0,207,255,.3);
  padding: .3rem .9rem; white-space: nowrap; flex-shrink: 0;
}
.cl-oh-body {}
.cl-oh-head { font-size: .8rem; color: var(--white); margin-bottom: .3rem; letter-spacing: .04em; }
.cl-oh-detail { font-size: .75rem; color: var(--muted); line-height: 1.7; }

/* ── Instructors ── */
.cl-instructors-label {
  font-size: .56rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--neon-gold); text-shadow: 0 0 10px rgba(255,184,0,.4);
  margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;
}
.cl-instructors-label::after { content:''; flex:1; height:1px; background: var(--border); }

.cl-instructors { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 4rem; }
.cl-instructor {
  display: flex; align-items: flex-start; gap: 1.5rem;
  padding: 2rem 2.5rem;
  background: var(--surface); border: 1px solid var(--border);
  transition: border-color .25s;
}
.cl-instructor:hover { border-color: rgba(255,184,0,.18); }
.cl-instructor-glyph {
  width: 110px; height: 110px; flex-shrink: 0;
  border: 1px solid rgba(255,184,0,.25);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem;
  color: var(--neon-gold); text-shadow: 0 0 15px rgba(255,184,0,.6);
  transition: box-shadow .25s;
}
.cl-instructor:hover .cl-instructor-glyph {
  box-shadow: 0 0 20px rgba(255,184,0,.2) inset;
}
.cl-instructor-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: .06em; color: var(--white); }
.cl-instructor-role { font-size: .54rem; letter-spacing: .2em; text-transform: uppercase; color: var(--neon-gold); opacity: .7; margin: .3rem 0 .7rem; }
.cl-instructor-bio { font-size: .78rem; line-height: 1.8; color: var(--muted); }
.cl-divider-v { display: none; }

/* ── Register ── */
.cl-register-label {
  font-size: .56rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--neon-gold); text-shadow: 0 0 10px rgba(255,184,0,.4);
  margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;
}
.cl-register-label::after { content:''; flex:1; height:1px; background: var(--border); }
.cl-register-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 4rem; align-items: start; }
.cl-detail-rows { display: flex; flex-direction: column; margin-bottom: 2rem; }
.cl-detail-row { display: flex; justify-content: space-between; align-items: baseline; padding: 1rem 0; border-bottom: 1px solid var(--border); gap: 1rem; }
.cl-dr-label { font-size: .56rem; letter-spacing: .2em; text-transform: uppercase; color: var(--dim); }
.cl-dr-value { font-size: .84rem; color: rgba(240,240,240,.9); text-align: right; }
.cl-dr-value.neon { color: var(--neon-gold); text-shadow: 0 0 8px rgba(255,184,0,.4); }

@keyframes spin { to { transform: rotate(360deg) } }

/* ── Responsive ── */
@media(max-width:820px){

  /* NAV */
  nav{padding:1rem 4vw}
  .nav-logo{font-size:1.2rem}
  .nav-tab{font-size:.52rem;padding:.4rem .7rem;letter-spacing:.12em}
  .nav-pill{display:none}

  /* HERO */
  .hero{padding:6rem 4vw 4rem;min-height:auto}
  .hero-eyebrow{font-size:.5rem;letter-spacing:.25em;margin-bottom:1rem}
  .hero-title{font-size:clamp(2.8rem,13vw,5rem);margin-bottom:1.8rem}
  .hero-sub{font-size:.72rem;margin-bottom:2rem;max-width:100%}
  .hero-ctas{gap:.8rem}
  .btn-primary{font-size:.8rem;padding:.75rem 1.5rem}
  .btn-ghost{font-size:.52rem}
  .hud{display:none}

  /* MANIFESTO */
  .manifesto{padding:4rem 4vw}
  .manifesto-inner{grid-template-columns:1fr;gap:2rem}
  .manifesto-left h2{font-size:clamp(2rem,9vw,3.5rem)}
  .manifesto-quote{font-size:.9rem}

  /* EVENTS */
  .events{padding:0 4vw 5rem}
  .tab-row{top:52px;overflow-x:auto;-webkit-overflow-scrolling:touch}
  .ev-tab{font-size:clamp(.9rem,4vw,1.4rem);padding:1.1rem .8rem;white-space:nowrap}
  .panel-grid{grid-template-columns:1fr;gap:2rem}
  .ev-name{font-size:clamp(2.5rem,10vw,5rem)}
  .info-grid{grid-template-columns:1fr 1fr}
  .info-cell:nth-child(even){border-right:none}
  .info-cell.full{border-right:none}

  /* FORMS */
  .f-row{grid-template-columns:1fr}
  .form-wrap{width:100%}
  .tier-opt{padding:.85rem 1rem}
  .tier-p{font-size:1.25rem}

  /* CLASSES PAGE */
  .cl-page-wrap{padding:6rem 4vw 4rem}
  .classes-hero{grid-template-columns:1fr;gap:2rem;padding-bottom:3rem;margin-bottom:3rem}
  .cl-hero-simple{padding-bottom:3rem;margin-bottom:3rem}
  .classes-title{font-size:clamp(2.5rem,10vw,5rem)}
  .cl-hero-title{font-size:clamp(2.5rem,10vw,5rem)}
  .cl-meta-strip{grid-template-columns:1fr 1fr}
  .cl-meta-cell:nth-child(2){border-right:none}
  .cl-meta-cell:nth-child(3){border-top:1px solid var(--border)}
  .cl-meta-cell:nth-child(4){border-top:1px solid var(--border);border-right:none}
  .cl-pricing-3col{grid-template-columns:1fr !important}
  .cl-cards{grid-template-columns:1fr}
  .cl-card{padding:1.75rem}
  .cl-instructors{grid-template-columns:1fr}
  .cl-instructor{flex-direction:column;gap:1rem;padding:1.5rem}
  .cl-instructor-glyph{width:80px;height:80px}
  .cl-register-grid{grid-template-columns:1fr;gap:2.5rem}
  .cl-register-label{font-size:.5rem}
  .cl-oh-callout{flex-direction:column;gap:1rem;padding:1.2rem 1.5rem}

  /* INSTRUCTOR PHOTO CARD */
  .cl-photo-bio-grid{
    grid-template-columns:1fr !important;
  }
  .cl-photo-bio-grid > div:first-child{
    aspect-ratio:4/3 !important;
  }

  /* FOOTER */
  footer{flex-direction:column;gap:.8rem;text-align:center;padding:1.5rem 4vw}
}
</style>
</head>
<body>

<!-- ── NAV ── -->
<nav>
  <a href="#" class="nav-logo" onclick="showPage('events');return false"><img src="data:image/png;base64,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Cck5KgC2RkqALAqALAqALAqALZGSoAtkjJAAnIyQAJyMkACSBkZAAZIyBIIyAJGSAAyAAAAAAjIyBJGSAAAAAAAAAAAAAAAAAAAAAAAAAAAAE5GSABYFRkCwIyMgSCMkgAAAGQAGRkABkZAAZGQAGRkABkZAAZAAAAAAAABGRkCQRkZAkEZGQJBUATkZIAE5IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnIyQAJyMkACcjJAAnIyQAJyMkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=" alt="ODT" style="height:38px;width:auto;filter:brightness(1.1)"></a>
  <div class="nav-right">
    <button class="nav-tab active" id="ntab-events"  onclick="showPage('events')">Events</button>
    <button class="nav-tab"        id="ntab-classes" onclick="showPage('classes')">Classes</button>
    <a href="#" class="nav-pill" id="nav-cta-btn">Get Tickets</a>
  </div>
</nav>

<!-- ══════════════════════════════════════════ -->
<!-- PAGE: EVENTS                              -->
<!-- ══════════════════════════════════════════ -->
<div class="page active" id="page-events">

  <!-- HERO -->
  <section class="hero">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="hero-sweep"></div>
    <div class="hud tl"></div><div class="hud tr"></div>
    <div class="hud bl"></div><div class="hud br"></div>
    <div class="hero-content">
      <div class="hero-eyebrow">Official Dance Theory · Tampa, FL</div>
      <h1 class="hero-title">
        <span class="t-solid">Tampa Bachata,</span>
        <span class="t-neon observe" data-effect="neon-blue">Evolving<br>Together.</span>
      </h1>
      <p class="hero-sub">Bachata socials and classes in Tampa, FL.</p>
      <div class="hero-ctas">
        <a href="#events" class="btn-primary"><span>Bachata Events</span></a>
        <a href="#manifesto" class="btn-ghost"><span class="ghost-line"></span>Who We Are</a>
      </div>
    </div>
  </section>

  <!-- MANIFESTO -->
  <section class="manifesto" id="manifesto">
    <div class="manifesto-inner">
      <div class="manifesto-left">
        <div class="manifesto-label">Who We Are</div>
        <h2>Elevating<br><span class="neon-word observe" data-effect="neon-red">Tampa.</span></h2>
      </div>
      <div class="manifesto-right">
        <div class="manifesto-text">
          ODT is bringing a <span class="glow-word observe" data-effect="gold">new standard</span> to Tampa's bachata scene —
          fresh music, open floors, and a community that actually wants to grow.
          Every level welcome. Every night a reason to come back.
        </div>
        <blockquote class="manifesto-quote">
          "The culture moves forward when people show up ready."
        </blockquote>
      </div>
    </div>
  </section>

  <!-- EVENTS -->
  <section class="events" id="events">
    <div class="section-header">
      <span class="section-label">Events</span>
      <span class="section-line"></span>
    </div>

    <div class="tab-row">
      <button class="ev-tab active" id="tab-invasion" onclick="switchEv('invasion')">
        Bachata Invasion <span class="ev-tab-sub">Every 2nd Friday · Jun 12</span>
      </button>
      <button class="ev-tab" id="tab-locura" onclick="switchEv('locura')">
        Bachata Locura <span class="ev-tab-sub">Special Event · May 17</span>
      </button>
    </div>

    <!-- INVASION -->
    <div class="panel active" id="panel-invasion">
      <div class="panel-grid">
        <div>
          <div class="ev-name observe" data-effect="ev-invasion">BACHATA<br>INVASION</div>
          <div class="info-grid">
            <div class="info-cell"><div class="info-lbl">Date</div><div class="info-val" id="invasion-date">June 12, 2025</div></div>
            <div class="info-cell"><div class="info-lbl">Day</div><div class="info-val" id="invasion-day">Monday</div></div>
            <div class="info-cell"><div class="info-lbl">Doors</div><div class="info-val" id="invasion-doors">8:00 PM</div></div>
            <div class="info-cell"><div class="info-lbl">Ends</div><div class="info-val" id="invasion-ends">1:00 AM</div></div>
            <div class="info-cell full"><div class="info-lbl">Venue</div><div class="info-val">The Dance Factory · 334 Westshore Plaza, Unit A10 · Tampa, FL 33609</div></div>
          </div>
          <p class="ev-desc" id="invasion-desc"></p>
        </div>
        <div class="form-wrap">
          <div class="form-head"><span class="form-head-title">Get Tickets</span><span class="form-head-ev">Bachata Invasion</span></div>
          <div class="success-panel" id="invasion-success"><div class="success-icon">✓</div><h3>You're in.</h3><p>Confirmation sent to your email. See you at Bachata Invasion.</p></div>
          <div class="form-body" id="invasion-form">
            <div class="alert" id="invasion-alert"></div>
            <div class="tier-list" id="invasion-tiers"></div>
            <div class="f-row">
              <div class="f-group"><label class="f-label">First Name</label><input class="f-input" type="text" id="invasion-first" placeholder="First"></div>
              <div class="f-group"><label class="f-label">Last Name</label><input class="f-input" type="text" id="invasion-last" placeholder="Last"></div>
            </div>
            <div class="f-group"><label class="f-label">Email</label><input class="f-input" type="email" id="invasion-email" placeholder="you@example.com"></div>
            <div class="f-group">
              <label class="f-label">Quantity</label>
              <div class="qty-wrap"><button class="qty-btn" onclick="chgQty('invasion',-1)">−</button><span class="qty-n" id="invasion-qty">1</span><button class="qty-btn" onclick="chgQty('invasion',1)">+</button></div>
            </div>
            <div class="f-group"><label class="f-label">Card Details</label><div class="card-wrap" id="invasion-cw"><div id="invasion-card"></div></div><div class="card-err" id="invasion-cerr"></div></div>
            <div class="summary">
              <div class="s-row"><span id="invasion-slbl">—</span><span id="invasion-ssub">—</span></div>
              <div class="s-row"><span>Processing fee (2.9% + $0.30)</span><span id="invasion-sfee">—</span></div>
              <div class="s-total"><span class="s-total-lbl">Total</span><span class="s-total-amt" id="invasion-stot">—</span></div>
            </div>
            <button class="submit" id="invasion-btn" onclick="doSubmit('invasion')"><div class="sp"></div><span class="sl">Get My Tickets</span></button>
            <div class="secure"><svg width="9" height="11" viewBox="0 0 9 11" fill="none"><rect x=".5" y="4.5" width="8" height="6" rx=".5" stroke="currentColor"/><path d="M2.5 4.5V3a2 2 0 014 0v1.5" stroke="currentColor"/></svg>Secured by Stripe · SSL Encrypted</div>
          </div>
        </div>
      </div>
    </div>

    <!-- LOCURA -->
    <div class="panel" id="panel-locura">
      <div class="panel-grid">
        <div>
          <div class="ev-name observe" data-effect="ev-locura">BACHATA<br>LOCURA</div>
          <div class="info-grid">
            <div class="info-cell"><div class="info-lbl">Date</div><div class="info-val" id="locura-date">May 17, 2025</div></div>
            <div class="info-cell"><div class="info-lbl">Day</div><div class="info-val" id="locura-day">Saturday</div></div>
            <div class="info-cell"><div class="info-lbl">Doors</div><div class="info-val" id="locura-doors">1:30 PM</div></div>
            <div class="info-cell"><div class="info-lbl">Ends</div><div class="info-val" id="locura-ends">9:00 PM</div></div>
            <div class="info-cell full"><div class="info-lbl">Venue</div><div class="info-val">Yuengling Draft Haus · 11109 N 30th St · Tampa, FL 33612</div></div>
          </div>
          <p class="ev-desc" id="locura-desc"></p>
        </div>
        <div class="form-wrap">
          <div class="form-head"><span class="form-head-title">Get Tickets</span><span class="form-head-ev">Bachata Locura</span></div>
          <div class="success-panel" id="locura-success"><div class="success-icon" style="border-color:var(--neon-red);color:var(--neon-red);box-shadow:0 0 20px rgba(255,45,85,.25)">✓</div><h3>You're in.</h3><p>Confirmation sent to your email. See you at Bachata Locura.</p></div>
          <div class="form-body" id="locura-form">
            <div class="alert" id="locura-alert"></div>
            <div class="tier-list" id="locura-tiers"></div>
            <div class="f-row">
              <div class="f-group"><label class="f-label">First Name</label><input class="f-input" type="text" id="locura-first" placeholder="First"></div>
              <div class="f-group"><label class="f-label">Last Name</label><input class="f-input" type="text" id="locura-last" placeholder="Last"></div>
            </div>
            <div class="f-group"><label class="f-label">Email</label><input class="f-input" type="email" id="locura-email" placeholder="you@example.com"></div>
            <div class="f-group">
              <label class="f-label">Quantity</label>
              <div class="qty-wrap"><button class="qty-btn" onclick="chgQty('locura',-1)">−</button><span class="qty-n" id="locura-qty">1</span><button class="qty-btn" onclick="chgQty('locura',1)">+</button></div>
            </div>
            <div class="f-group"><label class="f-label">Card Details</label><div class="card-wrap" id="locura-cw"><div id="locura-card"></div></div><div class="card-err" id="locura-cerr"></div></div>
            <div class="summary">
              <div class="s-row"><span id="locura-slbl">—</span><span id="locura-ssub">—</span></div>
              <div class="s-row"><span>Processing fee (2.9% + $0.30)</span><span id="locura-sfee">—</span></div>
              <div class="s-total"><span class="s-total-lbl">Total</span><span class="s-total-amt" id="locura-stot">—</span></div>
            </div>
            <button class="submit" id="locura-btn" onclick="doSubmit('locura')"><div class="sp"></div><span class="sl">Get My Tickets</span></button>
            <div class="secure"><svg width="9" height="11" viewBox="0 0 9 11" fill="none"><rect x=".5" y="4.5" width="8" height="6" rx=".5" stroke="currentColor"/><path d="M2.5 4.5V3a2 2 0 014 0v1.5" stroke="currentColor"/></svg>Secured by Stripe · SSL Encrypted</div>
          </div>
        </div>
      </div>
    </div>
  </section>

</div><!-- /page-events -->


<!-- ══════════════════════════════════════════ -->
<!-- PAGE: CLASSES                             -->
<!-- ══════════════════════════════════════════ -->
<div class="page" id="page-classes">
<div class="cl-page-wrap">

  <!-- Hero -->
  <div class="cl-hero-simple">
    <span class="cl-eyebrow">Official Dance Theory · Tampa, FL</span>
    <h1 class="cl-hero-title">
      Urban <span class="cl-hollow observe" data-effect="cl-main">Bachata</span><br>Classes
    </h1>
    <p class="cl-hero-sub">A 7-week course covering everything from the basics to advanced partner work — taught every Wednesday in Tampa. All levels welcome, no partner needed.</p>
  </div>

  <!-- Course meta -->
  <div class="cl-meta-strip">
    <div class="cl-meta-cell">
      <div class="cl-meta-lbl">Day</div>
      <div class="cl-meta-val">Every Wednesday</div>
    </div>
    <div class="cl-meta-cell">
      <div class="cl-meta-lbl">Duration</div>
      <div class="cl-meta-val accent" id="cl-duration">7 Weeks</div>
    </div>
    <div class="cl-meta-cell">
      <div class="cl-meta-lbl">Starts</div>
      <div class="cl-meta-val accent" id="cl-start-date">May 20th</div>
    </div>
    <div class="cl-meta-cell">
      <div class="cl-meta-lbl">Venue</div>
      <div class="cl-meta-val" id="cl-venue-name" style="font-family:'Syne',sans-serif;font-size:.75rem;font-weight:300">TBD · Tampa, FL</div>
    </div>
  </div>

  <!-- Class schedule cards -->
  <div class="cl-cards-label">Schedule</div>
  <div class="cl-cards">

    <div class="cl-card cl-card-blue">
      <div class="cl-card-time">7PM – 8PM</div>
      <div class="cl-card-name">Bachata Foundations</div>
      <div class="cl-card-level">Beginner Level</div>
      <div class="cl-card-desc">Build your foundation — footwork, timing, partner connection, and musicality. Start from zero or tighten what you already have.</div>
      <div class="cl-card-tags">
        <span class="cl-card-tag">No Partner Needed</span>
        <span class="cl-card-tag">Drop-ins Welcome</span>
      </div>
    </div>

    <div class="cl-card cl-card-red">
      <div class="cl-card-time">8PM – 9:30PM</div>
      <div class="cl-card-name">Urban Bachata</div>
      <div class="cl-card-level">Intermediate Level</div>
      <div class="cl-card-desc">Advanced combos, styling, and connection. The techniques that define modern urban bachata — come ready to push your movement further.</div>
      <div class="cl-card-tags">
        <span class="cl-card-tag">No Partner Needed</span>
        <span class="cl-card-tag">Lab Night · Final Week</span>
      </div>
    </div>

  </div>

  <!-- Open house callout -->
  <div class="cl-oh-callout">
    <div class="cl-oh-pill">Free</div>
    <div class="cl-oh-body">
      <div class="cl-oh-head">Open House — try before you commit</div>
      <div class="cl-oh-detail" id="cl-oh-detail">Date TBD · 7PM–9:30PM · Both classes free · No sign-up required</div>
    </div>
  </div>

 </body>
</html>  <!-- ══ INSTRUCTORS ══ -->
  <div class="cl-instructors-label">Instructors</div>
  <div class="cl-photo-bio-grid" style="display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border);margin-bottom:3rem;overflow:hidden;background:var(--surface)">

    <!-- Photo left -->
    <div style="background:var(--surface2);overflow:hidden;aspect-ratio:1/1;">
      <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAGkAaQDASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAwABAgQFBgcICf/EAEMQAAIBAwIEBAMEBwYGAgMBAAECAAMEEQUhBhIxQQcTUWEicYEUMpGhFSNCUmKxwTNygtHh8BYkQ1OSohclssPi8f/EABkBAQADAQEAAAAAAAAAAAAAAAABAwQCBf/EADIRAAICAQMDAQcDAwUBAAAAAAABAhEDEiExBEFREwUiYXGBkaEUMvCx0eEVJDPB8UL/2gAMAwEAAhEDEQA/APlhIyQUjJAHSMnaCkZO0AZYyQVjJAHSOkBI6QBkjpASOkAZI6QEjpAGWOsBY6wBljrAWOsAZIyQUjJAHSMnaCkZO0AdI6doCR07QBkjpASOkAZI6QEjpAHSMkFIyQBkjpASOkAZYywVjLAHSMkFIyQB0jJ2gpGTtAHTtGSCnaMkAdIyQUjJAHTtGTtBTtGTtAGSOkBI6QB0jJBSMkAdIydYKRk6wB16xlgr1jLAGTtHSAnaOkAWSSSAflgkZIKRkgDpGTtBSMnaAMsZIKxkgDpHSAkdIAyR0gJHSAMkdICR0gDLHWAsdYAyx1gLHWAMkZIKRkgDpM2xtKt7VFKiuTjJPYD1MwknpXh9oRoW5u61P9ZcYK5H3VHT6nr+Ery5NEbLMWN5JaUaShwXdsN6gLcoblVSTvMatode2qrTqEU3bZRU25p7kttYi3XIZSBuDNPqGi6dqNF1c0xsT8Y6zD+pyJ7m9dHBrZnk1fRr2zpebVo/q8451IIz6QUna09Ko07e40pnZadaoOVkOGU7EEH5icLf1f0TrL6ZeVud2AelWIA80H1x0PUfSacPUa3TMebA4My0jpASOk0lA6RkgpGSAMkdICR0gDLGWCsZYA6RkgpGSAOkZO0FIydoA6doyQU7RkgDpGSCkZIA6doydoKdoydoAyR0gJHSAOkZIKRkgDpGTrBSMnWAOvWMsFesZYAydo6QE7R0gCySSQD8sEjJBSMkAdIydoKRk7QBljJBWMkAdI6QEjpAGSOkBI6QBkjpASOkAZY6wFjrAGWOsBY6wBkjJBSMkA6LhLT7W/urlrtPMp0KJqBM45mzgDPbcidxofGNzZ6jSsLvSUt0falUpPzpgdJxmhcK61ruh6i2k3FW0qvyLTqomSSpyfpOj4V4W1+3vwdbqlrC2Afz6+Fqjb7pwAGyc9pmy6W3fY39NCSSaXJ6HV1elc7MQpP0mPf4WhgY33nDcV31s9Kq1Rai2dIDmZSck9sAbkzR6PfW9whGkcRXiVVz/wAvWbmVT6MrbiRHFtZqnNxlVHZjn+3rUxny1ZiPkCZ5lx9Qa8rNXQkvRwF9yN56Ppd4a9q9zd0jSqMGo1EB2HZmB9PT5zy/jKvcWdStZ1CHRskMOhB6GcY4+8Z88kza8N6hbalY29AU7k3JyOcbhsduXr+E2gGPcHofWeecI6wNL1G2oKpPPUDdd19/YT1I0Kt2KoYA1QS4Yftev1/33lutxlUuDJoTja5MZIyQEjpNBSMkdICR0gDLGWCsZYA6RkgpGSAOkZO0FIydoA6doyQU7RkgDpGSCkZIA6doydoKdoydoAyR0gJHSAOkZIKRkgDpGTrBSMnWAOvWMsFesZYAydo6QE7R0gCySSQD8sEjJBSMkAdIydoKRk7QBljJBWMkAdI6QEjpAGSOkBI6QBkjpASOkAZY6wFjrAGWOsBY6wBkjJBSZFLHMuemRmAet6DrFfSrKz06xXD+UqnHrjc/jmHecbm7H2C8otRKuRVcoTyEfvEbY94dfSq9ajaVrK9e0ZqqLVemoLGkT8QXPfEz7nTLikA9pqNG/f7nlXS+VUI2/a6Hc95jjBSdnuqelIzdKtNO1Sg1DzlWoDs4/pOQ1/wht62r09Uo6pXtLpH5jWoP8b+oOexm1tNZtvMFmtA2V3RHN5Drylh6qRswPqPaZ19qZal51xWFKmNsnqfYDuZ170dkydMJ7yMK8oNR06hQ8xnZXwGPVxsSTPLeO6po16QL8rrSwcMwP3m9Pb1nolPWKN9qAdjyULcHlU/teuZ5prul6pr2rVWpeWPMbC+Y2MnOwA6n0neL4nn51bdHO6OXu9TSgrEFj97OT/vpPYdGunegHduQ5KZ/iwCp/HInlvBNk91qVzeVaZRLccpyOjZx+OR+Rnpui0WvrGvSOBVX4kI7kGcdQu5VjRn6lamhVSqFCpXXnAHQHuIKTJr3f2/TaNUjDUWKfIGYyS7FJuCbKciqWwyR0gJHSWHAyxlgrGWAOkZIKRkgDpGTtBSMnaAOnaMkFO0ZIA6RkgpGSAOnaMnaCnaMnaAMkdICR0gDpGSCkZIA6Rk6wUjJ1gDr1jLBXrGWAMnaOkBO0dIAskkkA/LBIyQUjJAHSMnaCkZO0AZYyQVjJAHSOkBI6QBkjpASOkAZI6QEjpAGWOsBY6wBljrAWOsAZIyQUjJAPW+E7mw1nh+2S7qlXpg03wd8j/TBmxuNI+z0+Rbo1qbb4c5wJ5NpF7c2lygoVSnmMFYdQd5ub7irUbOu9FeSpykgHff6TM4qD+Z6mDqbjR2y21pbEVPLRqijCsR0+U1mtPTfkqPgqq4x6HOZztnxLf3m32cn1Y7AfUzA1viH9X5NJxVrOd+TcAdMZ7yLs7eRdhqPn6hqgpWf3aWalXHQLMm7u6OgWVZ3q1HNXmo00o1VDjO/z32HN6Y6YM5LUq+qcP0Lapp9WpT1W8blQrvhMZbI7jE3Oj6ReXGoPd8S3PnFKZRAFwtPueUdPrLY7KzLlaszNJ0q2sdPtrElua6prcO4XA58tsTOo0u1FsyvTI5dunbHWHYrS1Cwt69OkSKQZUTuegz9P6zYWVA2yYqEEMRn5mUZN2cwRjUk/wDrb5R93zeYfQ/6zBSbtrM0ba5oj/tMc+3WaSnLsL2KcvIyR0gJHSXFQyxlgrGWAOkZIKRkgDpGTtBSMnaAOnaMkFO0ZIA6RkgpGSAOnaMnaCnaMnaAMkdICR0gDpGSCkZIA6Rk6wUjJ1gDr1jLBXrGWAMnaOkBO0dIAskkkA/LBIyQUjJAHSMnaCkZO0AZYyQVjJAHSOkBI6QBkjpASOkAZI6QEjpAGWOsBY6wBljrAWZNGlUqnFNGc/wjMARIyShtalFeavy0ExnmqsFEw62t2VuMURUuX+XIg+p3MlJvghtI3VgyLeWxqNyoayKT6ZYAfnOnr6OtPVOasmVb4h855Nfa7dV2ps7cqU6i1RTpjABUgj67T2ilqdDV9OoXdFxUp1AKlNx3B/3iVZsbTTNHTyTtFaul0alHlxse0steGrOi32g0VdhuMzJo1gSFMrrut0NK0wufidiKdNB1dz0A/mfacUa7S3ZzbU6V5xM1Z25ko0/L2XOM78q+/T8J0t+tGrZ2Xmlqbh1BLjGx7H3mFWp06GvFaQphKVM1AB15yoGfpv8AjNhe6fUurS3oUay1ArGqXyCcrgBfxOfpLGtjK5W7MKk9V7zk0wmnSsatRVYHOxAzkdwSMTe2dRboh6ihXUYZR0PymBSsrbS7Ojzu1NHPxFhj4j3bvk+pm0p2PPUpNSIZSdwp6nsR9JmnuWR2RsLS3Ne2u+YgA0yCfQYnGrsTB4k8V7DRqdXTtLppfXHKUeqzYo0z3GR94/Lb5zzevxzqDK6td4yN/KQDB+ZmnBjlW5ly5E3seqKYyEDvPGn4kqV2DV61d26Zeqf85cmtUqhCh3BJ/wC43+c0en8SnWeyVby3tk561enTX1ZsTDTi/ROfl+3oD/dM8qa5WuQpqOe4PPn+cNxUIBpsjD0Y4M69Ej1D3O1uqF0nPQrU6q+qMCJlpPDuG9ercO6tTuWFVKRPLVp5yrKev1ns+manZ6rbrXs66VkP7p3HzErlBxO4ys2KRk7QUjJ2nB0OnaMkFO0ZIA6RkgpGSAOnaMnaCnaMnaAMkdICR0gDpGSCkZIA6Rk6wUjJ1gDr1jLBXrGWAMnaOkBO0dIAskkkA/LBIyQUjJAHSMnaCkZO0AZYyQVjJAHSOkBI6QBkjpASOkAZI6QEjpAGWOsBY6wB0GSBMO+1KoXVKdVkoqMqq7c3uZdfXH2e3yDgsQs09xditccxJYnvLccb3OJMynuecc9QliO53gNz8z8+zZwQT0gvUYYKsQfUGWglMY2HtLkisWsuahXlxj3z/wD7MnR+LNW4ZqkWFVHt3+J7Wsn6vm7lcHI+Y6+kw+fAzLKiiouMD2MOKfJMZNO0du/inqbWtPyNNsqdzVPwhnZwFH7RHbf1M2ehWepahQOt6peKLioStGtXC5ye1JCQAAOp9dh0nnVnfjT0IRFNRj94qMgDt9Z0FHUb/UmtW+x/pC4rqQvmMSVGfuAAgKAAD9ZTLGlwW+pKXLPUdP0pq1lQr1qtR6yEguVIZznckfhuZ0JRfsVNUqGnvz5UYJ/2ZrdDq3D6Pb0b6hSpVE2ZKdTmAGNu5yenUzZUK3nW60/L8l6Y5WB6qP8AWZm2XryWUqJvD5Jc1GqEVKjNsAB/ScT4mcZDSrVdG0qu4a4QtWrLkctI5GFP8W+/oNus7Q2dYVgaAYJWBRixzzDGMkdhieBcb6q2q8T6jX5gaa1jSpgdAifCoHtgfnGHHcrZGWdRpGoq1y5wvwqNgBLQ/QZwcwC28hcKpZiAB3M12ZKEq1wnzhfbt8BgfabfROGW1N1r3gdKB3Wkpwz+5PYfn8p3ttbU9HprTTR3o0Rgc6UcA/795VLNW0dzVj6e95OjzKnqZp/ecqP4tpmU9XVwMsB752nsdHTqd7bBzRp1abjoyZH4Gc/rfAmjXQYmzW1qY2qW/wAH4jofwlMerp1JGmXs7a4Ss4WnfHHqDM/S9YuNNrC4sLl6FQH9k7H2Imo1bRb3hq4xUbzrVjhKy9PkR2P+xBWrgB6be+RNsZqStHmzxuDpnufBniJba2y2N+Ftr3GFJPw1fl7zuknytSuiCp5mUruCOqn1E9p8MOPv02g0jUXH26kv6tz/ANZR/USucO6Ooy7M9HTtGSCnaMkqOx0jJBSMkAdO0ZO0FO0ZO0AZI6QEjpAHSMkFIyQB0jJ1gpGTrAHXrGWCvWMsAZO0dICdo6QBZJJIB+WCRkgpGSAOkZO0FIydoAyxkgrGSAOkdICR0gDJHSAkdIAyR0gJHSAMsdYCx1gGHrY/5VD2Db/hNCQQ2D1G49CPWdHq1PnsH/hIM50OvKFbbB2f9w/5S/G9iuQwcEYH19pevTECmN8E4I9PWOsuOCMDj0l2Nt5T6yp7QQHVTJB9JteF+IW4dvXukoLXqsAq8x5eUZ3OfltNcMd4bphsggfKHFNEp0e06N4hJrl9a6clAiqAajsWyNh90dztk/SdPbVQpzTHOX2XH7XvPnfTdQr6bd0rig5SqjBlYHBBnunC+v07/RVu/MpseUl2XAPN3A9O8yZcdPY0Y5+TfXV3T062L16haoACxO4X2+nWfNGs0moare0nyHWvUU75/aM+iqt1RvadGj5wpFg6eVUXaqShIw3Zu47EZHWeAcUXlnqXEN/XsuYU2qZ+MYLN0ZsdgSDGK0yMrs0hON5teHNKbVr8Ap5ioRhT0Zu2fYdYGlaVV1XVLaxRXZq9QLhep7nH0BnpvC+nWdrWp2lqlLmoqTVdBgFmJ9euw6znqMuhNdy7pcPqNN8G4tdPThvTxeeXUrP+09OmXYe4Ub4iW/HukaliyFZ2uCSDTqU2Rh/hYbzuNPsqCWALuvTfJmputE0bUKxdqYrMvfkyPxnlwyLmSPaeKSrSHpJVbao4pjk7+k0eu3T10ZLLy/NPTm6TodWPk6eyIXRj0yMZnG1Tq2m0vtFnbUbg7llZsOfkSMeksxZNbOcsdK/sctq9xfpRez1iwCrVUhaqjKP7exnAZNGo6g4ZGKtjocT0fUNabWLC8trqjUo1lTLUqi4KnqCOx+YnnNwhWtWqE7OwOPfv/Seh0752PI6tLbeyqV8+xmdpWr19Lv6F7bOUr27iohHt2mqzvEU7iaTEfWvDms0eINGtNUofcuKYbH7p6EfQ5m2SeceBtapU4Nam5JWld1FX5EKf6z0dJnaplqHSMkFIySCR07Rk7QU7Rk7QBkjpASOkAdIyQUjJAHSMnWCkZOsAdesZYK9YywBk7R0gJ2jpAFkkkgH5YJGSCkZIA6Rk7QUjJ2gDLGSCsZIA6R0gJHSAMkdICR0gDJHSAkdIAyx1gLHWAXVqfm0KlP8AeUicowAOMb9895169Zy19TFO4qr0wxluI4kY1KoEq8h+63TPb2mWCMnGcds9Zrqqcy4zj0My7dzUoq569D85eVsyPrK52lgIxjEqD+Ukgrj3lCBJmXDYSQBUXl3mdaaze2NvUpW9dkWqAGA9jkY9Jh1RlSYLNgAxQNsOL9YpOlRLosae6BhkKfXE52rVfz2r5Oc5Y+sW4YrnJU4PUHYyynmtbBCoBYls9/lOGl2OrPRPCSppta61C7u6lNGo0F3PUJk8+PmAAfn7zO0riGnX168rj9Wlw+aYP7IGyj8J5RYPcWt8nkuyFjhsHG3eb+jctRcY5hjABA3mWeBSbb7mrH1DioxXY90TUadGz5r668qgSB3y0x9a1Spb8jaJqle0CqC6Namoj+h7EfT5zX6HZPxLo1Dlu2o1BTUtWVQxRge2ds4nYWvCdSnTD0eKLhnRGfyq9DPOQDjG/faYVjV0ev6kpK+xxGq8d3tSjRtruwuLhivMfKVW+H1BJGR+c6Hh64ttT05qho1KVMk8gqqQfzmm4u4Y1Wxtk1K8saVxRFPznrW55Wo5G4YbEYHzE1/D+u1vsflvUFSlyc9Ktn76k9/fEmeJVsiYZveqTJxhTo0kK00XmIK5A7Tx+6DioyVEKnmyARjb1+v9J3vEvEFOr5lNG56jZVAu+52nI8Q0Xt71aNQlqgpK7MenxbgD2Ax+c1dOnFJM8zrZKbbXY1B6xremXcKASSeg6mWpRLtyqMk7Aes9n8LfC97OrR1zW6PJUXD21q43U9ncdvYfUzTKVGJbndeHXD78N8KWdnXXluXzXrD0dt8fQYH0nVJBSMkoLB0jJBSMkAdO0ZO0FO0ZO0AZI6QEjpAHSMkFIyQB0jJ1gpGTrAHXrGWCvWMsAZO0dICdo6QBZJJIB+WCRkgpGSAOkZO0FIydoAyxkgrGSAOkdICR0gDJHSAkdIAyR0gJHSAMsdYCx1gDLOf16kad6zY2cBp0CzW8RUOe3p1h+wcH5Gd43UjmXBzbTKscPbsB1VzmY7gEDGffPrKWtz5NRqZwBU6H3mkqMyowTaWJUzkwKjEv1jC3ri3+0eTV8jm5PN5Dyc3pzdM+0WKEDS4NMcNtK8/vOiB3GVmK/SIakNmgAvT8z4WGQZW1dSckHlDYwDjaWXDkI3KQBjcscAQ7Jl5Dy5wDIJHqJy1FqLsVORM9DVp3DKwClWI5Dv3l2j6ZU1fVbS0oo1RalVA5xgBcjm/rOz8QtBGnXo1CnTHlXHwscdG+fvM88iU1DyWxxtwc12Oi8Lr5KyXVorhcgNTUHcYG+Jubri7UNBr1LO6tfOoqx5WBx+Gek8Ts9XuLOsalGo1M45Tytv0m3PElZqtKo9djyZBXO6iUvB7zkbMXWuMUl2PQrzi261SpyUOamjjD5zjHvnrOK4g1lKX2hreqAxUU1T90DbYfSUfjEpYG3pUU8wpyggH4QfWcqKF3qF5St6SVK9aq2ERRlmPoBGPFW7J6jqtfBlaJa3N9qCVqVKtW8thUdkQty79T/rO4vPDXiHirVzdVkpWFtyrSV6xwxVR15RvuSeuJ3HBXCVtoGh2lGvbobwfrarZz8Z7e4AwMdNp1aTtve0ZE3p0nNcJeGuicLslwtM3l6u4uKwHwH+Feg+fWdkkFIydpzYHTtGSCnaMkAdIyQUjJAHTtGTtBTtGTtAGSOkBI6QB0jJBSMkAdIydYKRk6wB16xlgr1jLAGTtHSAnaOkAWSSSAflgkZIKRkgDpGTtBSMkAZYyQVjJAHSOkBI6QBkjpASOkAZI6QEjpAGWOsBY6wBlku6H2m0q0u7Lt8+0ix07QgcJVUqcETDuELgjIB+c3+sWApXrgbI3xjPTBnVcI8BU1t/0vrluTSIDULdtuf+Jh3HoO/eXzyqMdTOceKU5Ui7QPDhNY0bRdYuKlOlQq0i9elTY+ZUAJAyMYXJHX03nScYcW22ncCVdCe3tkR6f2ahSpDCsM5DY7FeuZubatc69WawtTSo+VRapULtyoiqpbBI7kDpPDL69r6jdvcXTlnY9M7KPQegmTFGWWVt8G+c4dPFwju2YJQsMrUOJY1Ouv3amfnHa3XOVBUn90zMtdLrVFL1ahRBvgr8Rm+jyzTtc3NHPmJkeol1Ktc3hxQoVKh/hX/YnQLa29BFFQGqxOQH6D6TK5xSphQAg7ADAAkA0FPhy7rkNd1Vor+4DzN/lNhR061tRhUJwRktM9X2LnoOkJwfKLdycyUQd74f6P+po37qOV2qFdunKQo/mZ1nFWjprWjVKBUc2Mg+hmg4G1u3bStI05sCoTcoD6sGVgPqM/hO2U5+A954/VNrLZ7PRRjLFR826haV9PuXo1UPNTOOn5zD5gcEE7djsTPaeKOCqV9ctcIAGPWcNqvCNWi4+BfoJpx9Va3M+To2uDmbeszDJPNtgZGPrPQ/CmlZ0NXNa5NJLiojLQ5+pb9rl+n85yiaFVpHLjAEt1dno0aNKmzI1JlqKy7EE5HX6CXRnrdIonj0K2fRqRknjnCXizcWYS11pWuKQwBXX76j39Z6vo+sWOt2q3VhcJWpHuOo+Y7RKLXJwmmbNIydoKRk7TkkdO0ZIKdoyQB0jJBSMkAdO0ZO0FO0ZO0AZI6TAutRtNPQPdXFOiD05zjMzqTB1DKQVIyCO4glppWZCRkgpGSCB0jJ1gpGTrAHXrGWCvWMsAZO0dICdo6QBZJJIB+WCRkgpGSAOkZO0FIydoAyxkgrGSAOkdICR0gDJHSAkdIAyR0gJHSAMsdYCx1gDLHpgkgAEk7ACCgJIAGSewnY6DoqWXLXueX7QegP8A0v8A+v5TjJkUFbLMWJ5HSLNJ4RoU2panqtv5tVP7G2O4z+84/pNpeC6vVq16pKW9FWqMR1wBk4m5tKlutEvzoUT73O2B+cK84j0ylTPJ5dTYg+Wvw4+fpMbyapW0evDEscaieQabe8R69qF+uk0LjyL+n5NVKQxTWmDlQXOw9znJyfWbqy8F9VvPju9V061Y7lV5qh/kBOgveOrJKQtqS0UpUxtRpYUAfIbTSXniFUDZt6RGBygFsAD+p95rWTJL9iowPFhg7yO2bOz8MNE0qqq3WpXdy4HxNSRU/AnOJl8RcK8JU+DrnUNP+1Ub2gjnmq1S2SP2WHTcdMTgL3jDUbp8it5fss1tzqd1d02WvcVao9GfbPylkMeRu5MqnmwJNRiW0gcmtUO57eg9JOc1X5m2HYSxnA+H0lFbcTXRgHqPhVUdzL6pHKq9pjhue49lERnzVAz0WSDOta9WnpVc0HanXsqyXdJ1O6nof6GehaJ4paJqFrSGoVDYXyjDhkJpsfUMOg9jPNLWuKFyC/8AZupR/wC6dpgVbPyqrorcpU4I6gzPlwRyfuL8HUTwv3T3Ztasb0A0Lu3rKehp1Vb+RmHcW9KsSzYI954a9Plb7q59RlZGdiNjUx/f2lH6FLhmz/UnW8T1DWTZUabNUr0KSjuzgTz7Ur1LytVekCaXOqKx2yAD/rNXyqTupz85fuPhHRR+Z/0xNGLAsfcy5uoeTtRf0qfOZ+ia9qGgXXn2Nw9JgdwDsfpNe2SAfSQqcgzQ1ZmPbuFPFux1AJb6uBa1j0rL/Zt8/Seh2d5b3tMVbavTrIQDlGBnymnwdJtNJ16/0m4StY3dWg4IOFbY/MSh4/B2p+T6kTtGScVwFx9Q4opC1ueWjqNMZZO1Ueq/5TtUlTVbMsTsdIyTUa7UvqWk1305We4UAhV+8R3x74nHcI+IFwt49rq+PIdsU3BJNP5+04cqdMujico6l9j09O0ZO0xqFVK1NalN1dGGQynIMyU7ToqPIPGW8uhq/kUalSn5dspVk7ZzPYtIx+i7LlOR9np4Pr8AnkHiwV/4j5G6NbJv6dZ6ZwFffpHg/R7nJJNsqkn1X4f6SuHLNOb/AI4HSJGSCkZJYZh0jJ1gpGTrAHXrGWCvWMsAZO0dICdo6QBZJJIB+WCRkgpGSAOkZO0FIydoAyxkgrGSAOkdICR0gDJHSAkdIAyR0gJHSAMsdYCzf6HpIrqLu4GaYPwIf2z6n2/nOZSUVbOoQcnSNnw5o/kot/crhyM0kPYfvH39Pxm7q1FpDnZcnsJYlUkZz+PSY1xWIyqqznHUTz5SeSVs9fFCOJUhqdul8/8AzNVUHVV6zFudPtHqYqVPNpj9gjb6iYjV7hXUcjAHbYy6pZ290SK9WoV7qGKj8t5bFUdt2thKtbS7BAirQpIu4BA2PsJwfGGpWt1fq1tg8q4cgYye07C60vQ0pBKtAuiDALuTj6zzXVGtaOo1Utc+STgAnOJq6de9Zg62VQotB33ic4p5PXAmF9oWmCM7jpLPtWQN+s22eUbFWyMnq0SnjJJ6TFp1siMrkIx74xOgNQGwJ6tvKq2azn0wJSmQO/QS2k3Nzt/FIArGDWfOCc8wG59R6/SXs+28tLYwR23hgItzDBAz3lCm2yj8ZHVM5VkRv3GOPwPTHt2z7SU2HV6iIuPXJP0EakCwry5JGQOv9BKohwc7knJPvF5WcBivIg3Ve59z7y0HElAgUSAbYlQd5Cd5JBJRdjkSDrIDuQZARn6dqdfT7ulc29RqVakwZHXsRPojgLjShxfp3MSqX1EAV6fr/EPYz5oGc7Td8L8RXXDGsW2oWxPwMOdM7OvdT9JxONo7jKj6qScvxTwWNQqNqWmKEvMZqUui1/f2b+c3+l39DVLChfWr89CugqIfYzLq3FO1oPXrMFp015mJ7CZWk9maIScXcTzLQeMbrh+6NB6dSpS5sVaDZBp+pHofaeq6ZqFvqlql1a1BUpt+IPofeeU8ccQcJX+p06Jr3FnqrgFKyUC6VB6VAu+PcZPsQJr9A4nvbBqosLpadRWKVEzlCR/vYypNw+RseNZuNmbLxNb7dxE/KuUpotLI74G87rwkqhuDaFLvQr1qf/tkfk08+r39LUqbCuDTuh15u59Z1PhBqqebqekFssrC5T5HCt+YH4yMcrkddRjrGkux6ekZIKRkl5546Rk6wUjJ1gDr1jLBXrGWAMnaOkBO0dIAskkkA/LBIymAsZIBkJ0jJ2mOhjoYA6xkgpGSAOkdICR0gDJHSAkdIAyR0gJHSAMs6y0rgU1pK2FRQoA9pylLdh8xNrbV/wBe3M2NzKM6tI09M6kdA9Z1OS+BL1vVUAEZzObvNSdVbkYqo6AGY9je1rtGY1HADcuMYzKowb4NU8sY8nR3WoL0DAHttmclxDxDfWbtRt6ihsAsw6qJuba3qViwpIajKpY774HuZwms1qlze1Xqq1KqG6DYp7TRjxq9zHl6iTXu7Iw7zVdQuSTXvbhg3RucjH0mvNRxzKwIYbkenuPaZFR8giqoI/fUbfUdobISFRyAR/Z1M7H2zNSSWyMTbfIbXHmrnGG6GVoEsVzDamckgcrDqvY/KX0Nj8hLEQzZ0jiZIb4cTBp1ekdauxzJRBmc2Ac9BJQ+GmN+u8Fqg5D77S9agwPaAIxJMsJ2EnPscw+baSC84bYgH5y9KaKQQoHyEx2JByDFp1hjcbwDIPxQmTDSCqO0vyD1gBgSSp5R0MsLSAXASyqeUgj5S01AIFatnG+JIHWpyguRn0HqZcXaivOx36/X0mGlcLh2GcfcX195YajOedmz7+vsIJPoHwD4la/0q80Wu/NUtGFan/cbYj6N/Oei8VUTccM6lSWotN3oEKzdA22M/WfPvgXqBs+PbeiTgXdGrRI/w8w/NZ9FazYPqmkXdlSqLSqVqZVHYZCt2yPTMy5Fu6L8b4s+fqOm32icRXt9qq86XCjy7mmeamAOx7g4wJ1lvYW10y1VbBcYBByGEzLnStU0ajTGtWiU1c8gam4emx9j1HyM195dWllST7KjU23wE+6Jik23T5PYxRjVx4MPVma1Q0kqcxB+HPUfWZXAmujTOMtNuqjYSsfs9Q+qvt/PE0dRySSSxLHO8wXDJWDocFTzKR2MJ0yckdSaPrRNoyTVcPaiur6JY36nP2igjn543/PM2qTWeMOkZOsFIydYA69YywV6xlgDJ2jpATtHSALJJJAPyuWOkBI6QBkjJBSMkAdJkJMdI9OAOkdICR0gDJHSAhjKcwB0MZDASMvaAZdqvPWRR3YRKzk1MdMnMmnj9aX/AHEJ/p/WWMf1h/nKcj3o0YF3L6lMlMDfMu0hWqValBMc3MDj0/3iXZHL02mFplzUp6pXpI3KK1PHp0OZzGVblmWNo6g3tvbKtvTIamDmow61D/l7Q7vTLHXudLiizU+U8lXo9M/wn09uk1zVatFhzl8exEfzqlRQoNzU9sYEq0tvV3ITVaexxOqcO3llUyn6+kWISonffuJpXSrQYqFI/eRht+E9bs7Soaoq3CcioMKhgazpthfJitbU222OMEfIiaY9RTpnH6S1a2PKGIODjlPp2llM4ZsGb3XdEtbEc9G4b+64B/Oaarbta1DSbIbqZrjNS4McoOLpieZnf+kZKnwzFztL0bInZwZq1M43iq4JxvMFWIjK/eSQZXPLTUBB9YPm7dZYXyZAFDkt1wJcGBOBmErAAy5CBJBkoQO8r52DiYzVSNhIHzAHNY5hvVhc2Wh1GwZIEertMZmaq4Uf6Q2q7kekvosV3237kwSZCUXfoPrjeVCYbCfE373UD/My6mWdMZCp3PTP1MTnRV+Ek9sqNvxMA6Tw0vaOk8caNdVW5UFyqsx7c2Vz+c+sFGNvSfIGlaTdXTJVX9SgPMKr9dv3R3M+sNA1SjrGk215SfnDoObfJDAbg++ZmyNN7F0U0tzJ1XS7fWtNr2FyD5dZccw6oezD3B3nidzp9TTry4sa9T9dbuUYEYPz+vWe8IZxHiTwjV1Cidc01Qbu2pnz6X/epgZyP4lGfmPkJRkjas09Pl0OnweZXNMsNtjMOvS5VBiW17Tu1Uo4Od9jK3lMiicShI9By8HtHgrq4v8AhR7Qtl7Kuyf4W+If1noqTwrwDvHXiDVLMH9W9qKjD3VwAf8A2M91SaYvY8vKqkx0jJ1gpGTrOisdesZYK9YywBk7R0gJ2jpAFkkkgH5XJHSAkZIA6RkgKcRVaAZKRkMxg2IiVIBlowiBz2mMhz0iq47wDJVyDHV5hpUBOJkIYBl06m8yVbeYKGZKMdoBs7ZuWhVx1bC/zlufillJ/wDl23/aH8pQ1MYmef7jXi/aO7AJj2mqWo1vqNOuh3Vu/Qxq1z6GYNxcKeU+hiKOpuzu7NLe+RayU0weoI6H0mcrJQXGAo9BOQ4f1c27tTc/A+4z2M2dxqYfbIxKpRo0YnGrNtWuUHTBmk1PUFpIxyJj3N8VXZprbS3OuX7UalUU7eivmV6hOML6D3PSTCPc5yZOyOT16/qX9z5KEkZ3AhO7vyGo3OwUAn1xtB5uWpVrYANRjy47DMQOGCfLH5z0IJJHkzk2y3m3xEQ7fWC2zsPQyqNtLLK6MrMnP2zA58yqkzpAcGXBsQ1bMrmAMrZOMS5mA7wA2DIWzJFF5Y5lxflGM7wSZMmALzbe8o+8szLkwzgE7Hr8pAN3ZeG3EepaHca/RtVFlSRqo52w9VR1KL1Pff2M1ltomp18eTY139CqT6o02paVdItRTWmLZ7dAKa9OQoNvwni1W3fh/XLzS2Pw0KhFMnvTO6n8CJmlllE0Y8UZOmc7pXAurXtZfPpLbIer1WBIHyG873SuCNG0ukHakbq4/wC5W3x8h0X+clrcAFcNsZt1rgJnIMyZc85bHqYemxw3qzU6nQp0qWKVJFUHJI6gTc+GPFa6Vq36LuKmLa7OFJOyVOx+vSai/wA1wV3I65mgrU/IqBwWLA7FRjf5znFKuSOpxqR9Oq3vOW8V9cXQfD7WLjnC1KtL7NTycZZzy7fQsYfBXFK67olKrVcC4oKErg9iP2vqJ5z4ua+nFVvXs6Zza2mWpYP3nH7X9BNWtKrPOUG7Rw/DV5btZhFOKlIcpBPxDG31EydV11bW3L1agxnlA7k+k46+s7zSblrqmW8us3OCO2ex95vuEq/I1TWWVTUtA5D18PTUFfiPL3IGfxA67yXiTd3sd/qJRjpa3O88GtXvtC4so3V2fJo3uLWtbmn8aKxXkZiccuSVIxkn0n08vw9Z8yeF/D1/xtxJQ4tvLUafoWnVOaxtEyFq1BjBAJ33GWbudhsNvoNNSaqhGcZnTSWyKdTluzci6or1qDIl9G6WpkhgPYznOZixwZk0KjIQTIB0tOsO+M+0ykIO4nNLdOWO82On3pVirHrAN2kdJgW1wKj4marAd4A8kPzR6yQD8skjKYKnEvDQBlMVWmMGl6tAMoNLgSICPF5oAq1isQViZiFsStNjncwDZUGGcmZtNgRtNVSqYmSlbtAM/wAyZFF8Dea1a2GEYXABwIBt6Nb9Wy+sO4q8o2mD9p5CDmW1rrmGAciVTjvZdjltRe9XYmYNWqSeplWrnBz0mHUrZJkJHTZnUr00WRgccpG02Ru2bcHacw9fLAe8yamolBhTJcbEZ0bG81Rh8AOWP5TWVKlR1qChcEGoMMMzDqVjUJ6knrMdygJIYqe4znMtjFIonNyZfXNehhaqgr2IlaD5RfmRBp1apYJTZyCcBSc5mzutOpac6obgu4UM68uwb0HylllbRi1v7ZvTMop2hs/MxPcyudus7ORFbeIpgAy9W7SUyKFBwcy8uMbQebaW8+JNhIbzJUVAZjlpBUM51E0ZQcScw9Zi80nmFZOoijIL77StOp8YzMfzZUvgZEWKPpLga7a44R0lyxz9mVfwyP6TR+JelNi21yku9L9TXIH7JPwt9Dt9RLPD7VgvBunKdmVXX8HM6k1aep2VW2uKYejVQo6nuDM8lexfF07PMrS/flGTNzY3rMOUnInM6jZVuH9TqafWYsF+Km5/bQ9D/vvM+zvgABkCY5xo9PFO0dMqiquM9ZhXNCnkIpBYfgIKaiKaYDAltgIFW7WjTbDZJ6n1nDTLHJCi8NhTqpQrOvOMOQccw95qLi8BVlzkGYd9qSqTud5oq+pMHIDbSyETNKasz7+utRTTbdT2mRwfZ/pTiCw0y7CVrFmPm0ygHMg+Igkb7kCc814ajZzOu8Nx5epXF++4pU/LQ/xN1/IfnL47GfI09z3yz1qlb0KVGkq06dMBVSmAAqjoAOwm3p6xb1KalaoV/QnrPKzqpIOGwfYzHOs1aNT4qxA7EmWFB63V1zyRylhzexmdpWoVbr+76nvPKbLV3rlQKpcn1M7fRtValQH8oB3NM949G4RH+IzQnWaRtlIPxt29IdteGuxfmwAe0A7izqorI6sNz0M21Q/DsZxtHUsU0APQTP8A07TamAz4bGIBsat/5blSfzknIahqWLlsVe3rJAPz8EqJbLoBcDLgcQ5UGAMrS/zDMcNLg0AYOcxEbeYnmYly1DAM5XIiiriYSVPeXmpAMxa20vWtnaYAqSoqQDYG523Ms8/bYzBNTfYyhqnHWQ1ZKZk1bn1mM1fJ6w2bmluBneQkTqLlZnbYEyyo7FvvEERg2BtMao2SenWdI5bKtVqYwScSwDP7MqGOJQcxOJJA1rV8iulXlDchyB79pfVqvcO1R2+JjkmBjHeXAHHWdIgnNv7y4N7yhAI3lhyOs6sUMDLg20ANiVDYiyKMjnljNvDLSznkOQSGLS3nhlpbmRZNDF5UNB5pUGSmKFLGJSfPwmYzP6Si85PXEWKPX+DrlaOiWdJDkBST88nM7a21JaVEYIxPFOGuJF09Fta+QnN8NT93PrO1TV2I+/1lbOja8d0KOr2CVrfBu7bLp6svdf6j3nA2upZUHO06Kvq3MuebcbTj9YBtrlriltSqnJA/Zb/IziUbLcc9JuRqvK4JOwGwmHd6wxJIY7+80D3xyDnptMd7oses40HbyGfc6g1Q5LTEeuTvnMxXqZ7y3n2naRW5GStZs7Gd/wAL3aWNlToNszfG/wAz/sTgrKmFYVam+NwJuE1BlOQ2DOkjhs9CrX9IDPP195jNeefgFgV9T1nGU9SdgAznEy6eqqijLiSQd/pV35VMDPQ9Z09lq7Agh+g9Z5npmr02pFS03NrekKOWpt16wD0qjr+abBm3XpMyw140D5gOzDE8wbVzndsfIzNt9dLpyhvu+8A9StOImWviowIPSFqXED0nJp7d85nB2+tE0NyCyw7viAsnJgE59YB1VbiBqzl2fcyTi1vjUHNkiSAfO8kkkArmSUkgFQZMykkArmVBlsqIAqtiXhtoIMrzQBQ0pzGHmTmgCB5C0LMmYAmZC0PMqDAE5toOcmVLbS2AXSu8tzKlpNkFcmXBoYMuBBhMF+ZQyYlDJsFuPSTmMrLTIBXMpmSQjAB9YBSTMnUZ9JSLJK5kzKSQC6XA4lmZMxZAwGf2jOi0rU3+yikz5ant8xOaBMvFRl3U4MA6t9Q5gQTiYV1eCqvL94YwQZplvXGzHMvWvzDYyCS25Q0zlTlD+UxueZLVe0BkB3G0At5sy+nucnoIfIc7xAYBk+bnvEWvgTDDS8ttAMt7sgbbQRcPzZzMdnJlAYBurS9dcbmdJY6vinjO+JxdGoRiZ1vclWwDAOra/J+INMiz1IqwyevWc2tckdYqXmCAN4B2tLVVpY3BzLxU85ubM5CldMxGT0m0tL89M7D3gHSJX5RjGZJrUuvhG8kA8dkkkgEkkkgEkkkgElRKSQC+Qy2VzAJKSZlIBWTMpJAK5kzKSQCSSSQCSSSQCS4S2VEAuDSFpbmSAVzJmWyQCuZDKSQCo6GUlZSASVlJIBJJJIBcDK80tkzAK5kDEdJbJAEDkyucwpUGAXyolMyQC6QmWyQCuZWW5lQYA1POJkIxEx0YARUcMYBlCqR32mRTqHtMNTk9doiuUbYwDPS45NjMu2u+VgczVFuY5zMi3GYB0C6hhRgbSTVqxAxJAOMkkkgEkkkgFZSVzKQCSSSQCSSSQDM0jS7jWdRoWFsF82s3KCxwqjqWY9gACSfQTbvR4R08lXuNV1eovegq2tI/ItzMR9BL9GqHh/QbrVyoa41BaunW1Nh8JQrirUI74DKo9yfTE1mucP33D17Ts7+mtO4ejTreWDkqHGQD6H1E7qldGpR0QUlG3/Tx8NzdcY8MUrCvotbTLN6NHV7KlXo25qmq/O2xGSB3IxLtM4MsTqdrp2qavTN3c11t1tdOAr1EYtg87ZCKB7Fj7TtuL80vEXSRVPPR0PR1umBGymnTZx+LBPxnOeC+npd8YNql1n7PpVvUvKjHscYH8yfpLXBepp+Jvl0sP1Sxpcyr5VVvb6/Y4/VtGr6XrdzpT0qnn0qxohGA5ic4Gw7nb8Zs6vDukaRXehrOtg3FJitS206ga7Kw6qXYqmfkTMnhu5OtccVtbusctFq+p1C5woKBnUE9gW5R9ZuPCThyy17UNV1bWrT7fbWFHn8p+lSq52z69G67bziMNTpGfB06yzUYK9TdX2S3vb+bGpsLHgW91K2skq8SP9pqJSDlaKeUWIG435sE+0w14NrJrmq6be3VKwo6UXN1c1kYqihgq4C5JLErgD1m54H0inrvinR/RNM0rGhevdLyHanRR8jf0PwgfOLxhqVI2vEl5zGt+nNVKWzdCKduSS22xU86gD2z2k6U42zv0YSxerJLZvjh0v70vqYP/BWl3Wg6te6TqtxqtfTkp1najb+XRVGboS55uYKCTgY6DJmupcGXFtSFxrlzQ0a3IGDcfHVcnsKS5fPzAA9Z6PwVZDhrw8o17ykUfU7pr6orjHNbW6GoPoSi/wDnPGq9xUua9StVYvUqMXdj1Yk5JMTiopOh1WLHijjm47tcdvPz4a7nTtwVSpapaj7bVraTWsX1H7YtAoWpIGLgKSRzZXl69SJn6dw3oHEehazdaPY6nQr6ZarXapd3lM0webfYIM/CGPUbidHqVxTo+GOm31B0qKmjPY46jzKtwgYfMBGP4TC022raN4PulFGN9xPfrb0lUfE1NTjA+ZU/+U70JP6WXrpscZNVtpcvutkvqcXp3D1rU09NR1XVE021quyUB5LValYrjmKqMDAJAySN9uxm40Ph/g7VtX0/TqWpa3d1L2otHlS2p0PKJOMklmyO+APrLdc0avxFreoWmiPTr6doVmQtQnlRaNIfEd+rM5Y+5J7RfBqw+2eIOnOfuWwqXDn0CocfmROIx95RozYcS9aGLQmm6vffffvRyOp2FXTNQubKunJVt6rUnXIOCDgjI2mLM7XLwahrV/eA5FxcVKo/xMT/AFmGiF2CqCSdgB3lT5PPmlqajwPp1jV1K/trKiM1biqlFM/vMQB/Od/oun8LavrN5oNPRbcUbTzWp6hX1FqJq8gKguT8OGblIC4wCes1qUrnQdWs+H+H6NL9M3ApJVvmwaqVaigmmmdqXLzcpP3sg7jpN/e8EcAcHVBbcUa/fXuogBqltYpgLnf0P5kfKXQh3PU6Xp3G3SpPduq+Vvv5pHnuvaBecPXaW175BapTFZGoVVqI6EkBgykjBwZrZ13iFxNo/EFbTaGhWNW1sdOtRboaygVHwe5BOQAB1PrOXsrWrfXdG1ojNWvUWmg9WY4H5mVSSTpGDPCMcrjjdo3Nrw3ZU7S3uNZ1mlppuqfm0KQoNWcpv8TBfug4OO59AN5XXOEbjTtdpaTYrdXr1ggpsbc0zUcqGKgZP3c4O+283FtptPirxOt9LogtZ0rhLZR1HkUFCk/VUJ+s6zxi15qN9dVKTkVXX9GW2D/Z0xhrhh6FmZafyVxLNC0uXg3rpMbwTyPZRdX58/DxWx5+NF4d0tuTVtarXNwpw9DS6QqKp9DVchT/AIQw9zNt/wAJaFqvDWt6rodPVXXTPLP2m7q06aPk5YcgGdl/iySRtvibDhnhThrReE6fFnGHmXaXblbKxoVMGoASMnBHcHuAB13OJh8ReIGn6jw0eGOG9AOk2ta4FWqorGo1bpgdM5JC9z0Ak6Ulcv8AJKxY8cNWala2W7lutvKXk5vStAoXVk2o6lqNPTbIVPJR2pNUes4GSEVeuARkkgDI9ZtNO0jg26vbK2Gqa1d1LmstDy6dqlEqSwAbmLNtv0wTt2mRq/D91rmuUeGtEZK1LSbIhyx5Vpuq89csfXzCRkeijtMLww046lx7otADmC3IrH5IC39Jyo7pUUQxpZI49Cdur352vvRqOI9GqaBr19pdQMptqzUxzEE8udicbZxgzZvw3o+lFaeua3UoXYCtVtLS0NV6WRnlZmZVDYIyATjp1m3NW11bxK1nV7wr9is69xeMzLzJ8BIphgOoL8gx3zic3faNqtfRv+J7vDW91dtR812+OrVwWY49Ou/rIaSto5njjFylGN7uvku+385N3R4V0LVdI1utolzqd7caXRFx51VKdGk6c4B+DJbZcnr26Tm9H0e41m5ajRalSSmhq1q9ZuWnRpjqzH03A23JIABJna8FKNN8MuM9Ubb7QtGxQ+pJ3/8AzE0Gpq2jaLaaJSVvtl9yXl4F+9g/2NL6Kecj1cekmUVSZ3lxQ0wyNVtbS+bS/ngtW14S0/4q99qOrt08u2pC2Ue/O/MT8uUTP1HQtNv+Cm4k0rTq9gtvfC1qCtd+b5ilQQR8I3ye07DVfByhQ4e0rTLCklXiK5rKbmvVr8qUF5CzLy+nQDAJODNV4hC04V4I0bg63v7a8u1r1Lu9Nu/MA24AP499/hnbxuKepGmfRzxQm80Ukl+XVK3vfk81kloMrnMzniklMyGUgF4aXo5WFKgwDLSoTHQkzAV8R1re8A2FMgDpMihkH+kwKVYDvMmjV94Bss7STGFY46yQDl5JJIBJJJIBJJJIBJJJIBJk6fYV9TvaFlbJz17iotKmvqxOBMedJw4o03RNX1wkpXpqtnZsf+7Vzzke4pht+3MPaTFWyzFDVKnx/Y63hDSbDiTjUIeepoPDdtlWVcrU8s55iP4353x1I2mNxk9PivxdtqOfJSvUtKZ80EFcohIIHffGPWYPBuk+IYsqlDhu21C1tb4qz1lUUlcAEAio2DjBPQynhhbfa/E6wGo1nq1adepVdyS5eoisck99xnMvTtKNcs9eM3OGPC4NapJttUn2SXwSN14napSN5xJfW9VGe9vKWl02U/8ASo01aqAfdzTH0gaAV4a8Hta1QlVudbrixpEHfkGzf/s/KaXxF1AVri2tXpclcvWv6uRhla4fnCEeqoE98nHadDWoaHxLwxwrwnpus0EuaYevXC29So/nOuSNgBt8Wd+wk3cm/wCbnetz6jJJNXTS7byfx+bON04G14N1m7TlD3Fxb2R3wQh56hx8zTT8JfouucSafwxqllpdGsum3DA3lxSoElRjHKX/AGQc/n7y/XratpfDmiaQ9KpSrVzWvqyOOU8zP5SAg+gpn/yM9F8QtZTgrhChwja1LbFSwSg1NCC7OSDUqNj7owCB3Yv6LOYx2buqRnxYdpTcnFQj+Xbr8nN+Gmt3lPh3ifStKsqNG++wVLoXy58zlXAKHO33S3LjGD6zSavp9S81jh/hmiWDUre3oFR2qVj5jn6eYB/hnZ+FGjXdLg/VbmpVp2tPWbihYW7NTy9UF+Vwp9CGYD3BPac/wSLjX/F+2ucNTY31S5cfuKvMeX8AFnWluMU+5c8cpYcGOXMtvpf/AIzo/E7VhSqa9RoOy21hb22i2yA/CGcipVIHry0wp+k8kutPu7Slb1ri3q0qd0hq0WZcCouSMj1GQROz45rC9o2tG1rGs+o6nfXfKfvPzVRTpt8iFOPrOi8ZdJtLfRtKtbOqhqaAlKxuaeDkebTDIff+zbPzEia13Lwc9ZjfUPJlv9tfl3+F/Q8/fim7ueErbhcUl8ildtdBwTzMSMBcegJJ+s9L8RLqroP2T4aVGnoum0razppn4buspDN/gRCw9+U95534daP+m+NdIs2Xmpm4WpUH8CfGfyX850/jNd19W4zXS7INdcih/LoqWdqrgZBGM5Cqgx6D3iLehy+hHTzmuknlb3tRX0/ts/obvQdKtuF/CHU6t03lX+t2dWuMY5hSGFQfI8w/85yXhlq1toicR31TzPtA0upSt+RC3xMfbp0G8rxnfcf19FotxDbXFpphK0EQ0EoqSBlVIAz+znB22l3B1nYjw+4u1Gva1K1zRFGnSbHw0y2QGG+cjJz26Sb95KKqkdyy3mhHGtOiL5Vdm2zg5uOEaV4eIbK4srdK9S0rJdEVWCU1VGDEux2VdtyZp+86cUKljwEKlGk5fUrx/OdQSBRohcKT2Bepn5qPSUR5s8nBG5avG/8APqZtfS6t9x0z8B1rvUKq1TdU6i0+XyW5s/ebYqCfvEDPpOv4m0fWNI8PtV/4111ri+r1aTWdt5y1GVgTkZIzg5JONsL1nMcAcfHhrSr/AEi20i5uLu/cFbmzqhK4GMco+Bum5BA2yZseJeGK9bgS81y84ffRrmjeUmV7mq9W4uKbAqeZnOfvEHoM+kvjWltc/g9fDoeGc8e8mm2t1Ffjd15Z5kTvOg4FTl4gS8blCWNKrdtUb7tMoh5GPtzlB65InPnrN7ak2HCN3VyA+o3KWw9fLpjnf/2al+EojzZ5GDaerxv9v8nd+BNjTtrjWuJrv+x0+2K8x9SCzf8AquP8U5Tju+uby20I1252rWlS+ZiN+etXqMwz+6MDA+frOv4R02/o+Cuv1Uquv6QrBbemtPmap8SIQoG5Ln4fpNVwtqfHmj2p00aSGsAnl82rWWKNunPzEl3Awuc7Ekb7DMva9yMT2Jx/2+PA00mm7Svdv/BoLfj++paTY6XX03Rr2hYqy0DdWa1GQMcnfPczo9Y0Kjw7qVDioWlvbUTplC/o21MEIt3UHKqgHsGDVMei4mluxZ8ceJVKlZ26U7O9u6VHlt0FMFAArMB2yAze2Z1HjnqDXOs6ZoFjT5qdCiD5NMEuXJKqCMdlG3973nKXutveuCqEX6OTJN6tLSj8/wDwz/D7Trfh/wAPtV1q/qMl5rVvcLRb9vykpuc7+pBJ/wAM5fwVcUOKby6CM9W20y4q0woz8QA/1H1h8R3XiCOF6VPVrS5stGoIlso+zrRHLsAp25t+UexxvNt4G2VC6fiF6hqpUNkLc1FA5aaVGwzeuRjPyBncXc4xS4L8clPqMGGCa0ruq35b+5zBtLlNI07RbdS2pa9WS5qjvyElaKn5ks59is7Txjoafo3Cuh8PWVbP6OrNSdR0ZhTUsx98uD/inHaffa/f8ZVdX4dsXurm3qHyBRoGqlKmAUQYIxgKABn0mJxvW4nq6qicVCsl3yeYlOoqqArHqAuwyR89t5xqSg9jKs0YdPkSi96SdbUvj5b3O24ds6V94ccO6a9Nvs9/rzNeNy7eWilm39OVfyPpNT4b2h4v8SG1W/KtRt2qajWJHwjlPwj2AJXb0E6G5q09H8ItMq0KddQLGuyu4G9WvUFM4I/hNUj2xOe8PtXs7HhDimzbWLLTb28WlSotcA7oeYPjAJOxPTPynbpSin4/6NTUY5cMZ9kn9laX3v7nOcS8XX2r8V32u29zXt6tZ2FJ6blWSljlCgjcfDt9TOfJJ6nM62pwjptXhjUtW0zUbrUalhUpJVYW4pUlV+bf4jzHGAOg3I2nIzPK+WeP1CyatWT/AOt/yVlcy2VzOTOQykr1kEAglRJKgQCCIplmJAcQDIRsRkrYI3mIrGXc8AzxdbSTANQyQDGkkkgEkkkgEkkkgEle0pK5gFVHMwGwz6z1m18PrPVrTSKZ4i0hdHtLlKL8lfJuKjgPWYNsOY4VAP3VBJE8kl3McYJ2ncJJcqzT02aGO9cdV/Gj1PXvFiqePKRtb65pcOWNZKa0LQ4FVE2LY2zk9ATjAEbhPWPDngytbarR1DVNQ1SsnKeemFFtz7NntkAnOC08kknfrSu2aV7Uy6/Ukk3dq+3yPWNZ4M0nia9vOJdT420aytbqowt/LUszKnwLkNyknCjJAOTvF0C44A8O7n9I2uv19b1bymp0TTo8tKkWGOb26+p2ztPI8ykLKk7S3C9oRjL1IY1q5t29/PNHq+r+Ht1xpq93r1LiPQaem1KnJRqtck4RAFGxAwcDJ9zBo8HeHvD7faNf4wTVmQ5NrYLnnPoSCT+Y+c8v5pMyPUjzp3IfW4rc/STk/Lb3+Wx6rdeIdjxNfGwtK1Hh7TbOxqUNNFUNgVXwnM3IDykIXA9Mk53mToml6F4Z2eq6pU4q0vUNYqWdS3taFo/NyO3Q5ye+NyAMZnkMmZKzO7a3Jj7Slq9ScU5dnvt9OPkez6bwRa/p1OKtV1fT7Xh/SatGjalay1RWWkAq7qcDJAJG5JJ2nKXHF+ka7rnESa014thq95Sq07i2AL0RTZgpKt1HIx26zhjXqGkKRqOaanITOwPriHIeTakiMnXppRxxpW2+9t7fatj2vhbi3gDhe/o2XDtFXquHNbVdTPl/CFJ5QcZ3IAwABvk5l2l2X/x9b61xlrWs6Xea1e0Ga0p0anMedznIBwTnI6DYAzxMHBkzOlnfj5FsfasklcF7t6a2Sb713+p3+n8d2XEVsuncdV9UvaH2r7T59KqByAUyAoUL0JPbHX2i63xZwjZcE3fDvC9vqge/qpVr1bvl2CtnGx9h0HeedSTj1ZUZv1+XS06baq2t6fxK951vh7xLqun63ZabR1MW9hc1xTr0rhlNDkYjnJV/hyQMZM5GVnEXTtGbDllimpx7HtWg6Qvh5a6zxzqv2FLm5R/0baUKqsFLscAcu3oPhyAoM8t17i/XuJW/+11W5ukB5hTZsUwfUKMAfhNVUr1Kqoru7BByqGOeUeg9BDncslrStkauo6xzgseNaYrtfL7t8FR1ne8KadwxxTb2Fhq+uVdKp6fQqPVDimi1Hapn4XZuuCu3L0UzgZJzGVPdGfBlWOVuNrwz3TUOLeHa+nW3CvDOr0aaWVrVWjcXLGkjVsBEw5G5+Oo2cYyBOfpeDnEVzXpf8Qa9YWtkpHO9S8NRlX+EHAz8yJ5YDgypct1JPzljyqW8kbsntGOZ3mhdcJOlX5PZ+Ch4fcCX9G6HENLVdTrk0lrcpp0rdd+Yn0yBjO5Odhg5mVpFhT4c1PU/EPiHWdJubivQqVrOhQrcxLMPh5cgE/D8IwOhnhud8yZzJWaklXB1D2oopRWNJR3VXz5fNnfWHiGmv07jT+NrnUbyzurilUL0KgUUFTmyAvKepYbDHQbzqtCrcJXPDer6LwXePZalqzLbn9KVuRimT93lB25Sw9d954tKg4nMczXO5Vi9pTi7mlLlW+afx+p6/r+rf/FnBlpw/oesWtTWLmu9a8uLQhii9h3x+yBnfY9MzSDiXgvialTuuLF1xtQoW9C2FSjVDmqVzzPuBjf1J6zzsmUh5W/l4GT2jOUqSWlKlF7rb/v4nres8Y8OcV6VV4V024/RNjRtaVOyq6gvwM6VM/EwyUyvRvnnrMSl4TaJpVNa3EnG2mWyEZ8q0YOx+RJyfopnmA2kzDypu5KxLr45HqzY1J9t2l9kej8UcVcJ6ZwhccLcI07usl1XWrc3dyv3wuDtnB6gdgAM+s83kknEpOTsy9R1Es0lKSSrZJcJEkkknJQVEqJbLhALsSSZkG8AriTG8kmYBM4lMyGUzALsyS3MkAskkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgEkkkgElRKSQC7MqDLRK5gFebeVzmWyQCplJJIBMySuJIBZJJJAJJK4lIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJJJIBJWUlYBJWSVAgExIBLlUmItIntACwZI3lmSAYsrIJcBAKYlCJfiUIgFoEku5ZMQC0ykqZSASSSSASSVlcQCmJJXEmIBbK7SuJMQCkpLsSYgFMSYlcSYgFskqZSASSSVEApK4lcSYgFMSkuxKYgFJJWUgEkkkgEkkkgEkkkgEklcSuIBbK4lwEnLALJJfiUxALZXEriTEApiTEuxKGAWyshlRAKgS9RKKI1NcmAVpIJkJTz0EolPBmXQpZXMAxTTOekkymotnaSAaJZeJJIBeBKESSQCShkkgBtKSSQCSokkgFwEuAEkkAriUwJJIBMCVxtJJAKYEoRJJAKgSYkkgBt1lJJIBJUSSQC4SuJJIBMShEkkAmNpbiSSATEpJJAJJJJAJKiSSAVEuAkkgFQN5fgSSQCzEmBJJAJgSuJJIBTEtaSSAUlVkkgCqJk0VB7SSQDPRF5RtM+0optt1EkkAudQrEAbSSSQD/9k=" alt="Albina and Isaac" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block">
    </div>

    <!-- Bios right -->
    <div style="padding:2.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.8rem">

      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.06em;color:var(--white)">Albina</div>
        <div style="font-size:.54rem;letter-spacing:.2em;text-transform:uppercase;color:var(--neon-gold);opacity:.8;margin:.25rem 0 .6rem">Styling · Musicality · Technique</div>
        <div style="font-size:.7rem;line-height:1.8;color:var(--muted)">Lead instructor at ai.urbano. Albina brings technical precision and real musicality — she teaches the details that actually make a difference on the floor.</div>
      </div>

      <div style="height:1px;background:var(--border)"></div>

      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.06em;color:var(--white)">Isaac</div>
        <div style="font-size:.54rem;letter-spacing:.2em;text-transform:uppercase;color:var(--neon-gold);opacity:.8;margin:.25rem 0 .6rem">Partnering · Footwork · Connection</div>
        <div style="font-size:.7rem;line-height:1.8;color:var(--muted)">Isaac (ai.urbano / ODT) breaks down partner connection, timing, and footwork so they click. Expect to leave every class genuinely better.</div>
      </div>

      <div style="display:flex;gap:1.2rem;padding-top:.5rem;border-top:1px solid var(--border)">
        <a href="https://instagram.com/ai.urbano" target="_blank" style="font-size:.52rem;letter-spacing:.15em;color:var(--dim);text-decoration:none;text-transform:uppercase;transition:color .2s" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--dim)'">@ai.urbano</a>
        <a href="https://instagram.com/officialdancetheory" target="_blank" style="font-size:.52rem;letter-spacing:.15em;color:var(--dim);text-decoration:none;text-transform:uppercase;transition:color .2s" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--dim)'">@officialdancetheory</a>
      </div>

    </div>
  </div>
  <!-- Pricing & Registration -->
  <div class="cl-register-label">Pricing &amp; Registration</div>
  <div class="cl-register-grid">

    <div>
      <div class="cl-detail-rows" id="cl-detail-rows"></div>
    </div>

    <div class="form-wrap" style="--accent:var(--neon-gold);--accent-glow:rgba(255,184,0,0.12)">
      <div class="form-head"><span class="form-head-title">Reserve Your Spot</span><span class="form-head-ev">7-Week Course</span></div>
      <div class="success-panel" id="class-success">
        <div class="success-icon" style="border-color:var(--neon-gold);color:var(--neon-gold)">✓</div>
        <h3>See you on the floor.</h3>
        <p>Confirmation sent. Come ready to move.</p>
      </div>
      <div class="form-body" id="class-form">
        <div class="alert" id="class-alert"></div>
        <div class="tier-list" id="class-tiers"></div>
        <div class="f-row">
          <div class="f-group"><label class="f-label">First Name</label><input class="f-input" type="text" id="class-first" placeholder="First"></div>
          <div class="f-group"><label class="f-label">Last Name</label><input class="f-input" type="text" id="class-last" placeholder="Last"></div>
        </div>
        <div class="f-group"><label class="f-label">Email</label><input class="f-input" type="email" id="class-email" placeholder="you@example.com"></div>
        <div class="f-group">
          <label class="f-label">Spots</label>
          <div class="qty-wrap"><button class="qty-btn" onclick="chgQty('class',-1)">−</button><span class="qty-n" id="class-qty">1</span><button class="qty-btn" onclick="chgQty('class',1)">+</button></div>
        </div>
        <div class="f-group"><label class="f-label">Card Details</label><div class="card-wrap" id="class-cw"><div id="class-card"></div></div><div class="card-err" id="class-cerr"></div></div>
        <div class="summary">
          <div class="s-row"><span id="class-slbl">—</span><span id="class-ssub">—</span></div>
          <div class="s-row"><span>Processing fee (2.9% + $0.30)</span><span id="class-sfee">—</span></div>
          <div class="s-total"><span class="s-total-lbl">Total</span><span class="s-total-amt" id="class-stot">—</span></div>
        </div>
        <button class="submit" id="class-btn" onclick="doSubmit('class')" style="--accent:var(--neon-gold)"><div class="sp"></div><span class="sl">Reserve My Spot</span></button>
        <div class="secure"><svg width="9" height="11" viewBox="0 0 9 11" fill="none"><rect x=".5" y="4.5" width="8" height="6" rx=".5" stroke="currentColor"/><path d="M2.5 4.5V3a2 2 0 014 0v1.5" stroke="currentColor"/></svg>Secured by Stripe · SSL Encrypted</div>
      </div>
    </div>

  </div>

</div>
</div><!-- /page-classes -->

<footer>
  <img src="data:image/png;base64,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Cck5KgC2RkqALAqALAqALAqALZGSoAtkjJAAnIyQAJyMkACSBkZAAZIyBIIyAJGSAAyAAAAAAjIyBJGSAAAAAAAAAAAAAAAAAAAAAAAAAAAAE5GSABYFRkCwIyMgSCMkgAAAGQAGRkABkZAAZGQAGRkABkZAAZAAAAAAAABGRkCQRkZAkEZGQJBUATkZIAE5IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnIyQAJyMkACcjJAAnIyQAJyMkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=" alt="ODT" style="height:30px;width:auto;opacity:.7">
  <div style="display:flex;flex-direction:column;align-items:center;gap:.3rem">
    <span class="foot-r">Official Dance Theory · Tampa, FL</span>
    <div style="display:flex;gap:1.5rem">
      <a href="https://instagram.com/officialdancetheory" target="_blank" style="font-size:.52rem;letter-spacing:.15em;color:var(--dim);text-decoration:none;text-transform:uppercase;transition:color .2s" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--dim)'">@officialdancetheory</a>
      <a href="https://instagram.com/ai.urbano" target="_blank" style="font-size:.52rem;letter-spacing:.15em;color:var(--dim);text-decoration:none;text-transform:uppercase;transition:color .2s" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--dim)'">@ai.urbano</a>
    </div>
  </div>
  <span class="foot-r">Est. 2024</span>
</footer>

<script>
// ╔══════════════════════════════════════════════════════════════╗
// ║  EDITABLE CONFIG                                             ║
// ╚══════════════════════════════════════════════════════════════╝
const CONFIG = {
  stripeKey: 'pk_test_YOUR_KEY_HERE',   // ✏ Your Stripe publishable key
  paymentEndpoint: '/api/create-payment-intent',

  // ── BACHATA INVASION ──────────────────────────────
  invasion: {
    date:  'June 12, 2025',
    day:   'Thursday',
    doors: '8:00 PM',
    ends:  '1:00 AM',
    venue: 'The Dance Factory · WestShore Plaza Mall',
    description: '90% Bachata / 10% Salsa. Workshop with Isaac at 8PM, social dancing with DJ JR from 9PM–1AM. Free parking, $10 at the door. Every 2nd Friday.',
    tiers: [
      { label: 'General Admission', price: 10, desc: 'Entry + 8PM workshop + open social' },
    ]
  },

  // ── BACHATA LOCURA ────────────────────────────────
  locura: {
    date:  'May 17, 2025',
    day:   'Saturday',
    doors: '4:00 PM',
    ends:  '9:00 PM',
    venue: 'Yuengling Draft Haus',
    description: '85% Bachata / 15% Salsa. Bootcamp 1:30–3:30PM + pre-social workshop 4–5PM by Albina & Isaac. Social from 5PM. Food · Full bar · Free parking.',
    tiers: [
      { label: 'Pre-Sale',        price: 15, desc: 'Limited — ends 5/16' },
      { label: 'At the Door',     price: 20, desc: 'Day-of entry' },
      { label: 'Bootcamp', price: 45, desc: 'includes social' },
    ]
  },

  // ── CLASSES ───────────────────────────────────────
  courseInfo: {
    startDate:    'May 20th',
    dateRange:    'May 20th – July 1st',
    day:          'Every Wednesday',
    duration:     '7 Weeks',
    venue:        'The Dance Factory · WestShore Plaza Mall',
    venueSub:     '334 Westshore Plaza, Unit A10 · Tampa, FL 33609',
    openHouseDate:'May 13th, Wednesday',
    openHouseTime:'7PM – 9:30PM',
    openHouseSub: 'Free — try both classes, no sign-up required. Special open house rates available same night.',
  },

  // ✏ Switch to Regular prices after May 17th
  classes: [
    { label: 'Foundations — Early Bird',  price: 80,  desc: 'Beginner · Wed 7–8PM · 7 weeks · ends 5/17' },
    { label: 'Foundations — Regular',     price: 90,  desc: 'Beginner · Wed 7–8PM · 7 weeks' },
    { label: 'Urban Bachata — Early Bird',price: 120, desc: 'Intermediate · Wed 8–9:30PM · 7 weeks · ends 5/17' },
    { label: 'Urban Bachata — Regular',   price: 140, desc: 'Intermediate · Wed 8–9:30PM · 7 weeks' },
    { label: 'Bundle — Early Bird',       price: 180, desc: 'Both classes · best value · ends 5/17' },
    { label: 'Bundle — Regular',          price: 190, desc: 'Both classes · best value' },
    { label: 'Drop-in — First Class',     price: 20,  desc: 'Single beginner session' },
    { label: 'Drop-in — Second Class',    price: 25,  desc: 'Single intermediate session (90-min)' },
    { label: 'Drop-in — Full Day',        price: 40,  desc: 'Both classes, same day' },
  ]
}
// ══════════════════════════════════════════════════════════════

const STRIPE_READY = CONFIG.stripeKey && !CONFIG.stripeKey.includes('YOUR_KEY');
let stripe = null;

const st = {
  invasion: {price:0, label:'', qty:1, card:null},
  locura:   {price:0, label:'', qty:1, card:null},
  class:    {price:0, label:'', qty:1, card:null},
};

// ── Page switching ──
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById(`ntab-${page}`).classList.add('active');
  // Update nav CTA
  const cta = document.getElementById('nav-cta-btn');
  if (page === 'classes') {
    cta.textContent = 'Book a Class';
    cta.href = '#';
    cta.onclick = e => { e.preventDefault(); document.querySelector('.register-layout').scrollIntoView({behavior:'smooth'}); };
  } else {
    cta.textContent = 'Get Tickets';
    cta.href = '#events';
    cta.onclick = null;
  }
  window.scrollTo({top:0, behavior:'smooth'});
  // Re-run observer for newly visible elements
  setTimeout(initObserver, 100);
}

// ── Build event panels ──
function buildPanels() {
  ['invasion','locura'].forEach(ev => {
    const c = CONFIG[ev];
    // Only update elements that still have dynamic IDs
    ['date','day','doors','ends'].forEach(k => {
      const el = document.getElementById(`${ev}-${k}`);
      if (el) el.textContent = c[k];
    });
    const desc = document.getElementById(`${ev}-desc`);
    if (desc) desc.textContent = c.description;
    buildTierList(ev, c.tiers);
    st[ev].price = c.tiers[0].price;
    st[ev].label = c.tiers[0].label;
    updateSummary(ev);
  });
}

// ── Build classes page ──
function buildClasses() {
  const ci = CONFIG.courseInfo;
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setT('cl-start-date', ci.startDate);
  setT('cl-duration',   ci.duration);
  setT('cl-venue-name', ci.venue);
  setT('cl-oh-detail',  `${ci.openHouseDate || 'Date TBD'} · ${ci.openHouseTime || '7PM–9:30PM'} · Both classes free · No sign-up required`);
  setT('cl-date-range', ci.dateRange);

  const rows = document.getElementById('cl-detail-rows');
  if (rows) {
    [
      { label: 'Schedule', value: ci.day },
      { label: 'Starts',   value: ci.startDate,  neon: true },
      { label: 'Ends',     value: ci.dateRange },
      { label: 'Venue',    value: ci.venue },
    ].forEach(d => {
      const r = document.createElement('div');
      r.className = 'cl-detail-row';
      r.innerHTML = `<span class="cl-dr-label">${d.label}</span><span class="cl-dr-value${d.neon?' neon':''}">${d.value}</span>`;
      rows.appendChild(r);
    });
  }

  buildTierList('class', CONFIG.classes);
  st['class'].price = CONFIG.classes[0].price;
  st['class'].label = CONFIG.classes[0].label;
  updateSummary('class');
}

function buildTierList(key, tiers) {
  const list = document.getElementById(`${key}-tiers`);
  if (!list) return;
  list.innerHTML = '';
  tiers.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'tier-opt' + (i === 0 ? ' sel' : '');
    d.dataset.price = t.price; d.dataset.label = t.label;
    const handler = (e) => { e.preventDefault(); pickTier(key, d); };
    d.addEventListener('click', handler);
    d.addEventListener('touchend', handler, {passive: false});
    d.innerHTML = `<div class="tier-dot"></div>
      <div class="tier-txt"><div class="tier-n">${t.label}</div><div class="tier-d">${t.desc}</div></div>
      <div class="tier-p">$${t.price}</div>`;
    list.appendChild(d);
  });
}

// ── Scroll observer ──
const observed = new WeakSet();
let observer;

function initObserver() {
  if (!observer) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const effect = el.dataset.effect;
        const delay = effect === 'gold' ? Math.random() * 250 : 0;
        setTimeout(() => {
          if (effect === 'neon-blue' || effect === 'neon-red' || effect === 'gold-title' || effect === 'cl-main') {
            el.classList.add('lit');
          } else if (effect === 'gold') {
            el.classList.add('lit');
          } else if (effect === 'cl-block') {
            el.style.opacity = '1'; el.style.transform = 'translateY(0)';
          } else if (effect === 'ev-invasion') {
            el.style.setProperty('--accent','var(--invasion)');
            el.classList.add('lit');
          } else if (effect === 'ev-locura') {
            el.style.setProperty('--accent','var(--locura)');
            el.classList.add('lit');
          }
        }, delay);
      });
    }, {threshold: 0.25, rootMargin:'0px 0px -50px 0px'});
  }

  document.querySelectorAll('.observe').forEach(el => {
    if (!observed.has(el)) {
      observer.observe(el);
      observed.add(el);
    }
  });
}

// ── Stripe ──
function loadStripe(cb) {
  if (!STRIPE_READY) { cb(false); return; }
  const s = document.createElement('script');
  s.src = 'https://js.stripe.com/v3/';
  s.onload  = () => { stripe = Stripe(CONFIG.stripeKey); cb(true); };
  s.onerror = () => cb(false);
  document.head.appendChild(s);
}

function mountCards() {
  ['invasion','locura','class'].forEach(key => {
    const el = document.getElementById(`${key}-card`);
    if (!el) return;
    try {
      const card = stripe.elements().create('card', {
        style:{
          base:{color:'#f0f0f0',fontFamily:"'Syne',sans-serif",fontSize:'14px',fontWeight:'300','::placeholder':{color:'rgba(240,240,240,0.16)'}},
          invalid:{color:'#ff6b88'}
        }
      });
      card.mount(`#${key}-card`);
      card.on('focus',  () => document.getElementById(`${key}-cw`).classList.add('focused'));
      card.on('blur',   () => document.getElementById(`${key}-cw`).classList.remove('focused'));
      card.on('change', e => { document.getElementById(`${key}-cerr`).textContent = e.error ? e.error.message : ''; });
      st[key].card = card;
    } catch(e) { console.warn('card mount', key, e); }
  });
}

// ── Tab switch (events) ──
function switchEv(ev) {
  const r = document.documentElement;
  r.style.setProperty('--accent', `var(--${ev})`);
  r.style.setProperty('--accent-glow', `var(--${ev}-glow)`);
  document.querySelectorAll('.ev-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`tab-${ev}`).classList.add('active');
  document.getElementById(`panel-${ev}`).classList.add('active');
  setTimeout(initObserver, 50);
}

// ── Tier pick ──
function pickTier(key, el) {
  el.closest('.tier-list').querySelectorAll('.tier-opt').forEach(t => t.classList.remove('sel'));
  el.classList.add('sel');
  st[key].price = parseFloat(el.dataset.price);
  st[key].label = el.dataset.label;
  updateSummary(key);
}

// ── Quantity ──
function chgQty(key, d) {
  st[key].qty = Math.max(1, Math.min(10, st[key].qty + d));
  document.getElementById(`${key}-qty`).textContent = st[key].qty;
  updateSummary(key);
}

// ── Summary ──
function fee(a) { return +(a * 0.029 + 0.30).toFixed(2); }
function updateSummary(key) {
  const {price, label, qty} = st[key];
  const sub = price * qty, f = fee(sub);
  document.getElementById(`${key}-slbl`).textContent = `${label} × ${qty}`;
  document.getElementById(`${key}-ssub`).textContent = `$${sub.toFixed(2)}`;
  document.getElementById(`${key}-sfee`).textContent = `$${f.toFixed(2)}`;
  document.getElementById(`${key}-stot`).textContent = `$${(sub+f).toFixed(2)}`;
}

// ── Alert ──
function showAlert(key, msg) { const el = document.getElementById(`${key}-alert`); el.textContent = msg; el.className = 'alert err'; }
function clearAlert(key) { document.getElementById(`${key}-alert`).className = 'alert'; }

// ── Submit ──
async function doSubmit(key) {
  clearAlert(key);
  if (!STRIPE_READY || !stripe) { showAlert(key, 'Stripe not configured. Add your key to CONFIG.stripeKey.'); return; }
  if (!st[key].card)            { showAlert(key, 'Card element not loaded.'); return; }

  const first = document.getElementById(`${key}-first`).value.trim();
  const last  = document.getElementById(`${key}-last`).value.trim();
  const email = document.getElementById(`${key}-email`).value.trim();

  if (!first || !last || !email) { showAlert(key, 'Please fill in all fields.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAlert(key, 'Enter a valid email address.'); return; }

  const btn = document.getElementById(`${key}-btn`);
  btn.classList.add('ld'); btn.disabled = true;

  try {
    const {price, label, qty} = st[key];
    const sub = price * qty;
    const total = Math.round((sub + fee(sub)) * 100);

    const res = await fetch(CONFIG.paymentEndpoint, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({amount:total, currency:'usd', metadata:{type:key, item:label, qty, firstName:first, lastName:last, email}})
    });
    if (!res.ok) throw new Error('Could not reach payment server.');
    const {clientSecret} = await res.json();

    const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
      payment_method:{card:st[key].card, billing_details:{name:`${first} ${last}`, email}}
    });
    if (error) throw new Error(error.message);
    if (paymentIntent.status === 'succeeded') {
      document.getElementById(`${key}-form`).style.display = 'none';
      document.getElementById(`${key}-success`).classList.add('show');
    }
  } catch(err) {
    showAlert(key, err.message || 'Something went wrong. Try again.');
    btn.classList.remove('ld'); btn.disabled = false;
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  buildPanels();
  buildClasses();
  initObserver();
  loadStripe(ok => { if (ok) mountCards(); });
});
</script>

<!--
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETUP GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Stripe key → stripe.com → Developers → API Keys → CONFIG.stripeKey
2. Backend → netlify/functions/create-payment-intent.js:
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   exports.handler = async (event) => {
     const { amount, currency, metadata } = JSON.parse(event.body);
     const intent = await stripe.paymentIntents.create({ amount, currency, metadata });
     return { statusCode:200, body:JSON.stringify({ clientSecret:intent.client_secret }) };
   };
   Set CONFIG.paymentEndpoint = '/.netlify/functions/create-payment-intent'
3. Edit events in CONFIG.invasion / CONFIG.locura
4. Edit classes in CONFIG.classes — add/remove/rename freely
5. Edit instructor bios directly in the HTML (search "✏ Edit")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->


  
