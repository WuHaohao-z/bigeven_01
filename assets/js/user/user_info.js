$(function(){

    // 昵称验证
    var form = layui.form
    form.verify({
        nickname: function(value){
            if(value.length > 6) return '昵称长度必须在 1 ~ 6 个字符之间 ! '
        }
    })

    // 初始化用户的基本信息
    initUserInfo()
    var layer = layui.layer;
    function initUserInfo(){
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // console.log(res);
                // 成功后渲染
                form.val('formUserInfo',res.data)
            }
        });
    }

    // 重置表单的数据
    $('#btnReset').on('click',function(e){
        // 阻止默认行为
        e.preventDefault()
        // 从新用户渲染
        initUserInfo()
    })

    // 修改用户信息
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，用户信息修改成功')
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserInfo()
            }
        });
    })
})