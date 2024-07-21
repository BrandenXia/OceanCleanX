import useControl from "@/hook/useControl.ts";
import Wheel from "@/components/Wheel.tsx";
import SpeedIndicator from "@/components/SpeedIndicator.tsx";
import useRemote from "@/hook/useRemote.ts";

const App = () => {
  const { speed, direction } = useControl();
  useRemote(speed, direction);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex gap-x-32">
        <Wheel className="w-72 h-72" direction={direction} />
        <SpeedIndicator className="h-72 w-14" speed={speed} />
      </div>
    </div>
  );
};

export default App;
