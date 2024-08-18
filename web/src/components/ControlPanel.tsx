import Panel from "@/components/Panel.tsx";
import Wheel from "@/components/Wheel.tsx";
import SpeedIndicator from "@/components/SpeedIndicator.tsx";
import useControl from "@/hook/useControl.ts";
import useRemote from "@/hook/useRemote.ts";

const ControlPanel = () => {
  const { speed, direction } = useControl();
  useRemote(speed, direction);

  return (
    <div className="flex gap-x-20 justify-center items-center">
      <div className="relative h-72 w-72 flex justify-center items-center translate-y-6">
        <Panel
          degree={direction * 90 + 90}
          innerBorder={5}
          outerBorder={5}
          innerColor="border-yellow-300"
          outerColor="border-blue-300"
          className="absolute top-0 left-0 h-36 w-72"
        />
        <Wheel direction={direction} className="h-48 w-48"/>
      </div>
      <SpeedIndicator className="h-72 w-14" speed={speed}/>
    </div>
  );
};

export default ControlPanel;
