import { useState } from "react";

export const AreaList = (props) => {
  const areas = [
    { id: 1, name: "新橋" },
    { id: 2, name: "赤坂見附" }
  ];

  // const [selectedArea, setSelectedArea] = useState(2);
  const [selectedArea, setSelectedArea] = useState(1);

  const handleClick = (area) => {
    setSelectedArea(area.id);
    console.log(`Selected area: ${area.name}`);
    // ここでフィルターする
  };

  console.log(props.restaurants)

  return (
    <div>
      <div>
        {areas.map((area) => (
          <button
            key={area.id}
            onClick={() => handleClick(area)}
            className={`cursor-pointer text-white bg-blue-200 font-bold mx-2 px-2 rounded ${selectedArea === area.id ? 'bg-red-400 text-black' : ''}`} 
          >
            {area.name}
          </button>
        ))}
      </div>
    </div>
  );

}