
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function QueryArea(
    props: {
        running: boolean,
        onRun: (message: string) => void
    }
) {
  const [message, setMessage] = useState("");
  return (
    <div
      className="flex flex-row h-16 bg-red-500"
    >
      <Input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            props.onRun(message);
          }
        }}
      />
      <Button
        className="ml-2 text-3xl font-bold underline"
        disabled={props.running}
        onClick={() => props.onRun(message)}
        >
        {props.running ? "Running..." : "Run"}
      </Button>
    </div>
  );
}

export { QueryArea };
