$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
      
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
      
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
      
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
      
      // 定义补零的函数
      function padZero(n) {
        return n > 9 ? n : '0' + n
      }

    // 定义提交参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 初始化文章列表
    initTable()
    function initTable(){
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        });
    }

    initCate()

    // 初始化文章分类的方法
    function initCate() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('获取分类数据失败！')
          }
          // 调用模板引擎渲染分类的可选项
          var htmlStr = template('tpl-cate', res)
          $('[name=cate_id]').html(htmlStr)
          // 通过 layui 重新渲染表单区域的UI结构
          form.render()
        }
      })
    }

    // 筛选功能
    $("#form-search").on("submit",function(e){
        e.preventDefault();
        var state = $("[name=state").val();
        var cate_id = $("[name=cate_id]").val()
        q.state = state;
        q.cate_id = cate_id

        initTable()
    })

    // 分页功能
    function renderPage(total){
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum // 设置默认被选中的分页

        ,layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10]

        ,jump: function(obj,first) {
            // console.log(obj.curr)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            if (!first) {
                initTable()
            }
          }
        })
    }

    // 删除功能
    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
              if ($('.btn-delete').length === 1) {
                // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                // 页码值最小必须是 1
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
              }
              initTable()
            }
          })
    
          layer.close(index)
        })
    })
})
  