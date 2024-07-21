import wheel from "@/assets/wheel.png";
import { forwardRef, ImgHTMLAttributes } from "react";

const Wheel = forwardRef<
  HTMLImageElement,
  {
    direction: number;
  } & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">
>(({ direction, style, ...props }, ref) => (
  <img
    ref={ref}
    src={wheel}
    alt="wheel"
    style={{
      ...style,
      transform: `rotate(${direction * 90}deg)`,
    }}
    {...props}
  />
));

export default Wheel;
