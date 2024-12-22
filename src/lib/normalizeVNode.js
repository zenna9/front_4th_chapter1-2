import { createVNode } from "./createVNode";
export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 빈 문자열로 변환되어야 한다
  if (vNode === null) {
    return "";
  }
  switch (typeof vNode) {
    case "boolean":
    case "undefined":
      return "";
    case "number":
    case "string":
      return `${vNode}`;
    default:
      return createVNode(vNode);
  }
}
