import { css } from '@emotion/react';

export const isShown = (_isShown: boolean) =>
  css`
    ${!_isShown ? `display: none;` : ``}
  `;