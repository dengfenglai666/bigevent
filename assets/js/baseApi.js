// ajax预处理:每个Ajax调用之前都会先执行这个函数。
// 通过这个函数，可以拿到配置项的配置对象
$.ajaxPrefilter(options => {
    //拼接根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url)
})
