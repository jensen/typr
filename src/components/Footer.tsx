import cx from "classnames";

const Footer = () => {
  return (
    <footer
      className={cx("p-2", "font-xs font-light", "bg-green-400 text-white")}
    >
      built by <a href="https://github.com/jensen">@jensen</a>
    </footer>
  );
};

export default Footer;
