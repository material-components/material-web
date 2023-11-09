/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AbsolutePath,
  Analyzer,
  createPackageAnalyzer,
} from '@lit-labs/analyzer/package-analyzer.js';
import * as fs from 'fs/promises';
import * as path from 'path';

import {
  analyzeElementApi,
  MdMethodParameterInfo,
  MdModuleInfo,
  MdPropertyInfo,
} from './analyze-element.js';
import {docsToElementMapping} from './element-docs-map.js';
import {MarkdownTable} from './markdown-tree-builder.js';

interface MarkdownTableSection {
  name: string;
  table: MarkdownTable;
}

interface ElementTableSection {
  className: string;
  customElementName: string;
  summary: string;
  description: string;
  tables: Array<{name: string; table: MarkdownTable}>;
}

/**
 * The main side-effect function of this module.
 *
 * It will analyze the element files in `element-docs-map.ts` and update the
 * markdown file's API section with the latest API information. It will replace
 * the code in between the `<!-- auto-generated API docs start -->` and
 * `<!-- auto-generated API docs end -->` comments.
 */
async function updateApiDocs() {
  const packagePath = path.resolve('.');
  // Analyzes the entire material-web repository.
  const analyzer = createPackageAnalyzer(packagePath as AbsolutePath);
  const documentationFileNames = Object.keys(docsToElementMapping);

  const filesWritten: Array<Promise<void>> = [];

  // Update all the documentation files in parallel
  for (const docFileName of documentationFileNames) {
    filesWritten.push(
      updateDocFileApiSection(docFileName, analyzer, packagePath),
    );
  }

  // Wait for all the files to be written
  await Promise.all(filesWritten);
}

/**
 * Updates the API section of an individual documentation file with the latest
 * API information of the related elements in the `element-docs-map.ts` file.
 *
 * @param docFileName The name of the documentation file to update.
 * @param analyzer The instance of the package analyzer from which to pull
 *     module information.
 * @param packagePath The path of the package root.
 *
 * @returns A promise that resolves when the file has been updated.
 */
async function updateDocFileApiSection(
  docFileName: string,
  analyzer: Analyzer,
  packagePath: string,
) {
  const elementEntrypoints = docsToElementMapping[docFileName];
  // This is a data structure that describes an element and its associated API
  // tables. e.g. a single section for MdFilledButton represents MdFilledButton
  // and it's associated Property, Methods, and Events tables.
  const elementTableSections: ElementTableSection[] = [];

  for (const elementEntrypoint of elementEntrypoints) {
    elementTableSections.push(
      generateTableSection(elementEntrypoint, packagePath, analyzer),
    );
  }

  const documentationFileContents = await fs.readFile(
    path.resolve(packagePath, 'docs', 'components', docFileName),
  );

  const updatedFileContents = insertMarkdownTables(
    documentationFileContents.toString(),
    elementTableSections,
  );

  await fs.writeFile(
    path.resolve(packagePath, 'docs', 'components', docFileName),
    updatedFileContents,
  );
}

/**
 * Generates the API table section for a single element.
 *
 * @param elementEntrypoint The file path of where an element is defined.
 * @param packagePath The path of the package root.
 * @param analyzer An instance of the package analyzer from which to pull module
 *     information.
 *
 * @returns The table section of an element. e.g. MdFilledButton's table section
 * would be the element class name, summary, description, and the API tables
 * associated with this element's section e.g. Properties, Methods, and Events.
 */
function generateTableSection(
  elementEntrypoint: string,
  packagePath: string,
  analyzer: Analyzer,
): ElementTableSection {
  const elementDoc = analyzeElementApi(
    analyzer,
    path.resolve(packagePath, elementEntrypoint),
  );
  const tables: MarkdownTableSection[] = [];

  const propertiesTable = generateFieldMarkdownTable(elementDoc);
  const methodsTable = generateMethodMarkdownTable(elementDoc);
  const eventsTable = generateEventsMarkdownTable(elementDoc);

  if (propertiesTable.rows.length > 0) {
    tables.push({name: 'Properties', table: propertiesTable});
  }

  if (methodsTable.rows.length > 0) {
    tables.push({name: 'Methods', table: methodsTable});
  }

  if (eventsTable.rows.length > 0) {
    tables.push({name: 'Events', table: eventsTable});
  }

  return {
    className: elementDoc.className,
    customElementName: elementDoc.customElementName || '',
    summary: elementDoc.summary ?? '',
    description: elementDoc.description ?? '',
    tables,
  };
}

