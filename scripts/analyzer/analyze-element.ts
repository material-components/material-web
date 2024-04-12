/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {ReactiveProperty} from '@lit-labs/analyzer/lib/model.js';
import {
  AbsolutePath,
  Analyzer,
  ClassDeclaration,
  LitElementDeclaration,
  LitElementExport,
  Module,
} from '@lit-labs/analyzer/package-analyzer.js';
import * as path from 'path';
import type ts from 'typescript';

/**
 * Represents a module that exports a custom element and links its superclasses
 * via the superClass property up to the `LitElement` superclass.
 */
export interface MdModuleInfo {
  customElementName?: string;
  className: string;
  classPath: string;
  summary?: string;
  description?: string;
  properties: MdPropertyInfo[];
  reactiveProperties: MdPropertyInfo[];
  methods: MdMethodInfo[];
  superClass?: MdModuleInfo;
  events: MdEventInfo[];
}

/**
 * Describes an event that a material design custom element can dispatch.
 */
export interface MdEventInfo {
  name: string;
  description?: string;
  type?: string;
  bubbles: boolean;
  composed: boolean;
}

/**
 * Describes a material design element's property
 */
export interface MdPropertyInfo {
  name: string;
  attribute?: string;
  description?: string;
  type?: string;
  privacy?: string;
  default?: string;
}

/**
 * Describes a material design element's method
 */
export interface MdMethodInfo {
  name: string;
  description?: string;
  privacy?: string;
  parameters: MdMethodParameterInfo[];
  returns?: string;
}

/**
 * Describes a material design element's method parameters
 */
export interface MdMethodParameterInfo {
  name: string;
  description?: string;
  type?: string;
  default?: string;
}

/**
 * Analyzes a material design custom element and its superclass chain and
 * formats the data into a Module info object that describes the Material web
 * custom element and its superclass chain with data useful for API
 * documentation.
 *
 * @param analyzer An instance of the lit analyzer for the material-web project
 * @param elementEntrypoint The entrypoint of the custom elemenr or superclass
 * to analyze.
 * @param superClassName (optional) The name of the superclass we are currently
 * analyzing.
 * @returns A Module info object that describes the Material web custom element
 * and its superclass chain with data useful for API documentation.
 */
export function analyzeElementApi(
  analyzer: Analyzer,
  elementEntrypoint: string,
  superClassName = '',
) {
  // The description of the module
  const elementModule = analyzer.getModule(elementEntrypoint as AbsolutePath);
  let customElementModule: LitElementDeclaration | ClassDeclaration =
    elementModule.getCustomElementExports()[0];

  if (!customElementModule) {
    const unknownSuperClassDeclaration =
      elementModule.getDeclaration(superClassName);

    // Type-cast declaration
    if (
      unknownSuperClassDeclaration.isLitElementDeclaration() ||
      unknownSuperClassDeclaration.isClassDeclaration()
    ) {
      customElementModule = unknownSuperClassDeclaration;
    } else {
      throw new Error(
        `Unknown superclass declaration type for superclass or entrypoint: '${
          superClassName || elementEntrypoint
        }'`,
      );
    }
  }

  const {properties, reactiveProperties} = analyzeFields(
    customElementModule,
    elementModule,
  );
  const methods = analyzeMethods(customElementModule);
  let events: MdEventInfo[] = [];
  if (customElementModule.isLitElementDeclaration()) {
    events = analyzeEvents(customElementModule);
  }

  const superclass = customElementModule.heritage.superClass;

  const elementDocModule: MdModuleInfo = {
    customElementName: (customElementModule as unknown as {tagname?: string})
      .tagname,
    className: customElementModule.name,
    classPath: elementEntrypoint,
    summary: makeMarkdownFriendly(customElementModule.summary),
    description: makeMarkdownFriendly(customElementModule.description),
    properties,
    reactiveProperties,
    methods,
    events,
  };

  // If there is no superclass or we've gotten to the LitElement superclass,
  // we're done. Stop analyzing. Otherwise, analyze the superclass.
  if (superclass !== undefined && superclass.name !== 'LitElement') {
    // Get the typescript source path of the superclass since we use js imports
    const superClassLocation = superclass.module.replace(/\.js$/, '.ts');
    const absolutePath = path.resolve(
      elementEntrypoint,
      path.relative(elementEntrypoint, superClassLocation),
    );
    const superClassModule = analyzeElementApi(
      analyzer,
      absolutePath,
      superclass.name,
    );
    elementDocModule.superClass = superClassModule;
  }

  return elementDocModule;
}

