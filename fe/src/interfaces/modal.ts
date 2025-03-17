export interface modal {
  name: string;
  input?: boolean;
  confirmButton?: boolean;
  cancelButton?: boolean;
  status?: "success" | "error" | "warning" | "info" | "none";
  placeHolder?: string;
  onConfirm?: (inputValue: string) => void;
  onCancel?: () => void;
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
  description?: string;
}

export interface modalUpload {
  isOpen: boolean
  onClose: () => void
}