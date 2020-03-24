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
*/

var pForm  = nexacro.Form.prototype;


/**
 * gfnOpenMenu : 업무화면을 오픈한다.
 * @param {String} sMenuId - 메뉴 ID 또는 화면경로/명
 * @param {String} args - 화면에 넘겨줄 argument
 * @return {boolean}
 */
pForm.gfnOpenMenu = function(sMenuId, args)
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
		alert("해당 메뉴 ID가 존재하지 않습니다.");
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

		//넘겨주는 파라미터가 있으면 fn_postOnLoad함수를 이용해 파라미터를 넘겨준다.
		if(!this.gfnIsNull(args))
		{
			objChildFrame.arguments["FORM_ARGS"] = args;
			try
			{
				objChildFrame.form.div_work.div_body.lookup("fn_postOnLoad").call(objChildFrame.form.div_work.div_body,args);
			}
			catch(e)
			{
				trace("fn_postOnLoad함수 호출에 실패했습니다.[" + e + "]");
			}
		}
	}
	else
	{
		//선택한 메뉴의 childFrame을 workFrameset에 addchild 한다.
		objChildFrame = new ChildFrame();
		objChildFrame.init(sMenuId, 0,0,0,0, null,null,"Frame::Work.xfdl");
		objChildFrame.set_showtitlebar(false);
		objChildFrame.set_resizable(true);
		
		objChildFrame.set_showcascadetitletext(false);
		objChildFrame.set_openstatus("maximize");

		//화면에 넘겨줄 인자값을 정의한다.
		objChildFrame.arguments = [];
		objChildFrame.arguments["MENU_ID"]  = sMenuId;
		objChildFrame.arguments["MENU_NM"]  = objMenuDs.getColumn(nRow, "MENU_NM");
		objChildFrame.arguments["MENU_URL"] = objMenuDs.getColumn(nRow, "MENU_URL");
		objChildFrame.arguments["FORM_ARGS"] = args;
		objChildFrame.arguments["MENU_ROW"] = nRow;

		gWorkFrameSet.addChild(sMenuId,objChildFrame);
		objChildFrame.show();

		//해당 메뉴 화면에 focus를 준다.
		objChildFrame.setFocus();

		/* Tab Page 추가 */
		objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Tab.form.fnOpenTabMenu(sMenuId, objMenuDs.getColumn(nRow, "MENU_NM") );
		
	}
	
	//LeftFrame에 해당 메뉴 카테고리를 open 하고 포커스 준다.
	//@Todo
	/*
	var objGrid = objApp.mainframe.VFrameSet.HFrameSet.Left.form.divLeft.form.grdLeftMenu;
	objGrid.setTreeStatus(objGrid.getTreeRow(objGrid.getTreeParentRow( nRow, true )), true);
	
	objMenuDs.set_rowposition(nRow);//그리듸 스크롤 이동
	*/
	
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
	var btnNm = "btn_" + sMenuId;//버튼 삭제하기 btn_menuId
	objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Tab.form.divButtonList.form.removeChild(btnNm);
	objApp.mainframe.VFrameSet.HFrameSet.VFrameSet00.Tab.form.fnRearrange();

	//모든 화면이 닫힌경우에 메인 화면으로 이동한다.
	if( gWorkFrameSet.length == 0 )
	{
		//objApp.mainframe.VFrameSet.set_separatesize("*, 0, 0");//메인, 탑, 업무
	}
}
