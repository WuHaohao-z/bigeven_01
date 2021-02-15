$(function(){
    // 定义校验规则
    var form = layui.form
    form.verify({
        // 旧密码
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        // 新密码
        samePwd:function(value){
            if(value == $('[name=oldPwd]').val()){
                return '原密码和旧密码不能相同！';
            }
        },
        // 确认密码
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次输入的密码不一样'
            }
        }
    })

    // 表单提交
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改密码成功!')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        });
    })
})