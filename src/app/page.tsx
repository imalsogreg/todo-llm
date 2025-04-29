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
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [state, setState] = useAtom(stateAtom);

  // As tool calls are streamed in, we need to keep track of which
  // which instructions we have already executed.
  const instructionCounterRef = useRef(0);


  const hook = useSelectTools({
    stream: true,
    onFinalData: (chunk) => {
      hook.reset();
      instructionCounterRef.current = 0;
      setRunning(false);
    },
    onStreamData: (chunk) => {
      console.log("Stream data: ", chunk, " instructionCounterRef: ", instructionCounterRef.current)
      if (chunk) {
        // Take the last tool off the list. Any other tools have been
        // executed already.
        const tool = chunk[instructionCounterRef.current];
        console.log("Tool: ", tool)

        if (tool?.type === "message_to_user" || tool === undefined) {
          console.log("NOT INCREMENTING");
        } else {
          console.log("YES INCREMENTING");
          instructionCounterRef.current = instructionCounterRef.current + 1;
        }
        console.log("sanity check: instructionCounterRef: ", instructionCounterRef.current)

        if (tool?.type === "message_to_user") {
          messages[messages.length - 1] = tool.message;
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
      }
    }
  })
  const { data, streamData, finalData } = hook;

  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  async function onUserQuery(message: string) {
    setRunning(true);
    let now_epoch_seconds = Math.floor(Date.now() / 1000);

    messages.push("NewMessage ");
    hook.mutate(state, {
      message: message,
      date_time: now_epoch_seconds
    });
    // if (data) {

    //   for await (const chunk of data) {
    //     console.log(chunk);
    //   }
    // }
    // if (streamData) {
    //   console.log("Stream data.");
    //   for await (const chunk of streamData) {
    //     console.log(chunk);
    //     switch (chunk?.type) {
    //       case "message_to_user":
    //         messages[messages.length - 1] += chunk.message;
    //         break;
    //     }
    //   }
    // } else {
    //   console.error("No stream data.");
    // }
    // hook.reset();
    // setRunning(false);


  }


  return (
    <div className="bg-teal-200 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <div className="flex flex-col w-full">
          <QueryArea onRun={onUserQuery} running={running}/>

          <div className="flex flex-row">
            <TodoList items={state.todo_list.items} />
            <MessagesToUser messages={messages} />
            <div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

