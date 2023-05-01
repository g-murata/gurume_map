const customStyles = {
    // backgroundColor: "rgba(0,0,0,0.30)",
    position: "fixed"
}

function Loading() {
    return (
        <div className="z-10 h-screen w-screen flex justify-center items-center absolute left-0 top-0 h-full w-full " style={customStyles}>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
    )
}

export default Loading;
