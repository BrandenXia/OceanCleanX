type Entry = {
  title: string;
  url: string;
};

export class SidebarTreeNode {
  constructor(
    public entries: Entry[] = [],
    public children: { [key: string]: SidebarTreeNode } = {},
  ) {}
}

const buildSidebarTree = (
  entries: ({ position: string[] } & Entry)[],
): SidebarTreeNode => {
  const root: SidebarTreeNode = new SidebarTreeNode();

  entries.forEach(({ position, ...entry }) => {
    if (position.length === 0) {
      root.entries.push(entry);
      return;
    }

    let current = root;
    for (const key of position) {
      if (!current.children[key]) current.children[key] = new SidebarTreeNode();
      current = current.children[key];
    }
    current.entries.push(entry);
  });

  return root;
};

export default buildSidebarTree;
