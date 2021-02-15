$(function(){

    getUserInfo()

    // 实现退出功能
    var layer = layui.layer
    $('#btnLogout').on('click',function(){
        // 弹出询问框
        layer.confirm('确认退出登录?', {icon: 3, title:'提示'}, function(index){
            //清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登陆页面
            location.href = '/login.html'

            // 关闭询问框
            layer.close(index);
        });
    })

    

})
// 获取用户的基本信息

function getUserInfo(){
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
        if(res.status !== 0){
            return layui.layer.msg(res.message)
        }
        renderAvatar(res.data)
        }
    });
}

// 渲染用户的头像
function renderAvatar(user){
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}