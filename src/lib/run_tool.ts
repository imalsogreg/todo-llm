import { useAtomValue } from "jotai";
import { type State, type Query } from "../../baml_client/types";
import { Tool } from "@/lib/utils";
import { messagesToUserAtom } from "./atoms";


function runTool(tool: Tool, state: State, query: Query) {
    const messagesToUser = useAtomValue(messagesToUserAtom);
    switch (tool.type) {
        case "message_to_user":
            return tool.message;
        case "add_item":
            return tool.title;
    }
}

