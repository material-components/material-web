/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {safeAttrPrefix} from 'safevalues';
import {safeElement} from 'safevalues/dom.js';

declare global {
  interface ShadowRootInit {
    /**
     * A space-separated list of `aria-*` attributes that should be delegated
     * from the host element to internal Shadow DOM elements.
     */
    delegatesAria?: string;
  }

  interface ShadowRoot {
    /**
     * A space-separated list of `aria-*` attributes that should be delegated
     * from the host element to internal Shadow DOM elements.
     */
    delegatesAria: string;
  }
}

/**
 * Accessibility Object Model reflective aria properties.
 */
const ARIA_PROPERTIES: Array<keyof ARIAMixin> = [
  'ariaActiveDescendantElement',
  'ariaAtomic',
  'ariaAutoComplete',
  'ariaBusy',
  'ariaChecked',
  'ariaColCount',
  'ariaColIndex',
  'ariaColIndexText',
  'ariaColSpan',
  'ariaControlsElements',
  'ariaCurrent',
  'ariaDescribedByElements',
  'ariaDetailsElements',
  'ariaDisabled',
  'ariaErrorMessageElement',
  'ariaExpanded',
  'ariaFlowToElements',
  'ariaHasPopup',
  'ariaHidden',
  'ariaInvalid',
  'ariaKeyShortcuts',
  'ariaLabel',
  'ariaLabelledByElements',
  'ariaLevel',
  'ariaLive',
  'ariaModal',
  'ariaMultiLine',
  'ariaMultiSelectable',
  'ariaOrientation',
  'ariaOwnsElements',
  'ariaPlaceholder',
  'ariaPosInSet',
  'ariaPressed',
  'ariaReadOnly',
  'ariaRequired',
  'ariaRoleDescription',
  'ariaRowCount',
  'ariaRowIndex',
  'ariaRowIndexText',
  'ariaRowSpan',
  'ariaSelected',
  'ariaSetSize',
  'ariaSort',
  'ariaValueMax',
  'ariaValueMin',
  'ariaValueNow',
  'ariaValueText',
] as unknown as Array<keyof ARIAMixin>;
// TODO: remove cast when IDREF properties are added to TS

/**
 * A lookup map whose keys are `aria-*` attributes and values are the
 * corresponding AOM reflective aria property.
 */
const ARIA_ATTRIBUTE_TO_PROPERTY =
    new Map<string, keyof ARIAMixin>(ARIA_PROPERTIES.map(ariaProperty => {
      return [
        ariaProperty.replace('aria', 'aria-')
            .replace(/Elements?/g, '')
            .toLowerCase(),
        ariaProperty
      ];
    }));

/**
 * Aria IDREF attributes that can be shimmed by cloning referenced nodes. This
 * workaround can be removed once browsers support aria IDREF properties.
 */
const CLONEABLE_ARIA_IDREF_ATTRIBUTES = [
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-labelledby',
];

/**
 * A `MutationObserver` that delegates aria attributes between a host element
 * and its `shadowRoot` children.
 */
const DELEGATES_OBSERVER = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    handleMutation(mutation);
  }
});

/**
 * Completes any pending delegations. This is useful in situations like tests
 * where updates need to be synchronous instead of `MutationObserver`'s default
 * asynchronous behavior.
 */
export function completeDelegationMutations() {
  for (const mutation of DELEGATES_OBSERVER.takeRecords()) {
    handleMutation(mutation);
  }
}

/**
 * Sets up a host element's shadowRoot to delegate the provided space-separated
 * aria attributes.
 *
 * This should be called after the host's shadowRoot is attached.
 *
 * @example
 * ```ts
 * class XButton extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({
 *       mode: 'open',
 *       delegatesAria: 'aria-label aria-labelledby',
 *     });
 *
 *     this.shadowRoot.innerHTML = `
 *       <button delegatedaria="aria-label aria-labelledby">
 *         <slot></slot>
 *       </button>
 *     `;
 *   }
 *
 *   override attachShadow(init: ShadowRootInit) {
 *     return delegatesAria(super.attachShadow(init), init.delegatesAria);
 *   }
 * }
 * ```
 *
 * ```html
 * <x-button aria-label="Descriptive label">Label</x-button>
 * ```
 *
 * @param shadowRoot The shadow root that delegates aria attributes.
 * @param delegatesAria A space-separated list of aria attributes to delegate.
 * @return The provided `ShadowRoot` for convenience (see example).
 */
