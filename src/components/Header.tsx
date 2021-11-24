import cx from "classnames";
import { useMatch, Link } from "react-router-dom";
import { DiscordLoginButton } from "./DiscordLoginButton";

interface IHeaderProps {
  user: any;
}

const Header = (props: IHeaderProps) => {
  const matchesAuth = useMatch("/auth") !== null;

  return (
    <header
      className={cx("flex justify-between", "p-2", "text-white bg-green-400")}
    >
      <h3 className="text-2xl font-black tracking-wide">
        <Link to="/">typr.</Link>
      </h3>
      {props.user || matchesAuth ? null : <DiscordLoginButton />}
    </header>
  );
};

export default Header;
