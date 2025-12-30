- Thanks, `name`. Good morning everyone. Yesterday I finalized the custom properties and build the dashboards for EOVN.
- So for today I'll keep cleaning up the APAC docs and going through the remaining tasks to prepare for QLD and BKK rollouts.
---
# MVP issues
- `ContentEditable`: re-renders on EVERY key-down event --> unable to type quickly.
	- The "Insert" popup from line 1112 in `lib\lexical\packages\plugins\ToolbarPlugin\index.tsx` is cut off from overflow if its editor is the last item in the curriculum builder --> set a fixed height so that its inner content is scrollable and manipulate is rendered position so that it's contained WITHIN its `SortableContentItem`.
- Video preview before saving to the db