var baseAPI = 'http://api-breakingnews-web.itheima.net'
$.ajaxPrefilter (function(options){
    options.url = baseAPI + options.url

    // 为有权限的接口，设置headers请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }

    // 不论登录成功或者失败，都调用complete
    options.complete = function(res){
        // console.log(res);
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})