import Projects from "@/components/Projects/ProjectIndex.vue";
import ProjectDetail from "@/components/Projects/ProjectDetail.vue";
import TaskDetail from "@/components/Projects/TaskDetail.vue";
import Dashboard from "@/components/DashboardIndex.vue";
import ChartReporting from "@/components/ChartReporting.vue";
import SyncDataSystem from "@/components/System/SyncDataSystem.vue";
import Employees from "@/components/Employees/EmpIndex.vue";
import UserLogin from "@/components/UserLogin.vue";
import EmployeeTimeSheetDetail from "@/components/Employees/EmployeeTimeSheetDetail.vue";
import DepartIndex from "@/components/Departments/DepartIndex.vue";
import DepartmentDetail from "@/components/Departments/DepartmentDetail.vue";
import LogIndex from "@/components/LogUsers/LogIndex.vue";

const permission = {
  accessLevel: { requireAccess: true },
  authAdmin: { requiresAuth: true, requiresRole: "admin" },
  auth: { requiresAuth: true },
  unAuth: {},
};

const routes = [
  {
    path: "/",
    name: "DashboardIndex",
    component: Dashboard,
    meta: { ...permission.auth, title: "..." },
  },
  {
    path: "/",
    name: "ChartReporting",
    component: ChartReporting,
    meta: { ...permission.auth, title: "" },
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    meta: { ...permission.auth, title: "Projects" },
  },
  {
    path: "/projects/:name/:projectCode",
    name: "ProjectDetail",
    component: ProjectDetail,
    props: true,
    meta: { ...permission.auth, title: "Detail" },
  },
  {
    path: "/projects/:name/:projectCode/tasks/:taskName/:code",
    name: "TaskDetail",
    component: TaskDetail,
    props: true,
    meta: { ...permission.auth, title: "Task Details" },
  },
  {
    path: "/departments",
    name: "DepartmentIndex",
    component: DepartIndex,
    props: true,
    meta: { ...permission.auth, title: "Departments" },
  },
  {
    path: "/departments/:name",
    name: "DepartmentDetail",
    component: DepartmentDetail,
    props: true,
    meta: { ...permission.auth, title: " Department Detail" },
  },
  {
    path: "/log-user-activities",
    name: "LogIndex",
    component: LogIndex,
    props: true,
    meta: { ...permission.auth, ...permission.accessLevel },
  },
  {
    path: "/sync-data",
    name: "SyncDataSystem",
    component: SyncDataSystem,
    props: true,
    meta: permission.authAdmin,
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
    meta: { ...permission.auth, title: "Employees" },
  },
  {
    path: "/employees/:code/detail",
    name: "EmployeeTimeSheetDetail",
    component: EmployeeTimeSheetDetail,
    meta: { ...permission.auth, title: "Employee TimeSheet Detail" },
  },
  {
    path: "/login",
    name: "login",
    component: UserLogin,
    meta: { title: "Login" },
  },
  {
    path: "/azure-login",
    redirect: { name: "login" },
    meta: { title: "Login" },
  },
];

export default routes;
