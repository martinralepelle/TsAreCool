import { createContext, useContext, useState, ReactNode } from "react";

interface ToastState {
  visible: boolean;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
  toast: ToastState;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: ""
  });

  const showToast = (message: string, duration = 3000) => {
    setToast({ visible: true, message });
    
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      
      {/* Toast Notification */}
      <div 
        className={`fixed bottom-4 right-4 bg-[#1D3557] text-white px-6 py-3 rounded-md shadow-lg z-50 transition-all duration-300 ${
          toast.visible 
            ? "transform-none opacity-100" 
            : "transform translate-y-20 opacity-0"
        }`}
      >
        <div className="flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          <span>{toast.message}</span>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToastNotification = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastNotification must be used within a ToastNotificationProvider");
  }
  return context;
};
