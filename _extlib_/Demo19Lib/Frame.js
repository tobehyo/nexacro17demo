/**
*  Presales Demo Project (2019)
*  @FileName 	Util.js 
*  @Creator 	Presales
*  @CreateDate 	2017.03.08
*  @Desction 	1) Frame 관련 공통 함수 모음
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2019.06.21     		Presales				최초 생성    
*******************************************************************************
*/

/*
 ===============================================================================
 == Frame과 onload 관련된 공통함수들은 여기에 작성한다.
 ===============================================================================
     ====MDI관련
 ● gfnOpenMenu                     	: 업무화면을 오픈한다.
 ● gfnCloseMenu                    	: 해당 메뉴를 닫아준다.
 
 ● gfnCreateMegaMenu					: 탑메뉴의 메가메뉴를 생성한다.
 ● gfnOpenMegaMenu						: 탑메뉴의 메가메뉴를 연다.
 ● gfnCloseMegaMenu					: 탑메뉴의 메가메뉴를 닫는다.
 
*/

var pForm  = nexacro.Form.prototype;

/**
 * gfnOpenMenu : 업무화면을 오픈한다.
 * @param {String} sMenuId - 메뉴 ID 또는 화면경로/명
 * @param {String} args - 화면에 넘겨줄 argument
 * @return {boolean}
 */
pForm.gfnOpenMenu = function(sMenuId, args, argsComp)
{
	var objApp = nexacro.getApplication();
	var gWorkFrameSet = objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Work;
	
	//frame구성 변경 
	if(objApp.mainframe.VFrameSet.separatesize != "0,64,*")
	{
		objApp.mainframe.VFrameSet.set_separatesize("0,64,*");
	}

	/*****************************************
	 * 메뉴검색
	*****************************************/
	var objMenuDs 	= objApp.gdsMenu;
	var nRow  		= objMenuDs.findRow("MENU_ID", sMenuId);

	if(nRow < 0)
	{
		alert("warn.menuidnotexist");
		return false;
	}

	/*****************************************
	 * 화면 Open
	*****************************************/
	var objChildFrame = gWorkFrameSet[sMenuId];//해당 메뉴화면의 FrameSet이 존재하는지 확인

	//mdi 구조 전체화면을 기준으로 해준다.
	var nLength = gWorkFrameSet.frames.length;
	for(var i = 0; i < nLength ; i++)
	{
		gWorkFrameSet.frames[i].set_showtitlebar(false);
		gWorkFrameSet.getActiveFrame().set_openstatus("maximize");	
	}
	
	//해당 메뉴가 open 되어있으면 포커스를 주고, 아니면 새로 chileframe을 생성한다.
	if(!this.gfnIsNull(objChildFrame))
	{
		//해당 메뉴 화면에 focus를 준다. - active 이벤트를 받은 화면에서 tab에 포커스를 준다.
		objChildFrame.setFocus();
		
		//수정한 날짜 : 2019.10.30 
		//param{args}  : GA 연동인자값으로 사용하기 위함.
		
		//넘겨주는 파라미터가 있으면 fn_postOnLoad함수를 이용해 파라미터를 넘겨준다.
// 		if(!this.gfnIsNull(args))
// 		{
// 			objChildFrame.arguments["FORM_ARGS"] = args;
// 			try
// 			{
// 				objChildFrame.form.div_work.div_body.lookup("fn_postOnLoad").call(objChildFrame.form.div_work.div_body,args);
// 			}
// 			catch(e)
// 			{
// 				trace("fn_postOnLoad함수 호출에 실패했습니다.[" + e + "]");
// 			}
// 		}
	}
	else
	{
		//최대 갯수 10개 제한
		if(gWorkFrameSet.frames.length > 9)
		{
			alert("warn.menulimit");
			return false;
		}
		
		/* Tab 추가 */
		objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Tab.form.fnOpenTabMenu(sMenuId, objMenuDs.getColumn(nRow, "MENU_NM") );	
	
	
		//선택한 메뉴의 childFrame을 workFrameset에 addchild 한다.
		objChildFrame = new ChildFrame();
		objChildFrame.init(sMenuId, 0,0,1000,622, null,null,"frame::Work.xfdl");
		objChildFrame.set_showtitlebar(false);
		objChildFrame.set_resizable(true);
		objChildFrame.set_titletext(objMenuDs.getColumn(nRow, "MENU_NM"));
		
		objChildFrame.set_showcascadetitletext(false);
		objChildFrame.set_openstatus("maximize");

		//화면에 넘겨줄 인자값을 정의한다.
		objChildFrame.arguments = [];
		objChildFrame.arguments["MENU_ID"]  = sMenuId;
		objChildFrame.arguments["MENU_NM"]  = objMenuDs.getColumn(nRow, "MENU_NM");
		objChildFrame.arguments["MENU_URL"] = objMenuDs.getColumn(nRow, "MENU_URL");
		objChildFrame.arguments["FORM_ARGS"] = args;
		objChildFrame.arguments["FORM_ARGS_COMP"] = argsComp;
		objChildFrame.arguments["MENU_ROW"] = nRow;

		gWorkFrameSet.addChild(sMenuId,objChildFrame);
		objChildFrame.show();

		//해당 메뉴 화면에 focus를 준다.
		objChildFrame.setFocus();

			
		/* Google Analytics */
		try
		{
			if (system.navigatorname != "nexacro")
			{
				this.gfnCallGA(objMenuDs.getColumn(nRow, "MENU_NM"), args + "_Menu_Click", objMenuDs.getColumn(nRow, "MENU_URL"));
			}
		}
		catch(e)
		{
			trace("구글 어날리틱스 실패");
		}
		
		/*LeftFrame에 해당 메뉴 카테고리를 open 하고 포커스 준다.*/
		var pMenuId = objMenuDs.getColumn(nRow,"PARENT_MENU_ID");
		var divMenuDiv = objApp.mainframe.VFrameSet.HFrameSet.Left.form.divLeft.form.components["div"+pMenuId];
		var objTopMenuBtn = divMenuDiv.form.components["btn"+pMenuId];
		 
		if(!divMenuDiv._bOpened) objTopMenuBtn.click();
	}
	
	
	/**********
	**최근 열어본 메뉴에 추가
	***********/
	var objRecentDs = nexacro.getApplication().gdsRecent;
	var dupleRow = objRecentDs.findRow("MENU_ID", sMenuId);
	
	//중복은 삭제후 재 추가
	if( dupleRow > -1 )
	{
		objRecentDs.deleteRow(dupleRow);
	}
	objRecentDs.insertRow(0);
	objRecentDs.copyRow(0,objMenuDs,nRow);

	if(objRecentDs.rowcount > 4)
	{
		objRecentDs.deleteRow(5);
	}

	nexacro.setPrivateProfile("gdsRecent", objRecentDs.saveXML());
	
	/*****************************************
		* 메뉴열어본 이력 남기기 - 자주 열어본 화면
	*****************************************/
	//디비에 메뉴 이력남기기
	return true;
}



