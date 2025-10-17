// Convert the input date string to a UTC date object (data e.g. 2024-09-23 01:30:00)

// The input format is assumed to be 'YYYY-MM-DD HH:mm:ss'
export const formatDateTimeZone = (
  dateStr,
  timeZone = "Asia/Bangkok",
  lang = "en-US",
  utcStatus = false
) => {
  const utcDate = new Date(utcStatus ? `${dateStr} UTC` : dateStr);
  return utcDate.toLocaleString(lang, {
    timeZone: timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatYMD = (value, timeZone, locale = "en-US") => {
  const date = new Date(value);

  const year = date.toLocaleString(locale, { timeZone, year: "numeric" });
  const month = String(
    date.toLocaleString(locale, { timeZone, month: "2-digit" })
  ).padStart(2, "0");
  const day = String(
    date.toLocaleString(locale, { timeZone, day: "2-digit" })
  ).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const backTo = (router, customRouter) => {
  router.push(customRouter);
};

export const fixedDecimal = (number) => {
  return Number(number).toFixed(2);
};

export const accessList = () => {
  return [
    "CEO, Director",
    "Web Developer",
    "Senior Information Security Manager",
    "Technical Director",
    "Senior Security Services Engineer"
  ];
};
import { useAuthStore } from "@/stores/authStore";
export const checkAccess = () => {
  const authStore = useAuthStore();
  const list = accessList();
  const access = authStore.employee.job_title;
  const matchAccess = list.some((item) => item === access);

  return matchAccess;
};

export const shortName = (name) => {
  return `${name?.charAt(0) + "." ?? null}`;
};

export const empFullname = (emp) => {
  return `${emp?.preferred_name} ${shortName(emp?.last_name)}`;
};

export const shortDepartmentName = (name) => {
  if (!name) {
    return "";
  }
  // if (name === "System Administration") {
  //   return "SM";
  // }
  // if (name === "Network Administration") {
  //   return "NM";
  // }

  switch (name) {
    case "System Administration":
      return "SM";
    case "Network Administration":
      return "NM";
  }

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
};
