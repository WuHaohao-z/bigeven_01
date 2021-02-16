$(function() {
    var layer = layui.layer
    var form = layui.form
  
    initArtCateList()
  
    // 1.获取文章分类的列表
    function initArtCateList() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
          var htmlStr = template('tpl-table', res)
          $('tbody').html(htmlStr)
        }
      })
    }

    //2. 添加类别
    var indexAdd = null
    $("#btnAddCate").on('click',function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    
    //  3.文章分类添加
    $("body").on("submit","#form-add",function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        });
    })

    // 4.修改分类
    var indexEdit = null
    $('tbody').on('click','.btn-edit',function(){
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 获取id，发送ajax数据，渲染到页面
        var Id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val("form-edit",res.data)
            }
        });
    })

    // 5.文章分类修改
    $("body").on("submit","#form-edit",function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } 
                initArtCateList();
                layer.msg('修改分类成功！')
                layer.close(indexEdit)
            }
        });
    })

  })
  