;(function () {
    getUserInfo()
})()

//获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //成功得回调函数
        success: res => {
            if (res.status != 0) return layui.layer.msg('获取用户信息失败！')
            renderAvatar(res.data)
        },
    })
}

//渲染用户头像
function renderAvatar(user) {
    const name = user.nickname || user.username
    document.querySelector('.welcome').innerHTML = `欢迎\u00A0\u00A0\u00A0 ${name}`
    const imgAvatar = document.querySelectorAll('.layui-nav-img')
    const textAvatar = document.querySelectorAll('.text-avatar')
    //根据后台头像的有无来决定用图片头像还是文字头像
    //图片头像
    if (user.user_pic) {
        imgAvatar[0].src = `${user.user_pic}`
        imgAvatar[1].src = `${user.user_pic}`
        $('.layui-nav-img').show()
        textAvatar[0].style.display = 'none'
        textAvatar[1].style.display = 'none'
    } else {
        //文字头像
        imgAvatar[0].style.display = 'none'
        imgAvatar[1].style.display = 'none'

        //渲染文字
        textAvatar[0].innerHTML = name[0].toUpperCase()
        textAvatar[1].innerHTML = name[0].toUpperCase()
    }
}

//退出操作模块
document.querySelector('.quite').addEventListener('click', function () {
    layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
        //清空本地存储
        localStorage.removeItem('token')
        //重新跳转到登录页面
        location.href = './login.html'
        //关闭提示框
        layer.close(index)
    })
})
