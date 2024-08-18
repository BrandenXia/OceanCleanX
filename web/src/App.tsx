import ControlPanel from "@/components/ControlPanel.tsx";
import { ReactNode } from "react";
import LiveCam from "@/components/LiveCam.tsx";
import DataPanel from "@/components/DataPanel.tsx";

const App = () => (
  <div className="w-screen h-screen grid grid-rows-9 grid-cols-2 gap-4 p-4 *:border *:flex *:flex-col">
    <div className="row-span-4">
      <Label>Control Panel</Label>
      <ControlPanel />
    </div>
    <div className="row-span-5">
      <Label>Live Cam</Label>
      <LiveCam />
    </div>
    <div className="row-span-5">
      <Label>Data Display</Label>
      <DataPanel />
    </div>
    <div className="row-span-4">
      <Label>Lidar Data</Label>
    </div>
  </div>
);

const Label = ({ children }: { children?: ReactNode }) => (
  <label className="m-4 mb-3 w-full text-xl font-medium">
    {children}
  </label>
);

export default App;
