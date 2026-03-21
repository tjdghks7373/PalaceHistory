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
        <LogoAccent>▶</LogoAccent>
        <Logo>PALACE HISTORY</Logo>
      </LogoWrap>
      <Right>
        <ThemeToggle onClick={toggle}>
          {mode === "dark" ? "LIGHT" : "DARK"}
        </ThemeToggle>
        {session?.user && (
          <>
            <Divider>|</Divider>
            {session.user.image && (
              <Avatar
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={24}
                height={24}
              />
            )}
            <UserName>{session.user.name}</UserName>
            <SignOutButton onClick={() => signOut({ callbackUrl: "/login" })}>
              SIGN OUT
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
  padding: 0 32px;
  height: 52px;
  border-bottom: 1px solid var(--c-border);
  background-color: var(--c-bg);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoAccent = styled.span`
  font-size: 10px;
  color: var(--c-accent);
`;

const Logo = styled.span`
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.25em;
  color: var(--c-text);

  @media (max-width: 480px) {
    font-size: 10px;
    letter-spacing: 0.15em;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const ThemeToggle = styled.button`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--c-text-muted);
  transition: color 0.2s;

  &:hover {
    color: var(--c-text);
  }
`;

const Divider = styled.span`
  color: var(--c-border-hover);
`;

const Avatar = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 11px;
  color: var(--c-text-muted);
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    display: none;
  }
`;

const SignOutButton = styled.button`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--c-text-faint);
  transition: color 0.2s;

  &:hover {
    color: var(--c-accent);
  }
`;
