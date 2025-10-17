import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    projectCode: null,
    taskCode: null,
    pickDate: null,
  }),
  actions: {
    setProjectCode(code) {
      this.projectCode = code;
    },
    getProjectCode() {
      return this.projectCode;
    },
    setTaskCode(code) {
      this.taskCode = code;
    },
    getTaskCode() {
      return this.taskCode;
    },
    setPickDate(date) {
      this.pickDate = date;
    },
    getPickDate() {
      return this.pickDate;
    },
  },
});
