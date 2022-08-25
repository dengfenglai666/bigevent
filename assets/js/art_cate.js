;(function () {
    //渲染表单
    function initArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                let str = ''
                res.data.map(item => {
                    str += `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.alias}</td>
                      <td>
                      <button type="button" class="layui-btn layui-btn-sm" id="updateCate" data-id=${item.Id}>
                        <i class="layui-icon">&#xe642;</i>编辑
                      </button>
                      <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" data-id=${item.Id} id="delCate">
                        <i class="layui-icon">&#xe640;</i>删除
                      </button>
                      </td>
                      </tr>
              `
                })
                document.querySelector('tbody').innerHTML = str
            },
        })
    }
    initArtCate()

    //点击按钮，弹出添加的弹出层
    let addIndex
    document.querySelector('.addCate').addEventListener('click', function () {
        addIndex = layui.layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: `
          <form class="layui-form" id="addForm" style="margin:15px">
               <!-- 隐藏域，保存 Id 的值 -->
              <input type="hidden" name="Id">
              <div class="layui-form-item">
                   <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                  <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                 </div>
              </div>
              <div class="layui-form-item">
                   <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                  <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                 </div>
              </div>
              <div class="layui-form-item">
              <div class="layui-input-block">
                 <button class="layui-btn" lay-submit lay-filter="formDemo">确认提交</button>
                 <button type="reset" class="layui-btn layui-btn-primary" id="addReset"> 重置</button>
              </div>
            </div>
          </form>
          `,
        })
    })
    //通过事件委托新增分类（增）
    document.querySelector('body').addEventListener('submit', function (e) {
        e.preventDefault()
        if (e.target.id === 'addForm') {
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $('#addForm').serialize(),
                success: res => {
                    if (res.status !== 0) return layui.layer.msg('新增分类失败！')
                    initArtCate()
                    layui.layer.msg('新增分类成功！')
                    layui.layer.close(addIndex)
                },
            })
        }
        if (e.target.id === 'addReset') document.querySelector('#addForm').reset()
    })
    //点击编辑，弹出弹出层
    let updateIndex
    document.querySelector('tbody').addEventListener('click', function (e) {
        if (e.target.id === 'updateCate') {
            updateIndex = layui.layer.open({
                type: 1,
                title: '修改文章分类',
                area: ['500px', '250px'],
                content: `
                <form class="layui-form" id="updateForm" style="margin:15px" lay-filter="form-update">
                      <!-- 隐藏域，保存 Id 的值 -->
                      <input type="hidden" name="Id">
                 <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                       <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                     </div>
                  </div>
                  <div class="layui-form-item">
                     <label class="layui-form-label">分类别名</label>
                     <div class="layui-input-block">
                        <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                     </div>
                  </div>
                  <div class="layui-form-item">
                     <div class="layui-input-block">
                        <button class="layui-btn" lay-submit lay-filter="formDemo">确认提交</button>
                      </div>
                  </div>
               </form>
          `,
            })
            //根据id获取对应数据
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + e.target.dataset.id,
                success: res => {
                    //自动将数据渲染到表单
                    layui.form.val('form-update', res.data)
                },
            })
        }
    })
    //通过事件委托更新数据(改)
    document.querySelector('body').addEventListener('submit', function (e) {
        e.preventDefault()
        if (e.target.id === 'updateForm') {
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $('#updateForm').serialize(),
                success: res => {
                    if (res.status !== 0) return layui.layer.msg('更新数据失败!')
                    initArtCate()
                    layui.layer.msg('更新数据成功！')
                    layer.close(updateIndex)
                },
            })
        }
    })
    //通过事件委托删除数据（删）
    document.querySelector('tbody').addEventListener('click', function (e) {
        if (e.target.id === 'delCate') {
            layer.confirm('确认删除?', { icon: 7, title: '提示' }, function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + e.target.dataset.id,
                    success: res => {
                        if (res.status !== 0) return layui.layer.msg('删除数据失败')
                        initArtCate()
                        layui.layer.msg('删除数据成功！')
                        layer.close(index)
                    },
                })
            })
        }
    })
})()
