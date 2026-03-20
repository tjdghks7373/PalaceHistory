"use client";

import { useSession, signOut } from "next-auth/react";
import styled from "styled-components";
import { useTheme } from "./ThemeContext";

export default function Header() {
  const { data: session } = useSession();
  const { mode, toggle } = useTheme();

  return (
    <Nav>
      <Logo>PALACE HISTORY</Logo>
      <Right>
        <ThemeToggle onClick={toggle} title={mode === "dark" ? "라이트 모드" : "다크 모드"}>
          {mode === "dark" ? "☀" : "☾"}
        </ThemeToggle>
        {session?.user && (
          <>
            <UserName>{session.user.name}</UserName>
            <SignOutButton onClick={() => signOut({ callbackUrl: "/login" })}>
              로그아웃
            </SignOutButton>
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
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid var(--c-border);
  background-color: var(--c-bg);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

const Logo = styled.span`
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--c-text);

  @media (max-width: 480px) {
    font-size: 11px;
    letter-spacing: 0.15em;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const ThemeToggle = styled.button`
  font-size: 16px;
  color: var(--c-text-muted);
  padding: 4px;
  transition: color 0.2s;
  line-height: 1;

  &:hover {
    color: var(--c-text);
  }
`;

const UserName = styled.span`
  font-size: 12px;
  color: var(--c-text-muted);

  @media (max-width: 480px) {
    display: none;
  }
`;

const SignOutButton = styled.button`
  font-size: 12px;
  color: var(--c-text-faint);
  letter-spacing: 0.05em;
  transition: color 0.2s;

  &:hover {
    color: var(--c-text);
  }
`;
