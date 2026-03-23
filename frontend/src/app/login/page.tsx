"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const introRef = useRef<HTMLDivElement>(null);
  const bigTitleRef = useRef<HTMLHeadingElement>(null);
  const introMetaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === "authenticated") router.push("/weeks");
  }, [status, router]);

  useEffect(() => {
    if (status === "loading" || status === "authenticated") return;

    const ctx = gsap.context(() => {
      gsap.from(bigTitleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(introMetaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8,
      });
      gsap.from(scrollHintRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 1.4,
      });
      gsap.from(formCardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formSectionRef.current,
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, [status]);

  const handleBtnEnter = () =>
    gsap.to(btnRef.current, { scale: 1.02, duration: 0.2, ease: "power2.out" });
  const handleBtnLeave = () =>
    gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });

  if (status === "loading") {
    return (
      <Wrapper>
        <LoadingText>—</LoadingText>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* Section 1: Brand Intro */}
      <IntroSection ref={introRef}>
        <IntroInner>
          <BigTitle ref={bigTitleRef}>
            <TitleLine>PALACE</TitleLine>
            <TitleLine $accent>HISTORY</TitleLine>
          </BigTitle>
          <IntroMeta ref={introMetaRef}>
            <MetaItem>PALACE SKATEBOARDS</MetaItem>
            <MetaDot>·</MetaDot>
            <MetaItem>WEEKLY ARCHIVE</MetaItem>
            <MetaDot>·</MetaDot>
            <MetaItem>ALL DROPS</MetaItem>
          </IntroMeta>
        </IntroInner>
        <ScrollHint ref={scrollHintRef}>
          <ScrollLine />
          <ScrollLabel>SCROLL</ScrollLabel>
        </ScrollHint>
      </IntroSection>

      {/* Section 2: Login */}
      <FormSection ref={formSectionRef}>
        <FormCard ref={formCardRef}>
          <FormLabel>ACCESS</FormLabel>
          <FormHeading>
            GitHub 계정으로<br />로그인하세요
          </FormHeading>
          <FormDivider />
          <FormDesc>
            주차별 Palace Skateboards 드롭 히스토리,<br />
            가격 및 재고 정보를 확인할 수 있습니다.
          </FormDesc>
          <GitHubButton
            ref={btnRef}
            onClick={() => signIn("github")}
            onMouseEnter={handleBtnEnter}
            onMouseLeave={handleBtnLeave}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </GitHubButton>
        </FormCard>
        <FormBg>PALACE</FormBg>
      </FormSection>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  background-color: var(--c-bg);
`;

const IntroSection = styled.section`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8vw;
  position: relative;
  border-bottom: 1px solid var(--c-border);
`;

const IntroInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const BigTitle = styled.h1`
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 0.9;
`;

const TitleLine = styled.span<{ $accent?: boolean }>`
  font-size: clamp(72px, 14vw, 200px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${({ $accent }) => ($accent ? "var(--c-accent)" : "var(--c-text)")};
  display: block;
`;

const IntroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--c-text-muted);
`;

const MetaDot = styled.span`
  color: var(--c-border-hover);
  font-size: 11px;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 40px;
  left: 8vw;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ScrollLine = styled.div`
  width: 32px;
  height: 1px;
  background-color: var(--c-border-hover);
`;

const ScrollLabel = styled.span`
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--c-text-muted);
`;

const FormSection = styled.section`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const FormBg = styled.div`
  position: absolute;
  right: -4vw;
  bottom: -6vh;
  font-size: clamp(120px, 22vw, 340px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--c-surface);
  pointer-events: none;
  user-select: none;
  line-height: 1;
`;

const FormCard = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 56px 48px;
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  width: 100%;
  max-width: 480px;
  margin: 0 16px;

  @media (max-width: 480px) {
    padding: 40px 28px;
  }
`;

const FormLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--c-accent);
`;

const FormHeading = styled.h2`
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--c-text);

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const FormDivider = styled.div`
  width: 32px;
  height: 2px;
  background-color: var(--c-accent);
`;

const FormDesc = styled.p`
  font-size: 13px;
  color: var(--c-text-muted);
  line-height: 1.7;
`;

const GitHubButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background-color: var(--c-text);
  color: var(--c-bg);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  width: 100%;
  margin-top: 8px;
  transform-origin: center;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: var(--c-text-muted);
  font-size: 24px;
`;
