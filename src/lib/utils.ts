import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export function isEmbeddedBrowser() {
  if (!browser) return false;
  // @ts-expect-error
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isFacebookEmbedded = /FBAN|FBAV|FB_IAB|FBIOS|FBSS/i.test(userAgent);

  return isFacebookEmbedded;
}

export const globalConfirmationModalProps = writable<{
  show: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}>({
  title: undefined,
  message: undefined,
  onConfirm: () => {},
  onCancel: () => {},
  show: false,
});

export const confirmAction = (actionHandler: () => any, confirmationModalOptions: { title?: string; message?: string } = {}) => {
  const { title, message } = confirmationModalOptions;
  globalConfirmationModalProps.update((props) => ({
    ...props,
    title,
    message,
    onConfirm: () => {
      actionHandler();
      globalConfirmationModalProps.update((props) => ({ ...props, show: false }));
    },
    show: true,
    onCancel: () => {
      globalConfirmationModalProps.update((props) => ({ ...props, show: false }));
    },
  }));
};
