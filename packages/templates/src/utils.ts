// packages/templates/src/utils.ts
import type { BaseTemplate, TrackableConfigWithMeta } from "./types";
import { TRACKABLE_TEMPLATES } from "./templates";

// Helper function to create templates with type checking
export function defineTemplate(template: BaseTemplate): BaseTemplate {
  return template;
}

// Template retrieval and manipulation functions
export function getTemplateById(id: string): BaseTemplate | undefined {
  for (const typeTemplates of Object.values(TRACKABLE_TEMPLATES)) {
    for (const templates of Object.values(typeTemplates)) {
      const found = templates.find((template) => template.id === id);
      if (found) return found;
    }
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

export function hasTemplateUpdates(config: TrackableConfigWithMeta): boolean {
  if (!config._meta?.templateId || !config._meta.templateVersion) {
    return false;
  }

  const currentTemplate = getTemplateById(config._meta.templateId);
  return currentTemplate
    ? currentTemplate.version > config._meta.templateVersion
    : false;
}
