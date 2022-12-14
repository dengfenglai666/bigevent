;(function () {
    const form = layui.form
    //定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        newPwd: function (value) {
            const old = document.querySelector('[name=oldPwd]')
            if (value == old.value) return '新旧密码不能相同'
        },
        rePwd: function (value) {
            const temp = document.querySelector('[name=newPwd]')
            if (value !== temp.value) return '两次密码不一致'
        },
    })

    document.querySelector('.layui-form').addEventListener('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layui.layer.msg('更新密码失败！')
                layui.layer.msg('更新密码成功！')
                document.querySelector('.layui-form').reset()
            },
        })
    })
})()
