<!DOCTYPE html>
<html>
<head>
	<title>schedular</title>
	<link rel="stylesheet" type="text/css" href="/schedular/style.default.css">
	<link rel="stylesheet" type="text/css" href="/schedular/schedular.css">
</head>
<body>
<form>
	<div id="schedular">
		
	</div>
	<input type="submit" value="submit"/>	
</form>
	
<script type="text/javascript" src="/schedular/jquery-1.11.0.min.js"></script>	
<script type="text/javascript" src="/schedular/jquery-ui-1.10.3.js"></script>
<script type="text/javascript" src="/schedular/bootstrap.min.js"></script>
<script type="text/javascript">
	var confirmed = false;

function Confirmation(obj, title, confirmMsg, OkLabel, CancelLabel) {

    if (OkLabel == null)
        OkLabel = "Yes";

    if (CancelLabel == null)
        CancelLabel = "No";


    if (!confirmed) {
        $('body').append("<div id='dialog-confirm'><p>" + confirmMsg + "</p>");

        $("#dialog-confirm").dialog({
            title: title,
            resizable: false,
            height: "auto",
            width: "auto",
            open: function () {
                var closeBtn = $('.ui-dialog-titlebar-close');
                closeBtn.html('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span>');
            },
            modal: true,
            buttons: [
                {
                    text: OkLabel,
                    click: function () {
                        $(this).dialog("close");
                        $('#dialog-confirm').remove();
                        confirmed = true;
                        obj.click();
                    }
                },
                {
                    text: CancelLabel,
                    click: function () {
                        $(this).dialog("close");
                        confirmed = false;
                        $('#dialog-confirm').remove();
                    }
                }
            ]

        }).parent().find(".ui-dialog-titlebar-close").click(function () {
            $('#dialog-confirm').remove();
        });
    }

    return confirmed;
}

</script>
<script type="text/javascript" src="/schedular/schedular.js"></script>
<script type="text/javascript">
	$(function(){
		var before =  new Date("2016-07-31");
		var after = new Date("2016-08-31");
		$("#schedular").schedular({
			url:"data.php",
			data:{id:10},
			disableDatesBefore: false,
			disableDatesAfter: after,
			landingDate:false,
			onClosestFormSubmit:{
				validateStartEndDateRange:true,
				confirmOnNoDatesSelected:true,
				whatever:function(){
					alert();
				}
			},
			termlessScheduling:false

		});

	});
</script>
</body>
</html>