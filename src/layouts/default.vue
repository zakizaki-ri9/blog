<template>
  <div class="mx-auto px-8 max-w-screen-md">
    <TheHeader class="py-4 sticky top-0 bg-gray-50 z-50" />
    <hr>
    <main class="my-8">
      <slot />
    </main>
    <hr>
    <TheFooter class="mt-4" />
  </div>
</template>
