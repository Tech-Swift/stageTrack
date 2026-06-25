import  LoginForm from "./LoginForm";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({
  open,
  onClose,
}: LoginModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
}