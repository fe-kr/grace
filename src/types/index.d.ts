declare interface Bookmark {
  id: string;
  timestamp: number;
}

declare module "*.svg?react" {
  import { FC, SVGProps } from "react";

  const SVG: FC<SVGProps<SVGSVGElement>>;

  export default SVG;
}
