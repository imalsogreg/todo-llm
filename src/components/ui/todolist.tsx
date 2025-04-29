import * as types from "../../../baml_client/types";

function TodoList(props: { items: types.TodoItem[], onCheckboxClick: (item_id: number) => void }) {
    return (
        <div className="flex flex-col gap-1 grow-1 p-5">
            {props.items.map((item) => (
                <TodoItem key={item.id} item={item} onCheckboxClick={props.onCheckboxClick} />
            ))}
        </div>
    );
}

export { TodoList };

function TodoItem(props: { item: types.TodoItem, onCheckboxClick: (item_id: number) => void }) {
    const completed_at: string =
        props.item.completed_at ? new Date(props.item.completed_at * 1000).toLocaleString() : "";
    return (
        <div className="h-20 flex flex-row p-2 bg-slate-100 items-center gap-2">
            <div className="">
                <input
                  type="checkbox"
                  checked={props.item.completed_at !== null}
                  onChange={() => props.onCheckboxClick(props.item.id)}
                  />
            </div>
            <div className="truncate w-72">{props.item.title}</div>
            <div className="flex gap-2 grow-2">
                {props.item.tags.map((tag) => (
                    <div key={tag} className="px-2  bg-gray-100 rounded">{tag}</div>
                ))}
            </div>
            <div className="pr-2">
                {completed_at}
            </div>
        </div>
    );
}
