
export const AreaList = (props) => {

  const handleClick = (area) => {
    props.setSelectedArea(area);
  };

  return (
    <>
      エリア選択：
      <div className="flex">
      {(Object.keys(props.areas)).map(key => {  
        return(
          <>
            <button
              key={key}
              onClick={() => handleClick(Number(key))}
              className={`cursor-pointer text-white bg-gray-200 font-bold mx-2 px-2 rounded ${props.selectedArea === Number(key) ? 'bg-green-500 text-white' : ''}`} 
            >          
              {props.areas[Number(key)].name}
            </button>          
          </>
        )
      })}
      </div>
    </>

  )
}