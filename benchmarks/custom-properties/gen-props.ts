import {css, unsafeCSS} from 'lit';

export const genProps = (selector = `:host`, num = 1000) => css`
  ${unsafeCSS(selector)} {
    ${unsafeCSS(
      Array(num)
        .fill('')
        .map(
          (_a, i) => `
      --_private${i}: ${i};
    `
        )
        .join(';')
    )}
  }
`;
