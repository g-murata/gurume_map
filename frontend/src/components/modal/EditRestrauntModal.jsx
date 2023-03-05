export const EditRestrauntModal = (props) => {
  return (
    <>
      <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
        <div className="text-3xl font-bold text-center">
          編集
        </div>
        {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
        <div className="text-right">
          <button className="font-bold" onClick={() => props.onCloseDialog()}>Close</button>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
          店名
        </label>
        {/* TODO: hiddenはいくないね～書き換えられちゃうからね。リリース前に必ず直す。 */}
        <input type="hidden" id="id" name="id" value={props.restaurant.id}></input>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name"
          defaultValue={props.restaurant.name} />
        <div>
          {/* <label for="lat" className="block text-gray-700 text-sm font-bold mb-2">
            経緯
          </label> */}
          <input type="hidden" id="lat" name="lat" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.restaurant.lat}></input>
        </div>
        <div>
          {/* <label for="lng" className="block text-gray-700 text-sm font-bold mb-2">
            経度
          </label> */}
          <input type="hidden" id="lng" name="lng" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.restaurant.lng}></input>
        </div>
        <div className='flex justify-center '>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">更新</button>
        </div>
        <div className="text-right">
          <button className="font-bold" onClick={() => props.onCloseEditDialog()}>詳細画面に戻る</button>
        </div>
      </div>
    </>
  )
}

export default EditRestrauntModal;
