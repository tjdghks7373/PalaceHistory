"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/history");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Container><LoadingText>로딩 중...</LoadingText></Container>;
  }

  return (
    <Container>
      <Card>
        <Logo>PALACE</Logo>
        <Subtitle>HISTORY</Subtitle>
        <Description>
          주차별 Palace Skateboards 제품 히스토리를 확인하세요
        </Description>
        <GitHubButton onClick={() => signIn("github")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub로 로그인
        </GitHubButton>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--c-bg);
  padding: 16px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 40px;
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  width: 100%;
  max-width: 400px;

  @media (max-width: 480px) {
    padding: 36px 24px;
  }
`;

const Logo = styled.h1`
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--c-text);

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.span`
  font-size: 12px;
  letter-spacing: 0.4em;
  color: var(--c-text-muted);
  margin-top: -12px;
`;

const Description = styled.p`
  font-size: 13px;
  color: var(--c-text-muted);
  text-align: center;
  line-height: 1.6;
  margin: 8px 0 16px;
`;

const GitHubButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background-color: var(--c-text);
  color: var(--c-bg);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: opacity 0.2s;
  width: 100%;
  justify-content: center;

  &:hover {
    opacity: 0.85;
  }
`;

const LoadingText = styled.p`
  color: var(--c-text-muted);
  font-size: 14px;
`;
