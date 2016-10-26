
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('btn-submit').addEventListener('click',function(){
        
        
        fetch('/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                password: document.getElementById('password').value
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(res){
            if (res.isLogin) {
                location.href = '/homepage';
            } else {
                alert(res.msg);
            }
        })
        .catch(function(e){
            console.log(e);
            alert('严重错误！');
        });
        
        
    })
})


