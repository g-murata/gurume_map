
export const TagList = (props) => {
  return (
    <>
      {(Object.keys(props.tags_tagged_items)).map(key => {
          return(
          <>
            {props.tags[props.tags_tagged_items[key].tag_id] != undefined && 
              <div className="bg-gray-100 font-bold py-2 px-4 m-1 rounded-full inline-block">
                <p className="text-gray-600">
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
