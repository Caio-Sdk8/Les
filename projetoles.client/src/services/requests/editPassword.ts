import { PasswordForm } from "../../components/Modals/Senha";
import api from "./api";

export const UpdatePassword = async (uuid: string, payload: PasswordForm) => {
  await api.patch(`/api/customers/${uuid}/password`, payload);
};
