<template>
  <!-- Icon: browser window + wrench + gear (outline) -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ color }"
    role="img"
    aria-label="Browser with wrench and gear"
  >
    <g
      stroke="currentColor"
      :stroke-width="stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- Browser window -->
      <rect x="18" y="18" width="92" height="72" rx="10" />
      <path d="M18 36h92" />
      <circle cx="30" cy="27" r="2" />
      <circle cx="38" cy="27" r="2" />
      <circle cx="46" cy="27" r="2" />

      <!-- Content lines (top-right) -->
      <path d="M74 48h24" />
      <path d="M74 58h28" />
      <path d="M74 68h18" />

      <!-- Wrench (left inside) -->
      <!-- Head -->
      <path
        d="M44 52
           a10 10 0 0 0 12 12
           l6 6
           -8 8
           -6 -6
           a10 10 0 0 1 -12 -12
           l6 6
           6 -6
           z"
      />
      <!-- Handle -->
      <path d="M54 76l-16 16" />
      <circle cx="38" cy="92" r="3" />

      <!-- Gear (bottom-right, outside window a bit) -->
      <g transform="translate(72 66)">
        <!-- teeth -->
        <path d="M20 0v7M20 40v-7M0 20h7M40 20h-7" />
        <path d="M6 6l5 5M34 34l-5-5M34 6l-5 5M6 34l5-5" />
        <!-- outer + inner -->
        <circle cx="20" cy="20" r="13" />
        <circle cx="20" cy="20" r="4" />
      </g>
    </g>
  </svg>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
 size: { type: [Number, String], default: 128 },
  color: { type: String, default: "#111827" }, // เปลี่ยนเป็นสี theme ของคุณได้
  stroke: { type: [Number, String], default: 6 },
});

</script>
