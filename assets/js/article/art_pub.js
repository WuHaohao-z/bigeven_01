$(function() {
    var form = layui.form
    var layer = layui.layer
    // 初始化分类
    initCate()
    function initCate(){
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染form
                var str = template('tpl-cate',res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        });
    }

    // 初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择封面
    $("#btnChooseImage").on("click",function(){
        $("#coverFile").click()
    })

    // 5.设置图片
    $("#coverFile").change(function(e){
        // 拿到文件
        var file = e.target.files[0]
        // 非空校验
        if(file == undefined){
            return ;
        }
        // 根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = "已发布"
    $("#btnSave2").on("click",function(){
        state = "草稿"
    })

    // 7.添加文章
    $("#form-pub").on("submit",function(e){
        e.preventDefault()
        var fd = new FormData(this)
        // 放入状态
        fd.append("state",state)
        // 放入图片
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        // 将 Canvas 画布上的内容，转化为文件对象
        .toBlob(function(blob) {
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
        })
    })

    function publishArticle(fd){
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您，发布文章成功！")
                // 跳转
                location.href = "/article/art_list.html"
            }
        });
    }

})
  