/**
 * Given an object that represents a row in a markdown table, and another object
 * that represents the same row in the table but for the superclass, this
 * function will update the subclass row with the values of the superclass row
 * if they are not defined in the subclass row.
 *
 * @param subclassRow The row object that will be updated with the values of the
 *     superClassRow.
 * @param superClassRow The row object of the superclass that will be used to
 *     update the subclassRow.
 * @returns The mutated subclass row object.
 */
function updateRow<T extends {[key: string]: unknown}>(
  subclassRow: T,
  superClassRow: T,
) {
  const keys = Object.keys(superClassRow) as Array<keyof T>;
  // update the row values if they are not defined
  for (const key of keys) {
    if (subclassRow[key] === undefined) {
      subclassRow[key] = superClassRow[key];
    }
  }

  return subclassRow;
}

/**
 * Generates a markdown table of all the public properties of an element.
 *
 * @param element The analyzed element documentation module from which to
 * generate the properties table.
 * @returns A Markdown table where the rows are thepubli  properties of the
 * element. It is organized by inheritance order and with all reactive
 * properties listed first, then all other properties.
 */
function generateFieldMarkdownTable(element: MdModuleInfo): MarkdownTable {
  const propertiesTable = new MarkdownTable([
    'Property',
    'Attribute',
    'Type',
    'Default',
    'Description',
  ]);
  const fieldNameOrder: string[] = [];
  const fieldToRow = new Map<
    string,
    {
      name: string;
      attribute?: string;
      type?: string;
      default: string;
      description?: string;
    }
  >();

  /**
   * Adds rows to the fieldToRow map and fieldNameOrder array but deduplicates
   * overriden fields and updates the info for the row only if it's not defined
   * in the subclass.
   */
  const generateRow = (property: MdPropertyInfo) => {
    if (property.privacy !== 'public') {
      return;
    }

    let defaultVal = property.default;
    if (defaultVal && property.default.includes('=>')) {
      defaultVal = 'function { ... }';
    }

    const row = {
      name: property.name,
      attribute: property.attribute,
      type: property.type,
      default: defaultVal,
      description: property.description,
    };

    const isPropertyInSubclass = fieldToRow.has(property.name);

    if (isPropertyInSubclass) {
      const subclassRow = fieldToRow.get(property.name);
      updateRow(subclassRow, row);
      return;
    }

    fieldToRow.set(property.name, row);
    fieldNameOrder.push(property.name);
  };

  let currentClass = element;

  // Append reactive properties first in inheritance order
  while (currentClass) {
    for (const property of currentClass.reactiveProperties) {
      generateRow(property);
    }

    currentClass = currentClass.superClass;
  }

  // Reset and append the non-reactive properties in inheritance order.
  currentClass = element;

  while (currentClass) {
    for (const property of currentClass.properties) {
      generateRow(property);
    }

    currentClass = currentClass.superClass;
  }

  for (const property of fieldNameOrder) {
    const rowObj = fieldToRow.get(property);
    propertiesTable.addRow([
      `\`${rowObj.name}\``,
      rowObj.attribute ? `\`${rowObj.attribute}\`` : '',
      rowObj.type ? `\`${rowObj.type}\`` : '',
      `\`${rowObj.default}\``,
      rowObj.description ?? '',
    ]);
  }

  return propertiesTable;
}

/**
 * Generates a markdown table of all the public methods of an element.
 *
 * @param element The analyzed element documentation module from which to
 * generate the methods table.
 * @returns A Markdown table where the rows are the public methods of the
 * element.
 */
function generateMethodMarkdownTable(element: MdModuleInfo): MarkdownTable {
  const methodsTable = new MarkdownTable([
    'Method',
    'Parameters',
    'Returns',
    'Description',
  ]);
  const methodNameOrder: string[] = [];
  const methodToRow = new Map<
    string,
    {
      name: string;
      parameters: MdMethodParameterInfo[];
      returns?: string;
      description?: string;
    }
  >();

  let currentClass = element;
  while (currentClass) {
    for (const method of currentClass.methods) {
      if (method.privacy !== 'public') {
        continue;
      }

      const row = {
        name: method.name,
        parameters: method.parameters,
        returns: method.returns,
        description: method.description,
      };

      const isMethodInSubclass = methodToRow.has(method.name);

      if (isMethodInSubclass) {
        const subclassRow = methodToRow.get(method.name);
        updateRow(subclassRow, row);
        continue;
      }

      methodToRow.set(method.name, row);
      methodNameOrder.push(method.name);
    }

    currentClass = currentClass.superClass;
  }

  for (const methodName of methodNameOrder) {
    const rowObj = methodToRow.get(methodName);
    methodsTable.addRow([
      `\`${rowObj.name}\``,
      rowObj.parameters.map((p) => `\`${p.name}\``).join(', ') || '_None_',
      `\`${rowObj.returns}\`` ?? '`void`',
      rowObj.description ?? '',
    ]);
  }

  return methodsTable;
}

