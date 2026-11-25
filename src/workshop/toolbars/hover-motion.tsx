import { DropdownMenu } from "radix-ui";

import { DotsIcon, PinIcon } from "@excalidraw/excalidraw/components/icons";
import { t } from "@excalidraw/excalidraw/i18n";

import type { ToolbarMeta, ToolbarProps, ToolbarTool } from "../types";

import "./hover-motion.css";

export const meta: ToolbarMeta = {
  name: "Hover Motion",
  idea: "A light outline rail previews what each tool does in one brief gesture and reveals its shortcut on demand.",
};

function KeyHint({ shortcut }: { shortcut?: ToolbarTool["shortcut"] }) {
  return shortcut && <kbd className="hover-motion-key">{shortcut}</kbd>;
}

function ButtonFace({
  icon,
  label,
  shortcut,
  caption,
}: Pick<ToolbarTool, "icon" | "label"> &
  Partial<Pick<ToolbarTool, "shortcut">> & { caption?: string }) {
  return (
    <>
      <span className="hover-motion-icon" aria-hidden="true">
        {icon}
      </span>
      {caption && (
        <span className="hover-motion-caption" aria-hidden="true">
          {caption}
        </span>
      )}
      <span className="hover-motion-label" aria-hidden="true">
        {label}
        <KeyHint shortcut={shortcut} />
      </span>
    </>
  );
}

export default function HoverMotionToolbar({
  tools,
  activeTool,
  locked,
  toggleLock,
  renderHint,
  app,
  appState,
}: ToolbarProps) {
  const mainTools = tools.filter(
    (tool) =>
      tool.group === "main" ||
      (tool.type === "image" && app.props.UIOptions.tools?.image !== false),
  );
  const extraTools = tools.filter(
    (tool) => tool.group === "more" && tool.type !== "image",
  );
  const activeExtra = extraTools.find((tool) => tool.active);
  const lockLabel = t("toolBar.keepTool");
  const lockHint = t("toolBar.keepToolHint");
  const moreLabel = t("toolBar.extraTools");

  return (
    <div className="toolbar-hover-motion" data-viewport-ui="top">
      <div
        className="hover-motion-rail"
        role="group"
        aria-label={t("headings.shapes")}
      >
        {app.props.activeTool == null && (
          <button
            type="button"
            className="hover-motion-button hover-motion-lock"
            aria-label={lockLabel}
            aria-description={lockHint}
            aria-keyshortcuts="Q"
            aria-pressed={locked}
            data-testid="toolbar-lock"
            onClick={toggleLock}
          >
            <ButtonFace
              icon={PinIcon}
              label={lockHint}
              caption={lockLabel}
              shortcut="Q"
            />
          </button>
        )}
        {mainTools.map((tool) => {
          const shortcut =
            tool.type === "selection" &&
            appState.preferredSelectionTool.type !== tool.type
              ? null
              : tool.shortcut;

          return (
            <button
              type="button"
              key={tool.type}
              className="hover-motion-button"
              aria-label={tool.label}
              aria-description={shortcut ?? undefined}
              aria-pressed={tool.active}
              disabled={tool.disabled}
              data-tool={tool.type}
              data-testid={`toolbar-${tool.type}`}
              onClick={tool.select}
            >
              <ButtonFace
                icon={tool.icon}
                label={tool.label}
                shortcut={shortcut}
                caption={tool.type === "image" ? t("element.image") : undefined}
              />
            </button>
          );
        })}
        <DropdownMenu.Root
          modal={false}
          onOpenChange={(open) => {
            if (open) {
              app.setAppState({ openMenu: null, openPopup: null });
            }
          }}
        >
          <DropdownMenu.Trigger
            type="button"
            className="hover-motion-button hover-motion-more"
            aria-label={moreLabel}
            data-active={activeExtra ? "" : undefined}
          >
            <ButtonFace
              icon={activeExtra?.icon ?? DotsIcon}
              label={moreLabel}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="hover-motion-menu"
            align="end"
            sideOffset={7}
          >
            <DropdownMenu.RadioGroup value={activeTool}>
              {extraTools.map((tool) => (
                <DropdownMenu.RadioItem
                  key={tool.type}
                  className="hover-motion-menu-item"
                  value={tool.type}
                  aria-label={tool.label}
                  aria-description={tool.shortcut ?? undefined}
                  disabled={tool.disabled}
                  data-testid={`toolbar-${tool.type}`}
                  onSelect={tool.select}
                >
                  <span className="hover-motion-icon" aria-hidden="true">
                    {tool.icon}
                  </span>
                  {tool.label}
                  <KeyHint shortcut={tool.shortcut} />
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
