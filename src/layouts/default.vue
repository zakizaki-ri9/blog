<template>
  <div class="mx-auto px-8 max-w-screen-md">
    <TheHeader class="py-4 sticky top-0 bg-gray-100 z-50" />
    <main class="my-8">
      <slot />
    </main>
    <hr />
    <TheFooter class="mt-4" />
  </div>
</template>
