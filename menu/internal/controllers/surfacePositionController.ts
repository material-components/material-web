/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ReactiveController, ReactiveControllerHost} from 'lit';
import {StyleInfo} from 'lit/directives/style-map.js';

/**
 * Declare popoverAPI functions and properties. See
 * https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
 * Without this, closure will rename these functions. Can remove once these
 * functions make it into the typescript lib.
 */
declare global {
  interface HTMLElement {
    showPopover(): void;
    hidePopover(): void;
    togglePopover(force: boolean): void;
    popover: string | null;
  }
}

/**
 * An enum of supported Menu corners
 */
// tslint:disable-next-line:enforce-name-casing We are mimicking enum style
export const Corner = {
  END_START: 'end-start',
  END_END: 'end-end',
  START_START: 'start-start',
  START_END: 'start-end',
} as const;

/**
 * A corner of a box in the standard logical property style of <block>_<inline>
 */
export type Corner = (typeof Corner)[keyof typeof Corner];

/**
 * An interface that provides a method to customize the rect from which to
 * calculate the anchor positioning. Useful for when you want a surface to
 * anchor to an element in your shadow DOM rather than the host element.
 */
export interface SurfacePositionTarget extends HTMLElement {
  getSurfacePositionClientRect?: () => DOMRect;
}

/**
 * The configurable options for the surface position controller.
 */
export interface SurfacePositionControllerProperties {
  /**
   * The corner of the anchor to align the surface's position.
   */
  anchorCorner: Corner;
  /**
   * The corner of the surface to align to the given anchor corner.
   */
  surfaceCorner: Corner;
  /**
   * The HTMLElement reference of the surface to be positioned.
   */
  surfaceEl: SurfacePositionTarget | null;
  /**
   * The HTMLElement reference of the anchor to align to.
   */
  anchorEl: SurfacePositionTarget | null;
  /**
   * Whether the positioning algorithim should calculate relative to the parent
   * of the anchor element (absolute) or relative to the window (fixed).
   *
   * Examples for `position = 'fixed'`:
   *
   * - If there is no `position:relative` in the given parent tree and the
   *   surface is `position:absolute`
   * - If the surface is `position:fixed`
   * - If the surface is in the "top layer"
   * - The anchor and the surface do not share a common `position:relative`
   *   ancestor
   */
  positioning: 'absolute' | 'fixed' | 'document';
  /**
   * Whether or not the surface should be "open" and visible
   */
  isOpen: boolean;
  /**
   * The number of pixels in which to offset from the inline axis relative to
   * logical property.
   *
   * Positive is right in LTR and left in RTL.
   */
  xOffset: number;
  /**
   * The number of pixes in which to offset the block axis.
   *
   * Positive is down and negative is up.
   */
  yOffset: number;
  /**
   * The strategy to follow when repositioning the menu to stay inside the
   * viewport. "move" will simply move the surface to stay in the viewport.
   * "resize" will attempt to resize the surface.
   *
   * Both strategies will still attempt to flip the anchor and surface corners.
   */
  repositionStrategy: 'move' | 'resize';
  /**
   * A function to call after the surface has been positioned.
   */
  onOpen: () => void;
  /**
   * A function to call before the surface should be closed. (A good time to
   * perform animations while the surface is still visible)
   */
  beforeClose: () => Promise<void>;
  /**
   * A function to call after the surface has been closed.
   */
  onClose: () => void;
}

/**
 * Given a surface, an anchor, corners, and some options, this surface will
 * calculate the position of a surface to align the two given corners and keep
 * the surface inside the window viewport. It also provides a StyleInfo map that
 * can be applied to the surface to handle visiblility and position.
 */
export class SurfacePositionController implements ReactiveController {
  // The current styles to apply to the surface.
  private surfaceStylesInternal: StyleInfo = {
    'display': 'none',
  };
  // Previous values stored for change detection. Open change detection is
  // calculated separately so initialize it here.
  private lastValues: SurfacePositionControllerProperties = {
    isOpen: false,
  } as SurfacePositionControllerProperties;

