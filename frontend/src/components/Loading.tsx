import React, { useState, useEffect } from 'react';

const customStyles: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.50)",
    position: "fixed",
    zIndex: 9999
}

const Loading: React.FC = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // 1秒以上かかった場合のみ表示フラグを立てる
        const timer = setTimeout(() => {
            setShow(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div 
          className={`h-screen w-screen flex justify-center items-center fixed left-0 top-0 transition-opacity duration-700 ease-in-out ${show ? 'opacity-100' : 'opacity-0'}`} 
          style={customStyles}
          data-testid="loading-spinner"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent" />
            <span className="text-white font-bold text-lg">読み込み中...</span>
          </div>
        </div>
    )
}

export default Loading;
