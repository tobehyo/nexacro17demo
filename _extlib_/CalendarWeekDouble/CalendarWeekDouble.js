//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.0.html	
//
//==============================================================================
//==============================================================================
// Object : nexacro.CalendarWeekDouble
// Group : Component
//==============================================================================
if (!nexacro.CalendarWeekDouble)
{
    //==============================================================================
    // nexacro.CalendarWeekDouble
    //==============================================================================
    nexacro.CalendarWeekDouble = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Div.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pCalendarWeekDouble = nexacro._createPrototype(nexacro.Div, nexacro.CalendarWeekDouble);
    nexacro.CalendarWeekDouble.prototype = _pCalendarWeekDouble;
    _pCalendarWeekDouble._type_name = "CalendarWeekDouble";

    /* internal variable */
    _pCalendarWeekDouble.lastDays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];

    _pCalendarWeekDouble.intPrevYear;
    _pCalendarWeekDouble.intPrevMonth;
    _pCalendarWeekDouble.intNextYear;
    _pCalendarWeekDouble.intNextMonth;
    _pCalendarWeekDouble.intThisYear;
    _pCalendarWeekDouble.intThisMonth;
    _pCalendarWeekDouble.intThisDay;
    _pCalendarWeekDouble.pYear;
    _pCalendarWeekDouble.pMonth;
    _pCalendarWeekDouble.pDay;

    _pCalendarWeekDouble.intPrevYear2;
    _pCalendarWeekDouble.intPrevMonth2;
    _pCalendarWeekDouble.intNextYear2;
    _pCalendarWeekDouble.intNextMonth2;
    _pCalendarWeekDouble.intThisYear2;
    _pCalendarWeekDouble.intThisMonth2;
    _pCalendarWeekDouble.intThisDay2;
    _pCalendarWeekDouble.pYear2;
    _pCalendarWeekDouble.pMonth2;
    _pCalendarWeekDouble.pDay2;

    _pCalendarWeekDouble.orgStartDate;
    _pCalendarWeekDouble.orgEndDate;

    /* event list */
    _pCalendarWeekDouble._event_list["onchanged"] = 1;

    /* accessibility */
    _pCalendarWeekDouble.accessibilityrole = "form";

    //===============================================================
    // nexacro.CalendarWeekDouble : Create & Destroy & Update
    //===============================================================
    _pCalendarWeekDouble.on_create_contents = function()
    {
        nexacro.Div.prototype.on_create_contents.call(this);

        var obj = null;

        obj = new nexacro.Static("startdatestatic", 0, 1, 60, 20, null, null, null, null, null, null);
        obj.set_text("Start Date");
        obj.set_cssclass("sta_WF_label01");
        this.addChild("startdatestatic", obj);

        obj = new nexacro.Static("enddatestatic", 0, 25, 60, 20, null, null, null, null, null, null);
        obj.set_text("End Date");
        obj.set_cssclass("sta_WF_label01");
        this.addChild("enddatestatic", obj);

        obj = new nexacro.Calendar("startcalendaredit", 65, 0, null, 20, 20, null, null, null, null, null);
        obj.set_dateformat("SHORTDATE");
        obj.set_editformat("SHORTDATE");
        obj.set_buttonsize("0");
        obj.set_popuptype("none");
        this.addChild("startcalendaredit", obj);

        obj = new nexacro.Calendar("endcalendaredit", 65, 25, null, 20, 20, null, null, null, null, null);
        obj.set_dateformat("SHORTDATE");
        obj.set_editformat("SHORTDATE");
        obj.set_buttonsize("0");
        obj.set_popuptype("none");
        this.addChild("endcalendaredit", obj);

        obj = new nexacro.Button("dropbutton", null, 15, 16, 16, 3, null, null, null, null, null);
        obj.set_cssclass("CalendarWeekDropButton");
        this.addChild("dropbutton", obj);

        obj = new nexacro.Dataset("yeardataset");
        obj.addColumn("year", "int", 4);
        this.addChild("yeardataset", obj);

        obj = new nexacro.Dataset("monthdataset");
        obj.addColumn("month", "string", 2);
        obj.addColumn("name", "string", 10);

        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        for (var i = 0, len = 12; i < len; i++)
        {
            var nRow = obj.addRow();
            obj.setColumn(nRow, "month", (i + 1));
            obj.setColumn(nRow, "name", months[i]);
        }

        this.addChild("monthdataset", obj);

        obj = new nexacro.Dataset("calendardataset");

        for (var i = 0, len = 8; i < len; i++)
        {
            obj.addColumn("d" + i.toString(), "string", 10);
            obj.addColumn("css" + i.toString(), "string", 10);
        }

        this.addChild("calendardataset", obj);

        obj = new nexacro.Dataset("calendardataset2");

        for (var i = 0, len = 8; i < len; i++)
        {
            obj.addColumn("d" + i.toString(), "string", 10);
            obj.addColumn("css" + i.toString(), "string", 10);
        }

        this.addChild("calendardataset2", obj);

        obj = new nexacro.PopupDiv("datepicker", 0, 64, 600, 224, null, null, null, null, null, null);
        obj.set_cssclass("CalendarWeekDatePicker");
        obj.form.set_scrollbartype("none");
        this.addChild("datepicker", obj);

        obj = new nexacro.Static("startdatestatic", 4, 4, 60, 15, null, null, null, null, null, null);
        obj.set_text("Start Date");
        obj.set_color("#ffffff");
        this.form.datepicker.addChild("startdatestatic", obj);

        obj = new nexacro.Button("prevbutton", 80, 4, 15, 15, null, null, null, null, null, null);
        obj.set_cssclass("CalendarWeekPrevButton");
        this.form.datepicker.addChild("prevbutton", obj);

        obj = new nexacro.Button("nextbutton", 193, 4, 15, 15, null, null, null, null, null, null);
        obj.set_cssclass("CalendarWeekNextButton");
        this.form.datepicker.addChild("nextbutton", obj);

        obj = new nexacro.Combo("yearcombo", 103, 19, 60, 0, null, null, null, null, null, null);
        this.form.datepicker.addChild("yearcombo", obj);

        this.form.datepicker.form.yearcombo.set_innerdataset("yeardataset");
        this.form.datepicker.form.yearcombo.set_codecolumn("year");
        this.form.datepicker.form.yearcombo.set_datacolumn("year");
        this.form.datepicker.form.yearcombo.set_displayrowcount(12);

        obj = new nexacro.Combo("monthcombo", 159, 19, 50, 0, null, null, null, null, null, null);
        this.form.datepicker.addChild("monthcombo", obj);

        this.form.datepicker.form.monthcombo.set_innerdataset("monthdataset");
        this.form.datepicker.form.monthcombo.set_codecolumn("month");
        this.form.datepicker.form.monthcombo.set_datacolumn("month");
        this.form.datepicker.form.monthcombo.set_displayrowcount(13);

        obj = new nexacro.Edit("yearedit", 98, 5, 50, 15, null, null, null, null, null, null);
        obj.set_readonly("true");
        obj.set_cssclass("CalendarWeekEdit");
        this.form.datepicker.addChild("yearedit", obj);

        obj = new nexacro.Static("dotstatic", 148, 5, 7, 15, null, null, null, null, null, null);
        obj.set_text(".");
        obj.set_color("#ffffff");
        this.form.datepicker.addChild("dotstatic", obj);

        obj = new nexacro.Edit("monthedit", 154, 5, 35, 15, null, null, null, null, null, null);
        obj.set_readonly("true");
        obj.set_cssclass("CalendarWeekEdit");
        this.form.datepicker.addChild("monthedit", obj);

        obj = new nexacro.Grid("datepickergrid", -1, 21, "49%", null, null, 25, null, null, null, null);
        obj.set_autofittype("col");
        obj.set_selecttype("cell");
        //obj.set_useselcolor(false);
        obj.set_scrollbartype("none");

        var strFormat = '<Formats>' +
            '<Format id="default">' +
            '  <Columns>' +
            '    <Column size="35" />' +
            '    <Column size="30" />' +
            '    <Column size="30" />' +
            '    <Column size="30" />' +
            '    <Column size="30" />' +
            '    <Column size="30" />' +
            '    <Column size="30" />' +
            '    <Column size="30" />' +
            '  </Columns>' +
            '  <Rows>' +
            '    <Row size="21" band="head" />' +
            '    <Row size="25" />' +
            '  </Rows>' +
            '  <Band id="head">' +
            '    <Cell color="#115fac" text="WEEK" textAlign="center"/>' +
            '    <Cell col="1" color="#333333" text="MON" textAlign="center"/>' +
            '    <Cell col="2" color="#333333" text="TUE" textAlign="center"/>' +
            '    <Cell col="3" color="#333333" text="WED" textAlign="center"/>' +
            '    <Cell col="4" color="#333333" text="THU" textAlign="center"/>' +
            '    <Cell col="5" color="#333333" text="FRI" textAlign="center"/>' +
            '    <Cell col="6" color="#d40009" text="SAT" textAlign="center"/>' +
            '    <Cell col="7" color="#d40009" text="SUN" textAlign="center"/>' +
            '  </Band>' +
            '  <Band id="body">' +
            '    <Cell cssclass="bind:css0" text="bind:d0" textAlign="center"/>' +
            '    <Cell col="1" cssclass="bind:css1" text="bind:d1" textAlign="center"/>' +
            '    <Cell col="2" cssclass="bind:css2" text="bind:d2" textAlign="center"/>' +
            '    <Cell col="3" cssclass="bind:css3" text="bind:d3" textAlign="center"/>' +
            '    <Cell col="4" cssclass="bind:css4" text="bind:d4" textAlign="center"/>' +
            '    <Cell col="5" cssclass="bind:css5" text="bind:d5" textAlign="center"/>' +
            '    <Cell col="6" cssclass="bind:css6" text="bind:d6" textAlign="center"/>' +
            '    <Cell col="7" cssclass="bind:css7" text="bind:d7" textAlign="center"/>' +
            '  </Band>' +
            '</Format>' +
            '</Formats>';

        obj.set_formats(strFormat);
        obj.set_binddataset("calendardataset");
        this.form.datepicker.addChild("datepickergrid", obj);

        obj = new nexacro.Static("enddatestatic", 300, 4, 60, 15, null, null, null, null, null, null);
        obj.set_text("End Date");
        obj.set_color("#ffffff");
        this.form.datepicker.addChild("enddatestatic", obj);

        obj = new nexacro.Button("prevbutton2", 380, 4, 15, 15, null, null, null, null, null, null);
        obj.set_cssclass("CalendarWeekPrevButton");
        this.form.datepicker.addChild("prevbutton2", obj);

        obj = new nexacro.Button("nextbutton2", 493, 4, 15, 15, null, null, null, null, null, null);
        obj.set_cssclass("CalendarWeekNextButton");
        this.form.datepicker.addChild("nextbutton2", obj);

        obj = new nexacro.Combo("yearcombo2", 403, 19, 60, 0, null, null, null, null, null, null);
        this.form.datepicker.addChild("yearcombo2", obj);

        this.form.datepicker.form.yearcombo2.set_innerdataset("yeardataset");
        this.form.datepicker.form.yearcombo2.set_codecolumn("year");
        this.form.datepicker.form.yearcombo2.set_datacolumn("year");
        this.form.datepicker.form.yearcombo2.set_displayrowcount(12);

        obj = new nexacro.Combo("monthcombo2", 459, 19, 50, 0, null, null, null, null, null, null);
        this.form.datepicker.addChild("monthcombo2", obj);

        this.form.datepicker.form.monthcombo2.set_innerdataset("monthdataset");
        this.form.datepicker.form.monthcombo2.set_codecolumn("month");
        this.form.datepicker.form.monthcombo2.set_datacolumn("month");
        this.form.datepicker.form.monthcombo2.set_displayrowcount(13);

        obj = new nexacro.Edit("yearedit2", 398, 5, 50, 15, null, null, null, null, null, null);
        obj.set_readonly("true");
        obj.set_cssclass("CalendarWeekEdit");
        this.form.datepicker.addChild("yearedit2", obj);

        obj = new nexacro.Static("dotstatic2", 448, 5, 7, 15, null, null, null, null, null, null);
        obj.set_text(".");
        obj.set_color("#ffffff");
        this.form.datepicker.addChild("dotstatic2", obj);

        obj = new nexacro.Edit("monthedit2", 454, 5, 35, 15, null, null, null, null, null, null);
        obj.set_readonly("true");
        obj.set_cssclass("CalendarWeekEdit");
        this.form.datepicker.addChild("monthedit2", obj);

        obj = new nexacro.Grid("datepickergrid2", "49%", 21, null, null, -1, 25, null, null, null, null);
        obj.set_autofittype("col");
        obj.set_selecttype("cell");
        //obj.set_useselcolor(false);
        obj.set_scrollbartype("none");
        obj.set_formats(strFormat);
        obj.set_binddataset("calendardataset2");
        this.form.datepicker.addChild("datepickergrid2", obj);

        obj = new nexacro.Button("okbutton", null, null, 60, 20, 3, 3, null, null, null, null);
        obj.set_text("OK");
        this.form.datepicker.addChild("okbutton", obj);

        this.form.set_scrollbartype("none");

        this.form.startdatestatic.createComponent();
        this.form.enddatestatic.createComponent();
        this.form.startcalendaredit.createComponent();
        this.form.endcalendaredit.createComponent();
        this.form.dropbutton.createComponent();
        this.form.datepicker.createComponent();

        this.form.startcalendaredit.addEventHandler("onchanged", this._calendaredit_onchanged, this);
        this.form.endcalendaredit.addEventHandler("onchanged", this._calendaredit_onchanged, this);
        this.form.dropbutton.addEventHandler("onclick", this._dropbutton_onclick, this);
        this.form.datepicker.addEventHandler("onpopup", this._datepicker_onpopup, this);
        this.form.datepicker.addEventHandler("oncloseup", this._datepicker_oncloseup, this);
        this.form.datepicker.form.prevbutton.addEventHandler("onclick", this._prevbutton_onclick, this);
        this.form.datepicker.form.nextbutton.addEventHandler("onclick", this._nextbutton_onclick, this);
        this.form.datepicker.form.yearedit.addEventHandler("oneditclick", this._yearedit_oneditclick, this);
        this.form.datepicker.form.monthedit.addEventHandler("oneditclick", this._monthedit_oneditclick, this);
        this.form.datepicker.form.yearcombo.addEventHandler("onitemchanged", this._yearcombo_onitemchanged, this);
        this.form.datepicker.form.monthcombo.addEventHandler("onitemchanged", this._monthcombo_onitemchanged, this);
        this.form.datepicker.form.datepickergrid.addEventHandler("oncellclick", this._datepickergrid_oncellclick, this);
        this.form.datepicker.form.prevbutton2.addEventHandler("onclick", this._prevbutton2_onclick, this);
        this.form.datepicker.form.nextbutton2.addEventHandler("onclick", this._nextbutton2_onclick, this);
        this.form.datepicker.form.yearedit2.addEventHandler("oneditclick", this._yearedit2_oneditclick, this);
        this.form.datepicker.form.monthedit2.addEventHandler("oneditclick", this._monthedit2_oneditclick, this);
        this.form.datepicker.form.yearcombo2.addEventHandler("onitemchanged", this._yearcombo2_onitemchanged, this);
        this.form.datepicker.form.monthcombo2.addEventHandler("onitemchanged", this._monthcombo2_onitemchanged, this);
        this.form.datepicker.form.datepickergrid2.addEventHandler("oncellclick", this._datepickergrid2_oncellclick, this);
        this.form.datepicker.form.okbutton.addEventHandler("onclick", this._okbutton_onclick, this);
    };

    _pCalendarWeekDouble.on_created_contents = function(win)
    {
        this.form.on_created(win);
    };

    //===============================================================
    // nexacro.CalendarWeekSingle : Properties
    //===============================================================
    _pCalendarWeekDouble.set_value = function(v)
    {
        this.form.calendaredit.set_value(v);
    };

    //===============================================================
    // nexacro.CalendarWeekSingle : Methods
    //===============================================================
    _pCalendarWeekDouble.getStartDate = function()
    {
        return this.form.startcalendaredit.value;
    };
    
    _pCalendarWeekDouble.getEndDate = function()
    {
        return this.form.endcalendaredit.value;
    };

    _pCalendarWeekDouble.getStartWeek = function()
    {
        return this.form.startcalendaredit.userdata;
    };
    
    _pCalendarWeekDouble.getEndWeek = function()
    {
        return this.form.endcalendaredit.userdata;
    };

    _pCalendarWeekDouble.setStartDate = function(v)
    {
        this.form.startcalendaredit.set_value(v);
        this.form.startcalendaredit.userdata = this.dateToWeek(v);
    };

    _pCalendarWeekDouble.setEndDate = function(v)
    {
        this.form.endcalendaredit.set_value(v);
        this.form.endcalendaredit.userdata = this.dateToWeek(v);
    };

    _pCalendarWeekDouble.calculateWeek = function(year, month, day)
    {
        var a = Math.floor((14 - month) / 12);
        var y = year + 4800 - a;
        var m = month + 12 * a - 3;
        var b = Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
        var J = day + Math.floor((153 * m + 2) / 5) + 365 * y + b - 32045;
        var d4 = (((J + 31741 - (J % 7)) % 146097) % 36524) % 1461;
        var L = Math.floor(parseInt(d4) / 1460);
        var d1 = ((d4 - L) % 365) + L;

        week = Math.floor(d1 / 7) + 1;

        return week;
    };

    _pCalendarWeekDouble.dateToWeek = function(v)
    {
        var year = nexacro.toNumber(v.substr(0, 4));
        var month = nexacro.toNumber(v.substr(4, 2));
        var day = nexacro.toNumber(v.substr(6, 2));

        var week = this.calculateWeek(year, month, day);

        if ((month == 1) && (week > 50))
        {
            year--;
        }
        else if ((month == 12) && (week < 2))
        {
            year++;
        }

        return year.toString() + week.toString().padLeft(2, '0');
    };

    _pCalendarWeekDouble.getCurDate = function()
    {
        var dt = new Date();
        return new String(dt.getFullYear()) + new String(dt.getMonth() + 1).padLeft(2, '0') + new String(dt.getDate()).padLeft(2, '0');
    };

    _pCalendarWeekDouble.showCalendarData = function(sYear, sMonth, sDay, bCmbProc, bType)
    {
        this.form.calendardataset.clearData();

        var sDate = sYear + sMonth + sDay;

        if (sDate == "000")
        {
            var sToday = this.getCurDate();
            sYear = sToday.substr(0, 4);
            sMonth = sToday.substr(4, 2);
            sDay = sToday.substr(6, 2);
            sDate = sYear + sMonth + sDay;
        }

        this.intThisYear = parseInt(sYear);
        this.intThisMonth = parseInt(sMonth);
        this.intThisDay = parseInt(sDay);

        if (bType)
        {
            this.pYear = this.intThisYear;
            this.pMonth = this.intThisMonth;
            this.pDay = this.intThisDay;
        }

        if (bCmbProc)
        {
            this.form.datepicker.form.yearcombo.set_value(this.intThisYear);
            this.form.datepicker.form.monthcombo.set_index(this.intThisMonth - 1);

            this.form.datepicker.form.yearedit.set_value(this.intThisYear);
            this.form.datepicker.form.monthedit.set_value(this.intThisMonth);
        }

        switch (this.intThisMonth)
        {
            case 1:
                this.intPrevYear = this.intThisYear - 1;
                this.intPrevMonth = 12;
                this.intNextYear = this.intThisYear;
                this.intNextMonth = 2;
                break;
            case 12:
                this.intPrevYear = this.intThisYear;
                this.intPrevMonth = 11;
                this.intNextYear = this.intThisYear + 1;
                this.intNextMonth = 1;
                break;
            default:
                this.intPrevYear = this.intThisYear;
                this.intPrevMonth = parseInt(this.intThisMonth) - 1;
                this.intNextYear = this.intThisYear;
                this.intNextMonth = parseInt(this.intThisMonth) + 1;
                break;
        }

        var d = new Date();
        d.setFullYear(parseInt(sYear), parseInt(sMonth) - 1, 1);
        d.setHours(0, 0, 0);
        d.setMilliseconds(0);

        var seq = d.getDay();
        var stopFlag = 0;

        // 4년마다 1번이면 (사로나누어 떨어지면)
        if ((this.intThisYear % 4) == 0)
        {
            if ((this.intThisYear % 100) == 0)
            {
                if ((this.intThisYear % 400) == 0)
                {
                    this.lastDays[this.intPrevMonth] = "29";
                }
                else
                    this.lastDays[1] = "28";
            }
            else
            {
                this.lastDays[1] = "29";
            }
        }
        else
        {
            this.lastDays[1] = "28";
        }

        var preStartDay = parseInt(this.lastDays[this.intPrevMonth - 1]);

        if (this.intThisDay > parseInt(this.lastDays[this.intThisMonth - 1]))
            this.intThisDay = this.lastDays[this.intThisMonth - 1];

        var i, j;
        var Day = 1;
        var ColSel;
        var RowSel;
        var lastDay = 0;
        var PreDay;

        //일요일 일경우 7로 셋팅
        if (seq == 0) seq = 7;

        //오늘일자
        var today = this.getCurDate();
        var nYear = parseInt(today.substr(0, 4));
        var nMonth = parseInt(today.substr(4, 2));
        var nDay = parseInt(today.substr(6, 2));

        for (i = 0; i < 6; i++)
        {
            if (stopFlag == 0)
            {
                this.form.calendardataset.addRow();
                this.form.calendardataset.setColumn(this.form.calendardataset.rowposition, "d0", this.calculateWeek(this.intThisYear, this.intThisMonth, Day));
                this.form.calendardataset.setColumn(this.form.calendardataset.rowposition, "css0", "CalendarWeekWeekColor");
            }
            for (j = 1; j < 8; j++)
            {
                if (stopFlag == 1)
                {
                    this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekGrayColor");
                    this.form.calendardataset.setColumn(i, "d" + (j), lastDay);
                }
                else
                {
                    if (i == 0)
                    {
                        if (seq <= j)
                        {
                            if (j == 7) //일요일
                                this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSunColor");
                            else if (j == 6) //토요일
                                this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSatColor");
                            else
                                this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekDayColor");

                            //오늘일자 표시
                            if (nYear == this.form.datepicker.form.yearcombo.value && nMonth == this.form.datepicker.form.monthcombo.value && nDay == Day)
                                this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekTodayColor");

                            if (this.pYear == this.intThisYear && this.pMonth == this.intThisMonth && this.pDay == Day)
                                this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSelectColor");
                            else
                                this.form.calendardataset.setColumn(i, "css" + (j), null);

                            this.form.calendardataset.setColumn(i, "d" + (j), Day);

                            Day++;
                        }
                        else
                        {
                            preDay = preStartDay - (seq - j - 1);
                            this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekGrayColor");
                            this.form.calendardataset.setColumn(i, "d" + (j), preDay);
                        }
                    }
                    else
                    {
                        if (j == 7) //일요일
                            this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSunColor");
                        else if (j == 6) //토요일
                            this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSatColor");
                        else
                            this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekDayColor");

                        //오늘일자 표시
                        if (nYear == this.form.datepicker.form.yearcombo.value && nMonth == this.form.datepicker.form.monthcombo.value && nDay == Day)
                            this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSunColor");
                        if (this.pYear == this.intThisYear && this.pMonth == this.intThisMonth && this.pDay == Day)
                            this.form.calendardataset.setColumn(i, "css" + (j), "CalendarWeekSelectColor");
                        else
                            this.form.calendardataset.setColumn(i, "css" + (j), null);

                        this.form.calendardataset.setColumn(i, "d" + (j), Day);
                        Day++;
                    }
                }

                if (parseInt(this.lastDays[this.intThisMonth - 1]) < Day)
                {
                    stopFlag = 1;
                    lastDay++;
                }
            }
        }
    };

    _pCalendarWeekDouble.showCalendarData2 = function(sYear, sMonth, sDay, bCmbProc, bType)
    {
        this.form.calendardataset2.clearData();

        var sDate = sYear + sMonth + sDay;

        if (sDate == "000")
        {
            var sToday = this.getCurDate();
            sYear = sToday.substr(0, 4);
            sMonth = sToday.substr(4, 2);
            sDay = sToday.substr(6, 2);
            sDate = sYear + sMonth + sDay;
        }

        this.intThisYear2 = parseInt(sYear);
        this.intThisMonth2 = parseInt(sMonth);
        this.intThisDay2 = parseInt(sDay);

        if (bType)
        {
            this.pYear2 = this.intThisYear2;
            this.pMonth2 = this.intThisMonth2;
            this.pDay2 = this.intThisDay2;
        }

        if (bCmbProc)
        {
            this.form.datepicker.form.yearcombo2.set_value(this.intThisYear2);
            this.form.datepicker.form.monthcombo2.set_index(this.intThisMonth2 - 1);

            this.form.datepicker.form.yearedit2.set_value(this.intThisYear2);
            this.form.datepicker.form.monthedit2.set_value(this.intThisMonth2);
        }

        switch (this.intThisMonth2)
        {
            case 1:
                this.intPrevYear2 = this.intThisYear2 - 1;
                this.intPrevMonth2 = 12;
                this.intNextYear2 = this.intThisYear2;
                this.intNextMonth2 = 2;
                break;
            case 12:
                this.intPrevYear2 = this.intThisYear2;
                this.intPrevMonth2 = 11;
                this.intNextYear2 = this.intThisYear2 + 1;
                this.intNextMonth2 = 1;
                break;
            default:
                this.intPrevYear2 = this.intThisYear2;
                this.intPrevMonth2 = parseInt(this.intThisMonth2) - 1;
                this.intNextYear2 = this.intThisYear2;
                this.intNextMonth2 = parseInt(this.intThisMonth2) + 1;
                break;
        }

        var d = new Date();
        d.setFullYear(parseInt(sYear), parseInt(sMonth) - 1, 1);
        d.setHours(0, 0, 0);
        d.setMilliseconds(0);

        var seq = d.getDay();
        var stopFlag = 0;

        // 4년마다 1번이면 (사로나누어 떨어지면)
        if ((this.intThisYear2 % 4) == 0)
        {
            if ((this.intThisYear2 % 100) == 0)
            {
                if ((this.intThisYear2 % 400) == 0)
                {
                    this.lastDays[this.intPrevMonth2] = "29";
                }
                else
                    this.lastDays[1] = "28";
            }
            else
            {
                this.lastDays[1] = "29";
            }
        }
        else
        {
            this.lastDays[1] = "28";
        }

        var preStartDay = parseInt(this.lastDays[this.intPrevMonth2 - 1]);

        if (this.intThisDay > parseInt(this.lastDays[this.intThisMonth2 - 1]))
            this.intThisDay = this.lastDays[this.intThisMonth2 - 1];

        var i, j;
        var Day = 1;
        var ColSel;
        var RowSel;
        var lastDay = 0;
        var PreDay;

        //일요일 일경우 7로 셋팅
        if (seq == 0) seq = 7;

        //오늘일자
        var today = this.getCurDate();
        var nYear = parseInt(today.substr(0, 4));
        var nMonth = parseInt(today.substr(4, 2));
        var nDay = parseInt(today.substr(6, 2));

        for (i = 0; i < 6; i++)
        {
            if (stopFlag == 0)
            {
                this.form.calendardataset2.addRow();
                this.form.calendardataset2.setColumn(this.form.calendardataset2.rowposition, "d0", this.calculateWeek(this.intThisYear2, this.intThisMonth2, Day));
                this.form.calendardataset2.setColumn(this.form.calendardataset2.rowposition, "css0", "CalendarWeekWeekColor");
            }
            for (j = 1; j < 8; j++)
            {
                if (stopFlag == 1)
                {
                    this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekGrayColor");
                    this.form.calendardataset2.setColumn(i, "d" + (j), lastDay);
                }
                else
                {
                    if (i == 0)
                    {
                        if (seq <= j)
                        {
                            if (j == 7) //일요일
                                this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSunColor");
                            else if (j == 6) //토요일
                                this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSatColor");
                            else
                                this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekDayColor");

                            //오늘일자 표시
                            if (nYear == this.form.datepicker.form.yearcombo2.value && nMonth == this.form.datepicker.form.monthcombo2.value && nDay == Day)
                                this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekTodayColor");

                            if (this.pYear2 == this.intThisYear2 && this.pMonth2 == this.intThisMonth2 && this.pDay2 == Day)
                                this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSelectColor");
                            else
                                this.form.calendardataset2.setColumn(i, "css" + (j), null);

                            this.form.calendardataset2.setColumn(i, "d" + (j), Day);

                            Day++;
                        }
                        else
                        {
                            preDay = preStartDay - (seq - j - 1);
                            this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekGrayColor");
                            this.form.calendardataset2.setColumn(i, "d" + (j), preDay);
                        }
                    }
                    else
                    {
                        if (j == 7) //일요일
                            this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSunColor");
                        else if (j == 6) //토요일
                            this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSatColor");
                        else
                            this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekDayColor");

                        //오늘일자 표시
                        if (nYear == this.form.datepicker.form.yearcombo2.value && nMonth == this.form.datepicker.form.monthcombo2.value && nDay == Day)
                            this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSunColor");
                        
                        if (this.pYear2 == this.intThisYear2 && this.pMonth2 == this.intThisMonth2 && this.pDay2 == Day)
                            this.form.calendardataset2.setColumn(i, "css" + (j), "CalendarWeekSelectColor");
                        else
                            this.form.calendardataset2.setColumn(i, "css" + (j), null);

                        this.form.calendardataset2.setColumn(i, "d" + (j), Day);
                        Day++;
                    }
                }

                if (parseInt(this.lastDays[this.intThisMonth2 - 1]) < Day)
                {
                    stopFlag = 1;
                    lastDay++;
                }
            }
        }
    };

    //===============================================================
    // nexacro.CalendarWeekSingle : Events
    //===============================================================
    _pCalendarWeekDouble._calendaredit_onchanged = function(obj, e)
    {
        obj.userdata = this.dateToWeek(e.postvalue.toString());
        this.on_fire_onchanged();
    };

    _pCalendarWeekDouble._dropbutton_onclick = function(obj, e)
    {
        this.orgDate = this.form.startcalendaredit.value;
        this.orgDate2 = this.form.endcalendaredit.value;

        this.form.datepicker.trackPopupByComponent(this.form.enddatestatic, 0, this.form.enddatestatic.getOffsetHeight() + 3);
    };

    _pCalendarWeekDouble._datepicker_onpopup = function(obj, e)
    {
        var nRow;
        if (this.form.yeardataset.rowcount < 1)
        {
            for (var i = 1900; i < 2049; i++)
            {
                nRow = this.form.yeardataset.addRow();
                this.form.yeardataset.setColumn(nRow, "year", i);
            }

        }
        var pDate;
        if (this.form.startcalendaredit.value == undefined || this.form.startcalendaredit.value == null)
        {
            pDate = this.getCurDate();
        }
        else
        {
            pDate = this.form.startcalendaredit.value.toString();
        }

        if (pDate == null || pDate == "" || pDate.length < 1)
        {
            pDate = this.getCurDate();
        }
        var sYear = pDate.substr(0, 4);
        var sMonth = pDate.substr(4, 2);
        var sDay = pDate.substr(6, 2);

        this.form.datepicker.form.yearcombo.set_value(sYear);
        this.form.datepicker.form.monthcombo.set_value(sMonth);

        this.showCalendarData(sYear, sMonth, sDay, true, true);

        var pDate;
        if (this.form.endcalendaredit.value == undefined || this.form.endcalendaredit.value == null)
        {
            pDate = this.getCurDate();
        }
        else
        {
            pDate = this.form.endcalendaredit.value.toString();
        }

        if (pDate == null || pDate == "" || pDate.length < 1)
        {
            pDate = this.getCurDate();
        }
        var sYear = pDate.substr(0, 4);
        var sMonth = pDate.substr(4, 2);
        var sDay = pDate.substr(6, 2);

        this.form.datepicker.form.yearcombo2.set_value(sYear);
        this.form.datepicker.form.monthcombo2.set_value(sMonth);

        this.showCalendarData2(sYear, sMonth, sDay, true, true);
    };

    _pCalendarWeekDouble._datepicker_oncloseup = function(obj, e)
    {
    	if (this.orgDate != this.form.startcalendaredit.value && this.orgDate2 != this.form.endcalendaredit.value)
        {
            this.on_fire_onchanged();
        }
    };

    _pCalendarWeekDouble._prevbutton_onclick = function(obj, e)
    {
        if (this.form.datepicker.form.monthcombo.index == 0)
        {
            this.form.datepicker.form.monthcombo.set_index(this.form.datepicker.form.monthcombo.getCount() - 1);
            if (this.form.datepicker.form.yearcombo.index > 0)
            {
                this.form.datepicker.form.yearcombo.set_index(this.form.datepicker.form.yearcombo.index - 1);
            }
        }
        else
        {
            this.form.datepicker.form.monthcombo.set_index(this.form.datepicker.form.monthcombo.index - 1);
        }
        this.showCalendarData(this.form.datepicker.form.yearcombo.value, this.form.datepicker.form.monthcombo.value.padLeft(2, '0'), this.intThisDay, true);
    };

    _pCalendarWeekDouble._nextbutton_onclick = function(obj, e)
    {
        if (this.form.datepicker.form.monthcombo.index >= (this.form.datepicker.form.monthcombo.getCount() - 1))
        {
            this.form.datepicker.form.monthcombo.set_index(0);
            if (this.form.datepicker.form.yearcombo.index < (this.form.datepicker.form.yearcombo.getCount() - 1))
            {
                this.form.datepicker.form.yearcombo.set_index(this.form.datepicker.form.yearcombo.index + 1);
            }
        }
        else
        {
            this.form.datepicker.form.monthcombo.set_index(this.form.datepicker.form.monthcombo.index + 1);
        }
        this.showCalendarData(this.form.datepicker.form.yearcombo.value, this.form.datepicker.form.monthcombo.value.padLeft(2, '0'), this.intThisDay, true);
    };

    _pCalendarWeekDouble._yearedit_oneditclick = function(obj, e)
    {
        this.form.datepicker.form.yearcombo.dropdown();
    };

    _pCalendarWeekDouble._monthedit_oneditclick = function(obj, e)
    {
        this.form.datepicker.form.monthcombo.dropdown();
    };

    _pCalendarWeekDouble._yearcombo_onitemchanged = function(obj, e)
    {
        this.form.calendardataset.clearData();
        this.showCalendarData(e.postvalue, this.intThisMonth.toString().padLeft(2, '0'), this.intThisDay, true);
    };

    _pCalendarWeekDouble._monthcombo_onitemchanged = function(obj, e)
    {
        this.form.calendardataset.clearData();
        this.showCalendarData(this.intThisYear.toString(), e.postvalue.padLeft(2, '0'), this.intThisDay, true);
    };

    _pCalendarWeekDouble._datepickergrid_oncellclick = function(obj, e)
    {
        if (e.cell == 0) return false; //주차클릭시 리턴

        var retval = "";
        if (this.form.calendardataset.getColumn(e.row, "css" + (e.cell)) == "CalendarWeekGrayColor")
        {
            if (e.row == 0)
            {
                retval = this.intPrevYear.toString() + this.intPrevMonth.toString().padLeft(2, '0') + this.form.calendardataset.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
            }
            else
            {
                retval = this.intNextYear.toString() + this.intNextMonth.toString().padLeft(2, '0') + this.form.calendardataset.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
            }
        }
        else
        {
            retval = this.intThisYear.toString() + this.intThisMonth.toString().padLeft(2, '0') + this.form.calendardataset.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');

        }
        this.form.startcalendaredit.set_value(retval);
        this.form.startcalendaredit.userdata = this.dateToWeek(retval);
    };

    _pCalendarWeekDouble._prevbutton2_onclick = function(obj, e)
    {
        if (this.form.datepicker.form.monthcombo2.index == 0)
        {
            this.form.datepicker.form.monthcombo2.set_index(this.form.datepicker.form.monthcombo2.getCount() - 1);
            if (this.form.datepicker.form.yearcombo2.index > 0)
            {
                this.form.datepicker.form.yearcombo2.set_index(this.form.datepicker.form.yearcombo2.index - 1);
            }
        }
        else
        {
            this.form.datepicker.form.monthcombo2.set_index(this.form.datepicker.form.monthcombo2.index - 1);
        }
        this.showCalendarData2(this.form.datepicker.form.yearcombo2.value, this.form.datepicker.form.monthcombo2.value.padLeft(2, '0'), this.intThisDay2, true);
    };

    _pCalendarWeekDouble._nextbutton2_onclick = function(obj, e)
    {
        if (this.form.datepicker.form.monthcombo2.index >= (this.form.datepicker.form.monthcombo2.getCount() - 1))
        {
            this.form.datepicker.form.monthcombo2.set_index(0);
            if (this.form.datepicker.form.yearcombo2.index < (this.form.datepicker.form.yearcombo2.getCount() - 1))
            {
                this.form.datepicker.form.yearcombo2.set_index(this.form.datepicker.form.yearcombo2.index + 1);
            }
        }
        else
        {
            this.form.datepicker.form.monthcombo2.set_index(this.form.datepicker.form.monthcombo2.index + 1);
        }
        this.showCalendarData2(this.form.datepicker.form.yearcombo2.value, this.form.datepicker.form.monthcombo2.value.padLeft(2, '0'), this.intThisDay2, true);
    };

    _pCalendarWeekDouble._yearedit2_oneditclick = function(obj, e)
    {
        this.form.datepicker.form.yearcombo2.dropdown();
    };

    _pCalendarWeekDouble._monthedit2_oneditclick = function(obj, e)
    {
        this.form.datepicker.form.monthcombo2.dropdown();
    };

    _pCalendarWeekDouble._yearcombo2_onitemchanged = function(obj, e)
    {
        this.form.calendardataset2.clearData();
        this.showCalendarData2(e.postvalue, this.intThisMonth2.toString().padLeft(2, '0'), this.intThisDay2, true);
    };

    _pCalendarWeekDouble._monthcombo2_onitemchanged = function(obj, e)
    {
        this.form.calendardataset2.clearData();
        this.showCalendarData2(this.intThisYear2.toString(), e.postvalue.padLeft(2, '0'), this.intThisDay2, true);
    };

    _pCalendarWeekDouble._datepickergrid2_oncellclick = function(obj, e)
    {
        if (e.cell == 0) return false; //주차클릭시 리턴

        var retval = "";
        if (this.form.calendardataset2.getColumn(e.row, "css" + (e.cell)) == "CalendarWeekGrayColor")
        {
            if (e.row == 0)
            {
                retval = this.intPrevYear2.toString() + this.intPrevMonth2.toString().padLeft(2, '0') + this.form.calendardataset2.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
            }
            else
            {
                retval = this.intNextYear2.toString() + this.intNextMonth2.toString().padLeft(2, '0') + this.form.calendardataset2.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
            }
        }
        else
        {
            retval = this.intThisYear2.toString() + this.intThisMonth2.toString().padLeft(2, '0') + this.form.calendardataset2.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');

        }
        this.form.endcalendaredit.set_value(retval);
        this.form.endcalendaredit.userdata = this.dateToWeek(retval);
    };

    _pCalendarWeekDouble._okbutton_onclick = function(obj, e)
    {
        this.form.datepicker.closePopup();
    };

    _pCalendarWeekDouble.on_fire_onchanged = function()
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var pretext = {
                startdate: this.orgDate,
                enddate: this.orgDate2
            };
            var prevalue = {
                startdate: this.orgDate,
                enddate: this.orgDate2
            };
            var posttext = {
                startdate: this.form.startcalendaredit.text,
                enddate: this.form.endcalendaredit.text
            };
            var postvalue = {
                startdate: this.form.startcalendaredit.value,
                enddate: this.form.endcalendaredit.value
            };
            var evt = new nexacro.ChangedEventInfo(this, "onchanged", pretext, prevalue, posttext, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    delete _pCalendarWeekDouble;
    _pCalendarWeekDouble = null;
}