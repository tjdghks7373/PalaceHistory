import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root, [data-theme="dark"] {
    --c-bg: #0a0a0a;
    --c-surface: #111;
    --c-surface-hover: #161616;
    --c-border: #1a1a1a;
    --c-border-hover: #333;
    --c-text: #f0f0f0;
    --c-text-secondary: #ccc;
    --c-text-muted: #666;
    --c-text-faint: #444;
    --c-overlay: rgba(0, 0, 0, 0.75);
    --c-badge-new-bg: #fff;
    --c-badge-new-text: #000;
  }

  [data-theme="light"] {
    --c-bg: #f7f7f7;
    --c-surface: #fff;
    --c-surface-hover: #f0f0f0;
    --c-border: #e0e0e0;
    --c-border-hover: #aaa;
    --c-text: #0a0a0a;
    --c-text-secondary: #333;
    --c-text-muted: #777;
    --c-text-faint: #bbb;
    --c-overlay: rgba(0, 0, 0, 0.5);
    --c-badge-new-bg: #000;
    --c-badge-new-text: #fff;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    min-height: 100vh;
    background-color: var(--c-bg);
    color: var(--c-text);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s, color 0.2s;
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
`;

export default GlobalStyle;
