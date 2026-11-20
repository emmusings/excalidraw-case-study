import { cloneElement } from "react";
import { DropdownMenu } from "radix-ui";

import { useStylesPanelMode } from "@excalidraw/excalidraw/components/App";
import {
  createIcon,
  DotsHorizontalIcon,
  eraser,
  LockedIconFilled,
  PenModeIcon,
  UnlockedIcon,
} from "@excalidraw/excalidraw/components/icons";
import { TOOLS } from "@excalidraw/excalidraw/components/Tools";
import { t } from "@excalidraw/excalidraw/i18n";

import "./solid-icons.css";

import type { ToolbarMeta, ToolbarProps, ToolbarTool } from "../types";

export const meta: ToolbarMeta = {
  name: "Solid Icons",
  idea: "Filled blue silhouettes make the tools easy to scan, and a high-contrast chip marks the active tool.",
};

const solidIcon = (d: string) =>
  createIcon(<path d={d} fillRule="evenodd" fill="currentColor" />, 24);

const solidIcons: Partial<Record<ToolbarTool["type"], React.ReactNode>> = {
  hand: solidIcon(
    "M8 11V5a1.2 1.2 0 0 1 2.4 0v5h.9V3.9a1.2 1.2 0 0 1 2.4 0V10h.9V5.2a1.2 1.2 0 0 1 2.4 0V11h.9V7.5a1.2 1.2 0 0 1 2.4 0v7.9a5.9 5.9 0 0 1-5.9 5.9h-1.8a5.5 5.5 0 0 1-4.5-2.4l-3.9-5.8a1.4 1.4 0 0 1 2.2-1.7L8 13.1Z",
  ),
  selection: solidIcon(
    "M5 3l14.4 9-6.1 1.2 2.6 5.8-2.8 1.3-2.6-5.8L5 19Z",
  ),
  rectangle: solidIcon(
    "M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  ),
  diamond: solidIcon(
    "M10.9 3.6a1.6 1.6 0 0 1 2.2 0l8.4 7.3a1.5 1.5 0 0 1 0 2.2l-8.4 7.3a1.6 1.6 0 0 1-2.2 0l-8.4-7.3a1.5 1.5 0 0 1 0-2.2Z",
  ),
  ellipse: createIcon(
    <ellipse cx="12" cy="12" rx="9" ry="7.5" fill="currentColor" />,
    24,
  ),
  arrow: solidIcon("M4 10h9V6l8 6-8 6v-4H4a2 2 0 0 1 0-4Z"),
  line: solidIcon("M5 10.5h14a1.5 1.5 0 0 1 0 3H5a1.5 1.5 0 0 1 0-3Z"),
  freedraw: solidIcon(
    "M4 20l1.1-5.8 9.5-9.5 4.7 4.7-9.5 9.5L4 20ZM16 3.3l.7-.7a2.1 2.1 0 0 1 3 0l1.7 1.7a2.1 2.1 0 0 1 0 3l-.7.7L16 3.3Z",
  ),
  text: solidIcon(
    "M9.6 4h4.8L21 20h-4.1l-1.3-3.6H8.4L7.1 20H3Zm0 9.2h4.8L12 6.8Z",
  ),
  stickynote: solidIcon(
    "M6 3.5h12a2 2 0 0 1 2 2V13h-5a2 2 0 0 0-2 2v5H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Zm1 5v1.6h10V8.5Zm0 4v1.6h4v-1.6Zm7.7 7.3v-4.7c0-.2.2-.4.4-.4h4.7Z",
  ),
  eraser: cloneElement(eraser, { fill: "currentColor" }),
  image: solidIcon(
    "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm11.5 2.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM5 17h14l-3.5-4-2 2-4-4Z",
  ),
};

const toolIcon = (tool: ToolbarTool) => solidIcons[tool.type] ?? tool.icon;

const toolTitle = ({ label, shortcut }: ToolbarTool) =>
  shortcut ? `${label} · ${shortcut}` : label;

const ariaShortcuts = (tool: ToolbarTool) => {
  const { letterKey, numericKey, shiftKey } = TOOLS[tool.type];
  const letters = typeof letterKey === "string" ? [letterKey] : (letterKey ?? []);
  const keys = [
    ...letters.map(
      (letter) => `${shiftKey ? "Shift+" : ""}${letter.toUpperCase()}`,
    ),
    numericKey,
  ].filter(Boolean);
  return keys.length ? keys.join(" ") : undefined;
};

export default function SolidIconsToolbar({
  tools,
  activeTool,
  locked,
  toggleLock,
  renderHint,
  app,
  appState,
}: ToolbarProps) {
  const stylesPanelMode = useStylesPanelMode();
  const lockLabel = t("toolBar.lock");
  const extrasLabel = t("toolBar.extraTools");
  const mainTools = tools.filter((tool) => tool.group === "main");
  const extraTools = tools.filter(
    (tool) =>
      tool.group === "more" &&
      (tool.type !== "image" || app.props.UIOptions.tools?.image !== false),
  );
  const activeExtra = extraTools.find((tool) => tool.active);

  return (
    <div className="toolbar-solid-icons" data-viewport-ui="top">
      <div
        className="solid-icons-rail"
        role="group"
        aria-label={t("headings.shapes")}
      >
        {stylesPanelMode !== "compact" && appState.penDetected && (
          <button
            type="button"
            className="solid-icons-button"
            title={t("toolBar.penMode")}
            aria-label={t("toolBar.penMode")}
            aria-pressed={appState.penMode}
            onClick={() => app.togglePenMode(null)}
          >
            {PenModeIcon}
          </button>
        )}
        {app.props.activeTool == null && (
          <button
            type="button"
            className="solid-icons-button solid-icons-lock"
            data-testid="toolbar-lock"
            title={`${lockLabel} · Q`}
            aria-label={lockLabel}
            aria-keyshortcuts="Q"
            aria-pressed={locked}
            onClick={toggleLock}
          >
            {locked ? LockedIconFilled : UnlockedIcon}
          </button>
        )}
        {mainTools.map((tool) => (
          <button
            key={tool.type}
            type="button"
            className="solid-icons-button"
            data-testid={`toolbar-${tool.type}`}
            title={toolTitle(tool)}
            aria-label={tool.label}
            aria-keyshortcuts={ariaShortcuts(tool)}
            aria-pressed={tool.active}
            disabled={tool.disabled}
            onClick={tool.select}
          >
            {toolIcon(tool)}
          </button>
        ))}
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger
            className="solid-icons-button solid-icons-extras"
            aria-label={extrasLabel}
            title={
              activeExtra ? `${extrasLabel}: ${toolTitle(activeExtra)}` : extrasLabel
            }
            data-active={activeExtra ? "" : undefined}
          >
            {activeExtra ? toolIcon(activeExtra) : DotsHorizontalIcon}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="solid-icons-menu"
            align="end"
            sideOffset={10}
            onKeyDown={(event) => event.stopPropagation()}
            onEscapeKeyDown={(event) => event.stopImmediatePropagation()}
          >
            <DropdownMenu.RadioGroup value={activeTool}>
              {extraTools.map((tool) => (
                <DropdownMenu.RadioItem
                  key={tool.type}
                  className="solid-icons-menu-item"
                  value={tool.type}
                  disabled={tool.disabled}
                  aria-keyshortcuts={ariaShortcuts(tool)}
                  textValue={tool.label}
                  onSelect={tool.select}
                >
                  {toolIcon(tool)}
                  <span>{tool.label}</span>
                  {tool.shortcut && <kbd aria-hidden="true">{tool.shortcut}</kbd>}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      {!appState.zenModeEnabled && renderHint()}
    </div>
  );
}
