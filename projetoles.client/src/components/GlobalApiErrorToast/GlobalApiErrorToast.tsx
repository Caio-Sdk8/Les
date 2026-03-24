import { useEffect, useMemo, useState } from "react";
import { onApiError } from "../../services/errors/errorNotifier";
import {
  ToastCard,
  ToastCloseButton,
  ToastMessage,
  ToastViewport,
} from "./style";

type ToastItem = {
  id: number;
  message: string;
};

const TOAST_TTL_MS = 5000;
const MAX_TOASTS = 3;

export const GlobalApiErrorToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return onApiError((message) => {
      setToasts((current) => {
        const alreadyVisible = current.some((toast) => toast.message === message);
        if (alreadyVisible) {
          return current;
        }

        const item: ToastItem = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          message,
        };

        return [item, ...current].slice(0, MAX_TOASTS);
      });
    });
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, TOAST_TTL_MS),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  const hasToasts = useMemo(() => toasts.length > 0, [toasts.length]);

  if (!hasToasts) {
    return null;
  }

  return (
    <ToastViewport aria-live="assertive" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} role="status">
          <ToastMessage>{toast.message}</ToastMessage>
          <ToastCloseButton
            type="button"
            onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            aria-label="Fechar mensagem de erro"
          >
            ×
          </ToastCloseButton>
        </ToastCard>
      ))}
    </ToastViewport>
  );
};
