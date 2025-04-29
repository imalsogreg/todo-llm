function MessagesToUser(props: { messages: string[] }) {
    return (
      <div className="bg-gray-800 flex flex-col gap-2">
        { props.messages.map((message, index) => (
            <div
            className="bg-gray-500 p-2 rounded-md"
            key={index}
            >
              {message}
            </div>
        ))}
     </div>
     );
}

export { MessagesToUser };
