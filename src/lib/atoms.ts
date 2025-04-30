import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { State, TodoList } from "../../baml_client";

const todoListAtom = atomWithStorage<TodoList>("todoList", { items: [] });

const messagesToUserAtom = atom<string[]>([]);

const stateAtom = atomWithStorage<State>("todoState", {
    tool_history: [],
    todo_list: { items: [] }
});

export { todoListAtom, messagesToUserAtom, stateAtom };