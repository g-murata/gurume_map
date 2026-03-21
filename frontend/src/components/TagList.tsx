import React from 'react';
import { Tag, TagsTaggedItem } from '../types/index';

interface TagListProps {
  tags: Tag[];
  tags_tagged_items: { [key: string]: TagsTaggedItem };
}

export const TagList: React.FC<TagListProps> = (props) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(props.tags_tagged_items)).map(key => {
          const tag = props.tags.find(tag => tag.id === props.tags_tagged_items[key].tag_id);
          return(
          <div key={key}>
            {tag !== undefined && 
              <span className="bg-white border border-gray-200 text-gray-500 font-medium py-1 px-2.5 rounded-md text-xs shadow-sm">
                {tag.name}
              </span>
            }
          </div>
        )
      })}
    </div>
  )
}
