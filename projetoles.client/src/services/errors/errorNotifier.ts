const API_ERROR_EVENT = "pharmapro:api-error";

type ApiErrorDetail = {
  message: string;
};

export const notifyApiError = (message: string) => {
  if (!message || !message.trim()) return;

  window.dispatchEvent(
    new CustomEvent<ApiErrorDetail>(API_ERROR_EVENT, {
      detail: { message: message.trim() },
    }),
  );
};

export const onApiError = (listener: (message: string) => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ApiErrorDetail>;
    const message = customEvent.detail?.message;
    if (message) {
      listener(message);
    }
  };

  window.addEventListener(API_ERROR_EVENT, handler);
  return () => window.removeEventListener(API_ERROR_EVENT, handler);
};