export function delegatesAria(shadowRoot: ShadowRoot, delegatesAria = '') {
  // Add a `shadowRoot.delegatesAria` property.
  Object.defineProperty(shadowRoot, 'delegatesAria', {
    configurable: true,
    enumerable: true,
    get: () => delegatesAria,
    set: () => {},  // noop, like `shadowRoot.delegatesFocus`
  });

  const ariaAttributes = delegatesAria.split(' ');
  // Check if each delegated attribute can be supported by this shim.
  for (const attribute of ariaAttributes) {
    const property = ARIA_ATTRIBUTE_TO_PROPERTY.get(attribute);
    if (!property) {
      throw new Error(`delegatesAria: "${attribute}" is not supported.`);
    }

    // Check if we can add a workaround if an IDREF property is not supported
    // by cloning the node into the `ShadowRoot`.
    const isIdrefProperty = property.includes('Element');
    const isPropertySupported = property in Element.prototype;
    const isCloneable = CLONEABLE_ARIA_IDREF_ATTRIBUTES.includes(attribute);
    if (isIdrefProperty && !isPropertySupported && !isCloneable) {
      throw new Error(
          `"${attribute}" cannot be delegated without \`${property}\` support`);
    }
  }

  // Observe aria-* attribute changes on the host.
  DELEGATES_OBSERVER.observe(
      shadowRoot.host,
      {attributeFilter: ariaAttributes, attributeOldValue: true});

  // Observe `ShadowRoot` children's `delegatedaria` attribute changes, as well
  // as any added or removed children with `delegatedaria` attributes.
  DELEGATES_OBSERVER.observe(shadowRoot, {
    attributeFilter: ['delegatedaria'],
    attributeOldValue: true,
    childList: true,
    subtree: true
  });

  // Delegate to any children already in the `ShadowRoot` that have a
  // `delegatedaria` attribute.
  for (const child of shadowRoot.querySelectorAll('[delegatedaria]')) {
    const delegatedAttributes =
        child.getAttribute('delegatedaria')
            ?.split(' ')
            .filter(attribute => ariaAttributes.includes(attribute)) ||
        [];
    delegateAttributes(shadowRoot, child, delegatedAttributes);
  }

  return shadowRoot;
}

/**
 * Handle a delegation mutation.
 *
 * @param mutation The `MutationRecord` to handle from `DELEGATES_OBSERVER`.
 */
function handleMutation(mutation: MutationRecord) {
  // Handle a mutation that requires delegating aria attributes. This may be
  // one of the following.

  // - A child's `delegatedaria` attribute changes.
  if (mutation.attributeName === 'delegatedaria') {
    handleChildDelegatedAriaChange(
        mutation.target as Element, mutation.oldValue);
    return;
  }

  // - A host's `aria-*` attribute changes.
  if (mutation.type === 'attributes') {
    handleHostAriaAttributeChange(
        mutation.target as Element, mutation.attributeName!);
    return;
  }

  // - `delegatedaria` children that are added or removed.
  if (mutation.type === 'childList') {
    handleChildrenChange(
        Array.from(mutation.addedNodes).filter(isDelegatedAriaNode),
        Array.from(mutation.removedNodes).filter(isDelegatedAriaNode));
    return;
  }
}

/**
 * Handle when a shadow root's child with a "delegatedaria" attribute changes
 * the value of "delegatedaria".
 *
 * @param child The child element of a shadow root with a "delegatedaria"
 *     attribute.
 * @param oldValue The previous value of the "delegatedaria" attribute (if any).
 */
function handleChildDelegatedAriaChange(child: Element, oldValue: string|null) {
  const shadowRoot = child.getRootNode();
  if (!(shadowRoot instanceof ShadowRoot)) {
    return;
  }

  const previousAttributes = oldValue?.split(' ') ?? [];
  const currentAttributes =
      child.getAttribute('delegatedaria')?.split(' ') ?? [];
  // Remove aria attributes that are no longer delegated.
  for (const previousAttribute of previousAttributes) {
    if (!currentAttributes.includes(previousAttribute)) {
      child.removeAttribute(previousAttribute);
    }
  }

  const newAttributes = currentAttributes.filter(
      attribute => !previousAttributes.includes(attribute));
  delegateAttributes(shadowRoot, child, newAttributes);
  removeUnusedIdrefElements(shadowRoot);
}

/**
 * Handle when a host element's "aria-*" attribute changes. The new value will
 * be delegated to shadow root children with "delegatedaria" attributes.
 *
 * @param host The host element whose aria attribute changed.
 * @param attributeName The aria attribute that changed.
 */
