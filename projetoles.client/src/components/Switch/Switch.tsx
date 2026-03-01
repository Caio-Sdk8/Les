import { useState } from "react";
import { HiddenCheckbox, Slider, SwitchContainer } from "./style";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const ToggleSwitch = ({ checked, onChange }: SwitchProps) => {
  const toggle = () => onChange(!checked);
  return (
    <SwitchContainer onClick={toggle}>
      <HiddenCheckbox checked={checked} readOnly />
      <Slider checked={checked} />
    </SwitchContainer>
  );
};
