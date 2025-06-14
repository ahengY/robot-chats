//注册页面特殊js
//账号文本框验证器
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请输入账号';
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return '账号已被占用，请设置新账号';
  }
});

//昵称文本框验证器
const nicknameValidator = new FieldValidator('txtNickname', function (val) {
  if (!val) {
    return '请输入昵称';
  }
});

//密码文本框验证器
const txtLoginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
  if (!val) {
    return '请输入密码';
  }
});

//确认密码文本框验证器
const txtLoginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
  if (!val) {
    return '请输入确认密码';
  }
  if (val !== txtLoginPwdValidator.input.value) {
    return '两次密码不一致，请重新输入';
  }
})

//找到表单DOM元素
const form = $('.user-form');

//表单的提交事件
form.onsubmit = async function (e) {
  //阻止表单的默认事件(表单默认事件，提交后会刷新页面)
  e.preventDefault();

  //这是异步的，需要 await
  const result = FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    txtLoginPwdValidator,
    txtLoginPwdConfirmValidator);

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
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert('注册成功，点击确认跳转登录界面');
    location.href = './login.html';
  }
};