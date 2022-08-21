// ajax预处理:每个Ajax调用之前都会先执行这个函数。
// 通过这个函数，可以拿到配置项的配置对象
$.ajaxPrefilter(options => {
    //拼接根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    //统一为权限得接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    //不论成功与否，都会回调complete函数
    options.complete = res => {
        console.log(res)
        //在此回调函数中，res.responseJSON拿到服务器响应得数据
        //防止用户手动地址栏输入地址未登录跳转（没token,会报错），进行强制跳转
        if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = './login.html'
        }
    }
})
