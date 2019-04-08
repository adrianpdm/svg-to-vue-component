DOCS: Refer to https://github.com/egoist/svg-to-vue-component

EDIT: fix compiling error on Nuxt 2.5 (Webpack 4 + Vue-Loader 15.7.0)

NOTES:
For inline-loader usage only.

```
<template>
  <component :is="iconComponent"/>
</template>

export default {
  props: {
    iconPath: String
  },
  data(){
    return {
      iconComponent: null
    }
  },
  methods: {
    loadSVGIcon(iconPath){
      if (!iconPath) return;
      import(`!!vue-loader/lib/loaders/templateLoader!svg-to-vue-component/loader!${iconPath}`)
        .then((module) => {
          if (module){
            this.iconComponent = module.default || module
          }
        )}.catch(e => {
          console.log(`Error in loading SVG icon as component: ${iconPath}`)
        })
    }
  },
  watch: {
    iconPath: {
      immediate: true,
      handler: 'loadSVGIcon'
    }
  }
}
```