  /**
   * @param host The host to connect the controller to.
   * @param getProperties A function that returns the properties for the
   * controller.
   */
  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly getProperties: () => SurfacePositionControllerProperties,
  ) {
    this.host.addController(this);
  }

  /**
   * The StyleInfo map to apply to the surface via Lit's stylemap
   */
  get surfaceStyles() {
    return this.surfaceStylesInternal;
  }

  /**
   * Calculates the surface's new position required so that the surface's
   * `surfaceCorner` aligns to the anchor's `anchorCorner` while keeping the
   * surface inside the window viewport. This positioning also respects RTL by
   * checking `getComputedStyle()` on the surface element.
   */
  async position() {
    const {
      surfaceEl,
      anchorEl,
      anchorCorner: anchorCornerRaw,
      surfaceCorner: surfaceCornerRaw,
      positioning,
      xOffset,
      yOffset,
      repositionStrategy,
    } = this.getProperties();
    const anchorCorner = anchorCornerRaw.toLowerCase().trim();
    const surfaceCorner = surfaceCornerRaw.toLowerCase().trim();

    if (!surfaceEl || !anchorEl) {
      return;
    }

    // Store these before we potentially resize the window with the next set of
    // lines
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;

    const div = document.createElement('div');
    div.style.opacity = '0';
    div.style.position = 'fixed';
    div.style.display = 'block';
    div.style.inset = '0';
    document.body.appendChild(div);
    const scrollbarTestRect = div.getBoundingClientRect();
    div.remove();

    // Calculate the widths of the scrollbars in the inline and block directions
    // to account for window-relative calculations.
    const blockScrollbarHeight = window.innerHeight - scrollbarTestRect.bottom;
    const inlineScrollbarWidth = window.innerWidth - scrollbarTestRect.right;

    // Paint the surface transparently so that we can get the position and the
    // rect info of the surface.
    this.surfaceStylesInternal = {
      'display': 'block',
      'opacity': '0',
    };

    // Wait for it to be visible.
    this.host.requestUpdate();
    await this.host.updateComplete;

    // Safari has a bug that makes popovers render incorrectly if the node is
    // made visible + Animation Frame before calling showPopover().
    // https://bugs.webkit.org/show_bug.cgi?id=264069
    // also the cast is required due to differing TS types in Google and OSS.
    if (
      (surfaceEl as unknown as {popover: string}).popover &&
      surfaceEl.isConnected
    ) {
      (surfaceEl as unknown as {showPopover: () => void}).showPopover();
    }

    const surfaceRect = surfaceEl.getSurfacePositionClientRect
      ? surfaceEl.getSurfacePositionClientRect()
      : surfaceEl.getBoundingClientRect();
    const anchorRect = anchorEl.getSurfacePositionClientRect
      ? anchorEl.getSurfacePositionClientRect()
      : anchorEl.getBoundingClientRect();
    const [surfaceBlock, surfaceInline] = surfaceCorner.split('-') as Array<
      'start' | 'end'
    >;
    const [anchorBlock, anchorInline] = anchorCorner.split('-') as Array<
      'start' | 'end'
    >;

    // LTR depends on the direction of the SURFACE not the anchor.
    const isLTR =
      getComputedStyle(surfaceEl as HTMLElement).direction === 'ltr';

    /*
     * For more on inline and block dimensions, see MDN article:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
     *
     * ┌───── inline/blockDocumentOffset  inlineScrollbarWidth
     * │       │                                    │
     * │     ┌─▼─────┐                              │Document
     * │    ┌┼───────┴──────────────────────────────┼────────┐
     * │    ││                                      │        │
     * └──► ││ ┌───── inline/blockWindowOffset      │        │
     *      ││ │       │                            ▼        │
     *      ││ │     ┌─▼───┐                 Window┌┐        │
     *      └┤ │    ┌┼─────┴───────────────────────┼│        │
     *       │ │    ││                             ││        │
     *       │ └──► ││  ┌──inline/blockAnchorOffset││        │
     *       │      ││  │     │                    ││        │
     *       │      └┤  │  ┌──▼───┐                ││        │
     *       │       │  │ ┌┼──────┤                ││        │
     *       │       │  └─►│Anchor│                ││        │
     *       │       │    └┴──────┘                ││        │
     *       │       │                             ││        │
     *       │       │     ┌───────────────────────┼┼────┐   │
     *       │       │     │ Surface               ││    │   │
     *       │       │     │                       ││    │   │
     *       │       │     │                       ││    │   │
     *       │       │     │                       ││    │   │
     *       │       │     │                       ││    │   │
     *       │      ┌┼─────┼───────────────────────┼│    │   │
     *       │   ┌─►┴──────┼────────────────────────┘    ├┐  │
     *       │   │         │ inline/blockOOBCorrection   ││  │
     *       │   │         │                         │   ││  │
     *       │   │         │                         ├──►├│  │
     *       │   │         │                         │   ││  │
     *       │   │         └────────────────────────┐▼───┼┘  │
     *       │  blockScrollbarHeight                └────┘   │
     *       │                                               │
     *       └───────────────────────────────────────────────┘
     */

    // Calculate the block positioning properties
    let {blockInset, blockOutOfBoundsCorrection, surfaceBlockProperty} =
      this.calculateBlock({
        surfaceRect,
        anchorRect,
        anchorBlock,
        surfaceBlock,
        yOffset,
        positioning,
        windowInnerHeight,
        blockScrollbarHeight,
      });

    // If the surface should be out of bounds in the block direction, flip the
    // surface and anchor corner block values and recalculate
    if (blockOutOfBoundsCorrection) {
      const flippedSurfaceBlock = surfaceBlock === 'start' ? 'end' : 'start';
      const flippedAnchorBlock = anchorBlock === 'start' ? 'end' : 'start';

      const flippedBlock = this.calculateBlock({
        surfaceRect,
        anchorRect,
        anchorBlock: flippedAnchorBlock,
        surfaceBlock: flippedSurfaceBlock,
        yOffset,
        positioning,
        windowInnerHeight,
        blockScrollbarHeight,
      });

      // In the case that the flipped verion would require less out of bounds
      // correcting, use the flipped corner block values
      if (
        blockOutOfBoundsCorrection > flippedBlock.blockOutOfBoundsCorrection
      ) {
        blockInset = flippedBlock.blockInset;
        blockOutOfBoundsCorrection = flippedBlock.blockOutOfBoundsCorrection;
        surfaceBlockProperty = flippedBlock.surfaceBlockProperty;
      }
    }

    // Calculate the inline positioning properties
    let {inlineInset, inlineOutOfBoundsCorrection, surfaceInlineProperty} =
      this.calculateInline({
        surfaceRect,
        anchorRect,
        anchorInline,
        surfaceInline,
        xOffset,
        positioning,
        isLTR,
        windowInnerWidth,
        inlineScrollbarWidth,
      });

    // If the surface should be out of bounds in the inline direction, flip the
    // surface and anchor corner inline values and recalculate
    if (inlineOutOfBoundsCorrection) {
      const flippedSurfaceInline = surfaceInline === 'start' ? 'end' : 'start';
      const flippedAnchorInline = anchorInline === 'start' ? 'end' : 'start';

      const flippedInline = this.calculateInline({
        surfaceRect,
        anchorRect,
        anchorInline: flippedAnchorInline,
        surfaceInline: flippedSurfaceInline,
        xOffset,
        positioning,
        isLTR,
        windowInnerWidth,
        inlineScrollbarWidth,
      });

      // In the case that the flipped verion would require less out of bounds
      // correcting, use the flipped corner inline values
      if (
        Math.abs(inlineOutOfBoundsCorrection) >
        Math.abs(flippedInline.inlineOutOfBoundsCorrection)
      ) {
        inlineInset = flippedInline.inlineInset;
        inlineOutOfBoundsCorrection = flippedInline.inlineOutOfBoundsCorrection;
        surfaceInlineProperty = flippedInline.surfaceInlineProperty;
      }
    }

    // If we are simply repositioning the surface back inside the viewport,
    // subtract the out of bounds correction values from the positioning.
    if (repositionStrategy === 'move') {
      blockInset = blockInset - blockOutOfBoundsCorrection;
      inlineInset = inlineInset - inlineOutOfBoundsCorrection;
    }

    this.surfaceStylesInternal = {
      'display': 'block',
      'opacity': '1',
      [surfaceBlockProperty]: `${blockInset}px`,
      [surfaceInlineProperty]: `${inlineInset}px`,
    };

    // In the case that we are resizing the surface to stay inside the viewport
    // we need to set height and width on the surface.
    if (repositionStrategy === 'resize') {
      // Add a height property to the styles if there is block height correction
      if (blockOutOfBoundsCorrection) {
        this.surfaceStylesInternal['height'] = `${
          surfaceRect.height - blockOutOfBoundsCorrection
        }px`;
      }

      // Add a width property to the styles if there is block height correction
      if (inlineOutOfBoundsCorrection) {
        this.surfaceStylesInternal['width'] = `${
          surfaceRect.width - inlineOutOfBoundsCorrection
        }px`;
      }
    }

    this.host.requestUpdate();
  }

  /**
   * Calculates the css property, the inset, and the out of bounds correction
   * for the surface in the block direction.
   */
  private calculateBlock(config: {
    surfaceRect: DOMRect;
    anchorRect: DOMRect;
    anchorBlock: 'start' | 'end';
    surfaceBlock: 'start' | 'end';
    yOffset: number;
    positioning: 'absolute' | 'fixed' | 'document';
    windowInnerHeight: number;
    blockScrollbarHeight: number;
  }) {
    const {
      surfaceRect,
      anchorRect,
      anchorBlock,
      surfaceBlock,
      yOffset,
      positioning,
      windowInnerHeight,
      blockScrollbarHeight,
    } = config;
    // We use number booleans to multiply values rather than `if` / ternary
    // statements because it _heavily_ cuts down on nesting and readability
    const relativeToWindow =
      positioning === 'fixed' || positioning === 'document' ? 1 : 0;
    const relativeToDocument = positioning === 'document' ? 1 : 0;
    const isSurfaceBlockStart = surfaceBlock === 'start' ? 1 : 0;
    const isSurfaceBlockEnd = surfaceBlock === 'end' ? 1 : 0;
    const isOneBlockEnd = anchorBlock !== surfaceBlock ? 1 : 0;

    // Whether or not to apply the height of the anchor
    const blockAnchorOffset = isOneBlockEnd * anchorRect.height + yOffset;
    // The absolute block position of the anchor relative to window
    const blockTopLayerOffset =
      isSurfaceBlockStart * anchorRect.top +
      isSurfaceBlockEnd *
        (windowInnerHeight - anchorRect.bottom - blockScrollbarHeight);
    const blockDocumentOffset =
      isSurfaceBlockStart * window.scrollY - isSurfaceBlockEnd * window.scrollY;

    // If the surface's block would be out of bounds of the window, move it back
    // in
    const blockOutOfBoundsCorrection = Math.abs(
      Math.min(
        0,
        windowInnerHeight -
          blockTopLayerOffset -
          blockAnchorOffset -
          surfaceRect.height,
      ),
    );

    // The block logical value of the surface
    const blockInset =
      relativeToWindow * blockTopLayerOffset +
      relativeToDocument * blockDocumentOffset +
      blockAnchorOffset;

    const surfaceBlockProperty =
      surfaceBlock === 'start' ? 'inset-block-start' : 'inset-block-end';

    return {blockInset, blockOutOfBoundsCorrection, surfaceBlockProperty};
  }

  /**
   * Calculates the css property, the inset, and the out of bounds correction
   * for the surface in the inline direction.
   */
  private calculateInline(config: {
    isLTR: boolean;
    surfaceInline: 'start' | 'end';
    anchorInline: 'start' | 'end';
    anchorRect: DOMRect;
    surfaceRect: DOMRect;
    xOffset: number;
    positioning: 'absolute' | 'fixed' | 'document';
    windowInnerWidth: number;
    inlineScrollbarWidth: number;
  }) {
    const {
      isLTR: isLTRBool,
      surfaceInline,
      anchorInline,
      anchorRect,
      surfaceRect,
      xOffset,
      positioning,
      windowInnerWidth,
      inlineScrollbarWidth,
    } = config;
    // We use number booleans to multiply values rather than `if` / ternary
    // statements because it _heavily_ cuts down on nesting and readability
    const relativeToWindow =
      positioning === 'fixed' || positioning === 'document' ? 1 : 0;
    const relativeToDocument = positioning === 'document' ? 1 : 0;
    const isLTR = isLTRBool ? 1 : 0;
    const isRTL = isLTRBool ? 0 : 1;
    const isSurfaceInlineStart = surfaceInline === 'start' ? 1 : 0;
    const isSurfaceInlineEnd = surfaceInline === 'end' ? 1 : 0;
    const isOneInlineEnd = anchorInline !== surfaceInline ? 1 : 0;

    // Whether or not to apply the width of the anchor
    const inlineAnchorOffset = isOneInlineEnd * anchorRect.width + xOffset;
    // The inline position of the anchor relative to window in LTR
    const inlineTopLayerOffsetLTR =
      isSurfaceInlineStart * anchorRect.left +
      isSurfaceInlineEnd *
        (windowInnerWidth - anchorRect.right - inlineScrollbarWidth);
    // The inline position of the anchor relative to window in RTL
    const inlineTopLayerOffsetRTL =
      isSurfaceInlineStart *
        (windowInnerWidth - anchorRect.right - inlineScrollbarWidth) +
      isSurfaceInlineEnd * anchorRect.left;
    // The inline position of the anchor relative to window
    const inlineTopLayerOffset =
      isLTR * inlineTopLayerOffsetLTR + isRTL * inlineTopLayerOffsetRTL;

    // The inline position of the anchor relative to window in LTR
    const inlineDocumentOffsetLTR =
      isSurfaceInlineStart * window.scrollX -
      isSurfaceInlineEnd * window.scrollX;
    // The inline position of the anchor relative to window in RTL
    const inlineDocumentOffsetRTL =
      isSurfaceInlineEnd * window.scrollX -
      isSurfaceInlineStart * window.scrollX;
    // The inline position of the anchor relative to window
    const inlineDocumentOffset =
      isLTR * inlineDocumentOffsetLTR + isRTL * inlineDocumentOffsetRTL;

    // If the surface's inline would be out of bounds of the window, move it
    // back in
    const inlineOutOfBoundsCorrection = Math.abs(
      Math.min(
        0,
        windowInnerWidth -
          inlineTopLayerOffset -
          inlineAnchorOffset -
          surfaceRect.width,
      ),
    );

    // The inline logical value of the surface
    const inlineInset =
      relativeToWindow * inlineTopLayerOffset +
      inlineAnchorOffset +
      relativeToDocument * inlineDocumentOffset;

    let surfaceInlineProperty =
      surfaceInline === 'start' ? 'inset-inline-start' : 'inset-inline-end';

    // There are cases where the element is RTL but the root of the page is not.
    // In these cases we want to not use logical properties.
    if (positioning === 'document' || positioning === 'fixed') {
      if (
        (surfaceInline === 'start' && isLTRBool) ||
        (surfaceInline === 'end' && !isLTRBool)
      ) {
        surfaceInlineProperty = 'left';
      } else {
        surfaceInlineProperty = 'right';
      }
    }

    return {
      inlineInset,
      inlineOutOfBoundsCorrection,
      surfaceInlineProperty,
    };
  }

  hostUpdate() {
    this.onUpdate();
  }

  hostUpdated() {
    this.onUpdate();
  }

  /**
   * Checks whether the properties passed into the controller have changed since
   * the last positioning. If so, it will reposition if the surface is open or
   * close it if the surface should close.
   */
  private async onUpdate() {
    const props = this.getProperties();
    let hasChanged = false;
    for (const [key, value] of Object.entries(props)) {
      // tslint:disable-next-line
      hasChanged = hasChanged || value !== (this.lastValues as any)[key];
      if (hasChanged) break;
    }

    const openChanged = this.lastValues.isOpen !== props.isOpen;
    const hasAnchor = !!props.anchorEl;
    const hasSurface = !!props.surfaceEl;

    if (hasChanged && hasAnchor && hasSurface) {
      // Only update isOpen, because if it's closed, we do not want to waste
      // time on a useless reposition calculation. So save the other "dirty"
      // values until next time it opens.
      this.lastValues.isOpen = props.isOpen;

      if (props.isOpen) {
        // We are going to do a reposition, so save the prop values for future
        // dirty checking.
        this.lastValues = props;

        await this.position();
        props.onOpen();
      } else if (openChanged) {
        await props.beforeClose();
        this.close();
        props.onClose();
      }
    }
  }

  /**
   * Hides the surface.
   */
  private close() {
    this.surfaceStylesInternal = {
      'display': 'none',
    };
    this.host.requestUpdate();
    const surfaceEl = this.getProperties().surfaceEl;

    // The following type casts are required due to differing TS types in Google
    // and open source.
    if (
      (surfaceEl as unknown as {popover?: string})?.popover &&
      surfaceEl?.isConnected
    ) {
      (surfaceEl as unknown as {hidePopover: () => void}).hidePopover();
    }
  }
}
