import { DivTitle, Main, SubTitle, SubtitleContainer } from "../Cadastro/style";
import { NavBar } from "../../components/NavBar/NavBar";
import { Container, Content, InputAI, InputContainer } from "./style";
import { useState } from "react";

export default function IA() {
  const [message, setMessage] = useState("");

  return (
    <Main>
      <DivTitle>
        <SubtitleContainer>
          <SubTitle>Recomendação com IA</SubTitle>
        </SubtitleContainer>
        <NavBar />
      </DivTitle>

      <Container>
        <Content>
          <h2>Assistente IA</h2>
        </Content>

        <InputContainer>
          <InputAI
            placeholder="Digite sua pergunta..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </InputContainer>
      </Container>
    </Main>
  );
}
