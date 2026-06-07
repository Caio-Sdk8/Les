import { useNavigate } from "react-router-dom";
import CarrinhoIcon from "../../assets/Carrinho.png";
import LogoPhoto from "../../assets/LogoPharma.png";
import {
  CartButton,
  HeaderContainer,
  HeaderContent,
  Logo,
  NavActions,
  NavLink,
  SearchInput,
} from "./style";

type StoreHeaderProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export const StoreHeader = ({
  searchValue,
  onSearchChange,
}: StoreHeaderProps) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <HeaderContent>
        <img
          src={LogoPhoto}
          alt="Logo"
          style={{
            width: "100px",
            height: "50px",
          }}
          onClick={() => navigate("/loja")}
        />

        <SearchInput
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar produto, categoria ou marca"
        />

        <NavActions>
          <NavLink onClick={() => navigate("/loja")}>Início</NavLink>
          <NavLink onClick={() => navigate("/clientes")}>Clientes</NavLink>
          <NavLink onClick={() => navigate("/pedidos")}>Pedidos</NavLink>
          <CartButton onClick={() => navigate("/carrinho")}>
            <img src={CarrinhoIcon} alt="Carrinho" />
          </CartButton>
        </NavActions>
      </HeaderContent>
    </HeaderContainer>
  );
};
