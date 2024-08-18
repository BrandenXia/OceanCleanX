import useWs from "@/hook/useWs.ts";

const DataPanel = () => {
  const wsState = useWs();

  return (
    <div className="px-6 text-lg">
      <p>
        Websocket Status:{" "}
        <span className={wsState.ready ? "text-green-500" : "text-red-600"}>
          {wsState.ready ? "Connected" : "Disconnected"}
        </span>
      </p>
    </div>
  );
};

export default DataPanel;
