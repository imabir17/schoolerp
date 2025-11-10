
type ToastListener = (message: string) => void;

class ToastService {
  private listener: ToastListener | null = null;

  subscribe(listener: ToastListener) {
    this.listener = listener;
  }

  unsubscribe() {
    this.listener = null;
  }

  show(message: string) {
    if (this.listener) {
      this.listener(message);
    }
  }
}

export const toastService = new ToastService();
