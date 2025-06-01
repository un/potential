// packages/templates/src/utils.ts
import type { ConstsTypes } from "@potential/consts";

import type { BaseTemplate, TrackerConfigWithMeta } from "./types";
import { TRACKER_TEMPLATES } from "./templates/templates-registry";

// Helper function to create templates with type checking
export function defineTemplate(template: BaseTemplate): BaseTemplate {
  return template;
}

// Template retrieval and manipulation functions
export function getTemplateById(id: string): BaseTemplate | undefined {
  for (const typeTemplates of Object.values(TRACKER_TEMPLATES)) {
    const found = typeTemplates[id as keyof typeof typeTemplates];
    if (found) return found;
  }
  return undefined;
}

export function getTemplateVersion(
  templateId: string,
  version: number,
): BaseTemplate | undefined {
  const template = getTemplateById(templateId);
  if (template?.version === version) {
    return template;
  }
  return undefined;
}

export function hasTemplateUpdates(config: TrackerConfigWithMeta): boolean {
  if (!config._meta?.templateId || !config._meta.templateVersion) {
    return false;
  }

  const currentTemplate = getTemplateById(config._meta.templateId);
  return currentTemplate
    ? currentTemplate.version > config._meta.templateVersion
    : false;
}

export function filterTemplatesByType(
  type: ConstsTypes["TRACKER"]["TYPES"]["KEY"],
): BaseTemplate[] {
  const templates: BaseTemplate[] = [];
  for (const typeTemplates of Object.values(TRACKER_TEMPLATES[type])) {
    templates.push(typeTemplates);
  }
  return templates;
}
