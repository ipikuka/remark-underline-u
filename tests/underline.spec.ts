import { describe, it, expect } from "vitest";
import dedent from "dedent";

import { process } from "./util/index.js";

describe("no options - fail", () => {
  // ******************************************
  it("bad usage", async () => {
    const input = dedent`
      !!underlined text with bad wrapped!

      !underlined text with bad wrapped!!

      + !underlined text with bad wrapped!!

      !! underlined text with unwanted space!!

      !!underlined text with unwanted space !!
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>!!underlined text with bad wrapped!</p>
      <p>!underlined text with bad wrapped!!</p>
      <ul>
        <li>!underlined text with bad wrapped!!</li>
      </ul>
      <p>!! underlined text with unwanted space!!</p>
      <p>!!underlined text with unwanted space !!</p>
      "
    `);
  });
});

describe("no options - success", () => {
  // ******************************************
  it("empty underlined texts", async () => {
    const input = dedent(`
      !!!!

      !!  !!

      a!! !!a
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><u class="remark-underline-empty"></u></p>
      <p><u class="remark-underline-empty"></u></p>
      <p>a<u class="remark-underline-empty"></u>a</p>
      "
    `);
  });

  // ******************************************
  it("standart usage", async () => {
    const input = dedent(`
      !!underlined!! !!another underlined!! 
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><u class="remark-underline">underlined</u> <u class="remark-underline">another underlined</u></p>
      "
    `);
  });

  // ******************************************
  it("underlined text in a strong", async () => {
    const input = dedent(`      
      **!!bold underlined!!**

      here is **!!bold underlined!!**

      **!!bold underlined!!** is here

      **strong !!bold underlined!!**
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><strong><u class="remark-underline">bold underlined</u></strong></p>
      <p>here is <strong><u class="remark-underline">bold underlined</u></strong></p>
      <p><strong><u class="remark-underline">bold underlined</u></strong> is here</p>
      <p><strong>strong <u class="remark-underline">bold underlined</u></strong></p>
      "
    `);
  });

  // ******************************************
  it("standart usage with extra content", async () => {
    const input = dedent(`      
      !!underlined!! with extra content !! could not underlined!! 

      !!underlined!! **with extra boldcontent** !!another could not underlined !! 
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><u class="remark-underline">underlined</u> with extra content !! could not underlined!!</p>
      <p><u class="remark-underline">underlined</u> <strong>with extra boldcontent</strong> !!another could not underlined !!</p>
      "
    `);
  });

  // ******************************************
  it("example in README", async () => {
    const input = dedent(`      
      Here is ~~deleted content~~ and !!underlined content!!

      Here is **!!bold and underlined content!!**
      
      ### Heading with !!underlined content!!
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>Here is <del>deleted content</del> and <u class="remark-underline">underlined content</u></p>
      <p>Here is <strong><u class="remark-underline">bold and underlined content</u></strong></p>
      <h3>Heading with <u class="remark-underline">underlined content</u></h3>
      "
    `);
  });

  // ******************************************
  it("nested underline don't work, arbitrary underlined texts are considered right", async () => {
    const input = dedent`
      !!outer !!inner!! underlined!!

      !!underlined!!inner!!underlined!!
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><u class="remark-underline">outer !!inner</u> underlined!!</p>
      <p><u class="remark-underline">underlined</u>inner<u class="remark-underline">underlined</u></p>
      "
    `);
  });

  // ******************************************
  it("works if contains other phrasing contents", async () => {
    const input = dedent`
      !!**xxx!!_yyy_!!zzz**!!

      !!Google is [!!another underlined!!](https://www.google.com) in underlined!!
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><u class="remark-underline"><strong>xxx<u class="remark-underline"><em>yyy</em></u>zzz</strong></u></p>
      <p><u class="remark-underline">Google is <a href="https://www.google.com"><u class="remark-underline">another underlined</u></a> in underlined</u></p>
      "
    `);
  });
});
