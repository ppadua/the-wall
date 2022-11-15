$(document).ready(function(){
    $(document).on("submit", "#create_post", function(){
        $.post("/actions/create_post", $(this).serialize(),function(data){
            if(data.status){
                location.href = "/dashboard"
            }
            else{
                alert("Failed to login, check your account");
            }
        });

        return false;   
    });

    $(document).on("submit", "#delete_post", function(){
        $.post("/actions/delete_post", $(this).serialize(),function(data){
            if(data.status){
                location.href = "/dashboard"
            }
            else{
                alert("Failed to login, check your account");
            }
        });

        return false;   
    });

})