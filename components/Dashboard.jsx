'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'
import { EmailPreview } from './WriteCapsule'

// ── Templates list (mirrors WriteCapsule — only id/name/scenario/card/email needed here) ──
const TEMPLATES = [
  {
    id: 'cosmic',
    tier: 'free',
    scenario: '✦ For anyone',
    name: 'Cosmic Night',
    card: { bg: '#080c14', accent: '#e8a84c', text: '#f2e8d5' },
    email: {
      bg: '#080c14',
      header: 'linear-gradient(135deg,#0d1525,#111d35)',
      accent: '#e8a84c',
      text: '#f2e8d5',
      dim: '#c8b898',
      border: 'rgba(232,168,76,0.2)',
    },
  },
  {
    id: 'dawn',
    tier: 'free',
    scenario: '🌅 For hope',
    name: 'Golden Dawn',
    card: { bg: '#fff8e8', accent: '#c47a1a', text: '#2a1505' },
    email: {
      bg: '#fff8e8',
      header: 'linear-gradient(135deg,#fff8e8,#fdecc0)',
      accent: '#c47a1a',
      text: '#2a1505',
      dim: '#8a6030',
      border: 'rgba(196,122,26,0.2)',
    },
  },
  {
    id: 'midnight-letter',
    tier: 'free',
    scenario: '🌙 For yourself',
    name: 'Midnight Letter',
    card: { bg: '#0a0f1e', accent: '#8ab4f8', text: '#e8f0ff' },
    email: {
      bg: '#0a0f1e',
      header: 'linear-gradient(135deg,#0f1729,#162040)',
      accent: '#8ab4f8',
      text: '#e8f0ff',
      dim: '#a0b8d8',
      border: 'rgba(138,180,248,0.2)',
    },
  },
  {
    id: 'first-birthday',
    tier: 'premium',
    scenario: '🎂 For a child',
    name: 'First Birthday',
    card: { bg: '#fff0f7', accent: '#e8679a', text: '#2a0a18' },
    email: {
      bg: '#fff0f7',
      header: 'linear-gradient(135deg,#fff0f7,#fdd8ea)',
      accent: '#e8679a',
      text: '#2a0a18',
      dim: '#9a4070',
      border: 'rgba(232,103,154,0.2)',
    },
  },
  {
    id: 'graduation',
    tier: 'premium',
    scenario: '🎓 For a student',
    name: 'Graduation Day',
    card: { bg: '#0f1a0f', accent: '#5cb85c', text: '#e8f5e8' },
    email: {
      bg: '#0f1a0f',
      header: 'linear-gradient(135deg,#0f1a0f,#1a2e1a)',
      accent: '#5cb85c',
      text: '#e8f5e8',
      dim: '#7dc97d',
      border: 'rgba(92,184,92,0.2)',
    },
  },
  {
    id: 'wedding',
    tier: 'premium',
    scenario: '💍 For a partner',
    name: 'Wedding Vows',
    card: { bg: '#1a0f0a', accent: '#c8916a', text: '#f5ede8' },
    email: {
      bg: '#1a0f0a',
      header: 'linear-gradient(135deg,#1a0f0a,#2e1a10)',
      accent: '#c8916a',
      text: '#f5ede8',
      dim: '#a07060',
      border: 'rgba(200,145,106,0.2)',
    },
  },
  {
    id: 'startup',
    tier: 'premium',
    scenario: '🚀 For a founder',
    name: 'Day One',
    card: { bg: '#080c18', accent: '#7c6ef5', text: '#e8e8ff' },
    email: {
      bg: '#080c18',
      header: 'linear-gradient(135deg,#0c1028,#141830)',
      accent: '#7c6ef5',
      text: '#e8e8ff',
      dim: '#9090cc',
      border: 'rgba(124,110,245,0.2)',
    },
  },
  {
    id: 'grief',
    tier: 'premium',
    scenario: '🕊️ After a loss',
    name: 'In Loving Memory',
    card: { bg: '#0f0f18', accent: '#a8b4e8', text: '#e8eaf5' },
    email: {
      bg: '#0f0f18',
      header: 'linear-gradient(135deg,#0f0f20,#18182e)',
      accent: '#a8b4e8',
      text: '#e8eaf5',
      dim: '#8898cc',
      border: 'rgba(168,180,232,0.2)',
    },
  },
  {
    id: 'retirement',
    tier: 'premium',
    scenario: '🌿 For retirement',
    name: 'Golden Years',
    card: { bg: '#1a1500', accent: '#e8c84c', text: '#f8f0d5' },
    email: {
      bg: '#1a1500',
      header: 'linear-gradient(135deg,#1a1500,#2a2000)',
      accent: '#e8c84c',
      text: '#f8f0d5',
      dim: '#c0a870',
      border: 'rgba(232,200,76,0.2)',
    },
  },
  {
    id: 'new-year',
    tier: 'premium',
    scenario: '🎊 New Year',
    name: 'Dear January',
    card: { bg: '#05101e', accent: '#4ad4f5', text: '#e0f8ff' },
    email: {
      bg: '#05101e',
      header: 'linear-gradient(135deg,#05101e,#0a1a2e)',
      accent: '#4ad4f5',
      text: '#e0f8ff',
      dim: '#80c8e0',
      border: 'rgba(74,212,245,0.2)',
    },
  },
  {
    id: 'apology',
    tier: 'premium',
    scenario: '🤝 To make peace',
    name: 'Unsent Words',
    card: { bg: '#180a0a', accent: '#e87878', text: '#fff0f0' },
    email: {
      bg: '#180a0a',
      header: 'linear-gradient(135deg,#180a0a,#280f0f)',
      accent: '#e87878',
      text: '#fff0f0',
      dim: '#c08080',
      border: 'rgba(232,120,120,0.2)',
    },
  },
  {
    id: 'milestone',
    tier: 'premium',
    scenario: '🏆 For a milestone',
    name: 'The Summit',
    card: { bg: '#0f0a00', accent: '#ffa040', text: '#fff5e0' },
    email: {
      bg: '#0f0a00',
      header: 'linear-gradient(135deg,#0f0a00,#201500)',
      accent: '#ffa040',
      text: '#fff5e0',
      dim: '#c08040',
      border: 'rgba(255,160,64,0.2)',
    },
  },
  {
    id: 'friendship',
    tier: 'premium',
    scenario: '👫 Best friend',
    name: 'Old Friends',
    card: { bg: '#0a1808', accent: '#88d068', text: '#f0ffe8' },
    email: {
      bg: '#0a1808',
      header: 'linear-gradient(135deg,#0a1808,#152510)',
      accent: '#88d068',
      text: '#f0ffe8',
      dim: '#80b860',
      border: 'rgba(136,208,104,0.2)',
    },
  },
  {
    id: 'diagnosis',
    tier: 'premium',
    scenario: '💙 Through illness',
    name: 'Brave Words',
    card: { bg: '#08101e', accent: '#60a8e8', text: '#e0f0ff' },
    email: {
      bg: '#08101e',
      header: 'linear-gradient(135deg,#08101e,#101828)',
      accent: '#60a8e8',
      text: '#e0f0ff',
      dim: '#7090c0',
      border: 'rgba(96,168,232,0.2)',
    },
  },
  {
    id: 'parchment',
    tier: 'premium',
    scenario: '📜 Classic letter',
    name: 'Vintage Parchment',
    card: { bg: '#f5e8c8', accent: '#8b4513', text: '#2a1505' },
    email: {
      bg: '#f5e8c8',
      header: 'linear-gradient(135deg,#f5e8c8,#ead8a8)',
      accent: '#8b4513',
      text: '#2a1505',
      dim: '#7a5028',
      border: 'rgba(139,69,19,0.2)',
    },
  },
]
const FREE_IDS = ['cosmic', 'dawn', 'midnight-letter']

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--midnight:#080c14;--cosmos:#0d1525;--nebula:#111d35;--amber:#e8a84c;--gold:#f5c842;--parchment:#f2e8d5;--dim:#c8b898;--ink:#1a1005;}
  body{font-family:'Lora',serif;background:var(--midnight);color:var(--parchment);min-height:100vh;}

  /* NAV */
  nav{padding:1.1rem 2.5rem;display:flex;justify-content:space-between;align-items:center;
    border-bottom:1px solid rgba(232,168,76,0.1);background:rgba(8,12,20,0.95);
    position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
  .logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--amber);cursor:pointer;}
  .logo em{font-style:italic;color:var(--gold);}
  .nav-right{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}
  .user-email{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--dim);}
  .btn-sm{font-family:'JetBrains Mono',monospace;font-size:0.68rem;letter-spacing:0.1em;
    text-transform:uppercase;padding:0.45rem 1rem;border-radius:2px;cursor:pointer;
    transition:all 0.2s;border:none;}
  .btn-primary{background:var(--amber);color:var(--ink);}
  .btn-primary:hover{background:var(--gold);}
  .btn-ghost{background:transparent;color:var(--dim);border:1px solid rgba(232,168,76,0.2);}
  .btn-ghost:hover{border-color:var(--amber);color:var(--amber);}
  .btn-danger{background:transparent;color:#e87c7c;border:1px solid rgba(232,124,124,0.25);}
  .btn-danger:hover{background:rgba(232,124,124,0.08);border-color:#e87c7c;}
  .btn-icon{background:transparent;border:1px solid rgba(232,168,76,0.18);color:var(--dim);padding:0.38rem 0.7rem;font-size:0.7rem;}
  .btn-icon:hover{border-color:var(--amber);color:var(--amber);}

  /* DASHBOARD */
  .dashboard{max-width:1000px;margin:0 auto;padding:2.5rem 1.5rem;}
  .page-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.68rem;letter-spacing:0.3em;
    text-transform:uppercase;color:var(--amber);margin-bottom:0.65rem;}
  .page-title{font-family:'Playfair Display',serif;font-size:2.2rem;color:var(--parchment);
    line-height:1.2;margin-bottom:2rem;}
  .page-title em{font-style:italic;color:var(--amber);}

  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2.5rem;}
  .stat-card{background:rgba(255,255,255,0.03);border:1px solid rgba(232,168,76,0.1);
    border-radius:4px;padding:1.25rem;}
  .stat-num{font-family:'Playfair Display',serif;font-size:2.2rem;color:var(--amber);line-height:1;margin-bottom:0.3rem;}
  .stat-label{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.2em;
    text-transform:uppercase;color:var(--dim);}

  .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.5rem;}
  .section-title-sm{font-family:'Playfair Display',serif;font-size:1.25rem;color:var(--parchment);}
  .capsule-list{display:flex;flex-direction:column;gap:0.85rem;}
  .capsule-card{background:rgba(255,255,255,0.02);border:1px solid rgba(232,168,76,0.1);
    border-radius:4px;padding:1.25rem 1.5rem;transition:all 0.2s;}
  .capsule-card:hover{border-color:rgba(232,168,76,0.22);}
  .capsule-card-row{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center;}
  .capsule-to{font-family:'Playfair Display',serif;font-size:1.05rem;color:var(--parchment);margin-bottom:0.25rem;}
  .capsule-subject{font-size:0.85rem;color:var(--dim);font-style:italic;margin-bottom:0.4rem;}
  .capsule-meta{display:flex;gap:1.25rem;align-items:center;flex-wrap:wrap;}
  .capsule-date{font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--dim);}
  .badge{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.12em;
    text-transform:uppercase;padding:3px 9px;border-radius:2px;}
  .badge-pending{background:rgba(232,168,76,0.1);color:var(--amber);border:1px solid rgba(232,168,76,0.28);}
  .badge-delivered{background:rgba(100,200,100,0.1);color:#7dc97d;border:1px solid rgba(100,200,100,0.28);}
  .capsule-delivered{border-color:rgba(125,201,125,0.12);opacity:0.8;}
  .capsule-delivered:hover{border-color:rgba(125,201,125,0.25);}
  .delivered-note{margin-top:0.75rem;padding:0.55rem 0.85rem;background:rgba(125,201,125,0.04);border:1px solid rgba(125,201,125,0.12);border-radius:2px;font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:rgba(125,201,125,0.55);letter-spacing:0.04em;line-height:1.5;}
  .days-left{font-family:'Playfair Display',serif;font-size:1.75rem;color:rgba(232,168,76,0.4);text-align:right;line-height:1;}
  .days-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:var(--dim);text-align:right;letter-spacing:0.1em;text-transform:uppercase;}
  .card-actions{display:flex;gap:0.45rem;margin-top:1rem;padding-top:1rem;
    border-top:1px solid rgba(255,255,255,0.05);flex-wrap:wrap;align-items:center;}
  .share-link{font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:var(--dim);
    background:rgba(255,255,255,0.03);border:1px solid rgba(232,168,76,0.1);
    padding:0.35rem 0.7rem;border-radius:2px;cursor:pointer;transition:all 0.2s;letter-spacing:0.05em;}
  .share-link:hover{border-color:rgba(232,168,76,0.3);color:var(--amber);}
  .actions-spacer{flex:1;}

  /* DELETE CONFIRM */
  .confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:300;
    display:flex;align-items:center;justify-content:center;padding:2rem;backdrop-filter:blur(4px);}
  .confirm-box{background:var(--cosmos);border:1px solid rgba(232,124,124,0.3);
    border-radius:4px;padding:2rem;max-width:380px;width:100%;text-align:center;}
  .confirm-title{font-family:'Playfair Display',serif;font-size:1.25rem;color:var(--parchment);margin-bottom:0.65rem;}
  .confirm-desc{color:var(--dim);font-size:0.88rem;margin-bottom:1.5rem;line-height:1.6;font-style:italic;}
  .confirm-actions{display:flex;gap:0.65rem;justify-content:center;}

  /* EMPTY */
  .empty-state{text-align:center;padding:5rem 2rem;}
  .empty-icon{font-size:3rem;margin-bottom:1.5rem;opacity:0.4;}
  .empty-title{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--dim);margin-bottom:0.65rem;}
  .empty-desc{color:rgba(200,184,152,0.45);font-size:0.88rem;margin-bottom:2rem;font-style:italic;}

  /* LOADING */
  .loading{display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .loading-text{font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:var(--amber);
    letter-spacing:0.2em;animation:pulse 1.5s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}

  /* TOAST */
  .toast{position:fixed;bottom:1.5rem;right:1.5rem;background:var(--cosmos);
    border:1px solid rgba(232,168,76,0.3);border-radius:4px;padding:0.9rem 1.3rem;
    font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--parchment);
    z-index:999;animation:tIn 0.3s ease;max-width:300px;}
  .toast-error{border-color:rgba(232,124,124,0.4);color:#e87c7c;}
  @keyframes tIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}

  /* ── EDIT FLOW (full-page, 3 steps) ── */
  .edit-page{max-width:1200px;margin:0 auto;padding:2rem 1.5rem;}
  .back-btn{display:inline-flex;align-items:center;gap:0.4rem;font-family:'JetBrains Mono',monospace;
    font-size:0.65rem;letter-spacing:0.06em;color:var(--dim);cursor:pointer;
    background:none;border:none;padding:0;margin-bottom:1.5rem;transition:color 0.2s;}
  .back-btn:hover{color:var(--amber);}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.28em;
    text-transform:uppercase;color:var(--amber);margin-bottom:0.5rem;}
  .heading{font-family:'Playfair Display',serif;font-size:1.75rem;color:var(--parchment);
    margin-bottom:0.4rem;line-height:1.2;}
  .heading em{font-style:italic;color:var(--amber);}
  .subhead{color:var(--dim);font-size:0.85rem;font-style:italic;margin-bottom:1.75rem;}

  /* Step bar */
  .step-bar{display:flex;align-items:center;max-width:420px;margin:0 auto 2.5rem;}
  .sb-step{display:flex;flex-direction:column;align-items:center;gap:5px;}
  .sb-dot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-family:'JetBrains Mono',monospace;font-size:0.62rem;font-weight:700;transition:all 0.3s;}
  .sb-dot.active{background:var(--amber);color:var(--ink);box-shadow:0 0 14px rgba(232,168,76,0.35);}
  .sb-dot.done{background:rgba(232,168,76,0.14);color:var(--amber);border:1px solid rgba(232,168,76,0.32);}
  .sb-dot.todo{background:rgba(255,255,255,0.04);color:rgba(200,184,152,0.25);border:1px solid rgba(255,255,255,0.07);}
  .sb-label{font-family:'JetBrains Mono',monospace;font-size:0.54rem;letter-spacing:0.1em;
    text-transform:uppercase;white-space:nowrap;}
  .sb-label.active{color:var(--amber);}
  .sb-label.done{color:rgba(232,168,76,0.45);}
  .sb-label.todo{color:rgba(200,184,152,0.22);}
  .sb-line{flex:1;height:1px;background:rgba(232,168,76,0.12);margin:0 8px;margin-bottom:18px;}
  .sb-line.done{background:rgba(232,168,76,0.32);}

  /* Template grid */
  .tg{display:grid;grid-template-columns:repeat(6,1fr);gap:0.6rem;margin-bottom:2rem;}
  @media(max-width:1100px){.tg{grid-template-columns:repeat(5,1fr);}}
  @media(max-width:860px){.tg{grid-template-columns:repeat(4,1fr);}}
  @media(max-width:640px){.tg{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:400px){.tg{grid-template-columns:repeat(2,1fr);}}
  .tc{border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.18s;position:relative;}
  .tc:hover:not(.tc-locked){transform:translateY(-3px);box-shadow:0 8px 22px rgba(0,0,0,0.4);}
  .tc.sel{border-color:var(--amber);box-shadow:0 0 0 3px rgba(232,168,76,0.2);}
  .tc-pre{height:54px;padding:10px 12px;display:flex;flex-direction:column;justify-content:center;gap:4px;}
  .tc-bar{height:3px;border-radius:2px;}
  .tc-ln{height:2px;border-radius:1px;opacity:0.32;}
  .tc-meta{padding:6px 9px 9px;}
  .tc-sc{font-family:'JetBrains Mono',monospace;font-size:0.49rem;letter-spacing:0.06em;
    color:rgba(255,255,255,0.35);margin-bottom:2px;}
  .tc-nm{font-family:'Playfair Display',serif;font-size:0.7rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tc-lock{position:absolute;inset:0;background:rgba(8,12,20,0.68);display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:4px;backdrop-filter:blur(1px);}
  .tc-lock-badge{font-family:'JetBrains Mono',monospace;font-size:0.44rem;letter-spacing:0.1em;
    text-transform:uppercase;color:var(--amber);background:rgba(232,168,76,0.1);
    border:1px solid rgba(232,168,76,0.28);padding:2px 6px;border-radius:2px;}

  /* Chip */
  .sel-chip{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(232,168,76,0.07);
    border:1px solid rgba(232,168,76,0.18);border-radius:3px;padding:0.35rem 0.75rem;
    font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--amber);
    cursor:pointer;transition:all 0.2s;margin-bottom:1.25rem;}
  .sel-chip:hover{border-color:var(--amber);}
  .sel-dot{width:9px;height:9px;border-radius:50%;}

  /* Continue btn */
  .continue-btn-wrap{text-align:center;}
  .continue-btn{display:inline-flex;align-items:center;gap:0.6rem;background:var(--amber);
    color:var(--ink);border:none;padding:0.9rem 2.5rem;font-family:'Lora',serif;font-size:0.95rem;
    cursor:pointer;border-radius:2px;transition:all 0.2s;}
  .continue-btn:hover{background:var(--gold);}
  .continue-note{font-family:'JetBrains Mono',monospace;font-size:0.56rem;
    color:rgba(200,184,152,0.3);margin-top:0.6rem;letter-spacing:0.05em;}

  /* Edit form grid */
  .e2-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start;}
  @media(max-width:860px){.e2-grid{grid-template-columns:1fr;}}
  .sticky-prev{position:sticky;top:80px;}
  .prev-label{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.16em;
    text-transform:uppercase;color:var(--amber);margin-bottom:0.6rem;}
  .prev-note{font-family:'JetBrains Mono',monospace;font-size:0.52rem;
    color:rgba(200,184,152,0.26);text-align:center;margin-top:0.5rem;
    letter-spacing:0.08em;text-transform:uppercase;}

  /* Form */
  .fg{margin-bottom:1rem;}
  .fl{display:block;font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.16em;
    text-transform:uppercase;color:var(--amber);margin-bottom:0.4rem;}
  .fl span{color:var(--dim);text-transform:none;letter-spacing:0;font-size:0.58rem;}
  .fi,.fta{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(232,168,76,0.14);
    border-radius:2px;padding:0.75rem 0.9rem;color:var(--parchment);font-family:'Lora',serif;
    font-size:0.9rem;outline:none;transition:border-color 0.2s;}
  .fi:focus,.fta:focus{border-color:var(--amber);background:rgba(232,168,76,0.03);}
  .fi::placeholder,.fta::placeholder{color:rgba(200,184,152,0.28);font-style:italic;}
  .fi.readonly{opacity:0.45;cursor:not-allowed;}
  .fta{resize:vertical;min-height:160px;line-height:1.8;}
  .cc{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:var(--dim);text-align:right;margin-top:0.25rem;}
  .field-note{font-family:'JetBrains Mono',monospace;font-size:0.56rem;letter-spacing:0.05em;
    color:rgba(200,184,152,0.32);margin-top:3px;}
  .next-btn{width:100%;background:var(--amber);color:var(--ink);border:none;padding:0.9rem;
    font-family:'Lora',serif;font-size:0.92rem;cursor:pointer;border-radius:2px;
    transition:all 0.2s;margin-top:0.5rem;}
  .next-btn:hover{background:var(--gold);}
  .next-btn:disabled{opacity:0.55;cursor:not-allowed;}
  .ld-msg{padding:1rem;color:var(--dim);font-family:'JetBrains Mono',monospace;
    font-size:0.72rem;letter-spacing:0.1em;border:1px solid rgba(232,168,76,0.14);
    border-radius:2px;animation:pulse 1.5s ease-in-out infinite;}

  /* Review */
  .e3-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start;}
  @media(max-width:860px){.e3-grid{grid-template-columns:1fr;}}
  .review-card{background:var(--cosmos);border:1px solid rgba(232,168,76,0.14);border-radius:6px;padding:1.6rem;}
  .rc-title{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.2em;
    text-transform:uppercase;color:var(--amber);margin-bottom:1.2rem;}
  .rc-row{display:flex;align-items:baseline;gap:0.6rem;padding:0.55rem 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .rc-row:last-child{border-bottom:none;}
  .rc-key{font-family:'JetBrains Mono',monospace;font-size:0.56rem;letter-spacing:0.1em;
    text-transform:uppercase;color:var(--dim);min-width:75px;flex-shrink:0;}
  .rc-val{font-family:'Lora',serif;font-size:0.86rem;color:var(--parchment);line-height:1.5;word-break:break-word;}
  .rc-val.amber{color:var(--amber);}
  .rc-val.muted{color:var(--dim);}
  .rc-msg{font-style:italic;font-size:0.8rem;max-height:72px;overflow:hidden;position:relative;color:var(--dim);}
  .rc-msg::after{content:'';position:absolute;bottom:0;left:0;right:0;height:22px;background:linear-gradient(transparent,var(--cosmos));}
  .edit-link{font-family:'JetBrains Mono',monospace;font-size:0.56rem;color:rgba(232,168,76,0.5);
    cursor:pointer;background:none;border:none;transition:color 0.2s;text-decoration:underline;
    margin-left:auto;flex-shrink:0;}
  .edit-link:hover{color:var(--amber);}
  .save-btn{width:100%;background:var(--amber);color:var(--ink);border:none;padding:0.95rem;
    font-family:'Lora',serif;font-size:0.95rem;cursor:pointer;border-radius:2px;
    transition:all 0.2s;margin-top:1.25rem;letter-spacing:0.03em;}
  .save-btn:hover{background:var(--gold);}
  .save-btn:disabled{opacity:0.55;cursor:not-allowed;}
  .save-note{font-family:'JetBrains Mono',monospace;font-size:0.56rem;
    color:rgba(200,184,152,0.28);text-align:center;margin-top:0.5rem;letter-spacing:0.04em;}
  .divider{height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.1),transparent);margin:1.5rem 0;}

  /* Mobile */
  @media(max-width:720px){
    nav{padding:0.85rem 1.1rem;}
    .user-email{display:none;}
    .stats{grid-template-columns:1fr 1fr;gap:0.65rem;}
    .stat-card{padding:1rem;}
    .stat-num{font-size:1.8rem;}
    .dashboard{padding:1.5rem 1rem;}
    .capsule-card{padding:1rem 1.1rem;}
    .capsule-card-row{grid-template-columns:1fr auto;}
    .card-actions{flex-wrap:wrap;gap:0.4rem;}
    .section-header{flex-direction:column;align-items:flex-start;gap:0.5rem;}
    .edit-page{padding:1.5rem 1rem;}
    .continue-btn{padding:0.85rem 1.75rem;font-size:0.88rem;}
  }
  @media(max-width:420px){
    .stats{grid-template-columns:1fr;}
    nav{gap:0.4rem;}
  }
