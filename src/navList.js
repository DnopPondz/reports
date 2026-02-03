export const mainMenu = [
  {
    name: "Dashboards",
    routeName: { name: "DashboardIndex", hash: "" },
  },
  {
    name: "Reports",
    routeName: { name: "DashboardIndex", hash: "#chart-reports" },
  },
  {
    name: "Projects",
    routeName: { name: "Projects", hash: "" },
    subMenu: [
      {
        name: "Customer - 0623 - VOM USA",
        code: 13,
        title: "VOM USA ",
      },
    ],
  },
  {
    name: "Employees",
    routeName: { name: "Employees", hash: "" },
  },
  {
    name: "Departments",
    routeName: { name: "DepartmentIndex", hash: "" },
  },
  {
    name: "MSA",
    routeName: { name: "MsaIndex", hash: "" },
  },
  {
    name: "Log",
    routeName: { name: "LogIndex", hash: "" },
  },
  
  // {
  //   name: "MSA Table",
  //   routeName: { name: "MsaIndex2", hash: "" },
  // }
];

export const adminMenu = [
  {
    name: "Dashboard",
    routeName: { name: "DashboardIndex", hash: "" },
  },
  {
    name: "Projects",
    routeName: { name: "Projects", hash: "" },
  },
  {
    name: "SyncDataSystem",
    routeName: { name: "SyncDataSystem", hash: "" },
  },
];

export const dashboardMenu = [
  {
    name: "Dashboards",
    type: "dashboard",
    icon: "",
  },
  {
    name: "Reports",
    type: "chart-reports",
    icon: "",
  },
];

export const chartsMenu = [
  {
    name: "date",
    type: "date",
    value: "",
  },
  {
    name: "month",
    type: "month",
    value: "",
  },
  {
    name: "year",
    type: "year",
    value: "",
  },
  {
    name: "customize",
    type: "customizev2",
    value: "",
  },
];
