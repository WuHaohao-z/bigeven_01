$(function(){
    // 点击去注册的连接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    var form = layui.form
    form.verify({
        // 密码
        pwd:[/^[\S]{6,12}$/,'密码必须是6到12位，且不能出现空格']
        // 确认密码
        ,repwd:function(value){
            //拿到密码框中的值判断是否一致
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    var layer = layui.layer
    $('#form_reg').on('submit',function(e){
        // 阻止默认行为
        e.preventDefault()
        // 发起ajax请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data:data,
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录!')
                // 模拟人的点击行为
                $('#link_login').click()
            }
        });
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/login",
            data:$(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('登录成功!')
                // 将登陆成功得到的token保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        });
    })
})