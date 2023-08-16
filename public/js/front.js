let counter = 0;

$(".tasks li input").click(function(){
    $(this).next().toggleClass("line-through");
});