/**
 * These are fields we do not want to expose on the API docs.
 */
const FIELDS_TO_IGNORE = new Set(['isListItem', 'isMenuItem']);

/**
 * Analyzes the fields of a LitElement class and returns information about the
 * properties and reactive properties of the LitElement class in a format
 * useful for API documentation generation.
 *
 * @param classDeclaration The LitElement class declaration from which to
 * analyze and formatthe property fields.
 * @param module The analyzer module descriptor used to resolve default value
 * variable values.
 * @returns The information about the properties and reactive properties of the
 * LitElement class.
 */
export function analyzeFields(
  classDeclaration: LitElementExport | LitElementDeclaration | ClassDeclaration,
  module: Module,
): {properties: MdPropertyInfo[]; reactiveProperties: MdPropertyInfo[]} {
  const properties: MdPropertyInfo[] = [];
  const reactiveProperties: MdPropertyInfo[] = [];

  for (const field of classDeclaration.fields) {
    // skip certain fields and symbols
    if (FIELDS_TO_IGNORE.has(field.name) || field.name.includes('[')) {
      continue;
    }

    let defaultVal = field.default;
    let reactiveProp: ReactiveProperty | null = null;
    if (classDeclaration.isLitElementDeclaration()) {
      reactiveProp = classDeclaration.reactiveProperties.get(field.name);
    }

    // Check the module and see if the default value is a variable declared in
    // the same file.
    if (module.declarations.find((dec) => dec.name === field.default)) {
      // Check if the default value is a variable declared in the same file.
      const variableDeclaration = module.getDeclaration(field.default);

      if (variableDeclaration.isVariableDeclaration()) {
        const node =
          variableDeclaration.node as unknown as ts.VariableDeclaration;

        // attempt to get the default value. If it's not a string, just use the
        // variable name.
        defaultVal = node.initializer?.getText() ?? defaultVal;
      }
    }

    let attribute: string | undefined = undefined;
    let propertyArray = properties;

    // If it is a reactive property, put it in the reactive properties array
    // and add the attribute name.
    if (reactiveProp) {
      propertyArray = reactiveProperties;
      // If the attribute is true, try to convert the name to an attribute.
      if (reactiveProp.attribute === true) {
        attribute = nameToAttribute(reactiveProp.name);
        // If it is a string, use that as the attribute name.
      } else if (reactiveProp.attribute !== false) {
        attribute = reactiveProp.attribute;
      }
    }

    propertyArray.push({
      name: field.name,
      attribute,
      description: makeMarkdownFriendly(field.description),
      type: makeMarkdownFriendly(field.type.text),
      privacy: field.privacy,
      default: makeMarkdownFriendly(defaultVal),
    });
  }
  return {properties, reactiveProperties};
}

/**
 * These are substrings that we do not want to convert to kebab case. For
 * example, we want to keep tabIndex as tabindex attribute and not convert it to
 * tab-index.
 */
const SUBSTRINGS_TO_NOT_KEBAB = new Set(['tabIndex']);

/**
 * Converts a snakeCase property name to a kebab-case attribute name.
 *
 * @param propertyName The snakeCase property name to convert to an attribute
 * @returns A kebab case attribute name.
 */
