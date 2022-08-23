;(function () {
    // 1.1 裁剪配置选项
    const options = {
        // 裁剪框纵横比
        aspectRatio: 1 / 1,
        // 指定预览区域
        preview: '.img-preview',
    }

    // 1.2 创建裁剪区域（初始化）
    $('#image').cropper(options)

    //通过上传按钮模拟上传文件
    document.querySelector('.chooseImage').addEventListener('click', function () {
        document.querySelector('.file').click()
    })

    //监听上传文件change事件
    document.querySelector('.file').addEventListener('input', function (e) {
        //  e.target.files.length来判断用户提交了几个文件
        if (e.target.files.length === 0) return layui.layer.msg('请上传照片')
        //2.1.拿到用户选择的文件
        const file = e.target.files[0]
        //2.2.将文件转换为路径
        const imgUrl = URL.createObjectURL(file)
        //2.3.重新初始化裁剪区域
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //上传更新头像
    document.querySelector('.btnUpload').addEventListener('click', function () {
        //3.1.拿到用户裁剪后的头像
        const dataURL = $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100,
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //3.2将头像上传至服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: res => {
                if (res.status !== 0) return layui.layer.msg('上传头像失败！')
                layui.layer.msg('上传头像成功！')
                window.parent.getUserInfo()
            },
        })
    })
})()
