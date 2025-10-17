<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="39"
    height="35"
    viewBox="0 0 39 35"
    fill="none"
  >
    <g clip-path="url(#clip0_19_177)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.21 34.87H10.55L14.99 30.34H23.77L28.21 34.87Z"
        :fill="color"
      />
      <path
        d="M36.45 0H2.31C1.02 0 0 1.11 0 2.41V26.92C0 28.12 1.02 29.23 2.31 29.23H36.44C37.73 29.23 38.75 28.12 38.75 26.92V2.41C38.75 1.11 37.73 0 36.44 0H36.45ZM35.8 25.16H2.96V3.33H35.79V25.16H35.8Z"
        :fill="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M29.88 10.91L30.62 11.74L23.87 17.75C23.87 17.75 17.95 12.76 17.49 12.39C16.84 12.67 7.96 19.88 7.96 19.88L7.5 18.95L17.58 11.09C17.58 11.09 23.13 15.81 23.87 16.36C24.42 15.81 29.88 10.9 29.88 10.9V10.91Z"
        :fill="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.53001 19.14C9.53001 20.07 8.79001 20.71 7.96001 20.71C7.03001 20.71 6.39001 20.06 6.39001 19.14C6.39001 18.31 7.03001 17.57 7.96001 17.57C8.79001 17.57 9.53001 18.31 9.53001 19.14Z"
        :fill="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M31.8201 11.28C31.8201 12.21 31.0801 12.85 30.2501 12.85C29.3201 12.85 28.6801 12.2 28.6801 11.28C28.6801 10.45 29.3201 9.71001 30.2501 9.71001C31.0801 9.71001 31.8201 10.45 31.8201 11.28Z"
        :fill="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M25.5301 16.83C25.5301 17.66 24.7901 18.4 23.8701 18.4C23.0401 18.4 22.3 17.66 22.3 16.83C22.3 15.91 23.0401 15.26 23.8701 15.26C24.7901 15.26 25.5301 15.91 25.5301 16.83Z"
        :fill="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.15 11.75C19.15 12.58 18.41 13.32 17.58 13.32C16.66 13.32 16.01 12.58 16.01 11.75C16.01 10.83 16.66 10.09 17.58 10.09C18.42 10.09 19.15 10.83 19.15 11.75Z"
        :fill="color"
      />
    </g>
    <defs>
      <clipPath id="clip0_19_177">
        <rect width="38.76" height="34.87" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>
<script setup>
import { defineProps } from "vue";
defineProps({
  color: {
    type: String,
    required: true,
  },
});
</script>
