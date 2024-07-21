import { forwardRef, HTMLAttributes } from "react";

const SpeedIndicator = forwardRef<
  HTMLDivElement,
  { speed: number } & HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`border-2 ${className}`} {...props}>
    <div className="h-full w-full">
      <div className="h-full w-full flex flex-col justify-center">
        <div className="h-1/2 rotate-180">
          <div
            className="bg-green-500"
            style={{ height: `${props.speed * 100}%` }}
          />
        </div>
        <div className="h-1/2">
          <div
            className="bg-red-600"
            style={{ height: `${-props.speed * 100}%` }}
          />
        </div>
      </div>
    </div>
  </div>
));

export default SpeedIndicator;
