module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env'
  ],
  plugins: ['@babel/plugin-syntax-jsx', "@vue/babel-plugin-jsx", "transform-vue-jsx"]
}