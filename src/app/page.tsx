"use client";

import Image from "next/image";
import { QueryArea } from "@/components/ui/queryarea";
import { TodoList } from "@/components/ui/todolist";
import { MessagesToUser } from "@/components/ui/messagestouser";

import { useSelectTools } from "../../baml_client/react/hooks";
import * as types from "../../baml_client/types";
import * as partial_types from "../../baml_client/partial_types";

import { stateAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { useState, useRef, useEffect, useCallback } from "react";

export default function Home() {
  const [state, setState] = useAtom(stateAtom);

  // As tool calls are streamed in, we need to keep track of which
  // which instructions we have already executed.
  const finishedInstructionsRef = useRef(new Set<number>());

  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const hook = useSelectTools({
    stream: true,
    onFinalData: (chunk) => {
      hook.reset();
      finishedInstructionsRef.current = new Set<number>();
      setRunning(false);
    },
    onStreamData: (chunk) => {
      console.log("Stream data: ", chunk, " finishedInstructionsRef: ", finishedInstructionsRef.current)
      if (chunk) {
        // Take the last tool off the list. Any other tools have been
        // executed already.
        // const tool = chunk[instructionCounterRef.current];
        let tool_id = chunk.length - 1;
        const tool = chunk[tool_id];
        console.log("Tool: ", tool)

        // if (tool && tool.type !== "message_to_user") {
        //   instructionCounterRef.current = instructionCounterRef.current + 1;
        // }

        console.log("sanity check: tool_id: ", tool_id)

        // Pass if we've already executed this instruction.
        if (finishedInstructionsRef.current.has(tool_id)) {
          return;
        }

        if (tool?.type === "add_item") {
          if (tool) {
            const new_item: types.TodoItem = {
              id: state.todo_list.items.length + 1,
              title: tool.title,
              tags: tool?.tags ?? [],
              created_at: Math.floor(Date.now() / 1000.0),
              completed_at: null,
              deleted: false,
            }
            state.todo_list.items.push(new_item);
            setState(state);
          }
        }

        if (tool?.type === "adjust_item") {
          setState((state) => {
            const item_id = tool.item_id;
            // Get a reference to the item, by finding the one with the matching id.
            const item = state.todo_list.items.find((item) => item.id === item_id);
            if (item) {
              item.title = tool.title ?? item.title;
              item.completed_at = tool.completed_at;
              item.deleted = tool.deleted ?? false
              item.tags = tool.tags ?? [];
            }
            return state;
          })
        }

        // Update the set of finished instructions.
        if (tool) {
          if (tool.type === "message_to_user") {
            messages[messages.length - 1] = tool.message.value;
            if (tool.message.state == "Complete") {
              finishedInstructionsRef.current.add(tool_id);
              messages.push("");
            }
          } else {
            finishedInstructionsRef.current.add(tool_id);
          }
        }

      }
    }
  })
  const { data, streamData, finalData } = hook;


  async function onUserQuery(message: string) {
    setRunning(true);
    let now_epoch_seconds = Math.floor(Date.now() / 1000);

    messages.push("");
    hook.mutate(state, {
      message: message,
      date_time: now_epoch_seconds
    });
  }
  
  const onCheckboxClick = useCallback(async (item_id: number) => {
    console.log("onCheckboxClick: ", item_id);
    setState((state) => {
      const item = state.todo_list.items.find((item) => item.id === item_id);
      if (item) {
        // If it's already completed, uncomplete it. Otherwise complete it.
        item.completed_at = item.completed_at ? null : Math.floor(Date.now() / 1000);
      }
      console.log("state: ", state);
      return state;
    })
  }, [state, setState]);

  return (
    <div className="p-5">
      <main className="">
        <div className="flex flex-col w-full">
          <QueryArea onRun={onUserQuery} running={running}/>

          <div className="flex flex-row">
            <TodoList items={state.todo_list.items} onCheckboxClick={onCheckboxClick} />
            <MessagesToUser messages={messages} />
            <div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

