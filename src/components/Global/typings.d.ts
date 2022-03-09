declare namespace GLOBAL {
  type MenuFunc = {
    name?: string;
    path: string;
    icon?: string;
    routePath?: string;
    children?: MenuFunc[];
  };
}
