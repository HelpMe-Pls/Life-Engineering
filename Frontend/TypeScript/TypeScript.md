[[Frontend/TypeScript/Fundamentals]]
[[TypeScript/Advanced]]

Check [this](https://profy.dev/article/react-typescript) out.

---
- Get individual types from a type of Array by using 2 dimensional array:
```ts
import type { MenuProps } from 'antd';

type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType

type MenuItem = MenuProps['items']  // ItemType[] (from the docs)
type MenuItem = MenuProps['items'][number] // MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType

// If you want to see ALL of MenuItem props:
const item: MenuItem = {
  // Ctrl + Space
}
```
