//首页
(async function () {
  //验证是否登录，未登录状态跳转登录页面，登录状态获取用户信息
  const resp = await API.profile();
  // console.log(resp);
  // { code: 401, msg: '未登录，或登录已过期', data: null }
  //未登录状态的data值是null
  const user = resp.data;

  //如果user，即data是空的，就说明未登录，在未登录状态时，提示，并跳转页面回到登录页面
  if (!user) {
    alert('未登录，或登录已过期，请重新登陆');
    location.href = './login.html';
    return;
  }

  //获取DOM元素

  const doms = {
    aside: {
      nickname: $('#nickname'),
      loginId: $('#loginId'),
    },
    close: $('.close'),
    chatContainer: $('.chat-container'),
    txtMsg: $('#txtMsg'),
    msgContainer: $('.msg-container'),
  };

  //以下代码均是登录状态下
  setUserInfo();

  //展示历史聊天记录
  await loadHistory();
  async function loadHistory () {
    const resp = await API.getHistory();
    //利用for-of循环将历史记录依次展示
    for (const item of resp.data) {
      addChatItem(item);
    };
    scrollBottom();
  }

  //发送-->表单提交事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  //退出登录
  doms.close.onclick = function () {
    API.loginOut();
    location.href = './login.html';
  }

  /**
   * 设置用户信息
   * Tips：
   * 这里必须用innerText!不能用innerHTML
   * 原因是用innerHTML的话，如果用户设置的loginId和nickname有特殊内容，如：<h1>123</h1>
   * 会直接渲染生成效果的
   * 这样存在安全漏洞
   * innerText会把用户设置的直接以文本形式呈现
   */
  function setUserInfo () {
    doms.aside.loginId.innerText = user.loginId;
    doms.aside.nickname.innerText = user.nickname;
  }

  //添加对话行
  /**
    content: "halo"
    createdAt: 1749636701026
    from: "Qin"
    to: null
    _id: "6849565d5f8cc70c8a486612"
   */

  function addChatItem (chatInfo) {
    /**
       * 按照以下样例，创建DOM元素
       * <div class="chat-item me">
            <img class="chat-avatar" src="./asset/avatar.png" />
            <div class="chat-content">你几岁啦？</div>
            <div class="chat-date">2022-04-29 14:18:13</div>
          </div>
          <div class="chat-item">
            <img class="chat-avatar" src="./asset/robot-avatar.jpg" />
            <div class="chat-content">讨厌，不要随便问女生年龄知道不</div>
            <div class="chat-date">2022-04-29 14:18:16</div>
          </div>
     */
    //创建每一个对话行的根元素
    const div = $$$('div');
    div.classList.add('chat-item');
    //根据chatInfo的from是否有值(因为但是机器人时值为null)，决定是否添加类样式
    if (chatInfo.from) {
      div.classList.add('me');
    }
    //创建头像
    const img = $$$('img');
    img.classList.add('chat-avatar');
    //用三目运算符判断是用户还是机器人，选择对应的头像
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';
    //创建聊天内容
    const content = $$$('div');
    content.classList.add('chat-content');
    content.innerText = chatInfo.content;
    //创建时间
    const date = $$$('div');
    date.classList.add('chat-date');
    date.innerText = formatDate(chatInfo.createdAt);

    //将头像，聊天内容，时间添加到根元素
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  // addChatItem({
  //   content: "mi madre eso beauty",
  //   createdAt: 1749636701026,
  //   from: "Qin",
  //   to: null,
  // })


  /**
   * 利用日期API将时间戳转换为我们需要展示的格式
   * @param {*} timestamp 时间戳
   * @returns year-month-day hours:minutes:seconds
   */
  function formatDate (timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    //因为日期的范围是0-11，所以需要+1
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }



  //聊天区域滚动条滚动到底部
  function scrollBottom () {
    //scrollHeight是聊天记录区域总高度，设置scrollTop为总高度，就可以实现滚动条滚动到底部
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    // console.log(doms.chatContainer.scrollHeight);
  }


  //发送消息
  async function sendChat () {
    //拿到输入框中的内容,去掉首尾的空字符
    const content = doms.txtMsg.value.trim();
    //添加对话行
    addChatItem({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content
    });
    //发送后，输入区域内容清空
    doms.txtMsg.value = '';
    scrollBottom();
    //拿到网络端机器人的回复
    const resp = await API.sendChat(content);
    addChatItem({
      from: null,
      to: user.loginId,
      ...resp.data
    });
    scrollBottom();
  }

  //将sendchat函数保护给window，便于测试
  // window.sendChat = sendChat;


})()
