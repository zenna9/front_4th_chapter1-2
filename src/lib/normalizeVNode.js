// import { createVNode } from "./createVNode";
export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 빈 문자열로 변환되어야 한다
  if (vNode === null) {
    return "";
  }
  // console.log('typeof vNode === ', typeof vNode);
  switch (typeof vNode) {
    case "boolean":
    case "undefined":
      return "";

    case "number":
    case "string":
      return `${vNode}`;
      
    case "function":
      console.log('typeof vNode === ', typeof vNode);
      return normalizeVNode(vNode()); //vNode가 함수일 때 해당 함수를 호출

    default:

      if(typeof vNode.type === "function"){
        return normalizeVNode(vNode.type(vNode.props, ...vNode.children));
      }
      let childrenX = vNode.children;
      console.log('vNode:', vNode);
      console.log('children:', childrenX);
      console.log('childrenlength:', childrenX.length);
      if(childrenX && childrenX.length > 0) {
        let childrenNormalized = childrenX.map((child) => normalizeVNode(child)).filter((childN)=> Boolean)
        vNode["children"] = childrenNormalized;
      }
      return vNode;
  }
}
