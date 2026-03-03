import { ReactNode } from "react";
import { NavBar } from "../NavBar/NavBar";
import {
  AppContent,
  AppMain,
  HeaderBar,
  HeaderInner,
  HeaderTitle,
} from "./style";
import LogoPhoto from "../../assets/LogoPharma.png";
import { useNavigate } from "react-router-dom";

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export const AppShell = ({ title, children }: AppShellProps) => {
  const navigate = useNavigate();

  return (
    <AppMain>
      <HeaderBar>
        <HeaderInner>
          <img
            src={LogoPhoto}
            alt="Logo"
            style={{
              width: "100px",
              height: "50px",
            }}
            onClick={() => navigate("/loja")}
          />
          <HeaderTitle>{title}</HeaderTitle>
          <NavBar />
        </HeaderInner>
      </HeaderBar>
      <AppContent>{children}</AppContent>
    </AppMain>
  );
};
