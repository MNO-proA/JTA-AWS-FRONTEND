
import { useEffect, useState } from 'react';
import logo from '/1024x1024.png'

const StartScreen = () => {
    const [showLogo, setShowLogo] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLogo(false);
      }, 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }, []);
  
    return (
      <div>
        {showLogo && (
          <div className="bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <img
              src={logo}
              style={{ width: "20rem", height: "20rem" }}
              alt="Logo"
            />
          </div>
        )}
      </div>
    );
}

export default StartScreen