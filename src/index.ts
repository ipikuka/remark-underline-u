import { visit } from "unist-util-visit";
import type { Visitor, VisitorResult } from "unist-util-visit";
import type { Plugin, Transformer } from "unified";
import type { Data, Parent, PhrasingContent, Root, Text } from "mdast";
import { findBetween } from "unist-util-find-between";
import { findAllBefore } from "unist-util-find-all-before";
import { findAllAfter } from "unist-util-find-all-after";
import { findAfter } from "unist-util-find-after";
import { u } from "unist-builder";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UnderlineData extends Data {}

interface Underline extends Parent {
  /**
   * Node type of mdast Underline.
   */
  type: "underline";
  /**
   * Children of paragraph.
   */
  children: PhrasingContent[];
  /**
   * Data associated with the mdast paragraph.
   */
  data?: UnderlineData | undefined;
}

declare module "mdast" {
  interface PhrasingContentMap {
    underline: Underline;
  }

  interface RootContentMap {
    underline: Underline;
  }
}

// the previous regex was not strict related with spaces
// export const REGEX = /!!\s*([^!]*[^ ])?\s*!!/;
// export const REGEX_GLOBAL = /!!\s*([^!]*[^ ])?\s*!!/g;

// the new regex is strict!
// it doesn't allow a space after the first double exclamation sign
// it doesn't allow a space before the last double exclamation sign
export const REGEX = /!!(?![\s!])([\s\S]*?)(?<![\s!])!!/;
export const REGEX_GLOBAL = /!!(?![\s!])([\s\S]*?)(?<![\s!])!!/g;

export const REGEX_STARTING = /!!(?![\s]|!!\s)/;
export const REGEX_STARTING_GLOBAL = /!!(?![\s]|!!\s)/g;

export const REGEX_ENDING = /(?<!\s|\s!|\s!|\s!|\s!)!!/;
export const REGEX_ENDING_GLOBAL = /(?<!\s|\s!|\s!|\s!|\s!)!!/g;

export const REGEX_EMPTY = /!!\s*!!/;
export const REGEX_EMPTY_GLOBAL = /!!\s*!!/g;

/**
 *
 * This plugin turns !!text!! into a <u>text</u>
 *
 * for example:
 *
 * Here is !!underlined text!!
 *
 */
