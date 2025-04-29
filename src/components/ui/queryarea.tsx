
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
      className="flex flex-row h-32 items-center p-5"
    >
      <Input 
        value={message} 
        className="text-xl"
        placeholder="Enter a message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            props.onRun(message);
            setMessage("");
          }
        }}
      />
      <Button
        className="ml-2 "
        disabled={props.running}
        onClick={() => props.onRun(message)}
        >
        {props.running ? "Running..." : "Run"}
      </Button>
    </div>
  );
}

export { QueryArea };
