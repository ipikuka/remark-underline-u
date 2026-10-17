import { describe, it, expect } from "vitest";
import dedent from "dedent";

import { process } from "./util/index.js";

describe("within a markdown content", () => {
  // ******************************************
  it("works in different markdown elements", async () => {
    const input = dedent`
      # heading with !!underlined!!

      + !!underlined!! in a list item
      + list item with !!underlined!!

      |Abc|Xyz|
      |---|---|
      |normal|!!underlined!!|

      Here are *!!italic underlined!!* and **!!bold underlined!!**

      > Here is !!underlined!! in blockquote
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <h1>heading with <u class="remark-underline">underlined</u></h1>
      <ul>
        <li><u class="remark-underline">underlined</u> in a list item</li>
        <li>list item with <u class="remark-underline">underlined</u></li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Abc</th>
            <th>Xyz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>normal</td>
            <td><u class="remark-underline">underlined</u></td>
          </tr>
        </tbody>
      </table>
      <p>Here are <em><u class="remark-underline">italic underlined</u></em> and <strong><u class="remark-underline">bold underlined</u></strong></p>
      <blockquote>
        <p>Here is <u class="remark-underline">underlined</u> in blockquote</p>
      </blockquote>
      "
    `);
  });

  // ******************************************
  it("works if it contains other phrasing contents like **strong**", async () => {
    const input = dedent`
      foo!!**a!!b**!!bar

      foo !!**a!!b**!! bar

      !!foo **a!!b** bar!!
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>foo<u class="remark-underline"><strong>a!!b</strong></u>bar</p>
      <p>foo <u class="remark-underline"><strong>a!!b</strong></u> bar</p>
      <p><u class="remark-underline">foo <strong>a!!b</strong> bar</u></p>
      "
    `);
  });

  // ******************************************
  it("works if contains other phrasing contents", async () => {
    const input = dedent`
      open!!**strong !!_italik underlined_!! underlined**!!close

      !!open**strong !!_italik underlined_!! underlined**close!!
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>open<u class="remark-underline"><strong>strong <u class="remark-underline"><em>italik underlined</em></u> underlined</strong></u>close</p>
      <p><u class="remark-underline">open<strong>strong <u class="remark-underline"><em>italik underlined</em></u> underlined</strong>close</u></p>
      "
    `);
  });
});
