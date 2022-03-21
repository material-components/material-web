# Action Element

Action Element is a base class that distills user gestures into a simple API:
`beginPress()` and `endPress()`.

## Using Action Element

To use Action Element, take the following steps:

-   Create a component extending from Action Element
-   Add a`disabled` property
-   Add the necessary event listeners to the template.

## beginPress

The `beginPress` method should be used to set styling or behavior for when the
component is being pressed. For components with a Ripple state layer, it is also
the best time to call Ripple's `beginPress`.

The `positionEvent` property is either `null`, or the event that began the
press. Keyboard interaction will set `positionEvent` to `null`.

There is no need to call `super.beginPress()`.

## endPress

The `endPress` method is called when the user interaction ends. The `cancelled`
parameter will be `true` if the interaction should not cause an effect (i.e fire
the `action` event), and `false` otherwise. For components with a Ripple, the
Ripple's `endPress` method should be called regardless of the value of
`cancelled`.

This method is the ideal place to change component state and fire interaction
events.

Calling `super.endPress()` with `cancelled` set to `false`, will fire an event
named `action`, which is used for internal Wiz customers. If other events fired
from `endPress()` have a `detail` object, it should be included in the call to
`super.endPress()` as the `actionData` property.

### Example

```ts
import {ActionElement, BeginPressConfig, EndPressConfig} from '../action-element/action-element';

import {html} from 'lit';
import {property} from 'lit/decorators';

export class MyElement extends ActionElement {
  @property({type: Boolean}) disabled = false;

  override render() {
    return html`<div
      @pointerdown=${this.handlePointerDown}
      @pointerup=${this.handlePointerUp}
      @pointercancel=${this.handlePointerCancel}
      @pointerleave=${this.handlePointerLeave}
      @click=${this.handleClick}
      @contextmenu=${this.handleContextMenu}></div>`;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    // the left mouse button, finger, or pen is pressed.
  }

  override endPress({cancelled}: EndPressConfig) {
    // the left mouse button, finger, or pen has been released
    // and the component should take an action.
    const actionData = {pressed: true};
    super.endPress({cancelled, actionData});
    if (!cancelled) {
      this.dispatchEvent(new CustomEvent('my-element-pressed', {
        bubbles: true,
        composed: true,
        detail: actionData
      }));
    }
  }
}
```

### Example with ripple

```ts
import {ActionElement, BeginPressConfig, EndPressConfig} from '../action-element/action-element';
import {MdRipple} from '../ripple/ripple';

import {html} from 'lit';
import {property, query} from 'lit/decorators';


export class MyElementWithRipple extends ActionElement {

  @property({type: Boolean}) disabled = false;
  @query('.md3-button--ripple') protected ripple!: MdRipple;

  override render() {
    return html`<div
      @pointerdown=${this.handlePointerDown}
      @pointerup=${this.handlePointerUp}
      @pointercancel=${this.handlePointerCancel}
      @pointerleave=${this.handlePointerLeave}
      @click=${this.handleClick}
      @contextmenu=${this.handleContextMenu}>${this.renderRipple()}</div>`;
  }

  protected renderRipple() {
    return html`<md-ripple class="md3-button--ripple" .disabled="${this.disabled}"></md-ripple>`;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress({cancelled}: EndPressConfig) {
    this.ripple.endPress();
    const actionData = {pressed: true};
    super.endPress({cancelled, actionData});
    if (!cancelled) {
      this.dispatchEvent(new CustomEvent('my-element-pressed', {
        bubbles: true,
        composed: true,
        detail: actionData
      }));
    }
  }
}
```
