import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  height: "60vh",
  // TODO:widthはスマホの時だけ100%にしたい。
  width: "100%",
};

const center = {
  lat: 35.666333273506176,
  lng: 139.75424473120108,
};

const positionIshiBill = {
  lat: 35.666333273506176,
  lng: 139.75424473120108,
};

const positionKankoku = {
  lat: 35.66702060417376,
  lng: 139.75487166876127,
};

const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const url = process.env.REACT_APP_GOOGLE_MAP_API_KEY

export const Main = () => {
  const [size, setSize] = useState(undefined);
  const infoWindowOptions = {
    pixelOffset: size,
  };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };

  const testFunction = () => {
    alert("ここでモーダルを出して詳細を表示させたいのさ");
  };

  return (
    <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
      <div class="flex items-center flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
          <Marker position={positionIshiBill} />
          <Marker position={positionKankoku} />
          <InfoWindow position={positionIshiBill} options={infoWindowOptions}>
            <div style={divStyle}>
              <h1>石井ビル</h1>
            </div>
          </InfoWindow>
          <InfoWindow position={positionKankoku} options={infoWindowOptions}>
            <div style={divStyle} cursor-pointer button onClick={testFunction}>
              <h1>ヨプの王豚塩焼</h1>
              <p>飲み会でよく行く。</p>
            </div>
          </InfoWindow>
        </GoogleMap>
      </div>          
    </LoadScript>
  );
};

export default Main;