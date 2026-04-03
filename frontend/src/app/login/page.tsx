"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/history");
  }, [status, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn("github");
  };

  if (status === "loading") {
    return (
      <Wrapper>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* Background Grid */}
      <BackgroundGrid />
      <BackgroundGlow />

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <LogoBadge>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          </LogoBadge>
          
          <HeroTitle>
            <TitleLine>PALACE</TitleLine>
            <TitleLine $accent>HISTORY</TitleLine>
          </HeroTitle>
          
          <HeroSubtitle>
            Weekly archive of Palace Skateboards drops.<br />
            Track releases, prices, and availability.
          </HeroSubtitle>

          <FeatureList>
            <FeatureItem>
              <FeatureIcon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </FeatureIcon>
              <FeatureText>Weekly drop archives</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </FeatureIcon>
              <FeatureText>KRW &amp; GBP prices</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </FeatureIcon>
              <FeatureText>Size chart info</FeatureText>
            </FeatureItem>
          </FeatureList>
        </HeroContent>

        {/* Login Card */}
        <LoginCard>
          <CardHeader>
            <CardBadge>ACCESS</CardBadge>
            <CardTitle>Sign in to continue</CardTitle>
            <CardDescription>
              Connect with GitHub to access the complete Palace archive.
            </CardDescription>
          </CardHeader>

          <Divider />

          <GitHubButton onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            )}
            <span>{isLoading ? "Connecting..." : "Continue with GitHub"}</span>
          </GitHubButton>

          <SecurityNote>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Secure authentication via GitHub OAuth</span>
          </SecurityNote>
        </LoginCard>
      </HeroSection>

      {/* Footer */}
      <Footer>
        <FooterText>PALACE HISTORY — Weekly Archive</FooterText>
      </Footer>
    </Wrapper>
  );
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--c-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--c-border) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%);
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(circle, var(--c-accent-soft) 0%, transparent 70%);
  opacity: 0.5;
  pointer-events: none;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ButtonSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const HeroSection = styled.section`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 80px;
  padding: clamp(40px, 8vw, 120px);
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 40px 24px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 968px) {
    align-items: center;
    text-align: center;
  }
`;

const LogoBadge = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-accent);
  color: white;
  border-radius: 16px;
  animation: ${float} 4s ease-in-out infinite;
`;

const HeroTitle = styled.h1`
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 0.95;
`;

const TitleLine = styled.span<{ $accent?: boolean }>`
  font-size: clamp(56px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: ${({ $accent }) => ($accent ? "var(--c-accent)" : "var(--c-text)")};
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: var(--c-text-muted);
  max-width: 400px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;

  @media (max-width: 968px) {
    align-items: center;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  color: var(--c-accent);
`;

const FeatureText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-secondary);
`;

const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 48px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  box-shadow: var(--c-card-shadow);
  max-width: 440px;
  width: 100%;
  justify-self: center;

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--c-accent);
`;

const CardTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--c-text);

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const CardDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-muted);
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-border), transparent);
`;

const GitHubButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--c-text);
  color: var(--c-bg);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: 12px;
  transition: all 0.2s ease;
  min-height: 56px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: var(--c-text-faint);
`;

const Footer = styled.footer`
  padding: 24px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const FooterText = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--c-text-faint);
`;