function handleHostAriaAttributeChange(host: Element, attributeName: string) {
  if (!host.shadowRoot) {
    return;
  }

  const delegatedAriaChildren =
      host.shadowRoot.querySelectorAll(`[delegatedaria~="${attributeName}"]`);
  for (const child of delegatedAriaChildren) {
    delegateAttributes(host.shadowRoot, child, [attributeName]);
  }

  removeUnusedIdrefElements(host.shadowRoot);
}

/**
 * Handle when a host's shadow root adds or removed children with
 * "delegatedaria" attributes.
 *
 * @param added Child elements with "delegatedaria" attributes that have been
 *     added.
 * @param removed Child elements with "delegatedaria" attributes that were
 *     removed.
 */
function handleChildrenChange(
    added: DelegatedAriaNode[], removed: DelegatedAriaNode[]) {
  const shadowRootsWithChangedNodes = new Set<ShadowRoot>();
  for (const node of added) {
    const shadowRoot = node.getRootNode();
    const ariaAttributes = node.getAttribute('delegatedaria').split(' ');
    delegateAttributes(shadowRoot, node, ariaAttributes);
    shadowRootsWithChangedNodes.add(shadowRoot);
  }

  for (const node of removed) {
    shadowRootsWithChangedNodes.add(node.getRootNode());
  }

  for (const shadowRoot of shadowRootsWithChangedNodes) {
    removeUnusedIdrefElements(shadowRoot);
  }
}

/**
 * Delegate one or more aria attributes from a given `ShadowRoot`'s host element
 * to a given child element of the `ShadowRoot`.
 *
 * @param shadowRoot The `ShadowRoot` whose host element is delegating an
 *     attribute.
 * @param child The `shadowRoot`'s child element to delegate attributes to.
 * @param ariaAttributes Aria attributes to delegate to the child element.
 */
function delegateAttributes(
    shadowRoot: ShadowRoot, child: Element, ariaAttributes: string[]) {
  if (!ariaAttributes.length) {
    return;
  }

  // Tell assistive technologies to ignore the host element's aria attributes.
  shadowRoot.host.setAttribute('role', 'presentation');
  for (const ariaAttribute of ariaAttributes) {
    const ariaProperty = ARIA_ATTRIBUTE_TO_PROPERTY.get(ariaAttribute);
    const isPropertySupported =
        ariaProperty && ariaProperty in Element.prototype;
    if (isPropertySupported) {
      // `ariaProperty` is `keyof ARIAMixin` and not renamed.
      // tslint:disable-next-line:no-dict-access-on-struct-type
      child[ariaProperty] = shadowRoot.host[ariaProperty];
    } else if (CLONEABLE_ARIA_IDREF_ATTRIBUTES.includes(ariaAttribute)) {
      // Some IDREF attributes such as `aria-labelledby` can be supported
      // without IDREF properties (ex. `ariaLabelledByElements`) by cloning
      // the node and adding it to the host's `shadowRoot`.
      const externalIds =
          shadowRoot.host.getAttribute(ariaAttribute)?.split(' ') || [];
      const internalIds = cloneIdrefElements(shadowRoot, externalIds).join(' ');

      safeElement.setPrefixedAttribute(
          [safeAttrPrefix`aria-`], child, ariaAttribute, internalIds);
    } else {
      // Fallback for Firefox, which does not currently support any aria
      // properties. This can be removed once FF supports `ARIAMixin`
      // properties.
      const value = shadowRoot.host.getAttribute(ariaAttribute);
      if (value) {
        safeElement.setPrefixedAttribute(
            [safeAttrPrefix`aria-`], child, ariaAttribute, value);
      } else {
        child.removeAttribute(ariaAttribute);
      }
    }
  }
}

/**
 * A `Node` that is a child of an element's shadow root with a "delegatedaria"
 * attribute.
 *
 * This is used for type checking with `isDelegatedAriaNode()`.
 */
interface DelegatedAriaNode extends Element {
  getAttribute(name: 'delegatedaria'): string;
  getRootNode(): ShadowRoot;
}

/**
 * Checks if a `Node` from a mutation is a child of an element's shadow root
 * with a "delegatedaria" attribute.
 */
function isDelegatedAriaNode(node: Node): node is DelegatedAriaNode {
  return node instanceof Element && node.hasAttribute('delegatedaria') &&
      node.getRootNode() instanceof ShadowRoot;
}

