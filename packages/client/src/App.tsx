import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

// query-client manages all of the caching
const client = new QueryClient();

// we need to wrapthis appin a react query context
const AppContent = () => {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const getMessages = trpc.useQuery(["getMessages"]);
  const addMessage = trpc.useMutation(["addMessage"]);

  const onAdd = () => {
    addMessage.mutate(
      {
        message,
        user,
      },
      {
        onSuccess: () => {
          client.invalidateQueries(["getMessages"]);
        },
      }
    );
  };

  return (
    <div className="mt-10 text-3xl mx-auto max-w-lg">
      <div>{JSON.stringify(getMessages.data)}</div>
      <div className="mt-10">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-2 border-gray-400 rounded-lg w-full"
          placeholder="User"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-5 border-2 border-gray-400 rounded-lg w-full"
          placeholder="Message"
        />
      </div>
      <button onClick={onAdd}>AddMessage</button>
    </div>
  );
};

// connected out trpc client to trpc server
const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/trpc",
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
