//通用

//选定单个元素
function $ (selector) {
  return document.querySelector(selector);
}

//选定所有符合条件的元素
function $$ (selector) {
  return document.querySelectorAll(selector);
}

//创建一个DOM元素
function $$$ (tagName) {
  return document.createElement(tagName);
}