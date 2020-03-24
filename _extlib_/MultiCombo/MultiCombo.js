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
// Object : nexacro.MultiCombo
// Group : Component
//==============================================================================
if (!nexacro.MultiCombo)
{
    //==============================================================================
    // nexacro.MultiCombo
    //==============================================================================
    nexacro.MultiCombo = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Div.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiCombo = nexacro._createPrototype(nexacro.Div, nexacro.MultiCombo);
    nexacro.MultiCombo.prototype = _pMultiCombo;
    _pMultiCombo._type_name = "MultiCombo";

    /* internal variable */
    _pMultiCombo.innerdataset = "";
    _pMultiCombo._innerdataset = "";
    _pMultiCombo.codecolumn = "";
    _pMultiCombo.datacolumn = "";
    _pMultiCombo.listcolinfo = "";
    _pMultiCombo.popupwidth = 250;
    _pMultiCombo.popupheight = 146;
    _pMultiCombo.orgText = "";
    _pMultiCombo.orgValue = "";

    /* event list */
    _pMultiCombo._event_list["onitemchanged"] = 1;

    /* accessibility */
    _pMultiCombo.accessibilityrole = "button";

    //===============================================================
    // nexacro.MultiCombo : Create & Destroy & Update
    //===============================================================
    _pMultiCombo.on_create_contents = function()
    {
        nexacro.Div.prototype.on_create_contents.call(this);

        var obj = null;
        obj = new nexacro.Dataset("combodataset");
        obj.addColumn("rowchk", "int", 4);
        obj.set_updatecontrol(false);
        this.addChild("combodataset", obj);

        obj = new nexacro.Edit("comboedit", 0, 0, null, null, 0, 0, null, null, null, null);
        obj.set_readonly("true");
        obj.set_value("");
        obj.set_cssclass("MultiComboEdit");
		obj.set_border("1px solid rgba(156,156,156,1)");
        this.form.addChild("comboedit", obj);

        obj = new nexacro.Button("dropbutton", null, 0, 28, null, 0, 0, null, null, null, null); 
        obj.set_cssclass("btn_WF_multiCombo");
        this.form.addChild("dropbutton", obj);

        obj = new nexacro.PopupDiv("combolistpopupdiv", 0, 28, null, 146, 0, null, null, null, null, null);
        obj.form.set_scrollbartype("none");
		obj.form.set_background("#b8cef1");
		obj.form.set_border("1px solid rgba(156,156,156,1)");
        this.addChild("combolistpopupdiv", obj);

        obj = new nexacro.CheckBox("allcheckbox", 10, 1, 60, 32, null, null, null, null, null, null);
        obj.set_text("ALL");
        this.form.combolistpopupdiv.addChild("allcheckbox", obj);

        obj = new nexacro.Button("okbutton", null, 4, 39, 28, 58, null, null, null, null, null);
        obj.set_text("OK");
        this.form.combolistpopupdiv.addChild("okbutton", obj);

        obj = new nexacro.Button("cancelbutton", null, 4, 49, 28, 4, null, null, null, null, null);
        obj.set_text("Cancel");
        this.form.combolistpopupdiv.addChild("cancelbutton", obj);

        obj = new nexacro.Grid("combolistgrid", 0, 36, null, null, 0, 0, null, null, null, null);
        obj.set_autofittype("col");
        //obj.set_selecttype("cell");
        obj.set_useselcolor(false);
        //obj.set_scrollbartype("none");

        var strFormat = '<Formats>' +
            '<Format id="default">' +
            '  <Columns>' +
            '    <Column size="36" band="left" />' +
            '  </Columns>' +
            '  <Rows>' +
            '    <Row size="36" />' +
            '  </Rows>' +
            '  <Band id="body">' +
            '    <Cell displaytype="checkboxcontrol" edittype="checkbox" text="bind:rowchk" textAlign="center"/>' +
            '  </Band>' +
            '</Format>' +
            '</Formats>';

        obj.set_formats(strFormat);
        obj.set_binddataset("combodataset");
        obj.set_border("0px none #808080");
		
        this.form.combolistpopupdiv.addChild("combolistgrid", obj);

        this.form.set_scrollbartype("none");

        this.form.comboedit.createComponent();
        this.form.dropbutton.createComponent();
        this.form.combolistpopupdiv.createComponent();

        this.form.comboedit.addEventHandler("oneditclick", this._comboedit_oneditclick, this);
        this.form.dropbutton.addEventHandler("onclick", this._dropbutton_onclick, this);
        this.form.combolistpopupdiv.form.allcheckbox.addEventHandler("onclick", this._allcheckbox_onclick, this);
        this.form.combolistpopupdiv.form.okbutton.addEventHandler("onclick", this._okbutton_onclick, this);
        this.form.combolistpopupdiv.form.cancelbutton.addEventHandler("onclick", this._cancelbutton_onclick, this);
    };

    _pMultiCombo.on_created_contents = function(win)
    {
        this.form.on_created(win);

        this.on_apply_innerdataset(this._innerdataset);
        this.on_apply_listcolinfo(this.listcolinfo);
    };

    _pMultiCombo.on_create_contents_command = function(win)
    {
        this.on_apply_innerdataset(this._innerdataset);
        this.on_apply_listcolinfo(this.listcolinfo);
    };

    //===============================================================
    // nexacro.MultiCombo : Properties
    //===============================================================
    _pMultiCombo.set_innerdataset = function(v)
    {
        if (typeof v != "string")
        {
            this.setInnerDataset(v);
            return;
        }

        if (this.innerdataset != v)
        {
            if (!v)
            {
                this._innerdataset = null;
                this.innerdataset = "";
                this.form.combodataset.clear();
            }
            else
            {
                v = v.replace("@", "");
                this._innerdataset = this._findDataset(v);
                this.innerdataset = v;
            }
            this.on_apply_innerdataset(this._innerdataset);
        }
        else if (this.innerdataset && !this._innerdataset)
        {
            this._setInnerDatasetStr(this.innerdataset);
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pMultiCombo.on_apply_innerdataset = function(ds)
    {
        this.copyDataset(ds);
    };
    _pMultiCombo.set_codecolumn = function(v)
    {
        this.codecolumn = v;
    };
    _pMultiCombo.set_datacolumn = function(v)
    {
        this.datacolumn = v;
    };
    _pMultiCombo.set_listcolinfo = function(v)
    {
        this.listcolinfo = v;
        this.on_apply_listcolinfo(v);
    };
    _pMultiCombo.on_apply_listcolinfo = function(v)
    {
        this.setGridColumn(v);
    };
    _pMultiCombo.set_popupwidth = function(v)
    {
        this.popupwidth = v;
    };
    _pMultiCombo.set_popupheight = function(v)
    {
        this.popupheight = v;
    };

    //===============================================================
    // nexacro.MultiCombo : Methods
    //===============================================================
    _pMultiCombo.setInnerDataset = function(obj)
    {
        if (!obj)
        {
            this._innerdataset = null;
            this.innerdataset = "";
            this.on_apply_innerdataset(null);
            this.form.combodataset.clear();
        }
        else if (obj instanceof nexacro.Dataset || (typeof obj == "object" && obj._type_name == "Dataset"))
        {
            this._innerdataset = obj;
            this.innerdataset = obj.id;
            this.on_apply_innerdataset(obj);
        }
    };

    _pMultiCombo._setInnerDatasetStr = function(str)
    {
        if (str)
        {
            str = str.replace("@", "");
            this._innerdataset = this._findDataset(str);
            this.innerdataset = str;
        }
        else
        {
            this._innerdataset = null;
            this.innerdataset = "";
            this.form.combodataset.clear();
        }
    };

    _pMultiCombo.copyDataset = function(ds)
    {
        if (this.form.combodataset)
        {
            this.form.combodataset.copyData(ds);

            if (this.form.combodataset.getColumnInfo("rowchk") == null)
            {
                this.form.combodataset.addColumn("rowchk", "int", 4);
            }

            this.form.combodataset.set_enableevent(false);
            for (var i = 0, len = this.form.combodataset.rowcount; i < len; i++)
            {
                if (this.form.combodataset.getColumn(i, "rowchk") == null)
                {
                    this.form.combodataset.setColumn(i, "rowchk", 0);
                }
            }
            this.form.combodataset.set_enableevent(true);
        }
    };

    _pMultiCombo.getText = function()
    {
        return this.form.comboedit.value;
    };

    _pMultiCombo.getCode = function()
    {
        return this.form.comboedit.userdata;
    };

    _pMultiCombo.setCode = function(v)
    {
        this.form.comboedit.userdata = v;
    };

    _pMultiCombo.syncValue = function()
    {
        this.form.combolistpopupdiv.form.allcheckbox.set_value(0);

        this.form.combodataset.set_enableevent(false);
        for (var i = 0, len = this.form.combodataset.rowcount; i < len; i++)
        {
            this.form.combodataset.setColumn(i, "rowchk", 0);
        }
        this.form.combodataset.set_enableevent(true);

        var sCode = this.getCode();
        if (sCode == null || sCode == "")
        {
            return;
        }

        var arrCode = sCode.split("^");
        var iPos;
        this.form.combodataset.set_enableevent(false);
        for (var i = 0, len = arrCode.length; i < len; i++)
        {
            iPos = this.form.combodataset.findRow(this.codecolumn, arrCode[i]);
            if (iPos > -1)
            {
                this.form.combodataset.setColumn(iPos, "rowchk", 1);
            }
        }
        this.form.combodataset.set_enableevent(true);
    };

    _pMultiCombo.setGridColumn = function(v)
    {
        if (this.form.combolistpopupdiv)
        {
            var arrCellInfo;
            var arrCell;
            var iIndex;
            var objColinfo;
            var iCellCnt = 0;

            if ((v != null) && (v != ""))
            {
                arrCellInfo = v.split("^"); // "text|30^desc|50"
                for (var i = 0, len = arrCellInfo.length; i < len; i++)
                {
                    arrCell = arrCellInfo[i].split("|"); //  text|30
                    iIndex = this.form.combolistpopupdiv.form.combolistgrid.appendContentsCol("body", false);
                    this.form.combolistpopupdiv.form.combolistgrid.setFormatColProperty(iIndex, "size", arrCell[1]);
                    this.form.combolistpopupdiv.form.combolistgrid.setCellProperty("body", iIndex, "text", "bind:" + arrCell[0]);
                    iCellCnt++;
                }
            }
            else
            {
                for (var i = 0, len = this.form.combodataset.getColCount(); i < len; i++)
                {
                    objColinfo = this.form.combodataset.getColumnInfo(i);
                    iIndex = this.form.combolistpopupdiv.form.combolistgrid.appendContentsCol("body", false);
                    this.form.combolistpopupdiv.form.combolistgrid.setCellProperty("body", iIndex, "text", "bind:" + objColinfo.name);
                    iCellCnt++;
                }
            }

            if (iCellCnt <= 1)
            {
                this.form.combolistpopupdiv.form.combolistgrid.setFormatColProperty(1, "size", this.popupwidth - 31);
            }
        }
    };

    _pMultiCombo.showComboList = function()
    {
        this.syncValue();

        var iLeft = 0;
        var iTop = this.form.comboedit.getOffsetHeight() + 2;

        //this.form.combolistpopupdiv.trackPopupByComponent(this.form.comboedit, iLeft, iTop, this.popupwidth, this.popupheight);
		this.form.combolistpopupdiv.trackPopupByComponent(this.form.comboedit, iLeft, iTop);
    };

    //===============================================================
    // nexacro.MultiCombo : Events
    //===============================================================
    _pMultiCombo._comboedit_oneditclick = function(obj, e)
    {
        this.showComboList();
    };

    _pMultiCombo._dropbutton_onclick = function(obj, e)
    {
        this.showComboList();
    };

    _pMultiCombo._allcheckbox_onclick = function(obj, e)
    {
        this.form.combodataset.set_enableevent(false);
        for (var i = 0, len = this.form.combodataset.rowcount; i < len; i++)
        {
            this.form.combodataset.setColumn(i, "rowchk", obj.value);
        }
        this.form.combodataset.set_enableevent(true);
    };

    _pMultiCombo._okbutton_onclick = function(obj, e)
    {
        var sCode = "";
        var sText = "";

        this.form.combolistpopupdiv.form.combolistgrid.set_enableredraw(false);
        this.form.combodataset.filter("rowchk==1");

        for (var i = 0, len = this.form.combodataset.rowcount; i < len; i++)
        {
            sCode += "^" + this.form.combodataset.getColumn(i, this.codecolumn);
            sText += "^" + this.form.combodataset.getColumn(i, this.datacolumn);
        }

        this.form.combodataset.filter("");
        this.form.combolistpopupdiv.form.combolistgrid.set_enableredraw(true);

        if (sCode.length > 0)
        {
            sCode = sCode.substr(1);
        }
        if (sText.length > 0)
        {
            sText = sText.substr(1);
        }

        this.orgText = this.form.comboedit.value;
        this.orgValue = this.form.comboedit.userdata;

        this.form.comboedit.set_value(sText);
        this.form.comboedit.userdata = sCode;

        this.on_fire_onitemchanged();

        this.form.combolistpopupdiv.closePopup();
    };

    _pMultiCombo._cancelbutton_onclick = function(obj, e)
    {
        this.form.combolistpopupdiv.closePopup();
    };

    _pMultiCombo.on_fire_onitemchanged = function()
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var preindex = -1;
            var pretext = this.orgText;
            var prevalue = this.orgValue;
            var postindex = -1;
            var posttext = this.form.comboedit.value;
            var postvalue = this.form.comboedit.userdata;
            var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
            return this.onitemchanged._fireEvent(this, evt);
        }
    };

    delete _pMultiCombo;
    _pMultiCombo = null;
}