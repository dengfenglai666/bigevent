;(function () {
    document.querySelector('.goReg').addEventListener('click', function () {
        document.querySelector('.login').style.display = 'none'
        document.querySelector('.reg').style.display = 'block'
    })
    document.querySelector('.goLogin').addEventListener('click', function () {
        document.querySelector('.reg').style.display = 'none'
        document.querySelector('.login').style.display = 'block'
    })

    //预校验-自定义layui校验规则
    const form = layui.form
    const layer = layui.layer
    form.verify({
        //自定义校验pwd的规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        //自定义校验密码是否一致的规则
        repwd: function (value) {
            const temp = document.querySelector('.reg [name=password]')
            if (temp.value !== value) return '两次密码不一致'
        },
    })

    //注册表单提交事件
    document.querySelector('.form_reg').addEventListener('submit', function (e) {
        e.preventDefault()
        const reg_username = document.querySelector('.reg [name=username]').value
        const reg_password = document.querySelector('.reg [name=password]').value
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: { username: reg_username, password: reg_password },
            success: res => {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg('注册成功！')
                document.querySelector('.goLogin').click()
            },
        })
    })
    //登录表单提交事件
    document.querySelector('.form_login').addEventListener('submit', function (e) {
        e.preventDefault()
        const login_username = document.querySelector('.login [name=username]').value
        const login_password = document.querySelector('.login [name=password]').value
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: { username: login_username, password: login_password },
            success: res => {
                if (res.status != 0) return console.log(res.message)
                localStorage.setItem('token', res.token) //保存到本地存储
                location.href = './index.html'
            },
        })
    })
})()
