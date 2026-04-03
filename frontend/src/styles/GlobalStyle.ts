import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root, [data-theme="dark"] {
    --c-bg: #000000;
    --c-bg-elevated: #0a0a0a;
    --c-surface: #111111;
    --c-surface-hover: #1a1a1a;
    --c-border: #222222;
    --c-border-hover: #3a3a3a;
    --c-text: #ffffff;
    --c-text-secondary: #e5e5e5;
    --c-text-muted: #888888;
    --c-text-faint: #555555;
    --c-overlay: rgba(0, 0, 0, 0.85);
    --c-badge-new-bg: #ffffff;
    --c-badge-new-text: #000000;
    --c-accent: #FF3B30;
    --c-accent-soft: rgba(255, 59, 48, 0.15);
    --c-gradient-start: #ff3b30;
    --c-gradient-end: #ff6b5b;
    --c-card-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
    --c-glow: 0 0 40px rgba(255, 59, 48, 0.15);
  }

  [data-theme="light"] {
    --c-bg: #fafafa;
    --c-bg-elevated: #ffffff;
    --c-surface: #ffffff;
    --c-surface-hover: #f5f5f5;
    --c-border: #e8e8e8;
    --c-border-hover: #d0d0d0;
    --c-text: #0a0a0a;
    --c-text-secondary: #2a2a2a;
    --c-text-muted: #666666;
    --c-text-faint: #999999;
    --c-overlay: rgba(0, 0, 0, 0.6);
    --c-badge-new-bg: #0a0a0a;
    --c-badge-new-text: #ffffff;
    --c-accent: #E63028;
    --c-accent-soft: rgba(230, 48, 40, 0.1);
    --c-gradient-start: #e63028;
    --c-gradient-end: #ff6b5b;
    --c-card-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    --c-glow: 0 0 40px rgba(230, 48, 40, 0.1);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  html, body {
    min-height: 100vh;
    background-color: var(--c-bg);
    color: var(--c-text);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    letter-spacing: -0.01em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background-color: var(--c-accent);
    color: white;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--c-bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--c-border-hover);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--c-text-muted);
  }
`;

export default GlobalStyle;
