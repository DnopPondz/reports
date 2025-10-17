// stores/taskStore.js
import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    selectedTask: null,
  }),
  actions: {
    setTask(task) {
      this.selectedTask = task;
    },
    clearTask() {
      this.selectedTask = null;
    },
  },
  getters: {
    getSelectedTask: (state) => state.selectedTask,
  },
});
