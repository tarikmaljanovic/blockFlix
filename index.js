$(document).ready(function () {
    $("#movies").hide();
    
    $("#connectBtn").click(function () {
        $("#connect").slideUp("slow", function () {
            setTimeout(function () {
                $("#movies").toggleClass("hidden");
                $("#movies").slideDown("slow");
            }, 500); 
        });
    });

    $("#movies").click(".movie img", function () {
        $("#movieModal").show();
        return false;
    });

    $(".close").click(function() {
        $("#movieModal").hide();
        return false;
    })

    
});
