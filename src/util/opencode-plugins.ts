/**
 * Shared helpers for reading OpenCode/KiloCode plugin registrations.
 *
 * OpenCode V2 renamed the config key from `plugin` to `plugins` and added an
 * object entry shape (`{ package, options }`). V1 (`plugin`) is still accepted
 * as a deprecated alias, and KiloCode may still write the V1 key, so both are
 * supported here.
 */

export type PluginEntry = string | { package?: unknown; options?: unknown };

/** Bare package/name for a plugin entry, or undefined when it has none. */
export function pluginEntryName(entry: unknown): string | undefined {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const pkg = (entry as { package?: unknown }).package;
    if (typeof pkg === "string") return pkg;
  }
  return undefined;
}

/** Plugin entries from whichever config key the host uses (`plugins` wins). */
export function getPluginEntries(
  settings: Record<string, unknown> | null | undefined,
): unknown[] {
  if (!settings) return [];
  if (Array.isArray(settings.plugins)) return settings.plugins;
  if (Array.isArray(settings.plugin)) return settings.plugin;
  return [];
}

/** True when `settings` registers context-mode through either config key. */
export function hasContextModePlugin(
  settings: Record<string, unknown> | null | undefined,
): boolean {
  return getPluginEntries(settings).some((entry) =>
    (pluginEntryName(entry) ?? "").includes("context-mode"),
  );
}

/**
 * Config key to write. Preserve an existing key (so V1/Kilo configs are not
 * rewritten), otherwise default to V2 `plugins` for OpenCode and V1 `plugin`
 * for KiloCode.
 */
export function pluginConfigKey(
  settings: Record<string, unknown> | null | undefined,
  platform: "opencode" | "kilo",
): "plugins" | "plugin" {
  if (settings && Array.isArray(settings.plugins)) return "plugins";
  if (settings && Array.isArray(settings.plugin)) return "plugin";
  return platform === "opencode" ? "plugins" : "plugin";
}
