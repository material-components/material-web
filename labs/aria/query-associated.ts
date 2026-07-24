/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Queries for an associated element with the given ID that is in the same root
 * as the given element.
 *
 * @param element The element to query from.
 * @param id The ID of the associated element to query for.
 * @return The associated element with the given ID, or null if not found.
 */
export function queryAssociatedById(
  element: Element,
  id: string,
): Element | null {
  if (!id) return null;
  return (
    element.getRootNode() as Document | ShadowRoot | Element
  ).querySelector(`#${id}`);
}

/**
 * Queries for one or more associated elements that match the given
 * space-separated ID string that are in the same root as the given element.
 *
 * @param element The element to query from.
 * @param ids The space-separated IDs of the associated elements to query for.
 * @return An array of associated elements with the given IDs.
 */
export function queryAssociatedByIds(element: Element, ids: string): Element[] {
  const selectors = ids
    .split(/\s+/)
    .filter((id) => !!id)
    .map((id) => `#${id}`);
  if (!selectors.length) return [];
  return Array.from(
    (element.getRootNode() as Document | ShadowRoot | Element).querySelectorAll(
      selectors.join(','),
    ),
  );
}
