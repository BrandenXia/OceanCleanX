import { useContext } from "react";
import { WsContext } from "@/context/WsProvider.tsx";

const useWs = () => useContext(WsContext);

export default useWs;
