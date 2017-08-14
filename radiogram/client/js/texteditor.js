var limit = function (event) {
    var linha = $(this).attr("limit");

    var array = $(this).val().split("\n");

    $.each(array, function (i, value) {
        array[i] = value.slice(0, linha);
    });

    $(this).val(array.join("\n"))
}

$("textarea[limit]").keydown(limit).keyup(limit);
