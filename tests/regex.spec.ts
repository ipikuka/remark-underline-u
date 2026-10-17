import { describe, it, expect } from "vitest";

import { REGEX } from "../src/index.js";

type Fixture = {
  input: string;
  expect: null | {
    underlinedText: string | undefined;
  };
};

describe("remark-flexigraph regex tests", () => {
  it("REGEX_IN_BEGINNING matches or not", () => {
    const fixtures: Fixture[] = [
      {
        input: "!!",
        expect: null,
      },
      {
        input: "!!!",
        expect: null,
      },
      {
        input: "! !!",
        expect: null,
      },
      {
        input: "!!  !",
        expect: null,
      },
      {
        input: "! !underlined!!",
        expect: null,
      },
      {
        input: "!a!underlined!!",
        expect: null,
      },
      {
        input: "!!!!",
        expect: null,
      },
      {
        input: "!! !!",
        expect: null,
      },
      {
        input: "!!  !!",
        expect: null,
      },
      {
        input: "!! underlined underlined!!",
        expect: null,
      },
      {
        input: "!!underlined underlined !!",
        expect: null,
      },
      //********************************* */
      {
        input: "!!underlined text!!",
        expect: {
          underlinedText: "underlined text",
        },
      },
      {
        input: "!!underlined!! outer!!",
        expect: {
          underlinedText: "underlined",
        },
      },
      // TODO: how to match the shorter ?
      {
        input: "!!outer !!underlined!!",
        expect: {
          underlinedText: "outer !!underlined",
        },
      },
    ];

    /* eslint-disable vitest/no-conditional-expect */

    fixtures.forEach((fixture) => {
      // console.log(fixture.input);

      const match = fixture.input.match(REGEX);

      if (fixture.expect === null) {
        expect(match).toBeNull();
      } else {
        expect(match).not.toBeNull();
      }

      if (match) {
        const underlinedText = match[1];
        expect(underlinedText).toBe(fixture.expect?.underlinedText);
      }
    });

    /* eslint-enable vitest/no-conditional-expect */
  });
});