/**
 * Clones referenced external ID elements into a given shadow root.
 *
 * This is used to support some IDREF aria attributes (such as
 * "aria-labelledby") when the browser does not support IDREF aria properties
 * (such as `ariaLabelledByElements`).
 *
 * For a given array of external reference IDs, each referenced external element
 * is cloned and hidden inside the given shadow root. An array of corresponding
 * internal IDs are returned to be used in "aria-*" attributes within the shadow
 * root.
 *
 * @param shadowRoot The `ShadowRoot` to clone elements into.
 * @param externalIds An array of element IDs that are relative to the
 *     `shadowRoot`'s host element scope.
 * @return An array of corresponding internal IDs for each of the given external
 *     IDs. Internal IDs may be referenced in "aria-*" attributes of children
 *     within the shadow root.
 */
function cloneIdrefElements(shadowRoot: ShadowRoot, externalIds: string[]) {
  const internalIds: string[] = [];
  const hostRoot = shadowRoot.host.getRootNode() as ShadowRoot | Document;
  for (const id of externalIds) {
    const idrefElement = hostRoot.querySelector<HTMLElement>(`#${id}`);
    if (!idrefElement) {
      continue;
    }

    const internalId = getInternalId(shadowRoot, id);

    // Remove any previously cloned node to replace it with a new copy.
    shadowRoot.querySelector(`#${internalId}`)?.remove();

    const idrefElementClone = idrefElement.cloneNode(true) as HTMLElement;
    idrefElementClone.style.display = 'none';
    idrefElementClone.id = internalId;
    internalIds.push(internalId);
    shadowRoot.appendChild(idrefElementClone);
  }

  return internalIds;
}

/**
 * Checks to see if there are any cloned elements in a given shadow root that
 * are no longer needed, and removes them.
 *
 * @param shadowRoot The `ShadowRoot` to remove unused cloned elements from.
 */
function removeUnusedIdrefElements(shadowRoot: ShadowRoot) {
  const internalIds = getExternalToInternalIdMap(shadowRoot).values();
  for (const internalId of internalIds) {
    for (const aria of CLONEABLE_ARIA_IDREF_ATTRIBUTES) {
      const reference = shadowRoot.querySelector(`[${aria}~=${internalId}]`);
      if (!reference) {
        // No children are referencing this internalId, so we can remove it.
        shadowRoot.querySelector(`#${internalId}`)?.remove();
      }
    }
  }
}

/**
 * The Symbol key to retrieve a `ShadowRoot`'s `Map` of external to internal
 * IDs.
 */
const EXTERNAL_TO_INTERNAL_ID = Symbol('externalToInternalId');

/**
 * A `ShadowRoot` with a map of external and internal IDs.
 */
interface ShadowRootWithDelegatesAriaInternals extends ShadowRoot {
  /**
   * A Map whose keys are external aria IDs and values are internal `ShadowRoot`
   * IDs.
   */
  [EXTERNAL_TO_INTERNAL_ID]?: Map<string, string>;
}

/**
 * Retrieves a `Map` for a shadow root whose keys are external IDs and values
 * are internal IDs.
 *
 * @param shadowRoot The `ShadowRoot` to retrieve an ID map for.
 * @return An ID `Map` whose keys are external IDs and values are internal IDs.
 */
function getExternalToInternalIdMap(
    shadowRoot: ShadowRootWithDelegatesAriaInternals) {
  if (shadowRoot[EXTERNAL_TO_INTERNAL_ID]) {
    return shadowRoot[EXTERNAL_TO_INTERNAL_ID];
  }

  const map = new Map<string, string>();
  shadowRoot[EXTERNAL_TO_INTERNAL_ID] = map;
  return map;
}

/**
 * Retrieves or creates an internal ID for a shadow root that maps to the given
 * external ID.
 *
 * @param shadowRoot The `ShadowRoot` to get or create an internal ID for.
 * @param externalId The external ID the returned internal ID maps to.
 * @return The internal ID that maps to the external ID.
 */
function getInternalId(shadowRoot: ShadowRoot, externalId: string) {
  const idMap = getExternalToInternalIdMap(shadowRoot);
  let internalId = idMap.get(externalId);
  if (internalId) {
    return internalId;
  }

  internalId = `delegated-${externalId}`;
  // Ensure the generated internal ID is unique to the element's shadow root
  let count = 1;
  while (shadowRoot.querySelector(`#${internalId}`)) {
    internalId = `delegated-${externalId}-${count++}`;
  }

  idMap.set(externalId, internalId);
  return internalId;
}
