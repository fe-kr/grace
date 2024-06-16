import { MouseEvent, FC, SVGProps, useId } from "react";
import { Tooltip } from "react-tooltip";

interface IconButtonProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  label: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const tooltipStyles = {
  padding: "2px 8px",
  fontSize: "12px",
};

const IconButton = ({
  icon: Icon,
  onClick,
  iconClassName,
  label,
  ...restProps
}: IconButtonProps) => {
  const tooltipId = useId();

  return (
    <>
      <button
        {...restProps}
        data-tooltip-id={tooltipId}
        data-tooltip-content={label}
        className="flex justify-center items-center m-0 p-0 opacity-100 hover:opacity-80"
        onClick={onClick}
      >
        <Icon className={iconClassName} />
      </button>

      <Tooltip noArrow style={tooltipStyles} id={tooltipId} />
    </>
  );
};

export default IconButton;
