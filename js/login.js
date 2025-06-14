//登录页面特殊js
//账号文本框验证器
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请输入账号';
  }
});



//密码文本框验证器
const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
  if (!val) {
    return '请输入密码';
  }
});



//找到表单DOM元素
const form = $('.user-form');

//表单的提交事件
form.onsubmit = async function (e) {
  //阻止表单的默认事件(表单默认事件，提交后会刷新页面)
  e.preventDefault();

  //这是异步的，需要 await
  const result = FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator,);

  //如果返回为false则验证未通过，反之，则通过
  if (!result) {
    return;
  }
  //验证通过后需要调用API.reg()进行注册

  //法一：获取用户输入的注册表单中的数据
  // const data = {
  //   loginId: loginIdValidator.input.value,
  //   loginPwd: txtLoginPwdValidator.input.value,
  //   nickname: nicknameValidator.input.value
  // };

  //法二：
  //用formData拿到form表单的数据
  //向formData传入表单DOM，返回一个表单数据对象
  const formData = new FormData(form);

  //获取API.reg需要的格式的数据
  /**
   * formData.entries()可以获取到[["a":1],["b":2]]形式的键值对的数组
   * 调用Object.fromEntries()方法把拿到的数组转换为对象格式
   */
  const data = Object.fromEntries(formData.entries());

  // console.log(data);
  /**
   * {
   *    loginId: '124232',
   *    nickname: 'wew', 
   *    loginPwd: '123'
   * }
   */

  //调用api.js中的API.reg()来注册
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert('登录成功，点击确认，跳转首页');
    location.href = './index.html';
  }
  else {
    //验证未通过就清空密码文本框
    loginPwdValidator.input.value = '';
    //错误提示
    loginIdValidator.p.innerText = '账号或密码错误，请重新输入';
  }
};