/**
 * Generates a markdown table of all the __documented__ events of an element.
 *
 * @param element The analyzed element documentation module from which to
 * generate the events table.
 * @returns A Markdown table where the rows are the events of the element.
 */
function generateEventsMarkdownTable(element: MdModuleInfo): MarkdownTable {
  const eventsTable = new MarkdownTable([
    'Event',
    'Type',
    '[Bubbles](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles)',
    '[Composed](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed)',
    'Description',
  ]);
  const eventNameOrder: string[] = [];
  const eventToRow = new Map<
    string,
    {
      name: string;
      type?: string;
      bubbles: boolean;
      composed: boolean;
      description?: string;
    }
  >();

  let currentClass = element;

  while (currentClass) {
    for (const event of currentClass.events) {
      const row = {
        name: event.name,
        type: event.type,
        bubbles: event.bubbles,
        composed: event.composed,
        description: event.description,
      };

      const isEventInSubclass = eventToRow.has(event.name);

      if (isEventInSubclass) {
        const subclassRow = eventToRow.get(event.name);
        updateRow(subclassRow, row);
        continue;
      }

      eventToRow.set(event.name, row);
      eventNameOrder.push(event.name);
    }

    currentClass = currentClass.superClass;
  }

  for (const eventName of eventNameOrder) {
    const rowObj = eventToRow.get(eventName);
    eventsTable.addRow([
      `\`${rowObj.name}\``,
      rowObj.type ? `\`${rowObj.type}\`` : '`Event`',
      rowObj.bubbles ? 'Yes' : 'No',
      rowObj.composed ? 'Yes' : 'No',
      rowObj.description ?? '',
    ]);
  }

  return eventsTable;
}

/**
 * Returns the updated documentation file contents with the API section filled
 * with the _Markdownified_ API table sections.
 *
 * @param fileContents The stringified contents of a documentation file.
 * @param elementTableSections An array of elements and their associated
 * API tables to insert into the documentation file.
 * @returns The updated documentation file contents with the API section.
 */
function insertMarkdownTables(
  fileContents: string,
  elementTableSections: ElementTableSection[],
) {
  // A file that has no tables to insert should have its API section cleared.
  const hasContent = elementTableSections.reduce((hasContent, element) => {
    return hasContent || element.tables.length > 0;
  }, false);

  // If there is no content, clear the api section.
  if (!hasContent) {
    return replaceFileContents(fileContents);
  }

  const tablesStrings = stringifyMarkdownTableSections(elementTableSections);

  return replaceFileContents(fileContents, tablesStrings);
}

/**
 * Replaces the fileContents' API section with the provided tablesStrings. If
 * tablesStrings is not provided, the API section will be cleared.
 *
 * @param fileContents The stringified contents of a documentation file.
 * @param tablesStrings The stringified markdown tables to insert into the
 * documentation file. If not provided, the API section will be cleared.
 * @returns The updated documentation file contents with the API section.
 */
function replaceFileContents(fileContents: string, tablesStrings?: string) {
  const injectionPointRegex =
    /<!-- auto-generated API docs start -->.*<!-- auto-generated API docs end -->/s;

  if (!tablesStrings) {
    return fileContents.replace(
      injectionPointRegex,
      `<!-- auto-generated API docs start -->
<!-- auto-generated API docs end -->`,
    );
  }

  return fileContents.replace(
    injectionPointRegex,
    `<!-- auto-generated API docs start -->

## API

${tablesStrings}
<!-- auto-generated API docs end -->`,
  );
}

/**
 * Stringifies the markdown table sections of all the elements and their
 * associated API tables in markdown.
 *
 * @param elements The element classes and their associated API tables to
 * stringify into markdown.
 * @returns A stringified markdown table section of all the elements and their
 * associated API tables.
 */
function stringifyMarkdownTableSections(elements: ElementTableSection[]) {
  let tablesStrings = '';

  for (const element of elements) {
    const {className, tables, customElementName} = element;
    tablesStrings += `
### ${className}${
      customElementName ? ` <code>&lt;${customElementName}&gt;</code>` : ''
    }
${tables
  .map(
    ({name, table}) => `
#### ${name}

${table.toString()}
`,
  )
  .join('')}`;
  }

  return tablesStrings;
}

// Run the main script
await updateApiDocs();