/**
 * gfnCloseMenu : 해당 메뉴를 닫아준다.
 * @param {string} sMenuId : 닫으려는 화면 MENU_ID
 * @return : N/A
 * @example :
 */
pForm.gfnCloseMenu= function(sMenuId)
{	
	var objApp = nexacro.getApplication();
	var gWorkFrameSet = objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Work;//열린 업무화면 arr
	
	//gfnCloseMenu가 중복 호출 되었을 때 return
	if(!gWorkFrameSet[sMenuId]) return;

	//화면(WorkFrame)을 삭제한다.
	var objChild = gWorkFrameSet.removeChild(sMenuId);
	objChild.destroy();
	objChild = null;
	
	//활성화 된 화면이 닫혔을 경우 다른 화면에 focus를 준다.
	if(this.gfnIsNull(gWorkFrameSet.frames[sMenuId]))
	{
		if( gWorkFrameSet.frames.length > 0 )
		{
			gWorkFrameSet.frames[0].setFocus();
			//gWorkFrameSet.getActiveFrame().set_openstatus("maximize");	//포커스 한번 잃으면서 깜빡임
		}
	}

	/*탭(TabFrame) 버튼 위치 재정렬*/
	var btnNm = "div" + sMenuId;//버튼 삭제하기 div + menuId
	objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Tab.form.divButtonList.form.removeChild(btnNm);
	objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Tab.form.fnRearrange();
	
	//모든 화면이 닫힌경우에 메인 화면으로 이동한다.
	if( gWorkFrameSet.length == 0 )
	{
		//objApp.mainframe.VFrameSet.set_separatesize("*, 0, 0");//메인, 탑, 업무
	}
}


/**
 * gfnCreateMegaMenu : 메가메뉴를 생성한다..
 * @param {object} oForm : popupdiv가 열릴 부모화면
 * @return : N/A
 * @example :
 */
pForm.gfnCreateMegaMenu = function(oForm)
{
	// Create Object  
	var objCompId = "pdivMegaMenu";
	var objPopupDiv = new PopupDiv();  
	
	objPopupDiv.init(objCompId, 0, 0, null, 560, 0);
	objPopupDiv.set_url("frame::MegaMenu.xfdl");
	objPopupDiv.addEventHandler("oncloseup", this._gfnMegaMenuOncloseup, this);
	// Add Object to Parent Form  
	this.addChild(objCompId, objPopupDiv); 
	 
	// Show Object  
	objPopupDiv.show(); 
}



/**
 * gfnOpenMegaMenu : 메가메뉴를 열어준다.
 * @param {object} oForm : popupdiv가 열리는 부모화면
 * @return : N/A
 * @example :
 */
pForm.gfnOpenMegaMenu = function(oForm)
{
	//대메뉴 오픈
	oForm.components["pdivMegaMenu"].trackPopupByComponent(oForm,0,0);
	
	/* 가장 첫번째 메뉴에 sta_WF_navTitle_S 로 포커스를 준다. */
	var menuId = "9999999";
	var staObj;
	
	for(var objSta in oForm.components["pdivMegaMenu"].form.components)
	{
		staObj = oForm.components["pdivMegaMenu"].form.components[objSta];
		if( String(staObj.name).indexOf("L_") == 0)
		{
			if( menuId > String(staObj.id).replace("L_sta", ""))
			{
				menuId = String(staObj.id).replace("L_sta", "");
			}
		}
	}
	
	oForm.components["pdivMegaMenu"].form.components["L_sta" + menuId].set_cssclass("sta_WF_navTitle_S");
}

/**
 * gfnCloseMegaMenu : 메가메뉴를 닫아준다.
 * @return : N/A
 * @example :
 */
pForm.gfnCloseMegaMenu = function()
{
	var objTarget = this;
	
	while(true)
	{
		if(objTarget instanceof PopupDiv)
		{
			objTarget.closePopup();
			break;
		}
		else
		{
			objTarget = objTarget.parent;
		}
	}
	
	return true;
}