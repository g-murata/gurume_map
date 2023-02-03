const customStyles = {
    backgroundColor: "rgba(0,0,0,0.10)",
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%"
}

function Loading() {
    return (
        <div className="z-10 h-screen w-screen flex justify-center items-center" style={customStyles}>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            <h1>ローディングなう</h1>
        </div>
    )
}

export default Loading;
