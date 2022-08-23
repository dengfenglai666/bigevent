;(function () {
    //添加nickname的校验规则
    const form = layui.form
    form.verify({
        nickname: value => {
            if (value.length > 6) return '昵称只能为1~6之间的数字'
        },
    })

    //初始化用户基本信息（将用户数据渲染到表单）
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) return layui.layer.msg('获取用户信息失败！')
                //layui提供方法为表单直接赋值  form.val(表单lay-filter属性，object)
                layui.form.val('formTest', res.data)
                // layui.form.val('formTest', JSON.parse(JSON.stringify(res.data)))
            },
        })
    }
    initUserInfo()

    //重置按钮
    document.querySelector('.btnReset').addEventListener('click', function (e) {
        e.preventDefault()
        //回到初始数据
        initUserInfo()
    })

    // 用户信息表单提交事件
    document.querySelector('.layui-form').addEventListener('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('更新用户信息失败！')
                layui.layer.msg('更新用户信息成功！')
                //左侧导航更新头像和信息（调用父页面中的方法）
                window.parent.getUserInfo()
            },
        })
    })
})()
