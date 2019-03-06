(function ($) {

    Array.prototype.rotate = (function() {

        var push = Array.prototype.push;

        var splice = Array.prototype.splice;

        return function(count) {

            var len = this.length >>> 0,
                count = count >> 0;

            count = ((count % len) + len) % len;

            push.apply(this, splice.call(this, 0, count));

            return this;

        };

    })();

    Date.prototype.isLessThan = (function(){
        return function(date){
            
            return(this.getFullYear() < date.getFullYear() || 
                this.getFullYear() == date.getFullYear() && this.getMonth() < date.getMonth()||
                this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() < date.getDate()
                ) 
        }
    })();

    Date.prototype.isGreaterThan = (function(){
        return function(date){
            return(this.getFullYear() > date.getFullYear() || 
                this.getFullYear() == date.getFullYear() && this.getMonth() > date.getMonth()||
                this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() > date.getDate()
                ) 
        }
    })();


    Date.prototype.isToday = (function(){
        return function(){
            today = new Date();
            return(this.getFullYear() == today.getFullYear() && 
                    this.getMonth() == today.getMonth()&&
                    this.getDate() == today.getDate() 
                ) 
        }
    })();

    Date.prototype.isEqualTo = (function(){
        return function(date){
            return(this.getFullYear() == date.getFullYear() && 
                    this.getMonth() == date.getMonth()&&
                    this.getDate() == date.getDate() 
                ) 
        }
    })();

    Date.prototype.setNextDate = (function(){

        return function(){

            this.setDate(this.getDate() + 1);
            return this;
        }

    })();

    Date.prototype.setPrevDate = (function(){

        return function(){

            this.setDate(this.getDate() - 1);
            return this;
        }

    })();

    Date.prototype.setNextMonth = (function(){

        return function(){

            this.setMonth(this.getMonth() + 1);
            return this;
        }

    })();


    Date.prototype.setPrevMonth = (function(){

        return function(){

            this.setMonth(this.getMonth() - 1);
            return this;

        }

    })();

    Date.prototype.setNextYear = (function(){

        return function(){

            this.setFullYear(this.getFullYear() + 1);
            return this;
        }

    })();

    Date.prototype.setPrevYear = (function(){

        return function(){

            this.setFullYear(this.getFullYear() - 1);
            return this;
        }

    })();

    Date.prototype.YmdFormat = function () {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = this.getDate().toString();
        return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
    };

    function YmdToDate (YmdFormat) {
        var date = new Date();
        date.setDate(YmdFormat.split("-")[2]);
        date.setMonth(parseInt(YmdFormat.split("-")[1])-1);
        date.setFullYear(YmdFormat.split("-")[0]);
        return date;
    };

    $.fn.schedular = function (myoptions) {

        return this.each(function () {

            var $schedularHolder = $(this);

            var selectedDates = [];

            var languages = {

                previousMonth : "Previous Month",

                nextMonth : "Next Month",

                previousYear : "Previous Year", 

                nextYear : "Next Year",

                clickToTraverseYear : "Click to select by year",

                startDate : "Start Date",

                endDate : "End Date",

                endDateRequired: "Please specify end date.",

                endDateShouldBeGreaterThanStartDate :"End date should be greater than start date",

                noDatesScheduledTitle:"No dates scheduled", 

                noSchedulingDatesSelectedConfirmMessage: "Are you sure you want to continue without scheduling dates?",

                noSchedulingConfirmOk:"Yes", 

                noSchedulingConfirmCancel:"No",

                months_3 : "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec",

                months_full : "January|February|March|April|May|June|July|August|September|October|November|December",

                days_2 : "Su|Mo|Tu|We|Th|Fr|Sa",

                days_3 : "Sun|Mon|Tue|Wed|Thu|Fri|Sat",

            };

            var options = {

                first_day : "1", /* specify days index - Sunday => 0 -- takes value ranged from 0 - 6 */

                days_format : "2", /* specify number of letters to days - takes value ranged between  2 || 3 */

                months_format : "3", /* string -- takes value 3 | full */

                "url": false,

                "data":false,

                hightlightToday:true,

                hightlightMonthsHavingScheduledDates:true,

                disableDatesBefore:false,/* to disable dates before this date, value either false or a Date instance*/

                disableDatesAfter:false, /* to disable dates after this date, value either false or a Date instance*/

                termlessScheduling:false,/* if termless scheduling, i.e schedule every day without condition*/

                onClosestFormSubmit:{
                    validateStartEndDateRange:true,
                    confirmOnNoDatesSelected:true,
                    whatever:function(){
                        
                    },

                landingDate:false /*false or date's instance you need to begin schedular from*/
            }
            };


            var self = {

                initialize:function(){

                    var startDate = new Date();

                    startDate.setDate(1);

                    if(options.landingDate){

                        startDate.setMonth(options.landingDate.getMonth());

                        startDate.setYear(options.landingDate.getFullYear());

                    }

                    var $schedulesWrapper = $('<table class="schedules-wrapper"/>');

                    self.updateWeekView($schedulesWrapper, new Date(startDate));

                    $schedulesWrapper.on("click",".prev-month", function(){self.updateWeekView($schedulesWrapper, new Date(startDate.setPrevMonth()))});

                    $schedulesWrapper.on("click",".month-identifier", function(){self.updateMonthlyView($schedulesWrapper, new Date(startDate))});

                    $schedulesWrapper.on("click",".next-month", function(){self.updateWeekView($schedulesWrapper, new Date(startDate.setNextMonth()))});

                    $schedulesWrapper.on("click",".prev-year", function(){self.updateMonthlyView($schedulesWrapper, new Date(startDate.setPrevYear()))});

                    $schedulesWrapper.on("click",".year-identifier", function(){self.updateWeekView($schedulesWrapper, new Date(startDate))});

                    $schedulesWrapper.on("click",".next-year", function(){self.updateMonthlyView($schedulesWrapper, new Date(startDate.setNextYear()))});

                    $schedulesWrapper.on("click",".month-data", function(e){
                        startDate.setYear($(this).attr("data-year"));
                        startDate.setMonth($(this).attr("data-month"));
                        self.selectRange( new Date(startDate.setDate(1)), new Date(startDate.setNextMonth().setDate(0)) )
                        startDate.setDate(1);
                        $(this).addClass("active");
                    });

                    $schedulesWrapper.on("click",".month-data.active", function(e){
                        startDate.setYear($(this).attr("data-year"));
                        startDate.setMonth($(this).attr("data-month"));
                        self.unSelectRange( new Date(startDate.setDate(1)), new Date(startDate.setNextMonth().setDate(0)) )
                        startDate.setDate(1);
                        $(this).removeClass("active");
                        $(this).removeClass("has-scheduled-dates");
                    });

                    $schedulesWrapper.on("click",".day-data", function(e){
                        var date = new Date();
                        date.setYear($(this).attr("data-year"));
                        date.setMonth($(this).attr("data-month"));
                        date.setDate($(this).attr("data-date"));
                        self.selectDate(date);
                        startDate.setDate(1);
                        $(this).addClass("active");
                    });

                    $schedulesWrapper.on("click",".day-data.active", function(e){
                        var date = new Date();
                        date.setYear($(this).attr("data-year"));
                        date.setMonth($(this).attr("data-month"));
                        date.setDate($(this).attr("data-date"));
                        self.unSelectDate(date);
                        startDate.setDate(1);
                        $(this).removeClass("active");
                    });
                    
                    $schedularHolder.on("refreshSchedular", function(e,refreshOptions){

                        $.extend(options, refreshOptions);
                        self.updateWeekView($schedulesWrapper, new Date());
                    })

                    //$schedulesWrapper.on("click",".month-data", function(){ startDate.setYear($(this).attr("data-year"));startDate.setMonth($(this).attr("data-month"));self.updateWeekView($schedulesWrapper, new Date(startDate))});
                
                    if(!!options.url)

                        self.getScheduledDates_ajax();

                    if(options.onClosestFormSubmit != null){
                        $schedularHolder.closest("form").find("input[type='submit']").on("click", function(e){
                            e.preventDefault();
                            
                            if(options.onClosestFormSubmit.validateStartEndDateRange == true){
                                self.validateStartEndDateRange();
                            }
                            
                            if(options.onClosestFormSubmit.confirmOnNoDatesSelected == true){
                                self.confirmOnNoDatesSelected();
                            }

                            if(options.onClosestFormSubmit.whatever != null){
                                options.onClosestFormSubmit.whatever();
                            }

                        });
                    }

                    $schedulesWrapper.on("click", ":not(input[data-toggle='tooltip'])", function(){
                        $("[data-toggle='tooltip']").tooltip("hide");
                    });


                },



                updatePresentationWeekly:function(date){

                    var nextDate = new Date(date);

                    for(var i=0; i< 42; i++){

                        nextDate.setNextDate();

                        if( options.termlessScheduling || $.inArray(date.YmdFormat(), selectedDates) != -1){

                            $("td[data-full-date="+ date.YmdFormat() +"]").addClass("active");

                        }else{

                            $("td[data-full-date="+ date.YmdFormat() +"]").removeClass("active");

                        }

                        date.setNextDate();

                    }

                },

                updatePresentationMonthly:function(date){

                    date.setDate(1);

                    var nextDate = new Date(date)

                    for(var i=0;i<12; i++){

                        date.setDate(1);
                        date.setMonth(i);
                        nextDate.setDate(1);
                        nextDate.setMonth(i);
                        nextDate.setNextDate();

                        var flag = true;

                        if(!options.termlessScheduling){
                            while(date.getMonth() == nextDate.getMonth()){

                                if( $.inArray(date.YmdFormat(), selectedDates) != -1){

                                    date.setNextDate();

                                    nextDate.setNextDate();

                                }else{

                                    flag = false;

                                    break;
                                }
                            }    
                        }

                        if(flag)
                            $("td[data-month="+ i +"]").addClass("active");

                        else
                            $("td[data-month="+ i +"]").removeClass("active");

                    }

                    if(options.hightlightMonthsHavingScheduledDates){
                        for(var i=0; i<selectedDates.length; i++){
                            var date = YmdToDate(selectedDates[i]);
                            if(!$("td[data-year='"+date.getFullYear()+"'][data-month='"+date.getMonth()+"']").hasClass("has-scheduled-dates")){
                                $("td[data-year='"+date.getFullYear()+"'][data-month='"+date.getMonth()+"']").addClass("has-scheduled-dates");
                            }
                        }
                    }
                        
                },

                selectDate:function(date){

                    if( $.inArray(date.YmdFormat(), selectedDates) == -1 ){

                        selectedDates.push( date.YmdFormat() )

                    }

                    self.updateHiddenDateInputField();

                },

                unSelectDate:function(date){

                    var indexDate = $.inArray(date.YmdFormat(), selectedDates);
                    if(  indexDate != -1 )
                        selectedDates.splice( indexDate, 1 );

                    self.updateHiddenDateInputField();
                },

                selectRange:function(from, to){

                    while(from <= to){
                        self.selectDate(from);
                        from.setNextDate();
                    }
                },

                selectFromArray:function(datesArray){
                    //dates in array supposed to be Ymd Format
                    var date = new Date();
                    for(var i =0; i<datesArray.length; i++){
                        date.setDate(datesArray[i].split("-")[2]);    
                        date.setMonth(datesArray[i].split("-")[1]);
                        date.setFullYear(datesArray[i].split("-")[0]);
                        self.selectDate(date);
                    }
                },

                unSelectRange:function(from, to){
                    while(from <= to ){
                        self.unSelectDate(from);
                        from.setNextDate();
                    }
                },

                updateHiddenDateInputField:function(){
                    if($schedularHolder.find("input[type='hidden'][name='all-schedules']").length > 0 ){
                        $allSchedulesHidden = $schedularHolder.find("input[type='hidden'][name='all-schedules']");
                        $allSchedulesHidden.val(JSON.stringify(selectedDates));
                    }else{
                        var $allSchedulesHidden = $("<input type='hidden' name='all-schedules' />")
                        $schedularHolder.append($allSchedulesHidden.val(JSON.stringify(selectedDates)));                                
                    }
                },

                updateMonthlyView :function($schedulesWrapper, startDate){

                    /* set month to the end then pop */
                    startDate.setMonth(11);

                    var $leftSelector = $("<th class='prev-year'/>").append("<span class='glyphicon glyphicon-chevron-left' title='"+languages.previousYear+"'/>");

                    var $rightSelector = $("<th class='next-year'/>").append("<span class='glyphicon glyphicon-chevron-right' title='"+languages.nextYear+"'/>");

                    var $identifier = $("<th class='year-identifier' colspan='1'/>").append($("<span class='year' data-year='" + startDate.getFullYear() + "'/>").append(startDate.getFullYear()));

                    var $titleBar = $('<tr class="schedular-titlebar"/>');

                    $titleBar.append($leftSelector).append($identifier).append($rightSelector);

                    var $schedularBody = $("<tbody class='schedular-body'/>");

                    var months  = languages["months_"+options.months_format].split("|");

                    if(options.disableDatesBefore){
                       var disableBefore =  new Date(options.disableDatesBefore);
                       disableBefore.setDate(1);
                    }


                    if(options.disableDatesAfter){
                       var disableAfter =  new Date(options.disableDatesAfter);
                       disableAfter.setDate(1);
                    }

                    for(var i=1; i<=4; i++){

                        var $monthRow = $('<tr class="month-row"/>');

                        for(var j=1; j<=3; j++){

                            var $monthData = $('<td class="month-data" data-year="'+startDate.getFullYear()+'" data-month="'+startDate.getMonth()+'"/>').append('<span class="month-cell">'+months.pop()+'</span>');

                            if(options.disableDatesBefore && startDate.isLessThan(disableBefore)){
                               
                                $monthData.addClass("schedule-disabled");                                
                               
                            }


                            if(options.disableDatesAfter && startDate.isGreaterThan(disableAfter)){
                               
                                $monthData.addClass("schedule-disabled");                                
                               
                            }

                            $monthRow.prepend($monthData);

                            startDate.setPrevMonth();

                        }

                        $schedularBody.prepend($monthRow);

                    }
                    var $schedularHead = $("<thead class='schedular-head'/>").append($titleBar);

                    $schedulesWrapper.html($schedularHead);

                    $schedulesWrapper.append($schedularBody);

                    $schedularHolder.append($schedulesWrapper);


                    self.appendFooter($schedulesWrapper);

                    self.updatePresentationMonthly(startDate.setNextMonth());

                },

                updateWeekView : function($schedulesWrapper, startDate){

                    /* building schedular header */

                    var $leftSelector = $("<th class='prev-month'/>").append("<span class='glyphicon glyphicon-chevron-left' title='"+languages.previousMonth+"'/>");

                    var $rightSelector = $("<th class='next-month'/>").append("<span class='glyphicon glyphicon-chevron-right' title='"+languages.nextMonth+"'/>");

                    var $identifier = $("<th class='month-identifier' title='"+languages.clickToTraverseYear+"' colspan='5'/>").append($("<span class='month-year' data-month='" + startDate.getMonth() + "' data-year='" + startDate.getFullYear() + "'/>").append(languages.months_full.split("|")[startDate.getMonth()] + " " + startDate.getFullYear()));

                    var $titleBar = $('<tr class="schedular-titlebar"/>');

                    $titleBar.append($leftSelector).append($identifier).append($rightSelector);

                    var $days = $('<tr class="schedular-days"/>');

                    var days  = languages["days_"+options.days_format].split("|");

                    var daysFixed = days.rotate(options.first_day);

                    var dayIndex = options.first_day;

                    for( var i = 0; i< daysFixed.length; i++){

                        $days.append($('<th data-day-index="'+dayIndex+'"/>').append($('<span class="day-title"/>').append(daysFixed[i])));

                        dayIndex++;

                        if(dayIndex > 6)

                            dayIndex = 0;

                    }

                    var $schedularHead = $("<thead class='schedular-head'/>");

                    $schedularHead.append($titleBar);

                    /*schedular head end*/

                    /*fixing start date*/

                    var startDay = startDate.getDay();

                    if(options.first_day > startDay)
                        startDate.setDate(startDate.getDate() - (startDay - options.first_day + 7));

                    else
                        startDate.setDate(startDate.getDate() - (startDay - options.first_day));

                    var startDateClone = new Date(startDate);


                    // schedular body start
                    var $schedularBody = $("<tbody class='schedular-body'/>");

                    for(var i =0; i<6; i++){

                        var $weekRow = $('<tr class="schedular-days" data-week="week-'+i+'"/>');

                        for(var j=0; j<7; j++){

                            var $weekDate = $('<td class="day-data" data-year="'+startDate.getFullYear()+'" data-month="'+startDate.getMonth()+'" data-date="'+startDate.getDate()+'" data-full-date="'+startDate.YmdFormat()+'" />').append('<span class="date-cell">'+startDate.getDate()+'</span>');
                            
                            if(options.hightlightToday && startDate.isToday()){
                                $weekDate.addClass("today");    
                            }


                            if(options.disableDatesBefore && startDate.isLessThan(options.disableDatesBefore) ){
                                
                                $weekDate.addClass("schedule-disabled");                                
                            }

                            else if(options.disableDatesAfter && startDate.isGreaterThan(options.disableDatesAfter)){
                            
                                $weekDate.addClass("schedule-disabled");                                
                            
                            }

                            $weekRow.append($weekDate);

                            startDate.setNextDate();
                        }

                        $schedularBody.append($weekRow);

                    }
                    /* schedular body end */

                    $schedularHead.append($days);

                    $schedulesWrapper.html($schedularHead);

                    $schedulesWrapper.append($schedularBody);

                    $schedularHolder.append($schedulesWrapper);

                    self.appendFooter($schedulesWrapper);

                    self.updatePresentationWeekly(startDateClone);

                },
                appendFooter:function($schedulesWrapper){

                    $schedularHolder.find('#schedular-footer').remove();

                    var $schedularFooter = $("<div id='schedular-footer' class='range-selection'/>");
                    $schedularFooter.append($("<div class='col-xs-6'/>").append($("<div/>").append(languages.startDate)).append($("<div/>").append($("<input/>").attr({"type":"text", "class":"form-control","id":"schedular-range-from"}))));
                    $schedularFooter.append($("<div class='col-xs-6'/>").append($("<div/>").append(languages.endDate)).append($("<div/>").append($("<input/>").attr({"type":"text", "class":"form-control validate[required, lessThan[schedular-range-from]]","id":"schedular-range-to", "disabled":true}))));
                    $schedularFooter.append($("<div class='clearfix'/>"));
                    $schedularHolder.append($schedularFooter);

                    if($schedularHolder.find("input[type='hidden'][name='all-schedules']").length == 0 ){
                        var $allSchedulesHidden = $("<input type='hidden' name='all-schedules'/>")
                        $schedularHolder.append($allSchedulesHidden);                        
                    }

                    var datepickerOptions = {
                        dateFormat: "yy-mm-dd"
                    };

                    if(options.disableDatesBefore!=null && options.disableDatesBefore!=false){
                        datepickerOptions.minDate = options.disableDatesBefore;
                    }

                    if(options.disableDatesAfter!=null && options.disableDatesAfter!=false){
                        datepickerOptions.maxDate = options.disableDatesAfter;
                    }
                    
                    $schedularFooter.find("#schedular-range-from").datepicker(datepickerOptions);
                    $schedularFooter.find("#schedular-range-to").datepicker(datepickerOptions);
                    $schedularHolder.width($schedulesWrapper.width());

                    $schedularFooter.on("change", "#schedular-range-from", function(e){ self.onSchedularRangeFromChange(e, this) })
                    $schedularFooter.on("change", "#schedular-range-to", function(e){ self.onSchedularRangeToChange(e, this, $schedulesWrapper) })

                },

                onSchedularRangeFromChange:function(e, element){
                    if($(element).val().trim() != ""){
                        $(element).closest(".range-selection").find("#schedular-range-to").attr("disabled", false);
                    }else{
                        $(element).closest(".range-selection").find("#schedular-range-to").attr("disabled", true);
                    }
                },

                onSchedularRangeToChange:function(e, element, $schedulesWrapper){



                    var $schedularRangeFrom = $("#schedular-range-from");
                    var $schedularRangeTo = $("#schedular-range-to");

                    var from = YmdToDate($schedularRangeFrom.val());
                    var to = YmdToDate($schedularRangeTo.val());
                    
                    $schedularRangeTo.tooltip("destroy");
                    if(from.isEqualTo(to) || from.isGreaterThan(to)){
                        self.showTooltipMessage($schedularRangeTo,languages.endDateShouldBeGreaterThanStartDate);
                        return;
                    }

                    fromCloned = new Date(from);
                    toCloned = new Date(to);

                    selectedDates = [];

                    weekViewToFromDate = new Date(from);
                    weekViewToFromDate.setDate(1);



                    self.selectRange(from, to);

                    self.updateWeekView($schedulesWrapper, weekViewToFromDate);    

                    var $schedularRangeFrom = $("#schedular-range-from");

                    var $schedularRangeTo = $("#schedular-range-to");
                    
                    $schedularRangeFrom.val(fromCloned.YmdFormat());

                    $schedularRangeTo.val(toCloned.YmdFormat()).attr("disabled",false);

                },

                getScheduledDates_ajax:function(){
                    $.ajax({
                        url:options.url,
                        cache:false,
                        data:options.data,
                        type:"post",
                        dataType:"json",
                        beforeSend:function(){

                        },
                        success:function(data){

                            if(data.success){
                                self.selectFromArray(data.dates);
                            }
                        }
                    })

                },
                validateStartEndDateRange:function(){

                    $start = $("#schedular-range-from");
                    $end = $("#schedular-range-to");
                    
                    $end.tooltip('destroy');
                    
                    if($start.val().trim() != "" && $end.val().trim() == "" ){
                        //specify range upper  limit;
                        self.showTooltipMessage($end,languages.endDateRequired)
                        
                        return;
                    }

                },
                confirmOnNoDatesSelected:function(){

                    if(selectedDates.length==0){
                        Confirmation(
                            $schedularHolder.closest("form").find("input[type='submit']"),
                            languages.noDatesScheduledTitle, 
                            languages.noSchedulingDatesSelectedConfirmMessage, 
                            languages.noSchedulingConfirmOk, 
                            languages.noSchedulingConfirmCancel
                            );    
                    }
                    
                },
                showTooltipMessage:function($element, message){
                    $element.tooltip('destroy');
                    $element.attr({"title":message,
                                    "data-toggle":"tooltip",
                                    "data-trigger":"manual"
                                });
                    $element.tooltip('show'); 
                }


            };
            
            $.extend(options, myoptions);
            
            self.initialize();

        });

    };

})(jQuery);