function nameToAttribute(propertyName: string) {
  for (const substring of SUBSTRINGS_TO_NOT_KEBAB) {
    propertyName.replace(substring, substring.toLowerCase());
  }

  // Camel case to kebab case taken from Polymer source
  // https://github.com/Polymer/polymer/blob/1e8b246d01ea99adba305ea04c45d26da31f68f1/lib/utils/case-map.js#L45
  return propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * These are methods we do not want to expose on the API docs.
 */
const METHODS_TO_IGNORE = new Set([
  'attributeChangedCallback',
  'connectedCallback',
  'disconnectedCallback',
  'update',
  'render',
  'firstUpdated',
  'updated',
  'focus',
  'blur',
]);

/**
 * Analyzes the methods of a LitElement class and returns information about the
 * methods of the LitElement class in a format useful for API documentation
 * generation.
 *
 * @param classDeclaration The LitElement class declaration from which to
 *     analyze and format the method data.
 * @returns The information about the methods of the LitElement class.
 */
export function analyzeMethods(
  classDeclaration: LitElementExport | LitElementDeclaration | ClassDeclaration,
) {
  const methods: MdMethodInfo[] = [];
  for (const method of classDeclaration.methods) {
    // Skip methods we decided to skip and symbols
    if (METHODS_TO_IGNORE.has(method.name) || method.name.includes('[')) {
      continue;
    }

    methods.push({
      name: method.name,
      description: makeMarkdownFriendly(method.description),
      privacy: method.privacy,
      parameters: method.parameters.map((parameter) => ({
        name: parameter.name,
        summary: makeMarkdownFriendly(parameter.summary),
        description: makeMarkdownFriendly(parameter.description),
        type: makeMarkdownFriendly(parameter.type.text),
        default: parameter.default,
      })),
      returns: makeMarkdownFriendly(method.return?.type.text),
    });
  }

  return methods;
}

/**
 * Analyzes the events dispatched by a LitElement class and returns information
 * about the events dispatched by the LitElement class in a format useful for
 * API documentation generation. NOTE if --buubbles or --composed is in the
 * event description, it will be removed from the description and the bubbles
 * and composed properties will be set to true.
 *
 * @param classDeclaration The LitElement class declaration from which to
 *     analyze and format the event data.
 * @returns The information about the events dispatched by the LitElement class.
 */
export function analyzeEvents(
  classDeclaration: LitElementExport | LitElementDeclaration,
): MdEventInfo[] {
  const events: MdEventInfo[] = [];
  const eventsKeys = classDeclaration.events.keys();

  for (const eventName of eventsKeys) {
    const event = classDeclaration.events.get(eventName);
    let description = event.description;
    const bubbles = description?.includes('--bubbles') || false;
    const composed = description?.includes('--composed') || false;

    // Remove the --bubbles and --composed from the description
    description = description?.replace(/\s*\-\-bubbles\s*/g, '');
    description = description?.replace(/\s*\-\-composed\s*/g, '');
    description = makeMarkdownFriendly(description);

    events.push({
      name: eventName,
      description,
      bubbles,
      composed,
      type: makeMarkdownFriendly(event?.type?.text),
    });
  }
  return events;
}

/**
 * Attempts to make a string to be friendly to be inserted into a markdown
 * table. This includes replacing newlines with `<br>`, replacing | with \\| and
 * replacing multiple spaces with a single space.
 *
 * @param text The text to make markdown friendly.
 * @returns The text transformed to friendly to markdown tables, or undefined if
 * the text is undefined.
 */
export function makeMarkdownFriendly(text?: string) {
  if (!text) return undefined;

  text = text.trim();
  // create a newline marker so i don't have to deal with regex flags
  text = text.replaceAll('\n', '<newline>');
  // keep double newlines
  text = text.replaceAll(/<newline>\s*<newline>/g, '<br>');
  // replace single newlines with a space
  text = text.replaceAll('<newline>', ' ');
  text = text.replaceAll('|', '\\|');
  text = text.replaceAll(/\s+/g, ' ');
  // remove any newly created newline spaces at the start and end
  text = text.trim();

  return text;
}
