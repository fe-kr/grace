import { MouseEvent, FC, SVGProps } from "react";

interface IconButtonProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  label: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = ({
  icon: Icon,
  onClick,
  iconClassName,
  label,
  ...restProps
}: IconButtonProps) => {
  return (
    <button
      {...restProps}
      title={label}
      className="flex justify-center items-center m-0 p-1 rounded-full shadow focus:outline-gray-200 hover:bg-gray-200 active:bg-gray-300"
      onClick={onClick}
    >
      <Icon className={iconClassName} />
    </button>
  );
};

export default IconButton;