`

// ── Step indicator ────────────────────────────────────────────────
function StepBar({ step }) {
  const labels = ['Template', 'Edit', 'Review']
  return (
    <div className="step-bar">
      {labels.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'todo'
        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < labels.length - 1 ? 1 : undefined,
            }}
          >
            <div className="sb-step">
              <div className={`sb-dot ${state}`}>{state === 'done' ? '✓' : n}</div>
              <span className={`sb-label ${state}`}>{label}</span>
            </div>
            {i < labels.length - 1 && <div className={`sb-line ${step > n ? 'done' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ── 3-step Edit flow ──────────────────────────────────────────────
function EditFlow({ capsule, onClose, onSaved, showToast }) {
  const [step, setStep] = useState(1)
  const [template, setTemplate] = useState(capsule.template || 'cosmic')
  const [editForm, setEditForm] = useState({
    subject: '',
    message: '',
    from: capsule.from_name || '',
    loadingMsg: true,
  })
  const [saving, setSaving] = useState(false)

  const tmpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0]

  // Fetch full message on mount
  useEffect(() => {
    fetch(`/api/capsules/${capsule.id}`)
      .then(r => r.json())
      .then(d => {
        setEditForm(f => ({
          ...f,
          subject: d.capsule?.subject || capsule.subject || '',
          message: d.capsule?.message || '',
          loadingMsg: false,
        }))
      })
      .catch(() => setEditForm(f => ({ ...f, subject: capsule.subject || '', loadingMsg: false })))
  }, [capsule.id, capsule.subject])

  const sf = k => e => setEditForm(f => ({ ...f, [k]: e.target.value }))

  const previewForm = {
    to: capsule.to_name || '',
    toEmail: capsule.to_email || '',
    from: editForm.from,
    subject: editForm.subject,
    message: editForm.message,
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = {}
    if (editForm.subject !== capsule.subject) updates.subject = editForm.subject
    if (editForm.message) updates.message = editForm.message
    if (editForm.from !== capsule.from_name) updates.fromName = editForm.from
    if (template !== capsule.template) updates.template = template

    const res = await fetch(`/api/capsules/${capsule.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    setSaving(false)
    if (res.ok) {
      showToast('✦ Capsule updated')
      onSaved()
    } else {
      showToast('Failed to save changes', true)
    }
  }

  const formatDate = d =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="edit-page">
      <StepBar step={step} />

      {/* ── STEP 1: Change template ── */}
      {step === 1 && (
        <>
          <button className="back-btn" onClick={onClose}>
            ← Back to dashboard
          </button>
          <p className="eyebrow">Step 1 · Template</p>
          <h1 className="heading">
            Change the <em>look.</em>
          </h1>
          <p className="subhead">
            Your current template is highlighted. Pick a different one or keep it and continue.
          </p>

          <div className="tg">
            {TEMPLATES.map(t => {
              const locked = !FREE_IDS.includes(t.id)
              const sel = template === t.id
              return (
                <div
                  key={t.id}
                  className={`tc ${sel ? 'sel' : ''} ${locked ? 'tc-locked' : ''}`}
                  style={{ background: t.card.bg }}
                  onClick={() => !locked && setTemplate(t.id)}
                >
                  <div className="tc-pre" style={{ background: t.card.bg }}>
                    <div className="tc-bar" style={{ background: t.card.accent, width: '55%' }} />
                    <div className="tc-ln" style={{ background: t.card.text, width: '80%' }} />
                    <div className="tc-ln" style={{ background: t.card.text, width: '62%' }} />
                    <div className="tc-ln" style={{ background: t.card.text, width: '75%' }} />
                  </div>
                  <div className="tc-meta" style={{ background: `${t.card.bg}ee` }}>
                    <div className="tc-sc">{t.scenario}</div>
                    <div className="tc-nm" style={{ color: t.card.text }}>
                      {t.name}
                    </div>
                  </div>
                  {locked && (
                    <div className="tc-lock">
                      <span style={{ fontSize: '0.85rem' }}>🔒</span>
                      <span className="tc-lock-badge">Premium</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="continue-btn-wrap">
            <button className="continue-btn" onClick={() => setStep(2)}>
              Continue with {tmpl.name} →
            </button>
            <p className="continue-note">
              {tmpl.scenario} · {tmpl.desc || ''}
            </p>
          </div>
        </>
      )}

      {/* ── STEP 2: Edit form + live preview ── */}
      {step === 2 && (
        <>
          <button className="back-btn" onClick={() => setStep(1)}>
            ← Change template
          </button>
          <div className="sel-chip" onClick={() => setStep(1)}>
            <div className="sel-dot" style={{ background: tmpl.card.accent }} />
            {tmpl.scenario}&nbsp;&nbsp;{tmpl.name} &nbsp;· click to change
          </div>

          <p className="eyebrow">Step 2 · Edit your message</p>
          <h1 className="heading">
            Update the <em>words.</em>
          </h1>

          <div className="e2-grid">
            {/* Form */}
            <div>
              {/* Locked fields (read-only) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <label className="fl">
                    To <span>— locked</span>
                  </label>
                  <input className="fi readonly" readOnly value={capsule.to_name || ''} />
                  <p className="field-note">Can't change recipient after sealing</p>
                </div>
                <div>
                  <label className="fl">
                    Delivers on <span>— locked</span>
                  </label>
                  <input className="fi readonly" readOnly value={formatDate(capsule.deliver_at)} />
                  <p className="field-note">Delivery date is sealed</p>
                </div>
              </div>

              {/* Editable fields */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <label className="fl">
                    From <span>(optional)</span>
                  </label>
                  <input
                    className="fi"
                    type="text"
                    placeholder="Your name"
                    value={editForm.from}
                    onChange={sf('from')}
                  />
                </div>
                <div>
                  <label className="fl">
                    Subject <span>(optional)</span>
                  </label>
                  <input
                    className="fi"
                    type="text"
                    placeholder="Add a subject..."
                    value={editForm.subject}
                    onChange={sf('subject')}
                  />
                </div>
              </div>

              <div className="fg">
                <label className="fl">Message *</label>
                {editForm.loadingMsg ? (
                  <div className="ld-msg">✦ &nbsp; loading your message...</div>
                ) : (
                  <>
                    <textarea
                      className="fta"
                      value={editForm.message}
                      onChange={sf('message')}
                      placeholder="Write your message..."
                      maxLength={5000}
                    />
                    <div className="cc">{editForm.message.length} / 5000</div>
                  </>
                )}
              </div>

              <button
                className="next-btn"
                disabled={editForm.loadingMsg || !editForm.message}
                onClick={() => setStep(3)}
              >
                Review Changes →
              </button>
            </div>

            {/* Live preview */}
            <div>
              <div className="sticky-prev">
                <p className="prev-label">✦ Live preview — updates as you type</p>
                <EmailPreview templateId={template} form={previewForm} />
                <p className="prev-note">Exactly what lands in the inbox</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── STEP 3: Review + save ── */}
      {step === 3 && (
        <>
          <button className="back-btn" onClick={() => setStep(2)}>
            ← Back to editing
          </button>

          <p className="eyebrow">Step 3 · Review your changes</p>
          <h1 className="heading">
            Everything <em>look right?</em>
          </h1>
          <p className="subhead">
            Check the final preview before saving. These changes take effect immediately.
          </p>

          <div className="e3-grid">
            {/* Full email preview */}
            <div>
              <p className="prev-label">✦ Updated email preview</p>
              <EmailPreview templateId={template} form={previewForm} scale="large" />
            </div>

            {/* Summary + save */}
            <div>
              <div className="review-card">
                <p className="rc-title">✦ What's changing</p>

                <div className="rc-row">
                  <span className="rc-key">Template</span>
                  <span
                    className={`rc-val ${template !== (capsule.template || 'cosmic') ? 'amber' : 'muted'}`}
                  >
                    {tmpl.name} {template !== (capsule.template || 'cosmic') ? '← changed' : ''}
                  </span>
                  <button className="edit-link" onClick={() => setStep(1)}>
                    Change
                  </button>
                </div>
                <div className="rc-row">
                  <span className="rc-key">To</span>
                  <span className="rc-val muted">{capsule.to_name}</span>
                </div>
                {editForm.from && (
                  <div className="rc-row">
                    <span className="rc-key">From</span>
                    <span className="rc-val">{editForm.from}</span>
                  </div>
                )}
                <div className="rc-row">
                  <span className="rc-key">Subject</span>
                  <span
                    className={`rc-val ${editForm.subject !== (capsule.subject || '') ? 'amber' : 'muted'}`}
                  >
                    {editForm.subject || '(none)'}
                  </span>
                  <button className="edit-link" onClick={() => setStep(2)}>
                    Edit
                  </button>
                </div>
                <div className="rc-row" style={{ alignItems: 'flex-start' }}>
                  <span className="rc-key">Message</span>
                  <span className="rc-val rc-msg">{editForm.message}</span>
                  <button className="edit-link" onClick={() => setStep(2)}>
                    Edit
                  </button>
                </div>
                <div className="rc-row">
                  <span className="rc-key">Delivers</span>
                  <span className="rc-val muted">{formatDate(capsule.deliver_at)}</span>
                </div>

                <div className="divider" />

                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? '✦ Saving...' : '✦ Save Changes'}
                </button>
                <p className="save-note">Changes apply to the sealed capsule immediately</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCapsule, setEditingCapsule] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState(null)

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser()
      setUser(u)
      if (u) await fetchCapsules()
      setLoading(false)
    }
    init()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) await fetchCapsules()
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchCapsules = async () => {
    const res = await fetch('/api/capsules')
    const data = await res.json()
    if (data.capsules) setCapsules(data.capsules)
  }

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const deleteCapsule = async id => {
    const res = await fetch(`/api/capsules/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) {
      showToast('Capsule deleted')
      setCapsules(cs => cs.filter(c => c.id !== id))
    } else {
      showToast('Failed to delete', true)
    }
  }

  const toggleShare = async c => {
    const newVal = !c.share_enabled
    await fetch(`/api/capsules/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareEnabled: newVal }),
    })
    setCapsules(cs => cs.map(x => (x.id === c.id ? { ...x, share_enabled: newVal } : x)))
    showToast(newVal ? 'Share link enabled' : 'Share link disabled')
  }

  const copyShareLink = id => {
    navigator.clipboard.writeText(`${window.location.origin}/capsule/${id}`)
    showToast('✦ Link copied!')
  }

  const daysUntil = date => Math.max(0, Math.ceil((new Date(date) - new Date()) / 86400000))
  const formatDate = date =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div className="loading">
          <p className="loading-text">✦ &nbsp; opening vault &nbsp; ✦</p>
        </div>
      </>
    )

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return (
      <>
        <style>{styles}</style>
        <div className="loading">
          <p className="loading-text">✦ &nbsp; redirecting &nbsp; ✦</p>
        </div>
      </>
    )
  }

  const pending = capsules.filter(c => !c.delivered).length
  const delivered = capsules.filter(c => c.delivered).length

  return (
    <>
      <style>{styles}</style>
      {toast && <div className={`toast ${toast.isError ? 'toast-error' : ''}`}>{toast.msg}</div>}

      <nav>
        <div className="logo" onClick={() => (window.location.href = '/')}>
          Time<em>Capsula</em>
        </div>
        <div className="nav-right">
          <span className="user-email">{user.email}</span>
          {!editingCapsule && (
            <button
              className="btn-sm btn-primary"
              onClick={() => (window.location.href = '/write')}
            >
              + New Capsule
            </button>
          )}
          <button className="btn-sm btn-ghost" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Edit flow (full-page replacement) ── */}
      {editingCapsule ? (
        <EditFlow
          capsule={editingCapsule}
          onClose={() => setEditingCapsule(null)}
          onSaved={() => {
            setEditingCapsule(null)
            fetchCapsules()
          }}
          showToast={showToast}
        />
      ) : (
        <>
          {/* Delete confirm */}
          {deletingId && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <h3 className="confirm-title">Delete this capsule?</h3>
                <p className="confirm-desc">
                  This cannot be undone. The capsule will be permanently removed — your recipient
                  will never receive it.
                </p>
                <p
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.62rem',
                    color: 'rgba(232,168,76,0.6)',
                    marginTop: '0.75rem',
                    letterSpacing: '0.06em',
                  }}
                >
                  Only undelivered capsules can be deleted.
                </p>
                <div className="confirm-actions">
                  <button className="btn-sm btn-ghost" onClick={() => setDeletingId(null)}>
                    Keep it
                  </button>
                  <button className="btn-sm btn-danger" onClick={() => deleteCapsule(deletingId)}>
                    Yes, delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="dashboard">
            <div style={{ marginBottom: '2.5rem' }}>
              <p className="page-eyebrow">✦ Your vault</p>
              <h1 className="page-title">
                Your sealed <em>capsules.</em>
              </h1>
            </div>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-num">{capsules.length}</div>
                <div className="stat-label">Total Capsules</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{pending}</div>
                <div className="stat-label">Sealed & Waiting</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{delivered}</div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>

            <div className="section-header">
              <h2 className="section-title-sm">All Capsules</h2>
              <button
                className="btn-sm btn-primary"
                onClick={() => (window.location.href = '/write')}
              >
                + New Capsule
              </button>
            </div>

            {capsules.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✉️</div>
                <h3 className="empty-title">No capsules yet</h3>
                <p className="empty-desc">
                  Your vault is empty. Seal your first message to someone you love.
                </p>
                <button
                  className="btn-sm btn-primary"
                  onClick={() => (window.location.href = '/write')}
                >
                  Write Your First Capsule
                </button>
              </div>
            ) : (
              <div className="capsule-list">
                {capsules.map(c => (
                  <div
                    className={`capsule-card ${c.delivered ? 'capsule-delivered' : ''}`}
                    key={c.id}
                  >
                    <div className="capsule-card-row">
                      <div>
                        <div className="capsule-to">To: {c.to_name}</div>
                        {c.subject && <div className="capsule-subject">"{c.subject}"</div>}
                        <div className="capsule-meta">
                          <span className="capsule-date">
                            {c.delivered
                              ? `Delivered ${formatDate(c.deliver_at)}`
                              : `Opens ${formatDate(c.deliver_at)}`}
                          </span>
                          <span
                            className={`badge ${c.delivered ? 'badge-delivered' : 'badge-pending'}`}
                          >
                            {c.delivered ? '✓ Delivered' : '⏳ Sealed'}
                          </span>
                        </div>
                      </div>
                      {!c.delivered && (
                        <div>
                          <div className="days-left">
                            {daysUntil(c.deliver_at).toLocaleString()}
                          </div>
                          <div className="days-label">days left</div>
                        </div>
                      )}
                      {c.delivered && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '1.5rem' }}>📬</div>
                          <div
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.55rem',
                              color: 'rgba(125,201,125,0.6)',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              marginTop: '4px',
                            }}
                          >
                            sent
                          </div>
                        </div>
                      )}
                    </div>

                    {!c.delivered && (
                      <div className="card-actions">
                        <button className="btn-sm btn-icon" onClick={() => setEditingCapsule(c)}>
                          ✎ Edit
                        </button>
                        {c.share_enabled ? (
                          <>
                            <button className="share-link" onClick={() => copyShareLink(c.id)}>
                              🔗 Copy share link
                            </button>
                            <button className="btn-sm btn-icon" onClick={() => toggleShare(c)}>
                              ✕ Disable link
                            </button>
                          </>
                        ) : (
                          <button className="btn-sm btn-icon" onClick={() => toggleShare(c)}>
                            🔗 Enable share link
                          </button>
                        )}
                        <span className="actions-spacer" />
                        <button className="btn-sm btn-danger" onClick={() => setDeletingId(c.id)}>
                          ✕ Delete
                        </button>
                      </div>
                    )}

                    {c.delivered && (
                      <div className="delivered-note">
                        This capsule has been delivered and is now sealed in time. It cannot be
                        edited or deleted.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
