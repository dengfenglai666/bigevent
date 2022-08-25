;(function () {
    //渲染筛选列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return layui.layer.msg('筛选列表失败！')
                let str = ''
                res.data.map(item => {
                    str += `<option value="${item.Id}">${item.name}</option> `
                })
                document.querySelector('[name=cate_name]').innerHTML = '<option value="">所有分类</option>' + str
                layui.form.render()
            },
        })
    }
    initCate()
    //定义查询数据
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
    }
    //渲染文章列表
    function initArtList() {
        document.querySelector('tbody').innerHTML = ''
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) return layui.layer.msg('获取文章列表失败')
                let str = ''
                res.data.map(item => {
                    function getZero(n) {
                        return n > 9 ? n : '0' + n
                    }
                    function getTime() {
                        const dt = new Date(item.pub_date)
                        const y = dt.getFullYear()
                        const m = getZero(dt.getMonth() + 1)
                        const d = getZero(dt.getDate())
                        const hh = getZero(dt.getHours())
                        const mm = getZero(dt.getMinutes())
                        const ss = getZero(dt.getSeconds())
                        item.pub_date = `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
                    }
                    getTime()
                    str += `
                    <tr>
                       <td>${item.title}</td>
                       <td>${item.cate_name}</td>
                       <td>${item.pub_date}</td>
                       <td>${item.state}</td>
                       <td>
                          <button type="button" class="layui-btn layui-btn-xs">
                            <i class="layui-icon">&#xe642;</i>编辑
                          </button>
                          <button type="button " class="layui-btn layui-btn-xs layui-btn-danger btnDel" id="btnDel" data-id="${item.Id}">
                            <i class="layui-icon">&#xe640;</i>删除
                          </button>
                        </td>
                      </tr>
                `
                    document.querySelector('tbody').innerHTML = str
                    //渲染分页列表
                    page(res.total)
                })
            },
        })
    }
    initArtList()

    //筛选并渲染文章列表
    document.querySelector('#selForm').addEventListener('submit', function (e) {
        e.preventDefault()
        // 把查询的赋值给查询参数对象q
        q.cate_id = document.querySelector('[name=cate_name]').value
        q.state = document.querySelector('[name=state]').value
        initArtList()
    })

    //分页的渲染
    function page(total) {
        layui.laypage.render({
            elem: 'pageBox', //分页器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页的显示条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页排版
            limits: [2, 3, 4, 5], //定义自定义排版中limit的分组数值
            //jump：切换分页的回调
            // obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function (obj, first) {
                q.pagenum = obj.curr //将最新页面赋值给查询参数
                q.pagesize = obj.limit //将最新的每页条目数量赋值给查询参数
                if (!first) initArtList() //如果不是首次查询，就渲染页面（这样做避免死循环）
            },
        })
    }
    //删除模块
    document.querySelector('tbody').addEventListener('click', function (e) {
        let length = document.querySelectorAll('.btnDel').length
        console.log(e.target.dataset.id)
        if (e.target.id == 'btnDel') {
            layer.confirm('确认删除吗?', { icon: 2, title: '提示' }, function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + e.target.dataset.id,
                    success: res => {
                        console.log(res)
                        if (res.status !== 0) return layui.layer.msg('删除失败')
                        layui.layer.msg('删除成功')
                        //渲染页面，如果删除最后页数的所有数据，刷新页面不会出来，需要判断页面是否有数据在渲染
                        //判断当前页面删除按钮的个数，当为1个说明渲染后页面没有数据了，进行页面减一操作（需判断页面是否在第一页）
                        if (length == 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initArtList()
                    },
                })
                layer.close(index)
            })
        }
    })
})()
