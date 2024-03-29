
export const TagList = (props) => {
  return (
    <>
      {(Object.keys(props.tags_tagged_items)).map(key => {
          return(
          <>
            {/* TODO: undefined判定については、開発環境限定の処理にしてもよいかもしれんね？ */}
            {props.tags.find(tag => tag.id === props.tags_tagged_items[key].tag_id) !== undefined && 
              <div className="bg-gray-100 font-bold py-2 px-4 m-1 rounded-full inline-block">
                <p className="text-gray-600 text-xs md:text-base">
                  {props.tags.find(tag => tag.id === props.tags_tagged_items[key].tag_id).name}
                </p>
              </div>
            }
          </>
        )
      })}

    </>
  )
}
