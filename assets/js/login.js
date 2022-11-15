$(document).ready(function(){
    $("#login").submit(function(){
        $.post("/users/login", $(this).serialize(),function(data){
            if(data.status){
                location.href = "/dashboard"
            }
            else{
                alert("Failed to login, check your account");
            }
        });

        return false;   
    });

    $("#register").submit(function(){
        $.post("/users/register", $(this).serialize(),function(data){
            if(data.status){
                location.href = "/dashboard";
            }
            else{
                alert("Failed to register, check all fields or password and confirm password");
            }
        });

        return false;   
    });
})