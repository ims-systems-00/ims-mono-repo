import useAccess from "./useAccess";
import routes from "@/routes";

const useLinks = () => {
  let { authUser } = useAccess();
  function _getPath(routes, screenIdentifier) {
    let path = "Not found";
    for (let _route of routes) {
      if (_route.screenIdentifier === screenIdentifier)
        if (_route.screenIdentifier && authUser(_route.accessPolicy))
          return _route.path;
      if (_route.collapse) path = _getPath(_route.views, screenIdentifier);
      if (path === "Not found") continue;
      else break;
    }
    return path;
  }
  const getLink = ({ screenIdentifier, params }) => {
    let path = _getPath(routes, screenIdentifier);
    if (path === "Not found") return null;
    return `/admin${path
      .split("/")
      .map((splitedPath) =>
        splitedPath[0] === ":" && params
          ? params[splitedPath.substring(1)]
          : splitedPath
      )
      .join("/")}`;
  };
  return {
    getLink,
  };
};
export default useLinks;
