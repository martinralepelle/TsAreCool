import { useLocation } from "wouter";

const Footer = () => {
  const [, navigate] = useLocation();

  return (
    <footer className="bg-white shadow-sm mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-[#457B9D] text-sm">© {new Date().getFullYear()} Ts Are Cool. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-[#457B9D] hover:text-[#1D3557]">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-[#457B9D] hover:text-[#1D3557]">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-[#457B9D] hover:text-[#1D3557]">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button 
              onClick={() => navigate("/help")} 
              className="text-xs text-[#457B9D] hover:text-[#1D3557]"
            >
              Help & FAQs
            </button>
            <button 
              onClick={() => navigate("/terms")} 
              className="text-xs text-[#457B9D] hover:text-[#1D3557]"
            >
              Terms & Privacy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