export const plugin: Plugin<void[], Root> = () => {
  /**
   *
   * constructs a custom <u> node
   *
   */
  const constructUnderlineNode = (children: PhrasingContent[]): Underline => {
    // https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-custom-nodes

    const underlineClassName = children.length
      ? ["remark-underline"]
      : ["remark-underline-empty"];

    return {
      type: "underline",
      children,
      data: {
        hName: "u",
        hProperties: {
          className: underlineClassName,
        },
      },
    };
  };

  /**
   *
   * visits the Text nodes to match with the underline syntax (!!underlined text!!)
   *
   */
  const visitorFirst: Visitor<Text, Parent> = function (node, index, parent): VisitorResult {
    /* v8 ignore next -- @preserve */
    if (!parent || typeof index === "undefined") return;

    if (!REGEX.test(node.value)) return;

    const children: Array<PhrasingContent> = [];
    const value = node.value;
    let tempValue = "";
    let prevMatchIndex = 0;
    let prevMatchLength = 0;

    const matches = Array.from(value.matchAll(REGEX_GLOBAL));

    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];

      const [matched, underlinedText] = match;
      const mIndex = match.index!;
      const mLength = matched.length;

      // could be a text part before each matched part
      const textPartIndex = prevMatchIndex + prevMatchLength;

      prevMatchIndex = mIndex;
      prevMatchLength = mLength;

      // if there is a text part before
      if (mIndex > textPartIndex) {
        const textValue = value.substring(textPartIndex, mIndex);

        const textNode = u("text", textValue);
        children.push(textNode);
      }

      const underlineNode = constructUnderlineNode([
        { type: "text", value: underlinedText.trim() },
      ]);

      children.push(underlineNode);

      // control for the last text node if exists after the last match
      tempValue = value.slice(mIndex + mLength);
    }

    // if there is still text after the last match
    if (tempValue) {
      const textNode = u("text", tempValue);
      children.push(textNode);
    }

    // classic V8 coverage false negative
    /* v8 ignore next -- @preserve */
    if (children.length) {
      parent.children.splice(index, 1, ...children);
    }
  };

  /**
   *
   * visits the Text nodes to find the underline syntax (!!underlined **bold** text!!)
   * if parent contains other content phrases
   *
   */
  const visitorSecond: Visitor<Text, Parent> = function (node, index, parent): VisitorResult {
    /* v8 ignore next -- @preserve */
    if (!parent || typeof index === "undefined") return;

    // control if the Text node matches with "starting underline regex"
    if (!REGEX_STARTING.test(node.value)) return;

    const openingNode = node;

    // control if any next child Text node of the parent has "ending underline regex"
    const closingNode = findAfter(parent, openingNode, function (node) {
      return node.type === "text" && REGEX_ENDING.test((node as Text).value);
    });

    if (!closingNode) return;

    // now, ensured that the parent has a underline element between opening Text node and closing Text nodes

    const beforeChildren = findAllBefore(parent, openingNode) as PhrasingContent[];
    const mainChildren = findBetween(parent, openingNode, closingNode) as PhrasingContent[];
    const afterChildren = findAllAfter(parent, closingNode) as PhrasingContent[];

    /********************* OPENING NODE ***********************/

    // let's analyze the opening Text node
    const value = openingNode.value;

    const match = Array.from(value.matchAll(REGEX_STARTING_GLOBAL))[0];

    const [matched] = match;
    const mLength = matched.length;
    const mIndex = match.index!;

    // if there is a text part before
    if (mIndex > 0) {
      const textValue = value.substring(0, mIndex);

      const textNode = u("text", textValue);
      beforeChildren.push(textNode);
    }

    // if there is a text part after
    if (value.length > mIndex + mLength) {
      const textValue = value.slice(mIndex + mLength);

      const textNode = u("text", textValue);
      mainChildren.unshift(textNode);
    }

    /********************* CLOSING NODE ***********************/

    // let's analyze the closing Text node
    const value_ = (closingNode as Text).value;

    const match_ = Array.from(value_.matchAll(REGEX_ENDING_GLOBAL))[0];

    const [matched_] = match_;
    const mLength_ = matched_.length;
    const mIndex_ = match_.index!;

    // if there is a text part before
    if (mIndex_ > 0) {
      const textValue = value_.substring(0, mIndex_);

      const textNode = u("text", textValue);
      mainChildren.push(textNode);
    }

    // if there is a text part after
    if (value_.length > mIndex_ + mLength_) {
      const textValue = value_.slice(mIndex_ + mLength_);

      const textNode = u("text", textValue);
      afterChildren.unshift(textNode);
    }

    // now it is time to construct a underline node
    const underlineNode = constructUnderlineNode(mainChildren);

    parent.children = [...beforeChildren, underlineNode, ...afterChildren];

    return index; // in order to re-visit the same node and children
  };

  /**
   *
   * visits the Text nodes to find empty markers (!!!! or !! !!)
   *
   */
  const visitorThird: Visitor<Text, Parent> = function (node, index, parent): VisitorResult {
    /* v8 ignore next -- @preserve */
    if (!parent || typeof index === "undefined") return;

    if (!REGEX_EMPTY.test(node.value)) return;

    const children: Array<PhrasingContent> = [];
    const value = node.value;
    let tempValue = "";
    let prevMatchIndex = 0;
    let prevMatchLength = 0;

    const matches = Array.from(value.matchAll(REGEX_EMPTY_GLOBAL));

    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];

      const [matched] = match;
      const mIndex = match.index!;
      const mLength = matched.length;

      // could be a text part before each matched part
      const textPartIndex = prevMatchIndex + prevMatchLength;

      prevMatchIndex = mIndex;
      prevMatchLength = mLength;

      // if there is a text part before
      if (mIndex > textPartIndex) {
        const textValue = value.substring(textPartIndex, mIndex);

        const textNode = u("text", textValue);
        children.push(textNode);
      }

      // empty marker
      const markerNode = constructUnderlineNode([]);

      children.push(markerNode);

      // control for the last text node if exists after the last match
      tempValue = value.slice(mIndex + mLength);
    }

    // if there is still text after the last match
    if (tempValue) {
      const textNode = u("text", tempValue);
      children.push(textNode);
    }

    // classic V8 coverage false negative
    /* v8 ignore next -- @preserve */
    if (children.length) {
      parent.children.splice(index, 1, ...children);
    }
  };

  const transformer: Transformer<Root> = (tree) => {
    // to find underline syntax in a Text node
    visit(tree, "text", visitorFirst);

    // to find underline syntax if the parent contains other content phrases
    visit(tree, "text", visitorSecond);

    // to find empty underline (!!!! or !! !!)
    visit(tree, "text", visitorThird);
  };

  return transformer;
};

export default plugin;
