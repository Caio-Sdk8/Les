import { ReactNode } from "react";
import { NavBar } from "../NavBar/NavBar";
import {
  AppContent,
  AppMain,
  HeaderBar,
  HeaderInner,
  HeaderTitle,
} from "./style";

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export const AppShell = ({ title, children }: AppShellProps) => {
  return (
    <AppMain>
      <HeaderBar>
        <HeaderInner>
          <HeaderTitle>{title}</HeaderTitle>
          <NavBar />
        </HeaderInner>
      </HeaderBar>
      <AppContent>{children}</AppContent>
    </AppMain>
  );
};
