import { Container, Content, InputAI, InputContainer } from "./style";
import { useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";

export default function IA() {
  const [message, setMessage] = useState("");

  return (
    <AppShell title="Recomendação com IA">
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
    </AppShell>
  );
}
