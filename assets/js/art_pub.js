;(function () {
    function initSelect() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return layui.layer.msg('初始化文章分类失败')
                let str = ''
                res.data.map((item, index) => {
                    str += `<option value="${item.Id}">${item.name}</option>`
                })
                document.querySelector('select').innerHTML = `<option value=""></option>${str}`
                layui.form.render()
            },
        })
    }
    initSelect()
    initEditor() // 初始化富文本编辑器

    //实现基本剪裁效果
    // 1. 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
    }

    // 2. 初始化裁剪区域
    $('#image').cropper(options)

    //上传头像
    document.querySelector('.chooseFile').addEventListener('click', function () {
        document.querySelector('#updateFile').click()
    })
    document.querySelector('#updateFile').addEventListener('change', function (e) {
        const file = e.target.files[0]
        const newImgURL = URL.createObjectURL(file)
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //暂存草稿
    let art_state = '已发布'
    document.querySelector('.tempFile').addEventListener('click', () => {
        art_state = '已存草稿'
    })
    //发布表单的提交事件
    document.querySelector('.form_pub').addEventListener('submit', function (e) {
        e.preventDefault()
        //基于form表单，创建formData对象
        const fd = new FormData(this)
        //将文章发布状态存到fd中
        fd.append('state', art_state)
        //将头像图片，输出为文件对象存入fd中
        // // 创建一个 Canvas 画布
        $('#image')
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })
    //定义发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //说明：像服务器提交Formdate格式数据，必须加下面两个配置项
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) return layui.layer.msg('发布文章失败')
                // layui.layer.msg('发布文章成功')
                // location.href = 'art_list.html'
                layer.confirm('发布成功,是否跳转到文章列表页?', { icon: 1, title: '成功' }, function (index) {
                    location.href = 'art_list.html'
                    layer.close(index)
                })
            },
        })
    }
})()
