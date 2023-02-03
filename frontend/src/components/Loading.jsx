const customStyles = {
    backgroundColor: "rgba(0,0,0,0.10)"
  };
  
function Loading() {
    return (
    <div className="h-screen w-screen flex justify-center items-center" style={customStyles}>
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
    )
}
    
export default Loading;