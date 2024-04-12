/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {isServer, ReactiveController, ReactiveControllerHost} from 'lit';

/**
 * An element that can be attached to an associated controlling element.
 */
export interface Attachable {
  /**
   * Reflects the value of the `for` attribute, which is the ID of the element's
   * associated control.
   *
   * Use this when the elements's associated control is not its parent.
   *
   * To manually control an element, set its `for` attribute to `""`.
   *
   * @example
   * ```html
   * <div class="container">
   *   <md-attachable for="interactive"></md-attachable>
   *   <button id="interactive">Action</button>
   * </div>
   * ```
   *
   * @example
   * ```html
   * <button class="manually-controlled">
   *   <md-attachable for=""></md-attachable>
   * </button>
   * ```
   */
  htmlFor: string | null;

  /**
   * Gets or sets the element that controls the visibility of the attachable
   * element. It is one of:
   *
   * - The control referenced by the `for` attribute.
   * - The control provided to `element.attach(control)`
   * - The element's parent.
   * - `null` if the element is not controlled.
   */
  control: HTMLElement | null;

  /**
   * Attaches the element to an interactive control.
   *
   * @param control The element that controls the attachable element.
   */
  attach(control: HTMLElement): void;

  /**
   * Detaches the element from its current control.
   */
  detach(): void;
}

/**
 * A key to retrieve an `Attachable` element's `AttachableController` from a
 * global `MutationObserver`.
 */
const ATTACHABLE_CONTROLLER = Symbol('attachableController');

/**
 * The host of an `AttachableController`. The controller will add itself to
 * the host so it can be retrieved in a global `MutationObserver`.
 */
interface AttachableControllerHost extends ReactiveControllerHost, HTMLElement {
  [ATTACHABLE_CONTROLLER]?: AttachableController;
}

let FOR_ATTRIBUTE_OBSERVER: MutationObserver | undefined;

if (!isServer) {
  /**
   * A global `MutationObserver` that reacts to `for` attribute changes on
   * `Attachable` elements. If the `for` attribute changes, the controller will
   * re-attach to the new referenced element.
   */
  FOR_ATTRIBUTE_OBSERVER = new MutationObserver((records) => {
    for (const record of records) {
      // When a control's `for` attribute changes, inform its
      // `AttachableController` to update to a new control.
      (record.target as AttachableControllerHost)[
        ATTACHABLE_CONTROLLER
      ]?.hostConnected();
    }
  });
}

/**
 * A controller that provides an implementation for `Attachable` elements.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement implements Attachable {
 *   get control() { return this.attachableController.control; }
 *
 *   private readonly attachableController = new AttachableController(
 *     this,
 *     (previousControl, newControl) => {
 *       previousControl?.removeEventListener('click', this.handleClick);
 *       newControl?.addEventListener('click', this.handleClick);
 *     }
 *   );
 *
 *   // Implement remaining `Attachable` properties/methods that call the
 *   // controller's properties/methods.
 * }
 * ```
 */
export class AttachableController implements ReactiveController, Attachable {
  get htmlFor() {
    return this.host.getAttribute('for');
  }

  set htmlFor(htmlFor: string | null) {
    if (htmlFor === null) {
      this.host.removeAttribute('for');
    } else {
      this.host.setAttribute('for', htmlFor);
    }
  }

  get control() {
    if (this.host.hasAttribute('for')) {
      if (!this.htmlFor || !this.host.isConnected) {
        return null;
      }

      return (
        this.host.getRootNode() as Document | ShadowRoot
      ).querySelector<HTMLElement>(`#${this.htmlFor}`);
    }

    return this.currentControl || this.host.parentElement;
  }
  set control(control: HTMLElement | null) {
    if (control) {
      this.attach(control);
    } else {
      this.detach();
    }
  }

  private currentControl: HTMLElement | null = null;

  /**
   * Creates a new controller for an `Attachable` element.
   *
   * @param host The `Attachable` element.
   * @param onControlChange A callback with two parameters for the previous and
   *     next control. An `Attachable` element may perform setup or teardown
   *     logic whenever the control changes.
   */
  constructor(
    private readonly host: AttachableControllerHost,
    private readonly onControlChange: (
      prev: HTMLElement | null,
      next: HTMLElement | null,
    ) => void,
  ) {
    host.addController(this);
    host[ATTACHABLE_CONTROLLER] = this;
    FOR_ATTRIBUTE_OBSERVER?.observe(host, {attributeFilter: ['for']});
  }

  attach(control: HTMLElement) {
    if (control === this.currentControl) {
      return;
    }

    this.setCurrentControl(control);
    // When imperatively attaching, remove the `for` attribute so
    // that the attached control is used instead of a referenced one.
    this.host.removeAttribute('for');
  }

  detach() {
    this.setCurrentControl(null);
    // When imperatively detaching, add an empty `for=""` attribute. This will
    // ensure the control is `null` rather than the `parentElement`.
    this.host.setAttribute('for', '');
  }

  /** @private */
  hostConnected() {
    this.setCurrentControl(this.control);
  }

  /** @private */
  hostDisconnected() {
    this.setCurrentControl(null);
  }

  private setCurrentControl(control: HTMLElement | null) {
    this.onControlChange(this.currentControl, control);
    this.currentControl = control;
  }
}
