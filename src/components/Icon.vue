<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 },
})

const paths = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  sparkles: 'M10 2l1.9 5.1L17 9l-5.1 1.9L10 16l-1.9-5.1L3 9l5.1-1.9L10 2z M18 13l1.1 2.9L22 17l-2.9 1.1L18 21l-1.1-2.9L14 17l2.9-1.1L18 13z M19 3v4 M17 5h4',
  target: 'M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z M17 12a5 5 0 1 1-5-5 5 5 0 0 1 5 5z M12 12h.01',
  calendar: 'M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M7 3v4 M17 3v4 M3 10h18 M7.5 14h.01 M12 14h.01 M16.5 14h.01 M7.5 17.5h.01 M12 17.5h.01',
  megaphone: 'M3 9v5a2 2 0 0 0 2 2h4l10 4V4L9 8H5a2 2 0 0 0-2 1z M9 8v8 M6 16l2 5h3l-1.6-4.4 M22 9v6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 1 1 8 0z M16 3.13a4 4 0 0 1 0 7.75',
  chart: 'M3 3v18h18 M8 16v-4 M13 16V8 M18 16V5',
  checkSquare: 'M9 11l2 2 4-4 M20 11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10 M17 4h3v3',
  layers: 'M12 2 2 7l10 5 10-5-10-5z M2 12l10 5 10-5 M2 17l10 5 10-5',
  settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19.4 15a1.6 1.6 0 0 0 .32 1.76l.06.06-1.96 1.96-.06-.06A1.6 1.6 0 0 0 16 18.4a1.6 1.6 0 0 0-1 1.47V20h-2.8v-.13a1.6 1.6 0 0 0-1-1.47 1.6 1.6 0 0 0-1.76.32l-.06.06-1.96-1.96.06-.06A1.6 1.6 0 0 0 7.8 15a1.6 1.6 0 0 0-1.47-1H6v-2.8h.33a1.6 1.6 0 0 0 1.47-1 1.6 1.6 0 0 0-.32-1.76l-.06-.06 1.96-1.96.06.06A1.6 1.6 0 0 0 11.2 6.8a1.6 1.6 0 0 0 1-1.47V5H15v.33a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.76-.32l.06-.06 1.96 1.96-.06.06A1.6 1.6 0 0 0 19.4 10a1.6 1.6 0 0 0 1.47 1H21v2.8h-.13a1.6 1.6 0 0 0-1.47 1.2z',
  search: 'M20 20l-4-4 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21a2 2 0 0 0 4 0',
  sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.4 1.4 M17.6 17.6 19 19 M19 5l-1.4 1.4 M6.4 17.6 5 19 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M20.9 13.4A8.8 8.8 0 0 1 10.6 3.1 9 9 0 1 0 20.9 13.4z',
  arrowUpRight: 'M7 17 17 7 M7 7h10v10',
  arrowRight: 'M4 12h15 M13 6l6 6-6 6',
  arrowUp: 'M12 20V4 M6 10l6-6 6 6',
  arrowDown: 'M12 4v16 M6 14l6 6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronDown: 'm6 9 6 6 6-6',
  plus: 'M12 5v14 M5 12h14',
  close: 'm6 6 12 12 M18 6 6 18',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  eyeOff: 'm3 3 18 18 M10.6 6.1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3 3.3 M6.2 7.4A17 17 0 0 0 2 12s3.5 6 10 6a10 10 0 0 0 3.2-.5',
  lock: 'M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z M8 11V7a4 4 0 0 1 8 0v4 M12 15v2',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  wallet: 'M20 8H5a2 2 0 0 1 0-4h13v4 M3 6v12a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1 M21 12h-6a2 2 0 0 0 0 4h6 M15 14h.01',
  activity: 'M2 12h5l3-7 4 14 3-7h5',
  trend: 'm3 17 6-6 4 4 7-8 M15 7h5v5',
  logout: 'M10 17l5-5-5-5 M15 12H3 M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v4h16v-4',
  check: 'm5 12 4 4L19 6',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2',
  list: 'M9 6h12 M9 12h12 M9 18h12 M3 6h.01 M3 12h.01 M3 18h.01',
  filter: 'M4 7h16 M7 12h10 M10 17h4',
  pencil: 'm15 5 4 4 M4 20l4-.8L20 7l-4-4L4 15z',
  trash: 'M3 6h18 M9 6V3h6v3 M5 6l1 14h12l1-14 M10 10v6 M14 10v6',
  copy: 'M9 9h11v11H9z M15 5V3H3v12h2',
  send: 'M22 2 8.5 15.5 M22 2l-6 20-7.5-6.5L2 8l20-6z',
  globe: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M2 12h20 M12 2c-3 3-4 6-4 10s1 7 4 10c3-3 4-6 4-10s-1-7-4-10z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  message: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-4A8.5 8.5 0 1 1 21 11.5z M8 12h8',
  image: 'M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 5 M15 8h.01',
  file: 'M13 3H5v18h14V9z M13 3v6h6 M8 13h8 M8 17h6',
  bolt: 'm13 2-9 12h7l-1 8 10-12h-7z',
  building: 'M3 21h18 M5 21V7h8v14 M13 21V3h6v18 M8 10h2 M8 14h2 M16 7h.01 M16 11h.01 M16 15h.01',
  shield: 'M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10z M9 12l2 2 4-4',
  info: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 11v5 M12 7h.01',
  link: 'M10 13a4 4 0 0 0 6 .5l4-4a4 4 0 0 0-5.7-5.7l-2 2 M14 11a4 4 0 0 0-6-.5l-4 4a4 4 0 0 0 5.7 5.7l2-2',
  layout: 'M3 4h18v16H3z M3 8h18 M10 8v12',
  play: 'm8 5 12 7-12 7z',
  inbox: 'M3 13l3-8h12l3 8v6H3z M3 13h6l1 2h4l1-2h6',
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name] || paths.info" />
  </svg>
</template>
