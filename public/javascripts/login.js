
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('btn-submit').addEventListener('click',function(){
        
        
        fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                password: document.getElementById('password').value
            })
        }).then(function(response) {
            return response.json();
        }).then(function(data){
            if (data.isLogin == true) {
                location.href = '/homepage';
            } else {
                alert('用户名或密码错误！');
            }
        }).catch(function(e){
            console.log(e);
            alert('严重错误！');
        });
        
        
    })
})


