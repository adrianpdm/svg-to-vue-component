const posthtml = require('posthtml')

const plugin = () => tree => {
  tree.match({ tag: 'svg' }, node => {
    node.attrs = node.attrs || {}
    // Bind all events so that you can @click="handler" instead of @click.native="handler"
    node.attrs['v-on'] = '$listeners'
    return node
  })
  // SVGO will inline styles, so if you don't turn off relevant plugin
  // the tree will never match `style` nodes because they don't exist
  tree.match({ tag: 'style' }, node => {
    // Ignore the style tag if it's empty
    if (!node.content || node.content.length === 0) return

    // When SVGO is turned off
    // Make `style` tags work by using a dynamic component
    node.tag = 'component'
    node.attrs = node.attrs || {}
    node.attrs.is = 'style'
    return node
  })
}

const createComponent = svg => {
//   return `<template>\n${svg}\n</template>`
  return `${svg}`
}

module.exports = (input, { sync } = {}) => {
  const stream = posthtml([plugin()]).process(input, {
    sync,
    recognizeSelfClosing: true
  })

  if (stream.then) {
    return stream.then(res => ({
      component: createComponent(res.html)
    }))
  }

  return { component: createComponent(stream.html) }
}
