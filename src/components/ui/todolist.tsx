import * as types from "../../../baml_client/types";

function TodoList(props: { items: types.TodoItem[] }) {
    return (
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 w-full">
            {props.items.map((item) => (
                <TodoItem key={item.id} item={item} />
            ))}
        </div>
    );
}

export { TodoList };

function TodoItem(props: { item: types.TodoItem }) {
    const completed_at =
        props.item.completed_at ? <div>{new Date(props.item.completed_at * 1000).toLocaleString()}</div> : <div></div>;
    return (
        <>
            <div className="flex items-center">
                <input type="checkbox" defaultChecked={props.item.completed_at !== null} />
            </div>
            <div className="truncate">{props.item.title}</div>
            <div>
                {completed_at}
            </div>
            <div className="flex gap-2">
                {props.item.tags.map((tag) => (
                    <div key={tag} className="px-2 py-1 bg-gray-100 rounded">{tag}</div>
                ))}
            </div>
        </>
    );
}
