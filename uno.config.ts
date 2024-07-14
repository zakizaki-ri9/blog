import {
  defineConfig,
  presetUno,
  transformerDirectives,
  presetIcons,
} from "unocss"

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        tabler: () =>
          import("@iconify-json/tabler/icons.json").then(i => i.default),
      },
    }),
  ],
  transformers: [transformerDirectives()],
})
