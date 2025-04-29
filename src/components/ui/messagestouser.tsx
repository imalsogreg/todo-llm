function MessagesToUser(props: { messages: string[] }) {
    return (
      <div className="w-96 flex flex-col gap-2">
        { props.messages.filter((message) => message !== "").map((message, index, arr) => (
            <div
            className={`bg-gray-100 m-2 p-2 rounded-md ${
              index === arr.length - 1 
                ? "border-r-4 border-blue-500" 
                : "opacity-50"
            }`}
            key={index}
            >
              {message}
            </div>
        ))}
     </div>
     );
}

export { MessagesToUser };
