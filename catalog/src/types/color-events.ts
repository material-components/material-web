export interface Theme {
  [tokenName: string]: string;
}

export class ChangeColorEvent extends Event {
  theme: Theme | null = null;
  constructor(public color: string) {
    super('change-color', { bubbles: true, composed: true });
  }
}

export class ChangeDarkModeEvent extends Event {
  theme: Theme | null = null;
  constructor(public mode: 'light' | 'dark' | 'auto') {
    super('change-mode', { bubbles: true, composed: true });
  }
}

export class ChangeColorAndModeEvent extends Event {
  theme: Theme | null = null;
  constructor(public color: string, public mode: 'light' | 'dark' | 'auto') {
    super('change-color-and-mode', { bubbles: true, composed: true });
  }
}

declare global {
  interface HTMLElementEventMap {
    'change-color': ChangeColorEvent;
    'change-mode': ChangeDarkModeEvent;
    'change-color-and-mode': ChangeColorAndModeEvent;
  }
}
