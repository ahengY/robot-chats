//为将立即执行函数中的函数释放给其他人使用，
// 单对象模式--->函数表达式，要将函数名返回供其他js使用
var API = (function () {
  //为避免污染全局，把以下所有函数都封装到一个立即执行函数中
  //命名规范 常量名用全部大写
  const BASE_URL = 'https://study.duyiedu.com';
  const TOKEN_KEY = 'token';

  /**
   * 重新封装一下fetch函数，分成get post两种，
   * 根据是否有token，确定是否要在请求头中加入TOKEN_KEY
   * 在封装函数中定义好，传入的fetch()参数，并调用
   * 后续使用时，可以根据具体是GET还是POST选择调用
   */

  function get (path) {
    const url = BASE_URL + path;
    const headers = {};
    //拿到localStorage中新增的TOKEN_KEY，有可能为空
    const token = localStorage.getItem(TOKEN_KEY);
    //如果localStorage中有TOKEN_KEY，则token有值
    if (token) {
      //token有值，则在请求头中加入令牌属性，值为 `Bearer ${token}` (令牌的固定格式)
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(url, { headers });
  }

  function post (path, bodyObj) {
    const url = BASE_URL + path;
    const headers = {
      'Content-Type': 'application/json',
    };
    //拿到localStorage中新增的TOKEN_KEY，有可能为空
    const token = localStorage.getItem(TOKEN_KEY);
    //如果localStorage中有TOKEN_KEY，则token有值
    if (token) {
      //token有值，则在请求头中加入令牌属性，值为 `Bearer ${token}` (令牌的固定格式)
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(url, { headers, method: 'POST', body: JSON.stringify(bodyObj) });
  }

  //注册
  async function reg (userInfo) {
    // 调用fetch()传入url路径，{请求方法，请求头，请求体}，
    // fetch()完成表示已经拿到全部的响应头，
    // 想要获取响应体里面的数据，就需要await 或者回调fetch().then(resp=>resp.json())
    // const resp = await fetch(BASE_URL + '/api/user/reg', {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(userInfo),
    // });

    //利用新封装的post函数改写
    const resp = await post('/api/user/reg', userInfo);
    return await resp.json();
  }

  //登录
  async function login (loginInfo) {
    // const resp = await fetch(BASE_URL + '/api/user/login', {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(loginInfo),
    // });

    //利用新写的post()函数改写
    const resp = await post('/api/user/login', loginInfo)
    //将返回结果存到result中，为后续拿到令牌做准备
    const result = await resp.json();
    //成功时 code为0 只有成功时才会生成令牌
    if (result.code === 0) {
      //令牌在响应头中，所以要使用resp来获取
      const token = resp.headers.get('authorization');
      //为localStorage添加一项
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }

  //验证账号
  async function exists (loginId) {
    const resp = await get('/api/user/exists?loginId=' + loginId);
    return await resp.json();
  }

  //当前用户信息
  async function profile () {
    const resp = await get('/api/user/profile');
    return await resp.json();
  }

  //发送聊天信息
  async function sendChat (content) {
    const resp = await post('/api/chat', { content });
    return await resp.json();
  }

  //获取聊天历史记录
  async function getHistory () {
    const resp = await get('/api/chat/history');
    return await resp.json();
  }

  //退出登录
  function loginOut () {
    return localStorage.removeItem(TOKEN_KEY);
  }


  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})()
