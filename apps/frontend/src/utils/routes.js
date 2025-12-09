/**
 * TODO: Improvement possible by merging the useLinks hooks with
 * this utility
 */
import routes from "routes";
export function getPath(screenIdentifier) {
  let path = "Not found";
  for (let _route of routes) {
    if (_route.screenIdentifier === screenIdentifier) return _route.path;
    if (_route.collapse) path = _getPath(_route.views, screenIdentifier);
    if (path === "Not found") continue;
    else break;
  }
  return path;
}
export function getLink({ screenIdentifier, params }) {
  let path = getPath(routes, screenIdentifier);
  if (path === "Not found") return null;
  return `/admin${path
    .split("/")
    .map((splitedPath) =>
      splitedPath[0] === ":" ? params[splitedPath.substring(1)] : splitedPath
    )
    .join("/")}`;
}
