export const CreateRestrauntModal = (props) => {
  return (
    <>
      <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
      <div className="text-3xl font-bold text-center">
        新規店名登録
      </div>
      {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
      <div className="text-right">
        {/* <button className="font-bold" onClick={closeModal}>Close</button> */}
      </div>
      <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
        店名
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name" />
      <div>
        {/* <label for="lat" className="block text-gray-700 text-sm font-bold mb-2">
          経緯
        </label> */}
        <input type="hidden" id="lat" name="lat" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.coordinateLat}></input>
      </div>
      <div>
        {/* <label for="lng" className="block text-gray-700 text-sm font-bold mb-2">
          経度
        </label> */}
        <input type="hidden" id="lng" name="lng" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.coordinateLng}></input>
      </div>
      <div className='flex justify-center '>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">登録</button>
      </div>
      </div>
  </>
  )
}

export default CreateRestrauntModal;