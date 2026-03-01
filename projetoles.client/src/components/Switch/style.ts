import styled from "styled-components";

export const SwitchContainer = styled.label`
  position: relative;
  align-items: center;
  display: inline-block;
  width: 40px;
  height: 24px;
`;

export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) => (checked ? "#4CAF50" : "#9D9D9E")};
  transition: 0.4s;
  border-radius: 100px;

  &::before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: ${({ checked }) => (checked ? "18px" : "2px")};
    bottom: 2px;
    top: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;
