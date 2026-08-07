# Pay by Bank Bottom Clipping Design

## Problem

The Pay by Bank provider container uses a `31.25rem` minimum height while loading but drops to `23.75rem` when ready. Because the provider content is hosted inside a container with `overflow: hidden`, the shorter ready state can clip the bottom of the injected provider UI.

The widget content already has `0.75rem` bottom padding before the pinned action footer, so adding another 3–5px gap would not address the clipping and would reduce usable provider space.

## Fix

Use a `31.25rem` minimum height for the provider container in both loading and ready states. Keep the existing widget-content scrolling so smaller viewports can reach the complete provider UI without overlapping the pinned footer.

Mobile retains its existing viewport-specific `22.5rem` provider minimum so the provider fits within compact screens.

## Verification

Add style and rendered-layout tests proving the desktop ready and loading provider containers share the `31.25rem` minimum and the footer remains a separate pinned grid row.
