import cx from "classnames";
import { Link } from "remix";

interface IHeaderProps {
  user: any;
}

const Header = (props: IHeaderProps) => {
  return (
    <header
      className={cx("flex justify-between", "p-2", "text-white bg-green-400")}
    >
      <h3 className="text-2xl font-black tracking-wide">
        <Link to="/">typr.</Link>
      </h3>
    </header>
  );
};

export default Header;
