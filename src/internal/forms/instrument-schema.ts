import {
  defaultErrorTranslator,
  type ErrorTranslator,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import type {components as ConfigComponents} from '../../generated/config-openapi.js';

export type ConfigInstrumentSchemaErrorMessages =
  ConfigComponents['schemas']['ConfigInstrumentSchemaErrorMessages'];

export type ConfigInstrumentSchemaProperty =
  ConfigComponents['schemas']['ConfigInstrumentSchemaProperty'];

export type ConfigInstrumentSchema =
  ConfigComponents['schemas']['ConfigInstrumentSchema'];

type NormalizedInstrumentSchema = {
  type: 'object';
  properties: Record<
    string,
    NormalizedInstrumentSchema | NormalizedInstrumentSchemaProperty
  >;
  required?: string[];
};

type NormalizedInstrumentSchemaProperty = ConfigInstrumentSchemaProperty;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasOwn = (value: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const isNonBlankString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isOptionalNonNegativeInteger = (value: unknown): boolean =>
  value === undefined ||
  (typeof value === 'number' && Number.isInteger(value) && value >= 0);

const hasValidLengthRange = (minLength: unknown, maxLength: unknown): boolean =>
  isOptionalNonNegativeInteger(minLength) &&
  isOptionalNonNegativeInteger(maxLength) &&
  !(
    typeof minLength === 'number' &&
    typeof maxLength === 'number' &&
    minLength > maxLength
  );

const normalizePattern = (pattern: string): string =>
  pattern.length >= '$re$'.length * 2 &&
  pattern.startsWith('$re$') &&
  pattern.endsWith('$re$')
    ? `^(?:${pattern.slice('$re$'.length, -'$re$'.length)})$`
    : pattern;

const hasValidPattern = (value: unknown): boolean => {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  try {
    new RegExp(normalizePattern(value), 'u');
    return true;
  } catch {
    return false;
  }
};

const isInstrumentSchemaErrorMessages = (
  value: unknown
): value is ConfigInstrumentSchemaErrorMessages =>
  isRecord(value) &&
  isNonBlankString(value.required) &&
  Object.values(value).every(isNonBlankString);

const isInstrumentSchemaProperty = (
  value: unknown
): value is ConfigInstrumentSchemaProperty =>
  isRecord(value) &&
  value.type === 'string' &&
  isNonBlankString(value.title) &&
  hasValidLengthRange(value.minLength, value.maxLength) &&
  hasValidPattern(value.pattern) &&
  isInstrumentSchemaErrorMessages(value['x-errorMessages']);

const splitPropertyPath = (path: string): string[] => path.split('.');
const unsafePropertyPathSegments = new Set([
  'prototype',
  ...Object.getOwnPropertyNames(Object.prototype),
]);

const hasValidPropertyPaths = (paths: string[]): boolean => {
  const segments = paths.map(splitPropertyPath);

  if (
    segments.some((pathSegments) =>
      pathSegments.some(
        (segment) =>
          segment.length === 0 || unsafePropertyPathSegments.has(segment)
      )
    )
  ) {
    return false;
  }

  return !segments.some((pathSegments, index) =>
    segments.some(
      (candidate, candidateIndex) =>
        candidateIndex !== index &&
        candidate.length < pathSegments.length &&
        candidate.every(
          (segment, segmentIndex) => segment === pathSegments[segmentIndex]
        )
    )
  );
};

const assertValidPropertyPaths = (schema: ConfigInstrumentSchema): void => {
  if (!hasValidPropertyPaths(Object.keys(schema.properties))) {
    throw new Error('Instrument schema contains an unsafe property path.');
  }
};

const isConfigInstrumentSchema = (
  value: unknown
): value is ConfigInstrumentSchema => {
  if (
    !isRecord(value) ||
    !isNonBlankString(value.bavSupportedCode) ||
    typeof value.productId !== 'string' ||
    typeof value.countryCode !== 'string' ||
    typeof value.currencyCode !== 'string' ||
    typeof value.currencyName !== 'string' ||
    value.type !== 'object' ||
    !isRecord(value.properties) ||
    !Array.isArray(value.required)
  ) {
    return false;
  }

  const propertyPaths = Object.keys(value.properties);

  return (
    propertyPaths.length > 0 &&
    hasValidPropertyPaths(propertyPaths) &&
    Object.values(value.properties).every(isInstrumentSchemaProperty) &&
    value.required.every(
      (requiredPath) =>
        typeof requiredPath === 'string' && propertyPaths.includes(requiredPath)
    )
  );
};

export const usableInstrumentSchemas = (
  value: unknown
): ConfigInstrumentSchema[] => {
  const candidates = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.instrumentSchemas)
    ? value.instrumentSchemas
    : [];

  return candidates.filter(isConfigInstrumentSchema);
};

const createObjectSchema = (): NormalizedInstrumentSchema => ({
  type: 'object',
  properties: {},
});

const normalizeProperty = (
  property: ConfigInstrumentSchemaProperty
): NormalizedInstrumentSchemaProperty => {
  const normalized: NormalizedInstrumentSchemaProperty = {
    type: 'string',
    title: property.title,
    'x-errorMessages': {...property['x-errorMessages']},
  };

  if (property.minLength !== undefined) {
    normalized.minLength = property.minLength;
  }
  if (property.maxLength !== undefined) {
    normalized.maxLength = property.maxLength;
  }
  if (property.pattern !== undefined) {
    normalized.pattern = normalizePattern(property.pattern);
  }

  return normalized;
};

const addProperty = (
  root: NormalizedInstrumentSchema,
  path: string[],
  property: ConfigInstrumentSchemaProperty
): void => {
  let parent = root;

  for (const segment of path.slice(0, -1)) {
    const existing = hasOwn(parent.properties, segment)
      ? parent.properties[segment]
      : undefined;
    const child = existing ?? createObjectSchema();

    parent.properties[segment] = child;
    parent = child as NormalizedInstrumentSchema;
  }

  parent.properties[path[path.length - 1]] = normalizeProperty(property);
};

const addRequiredPath = (
  root: NormalizedInstrumentSchema,
  path: string[]
): void => {
  let parent = root;

  path.forEach((segment, index) => {
    parent.required ??= [];
    if (!parent.required.includes(segment)) {
      parent.required.push(segment);
    }

    if (index < path.length - 1) {
      parent = parent.properties[segment] as NormalizedInstrumentSchema;
    }
  });
};

export const normalizeInstrumentSchema = (
  schema: ConfigInstrumentSchema
): JsonSchema => {
  assertValidPropertyPaths(schema);

  const normalized = createObjectSchema();

  for (const [path, property] of Object.entries(schema.properties)) {
    addProperty(normalized, splitPropertyPath(path), property);
  }

  for (const path of schema.required) {
    addRequiredPath(normalized, splitPropertyPath(path));
  }

  return normalized as JsonSchema;
};

export const createInstrumentSchemaInitialData = (
  schema: ConfigInstrumentSchema
): Record<string, unknown> => {
  assertValidPropertyPaths(schema);

  const data: Record<string, unknown> = {};

  for (const path of Object.keys(schema.properties)) {
    let parent = data;

    for (const segment of splitPropertyPath(path).slice(0, -1)) {
      const existing = hasOwn(parent, segment) ? parent[segment] : undefined;
      const child = isRecord(existing) ? existing : {};

      parent[segment] = child;
      parent = child;
    }
  }

  return data;
};

const encodeJsonPointerSegment = (segment: string): string =>
  segment.replace(/~/gu, '~0').replace(/\//gu, '~1');

export const createInstrumentSchemaUiSchema = (
  schema: ConfigInstrumentSchema
): UISchemaElement => {
  assertValidPropertyPaths(schema);

  return {
    type: 'VerticalLayout',
    elements: Object.keys(schema.properties).map((path) => ({
      type: 'Control',
      scope: `#/properties/${splitPropertyPath(path)
        .map(encodeJsonPointerSegment)
        .join('/properties/')}`,
    })),
  };
};

const propertyPointer = (path: string): string =>
  `/${splitPropertyPath(path).map(encodeJsonPointerSegment).join('/')}`;

const errorPropertyPointer = (
  instancePath: string,
  keyword: string,
  params: Record<string, unknown>
): string => {
  if (keyword !== 'required' || typeof params.missingProperty !== 'string') {
    return instancePath;
  }

  return `${instancePath}/${encodeJsonPointerSegment(params.missingProperty)}`;
};

export const createInstrumentSchemaErrorTranslator = (
  schema: ConfigInstrumentSchema
): ErrorTranslator => {
  const messagesByPointer = new Map(
    Object.entries(schema.properties).map(([path, property]) => [
      propertyPointer(path),
      property['x-errorMessages'],
    ])
  );

  return (error, translate, uischema) => {
    const pointer = errorPropertyPointer(
      error.instancePath,
      error.keyword,
      error.params
    );
    const customMessage = (
      messagesByPointer.get(pointer) as
        | Record<string, string | undefined>
        | undefined
    )?.[error.keyword];

    return customMessage ?? defaultErrorTranslator(error, translate, uischema);
  };
};
