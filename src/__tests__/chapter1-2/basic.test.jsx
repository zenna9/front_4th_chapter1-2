/** @jsx createVNode */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createElement, createVNode } from "../../lib";
import { Footer, Header, Navigation, Post, PostForm } from "../../components";
import { HomePage, LoginPage, NotFoundPage, ProfilePage } from "../../pages";

describe("Chapter1-2 > 기본과제 > 가상돔 만들기 > ", () => {
  describe("createVNode > ", () => {
    it("올바른 구조의 vNode를 생성해야 한다", () => {
      const vNode = createVNode("div", { id: "test" }, "Hello");
      expect(vNode).toEqual({
        type: "div",
        props: { id: "test" },
        children: ["Hello"],
      });
    });

    it("여러 자식을 처리해야 한다", () => {
      const vNode = createVNode("div", null, "Hello", "world");
      expect(vNode.children).toEqual(["Hello", "world"]);
    });

    it("자식 배열을 평탄화해야 한다", () => {
      const vNode = createVNode("div", null, ["Hello", ["world", "!"]]);
      expect(vNode.children).toEqual(["Hello", "world", "!"]);
    });

    it("중첩 구조를 올바르게 표현해야 한다", () => {
      const vNode = createVNode(
        "div",
        null,
        createVNode("span", null, "Hello"),
        createVNode("b", null, "world"),
      );
      expect(vNode.type).toBe("div");
      expect(vNode.children.length).toBe(2);
      expect(vNode.children[0].type).toBe("span");
      expect(vNode.children[1].type).toBe("b");
    });

    it("JSX로 표현한 결과가 createVNode 함수 호출과 동일해야 한다", () => {
      const jsxVNode = (
        <div id="test">
          <span>Hello</span>
          <b>world</b>
        </div>
      );

      expect(jsxVNode).toEqual({
        type: "div",
        props: { id: "test" },
        children: [
          { type: "span", props: null, children: ["Hello"] },
          { type: "b", props: null, children: ["world"] },
        ],
      });
    });
  });

  describe("normalizeVNode", () => {});

  describe("createElement", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("문자열 입력에 대해 텍스트 노드를 생성해야 한다", () => {
      const result = createElement("Hello");
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("Hello");
    });

    it("숫자 입력에 대해 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(42);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("42");
    });

    it("null 입력에 대해 빈 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(null);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("");
    });

    it("false 입력에 대해 빈 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(false);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("");
    });

    it("true 입력에 대해 빈 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(true);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("");
    });

    it('0에 대해서는 "0"을 출력해야 한다.', () => {
      const result = createElement(0);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("0");
    });

    it("배열 입력에 대해 DocumentFragment를 생성해야 한다", () => {
      const result = createElement([<div>첫 번째</div>, <span>두 번째</span>]);

      expect(result.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("DIV");
      expect(result.childNodes[1].tagName).toBe("SPAN");
    });

    it("함수 컴포넌트를 처리해야 한다", () => {
      const FuncComponent = ({ text }) => <div>{text}</div>;
      console.log(<FuncComponent text="Hello" />);
      const result = createElement(<FuncComponent text="Hello" />);
      expect(result.tagName).toBe("DIV");
      expect(result.textContent).toBe("Hello");
    });

    it("올바른 속성으로 요소를 생성해야 한다", () => {
      const result = createElement(<div id="test" className="sample" />);
      expect(result.tagName).toBe("DIV");
      expect(result.id).toBe("test");
      expect(result.className).toBe("sample");
    });

    it("이벤트 리스너를 연결해야 한다", () => {
      const clickHandler = vi.fn();
      const result = createElement(<button onClick={clickHandler} />);
      result.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it("중첩된 자식 요소를 올바르게 처리해야 한다", () => {
      const result = createElement(
        <div>
          <span>Hello</span>
          <b>world</b>
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[1].tagName).toBe("B");
    });

    it("깊게 중첩된 구조를 처리해야 한다", () => {
      const result = createElement(
        <div>
          <span>
            <a href="#">링크</a>
            <b>굵게</b>
          </span>
          <p>문단</p>
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[0].childNodes.length).toBe(2);
      expect(result.childNodes[0].childNodes[0].tagName).toBe("A");
      expect(result.childNodes[0].childNodes[1].tagName).toBe("B");
      expect(result.childNodes[1].tagName).toBe("P");
    });

    it("혼합 콘텐츠(텍스트와 요소)를 처리해야 한다", () => {
      const result = createElement(
        <div>
          텍스트
          <span>span 안의 텍스트</span>더 많은 텍스트
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(3);
      expect(result.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(result.childNodes[1].tagName).toBe("SPAN");
      expect(result.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
    });

    it("빈 자식 배열을 처리해야 한다", () => {
      const result = createElement(<div>{[]}</div>);
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(0);
    });

    it("undefined 자식을 무시해야 한다", () => {
      const result = createElement(<div>{undefined}</div>);
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(0);
    });

    it("불리언 속성을 처리해야 한다", () => {
      const result = createElement(<input disabled={true} />);
      expect(result.tagName).toBe("INPUT");
      expect(result.disabled).toBe(true);
    });

    it("데이터 속성을 처리해야 한다", () => {
      const result = createElement(<div data-test="값" />);
      expect(result.tagName).toBe("DIV");
      expect(result.dataset.test).toBe("값");
    });
  });

  describe("renderElement", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("문자열 입력에 대해 텍스트 노드를 생성해야 한다", () => {
      const result = createElement("Hello");
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("Hello");
    });

    it("숫자 입력에 대해 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(42);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("42");
    });

    it("null 입력에 대해 빈 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(null);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("");
    });

    it("false 입력에 대해 빈 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(false);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("");
    });

    it("true 입력에 대해 빈 텍스트 노드를 생성해야 한다", () => {
      const result = createElement(true);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("");
    });

    it('0에 대해서는 "0"을 출력해야 한다.', () => {
      const result = createElement(0);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe("0");
    });

    it("배열 입력에 대해 DocumentFragment를 생성해야 한다", () => {
      const result = createElement([<div>첫 번째</div>, <span>두 번째</span>]);

      expect(result.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("DIV");
      expect(result.childNodes[1].tagName).toBe("SPAN");
    });

    it("함수 컴포넌트를 처리해야 한다", () => {
      const FuncComponent = ({ text }) => <div>{text}</div>;
      console.log(<FuncComponent text="Hello" />);
      const result = createElement(<FuncComponent text="Hello" />);
      expect(result.tagName).toBe("DIV");
      expect(result.textContent).toBe("Hello");
    });

    it("올바른 속성으로 요소를 생성해야 한다", () => {
      const result = createElement(<div id="test" className="sample" />);
      expect(result.tagName).toBe("DIV");
      expect(result.id).toBe("test");
      expect(result.className).toBe("sample");
    });

    it("이벤트 리스너를 연결해야 한다", () => {
      const clickHandler = vi.fn();
      const result = createElement(<button onClick={clickHandler} />);
      result.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it("중첩된 자식 요소를 올바르게 처리해야 한다", () => {
      const result = createElement(
        <div>
          <span>Hello</span>
          <b>world</b>
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[1].tagName).toBe("B");
    });

    it("깊게 중첩된 구조를 처리해야 한다", () => {
      const result = createElement(
        <div>
          <span>
            <a href="#">링크</a>
            <b>굵게</b>
          </span>
          <p>문단</p>
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[0].childNodes.length).toBe(2);
      expect(result.childNodes[0].childNodes[0].tagName).toBe("A");
      expect(result.childNodes[0].childNodes[1].tagName).toBe("B");
      expect(result.childNodes[1].tagName).toBe("P");
    });

    it("혼합 콘텐츠(텍스트와 요소)를 처리해야 한다", () => {
      const result = createElement(
        <div>
          텍스트
          <span>span 안의 텍스트</span>더 많은 텍스트
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(3);
      expect(result.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(result.childNodes[1].tagName).toBe("SPAN");
      expect(result.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
    });

    it("빈 자식 배열을 처리해야 한다", () => {
      const result = createElement(<div>{[]}</div>);
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(0);
    });

    it("undefined 자식을 무시해야 한다", () => {
      const result = createElement(<div>{undefined}</div>);
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(0);
    });

    it("불리언 속성을 처리해야 한다", () => {
      const result = createElement(<input disabled={true} />);
      expect(result.tagName).toBe("INPUT");
      expect(result.disabled).toBe(true);
    });

    it("데이터 속성을 처리해야 한다", () => {
      const result = createElement(<div data-test="값" />);
      expect(result.tagName).toBe("DIV");
      expect(result.dataset.test).toBe("값");
    });
  });
});
