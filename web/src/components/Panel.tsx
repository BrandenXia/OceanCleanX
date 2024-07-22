import { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";

const Panel = ({
  degree,
  innerBorder = 2,
  outerBorder = 8,
  innerColor = "border-gray-300",
  outerColor = "border-blue-400",
  ...props
}: {
  degree: number;
  innerBorder?: number;
  outerBorder?: number;
  innerColor?: string;
  outerColor?: string;
} & HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);

  const [radius, setRadius] = useState(0);
  const rectWidth = useMemo(() => radius * 2, [radius]);
  const trackArcSize = useMemo(
    () => rectWidth - outerBorder + innerBorder,
    [rectWidth, outerBorder, innerBorder],
  );
  const translate = useMemo(
    () => (rectWidth - trackArcSize) / 2,
    [rectWidth, trackArcSize],
  );

  useEffect(() => {
    if (ref.current) setRadius(ref.current.clientWidth / 2);
  }, []);

  return (
    <div ref={ref} {...props}>
      <div
        className="relative mx-auto my-0 overflow-hidden"
        style={{ width: `${rectWidth}px`, height: `${radius}px` }}
      >
        <p
          className={`box-border rounded-[50%] ${innerColor}`}
          style={{
            width: `${trackArcSize}px`,
            height: `${trackArcSize}px`,
            transform: `translate(${translate}px, ${translate}px)`,
            borderWidth: `${innerBorder}px`,
          }}
        />
        <div
          className="absolute left-0 top-0 w-full h-full overflow-hidden origin-[50%100%] z-20"
          style={{ transform: `rotate(${degree}deg)` }}
        >
          <p
            className={`w-full box-border rounded-[50%] ${outerColor}`}
            style={{
              height: `${rectWidth}px`,
              borderWidth: `${outerBorder}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Panel;
