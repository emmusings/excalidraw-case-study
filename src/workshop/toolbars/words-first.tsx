import { DropdownMenu as Menu } from "radix-ui";
import type { ReactNode } from "react";

import DropdownMenuItem from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuItem";
import { useStylesPanelMode } from "@excalidraw/excalidraw/components/App";
import { IconButton } from "@excalidraw/excalidraw/components/IconButton";
import { Island } from "@excalidraw/excalidraw/components/Island";
import {
  DotsIcon,
  LockedIcon,
  PenModeIcon,
  UnlockedIcon,
} from "@excalidraw/excalidraw/components/icons";
import {
  ArrowToolButton,
  DiamondToolButton,
  EllipseToolButton,
  EraserToolButton,
  FreedrawToolButton,
  LineToolButton,
  RectangleToolButton,
  SelectionToolButton,
  StickyNoteToolButton,
  TextToolButton,
} from "@excalidraw/excalidraw/components/Tools";
import { t } from "@excalidraw/excalidraw/i18n";

import type { ToolbarMeta, ToolbarProps } from "../types";

import "./words-first.css";

export const meta: ToolbarMeta = {
  name: "Words First",
  idea: "Find tools by task, with a clear name under every icon.",
};

const ToolGroup = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="words-first-group" role="group" aria-label={label}>
    <span className="words-first-heading" aria-hidden="true">
      {label}
    </span>
    <div className="words-first-tools">{children}</div>
  </div>
);

export default function WordsFirst({
  app,
  appState,
  tools,
  locked,
  toggleLock,
  renderHint,
}: ToolbarProps) {
  const toolProps = { app, activeTool: appState.activeTool, showLabel: true };
  const showPenMode = useStylesPanelMode() === "full" && appState.penDetected;
  const hand = tools.find((tool) => tool.type === "hand");
  const moreTools = tools.filter(
    (tool) =>
      tool.group === "more" &&
      (tool.type !== "image" || app.props.UIOptions?.tools?.image !== false),
  );
  const moreLabel = t("toolBar.extraTools");

  return (
    <Island
      className="toolbar-words-first"
      padding={1}
      data-viewport-ui="top"
    >
      {!appState.zenModeEnabled && renderHint()}
      <div className="words-first-groups" role="group" aria-label="Drawing tools">
        <ToolGroup label="Navigate">
          {hand && (
            <IconButton
              type="toggle"
              icon={hand.icon}
              checked={hand.active}
              disabled={hand.disabled}
              title={hand.shortcut ? `${hand.label} · ${hand.shortcut}` : hand.label}
              aria-label="Pan"
              aria-keyshortcuts={hand.shortcut ?? undefined}
              data-testid="toolbar-hand"
              showAriaLabel
              onSelect={({ pointerType }) => {
                if (!app.state.penDetected && pointerType === "pen") {
                  app.togglePenMode(true);
                }
                hand.select();
              }}
            />
          )}
          <SelectionToolButton {...toolProps} />
        </ToolGroup>
        <ToolGroup label="Shapes">
          <RectangleToolButton {...toolProps} />
          <DiamondToolButton {...toolProps} />
          <EllipseToolButton {...toolProps} />
          <ArrowToolButton {...toolProps} />
          <LineToolButton {...toolProps} />
        </ToolGroup>
        <ToolGroup label="Draw & write">
          <FreedrawToolButton {...toolProps} />
          <TextToolButton {...toolProps} />
          <StickyNoteToolButton {...toolProps} />
          <EraserToolButton {...toolProps} />
        </ToolGroup>
        <ToolGroup label="Options">
          {showPenMode && (
            <IconButton
              type="toggle"
              icon={PenModeIcon}
              checked={appState.penMode}
              title={t("toolBar.penMode")}
              aria-label="Pen mode"
              showAriaLabel
              onSelect={() => app.togglePenMode(null)}
            />
          )}
          {app.props.activeTool == null && (
            <IconButton
              type="toggle"
              icon={locked ? LockedIcon : UnlockedIcon}
              checked={locked}
              title={`${t("toolBar.lock")} · Q`}
              aria-label="Keep active"
              aria-keyshortcuts="Q"
              data-testid="toolbar-lock"
              showAriaLabel
              onSelect={toggleLock}
            />
          )}
          <Menu.Root
            modal={false}
            onOpenChange={(open) => {
              if (open) {
                app.setAppState({ openMenu: null, openPopup: null });
              }
            }}
          >
            <Menu.Trigger
              type="button"
              className="words-first-more"
              data-selected={moreTools.some((tool) => tool.active)}
            >
              <span aria-hidden="true">{DotsIcon}</span>
              {moreLabel}
            </Menu.Trigger>
            <Menu.Content
              className="dropdown-menu words-first-menu"
              align="end"
              sideOffset={10}
            >
              <Island className="dropdown-menu-container" padding={2}>
                {moreTools.map((tool) => (
                  <DropdownMenuItem
                    key={tool.type}
                    icon={<>{tool.icon}</>}
                    shortcut={tool.shortcut ?? undefined}
                    selected={tool.active}
                    disabled={tool.disabled}
                    data-testid={`toolbar-${tool.type}`}
                    onSelect={tool.select}
                  >
                    {tool.label}
                  </DropdownMenuItem>
                ))}
              </Island>
            </Menu.Content>
          </Menu.Root>
        </ToolGroup>
      </div>
    </Island>
  );
}
