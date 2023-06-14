module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    'babel-preset-vue'
  ],
  plugins: ['@babel/plugin-syntax-jsx', "@vue/babel-plugin-jsx", "transform-vue-jsx"]
}