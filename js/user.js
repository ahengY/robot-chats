//登录和注册的通用代码

/**
 * 对某一个表单进行验证时的构造函数
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId 需要验证的文本框
   * @param {Function} validatorFunc 验证规则函数，当该文本框需要验证的时候调用该函数，函数的参数是当前文本框的值，函数的返回值是验证的错误消息，若没有返回，则表示无错误
   */
  constructor(txtId, validatorFunc) {
    //获取文本框
    this.input = $('#' + txtId);
    //获取文本框的兄弟p元素
    this.p = this.input.nextElementSibling;
    //验证规则函数
    this.validatorFunc = validatorFunc;
    //当失去焦点，提交表单时 验证
    this.input.onblur = () => {
      this.validate();
    };
  }

  /**
   * 原型方法
   * 验证，成功返回true，有错误返回false
   */
  async validate () {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      //有错误
      this.p.innerText = err;
      return false;
    } else {
      //无错误
      this.p.innerText = '';
      return true;
    }
  };

  /**
   * 静态方法
   * 对传入的所有验证器进行同意验证，如果所有验证都通过则返回true，否则，返回false
   * @param {FieldValidator[]} validators 
   */
  static async validate (...validators) {
    //对传入的所有验证器都调用原型上的验证方法
    const prom = validators.map(v => v.validate());
    //利用Promise.all()拿到返回值，Promise.all()所有都对则对，有一个错则错
    const results = await Promise.all(prom);
    //利用数组的every方法，判断是否所有的项都为true 如果都为true 则返回true 否则返回false
    return results.every(r => r);
  }
}


//测试用例
/**
 * 调用class类，new一个实例，传两个参数，一个是文本框ID 一个是验证规则函数
 * 验证函数的参数是当前文本框的值，
 * 验证规则是，当文本框中无内容，则返回错误消息，否则无错误
 *
 * 还有可能传入的函数是异步的
 */
// var loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
//   if (!val) {
//     return '请输入账号';
//   }
//   const resp = await API.exists(val);
//   if (resp.data) {
//     return '账号已被占用，请设置新账号';
//   }
// });

// var nicknameValidator = new FieldValidator('txtNickname', function (val) {
//   if (!val) {
//     return '请输入昵称';
//   }
// });

// //调用静态方法，测试多个验证器的验证情况
// function test () {
//   FieldValidator.validate(loginIdValidator, nicknameValidator).then(resp => console.log(resp));
// }