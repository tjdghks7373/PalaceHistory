"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import styled from "styled-components";
import { useTheme } from "./ThemeContext";

export default function Header() {
  const { data: session } = useSession();
  const { mode, toggle } = useTheme();

  return (
    <Nav>
      <LogoWrap>
        <LogoIcon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--c-accent)" />
            <path d="M2 17L12 22L22 17" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="var(--c-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </LogoIcon>
        <LogoText>
          <LogoMain>PALACE</LogoMain>
          <LogoSub>HISTORY</LogoSub>
        </LogoText>
      </LogoWrap>
      
      <Right>
        <ThemeToggleWrap>
          <ThemeToggle onClick={toggle} $active={mode === "dark"}>
            <ThemeIcon>
              {mode === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </ThemeIcon>
            <span>{mode === "dark" ? "LIGHT" : "DARK"}</span>
          </ThemeToggle>
        </ThemeToggleWrap>
        
        {session?.user && (
          <>
            <Divider />
            <UserSection>
              {session.user.image && (
                <Avatar
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={28}
                  height={28}
                />
              )}
              <UserInfo>
                <UserName>{session.user.name}</UserName>
                <SignOutButton onClick={() => signOut({ callbackUrl: "/login" })}>
                  Sign Out
                </SignOutButton>
              </UserInfo>
            </UserSection>
          </>
        )}
      </Right>
    </Nav>
  );
}

const Nav = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 4vw, 48px);
  height: 64px;
  background: linear-gradient(180deg, var(--c-bg) 0%, var(--c-bg) 80%, transparent 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--c-border);
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const LogoMain = styled.span`
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--c-text);
`;

const LogoSub = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--c-accent);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ThemeToggleWrap = styled.div``;

const ThemeToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--c-text-muted);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 20px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--c-text);
    border-color: var(--c-border-hover);
    background: var(--c-surface-hover);
  }
`;

const ThemeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: var(--c-border);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--c-border);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--c-accent);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-secondary);
  letter-spacing: 0.02em;
`;

const SignOutButton = styled.button`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--c-text-muted);
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
    color: var(--c-accent);
  }
`;
