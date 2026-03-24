import axios from "axios";

const DEFAULT_ERROR_MESSAGE = "Não foi possível concluir a operação. Tente novamente.";
const NETWORK_ERROR_MESSAGE = "Não foi possível conectar ao servidor. Verifique sua conexão.";

const extractValidationErrors = (errors: unknown): string | null => {
  if (!errors || typeof errors !== "object") return null;

  const values = Object.values(errors as Record<string, unknown>);
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) {
      const first = value.find((item) => typeof item === "string");
      if (typeof first === "string" && first.trim().length > 0) {
        return first;
      }
    }
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return null;
};

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_CANCELED") {
      return "";
    }

    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }

    const responseData = error.response.data as
      | {
          message?: string;
          title?: string;
          errors?: Record<string, unknown>;
        }
      | undefined;

    if (typeof responseData?.message === "string" && responseData.message.trim().length > 0) {
      return responseData.message;
    }

    const validationMessage = extractValidationErrors(responseData?.errors);
    if (validationMessage) {
      return validationMessage;
    }

    if (typeof responseData?.title === "string" && responseData.title.trim().length > 0) {
      return responseData.title;
    }

    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};
