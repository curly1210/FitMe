/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactNode,
  // useContext,
  useEffect,
  useState,
} from "react";

interface ModalContextType {
  openPopup: (content: React.ReactNode) => void;
  closePopup: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  openPopup: () => {},
  closePopup: () => {},
});

// export const useModalContext = () => {
//   return useContext(ModalContext);
// };

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isShowing]);

  const openPopup = (content: ReactNode) => {
    setIsShowing(true);
    setContent(content);
  };

  const closePopup = () => {
    setIsShowing(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {isShowing && (
        <div className="fixed inset-0 ">
          {/* <div className="absolute inset-0 bg-slate-600/60"></div> */}
          <div
            onClick={() => setIsShowing(false)}
            className="absolute inset-0 flex items-center justify-center bg-slate-600/60 "
          >
            <div
              className="bg-white  max-h-[95vh] overflow-y-auto rounded shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
