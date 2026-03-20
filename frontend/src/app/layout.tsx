import type { Metadata } from "next";
import Providers from "./providers";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyleWrapper from "@/components/GlobalStyleWrapper";

export const metadata: Metadata = {
  title: "Palace History",
  description: "Palace Skateboards 주차별 제품 히스토리",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <GlobalStyleWrapper />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
