/**
 * @fileoverview 공통 전역 함수 모듈
 */
if (!JsNamespace.exist("nxlib"))
{
	/**
	 * JavaScript Library for nexacro Platform
	 * @namespace
	 * @name nxlib
	 * @memberof! <global>
	 */
	JsNamespace.declare("nxlib",
	{
		/**
         * 공통 트랜잭션 함수
         * @param {Form} form Form Object
         * @param {object} oData arguments
         * @param {string | function} callback callback 함수 또는 함수명
         * @return N/A
         * @example
         * var oDatas = {
         *    svcid: "searchList",
         *    url: "svcurl::searchList.do",
         *    inds: [
         *       "dsCond=dsCond"
         *    ],
         *    outds: [
         *       "dsUserInfo=dsUserInfo",
         *       "dsMessage=dsMessage",
         *       "dsConfig=dsUserInfo"
         *       ],
         *    args: [
         *        "arg1=abc",
         *        "arg2=test123"
         *    ],
         *    bAsync: true,
         *    nDataType: 0,
         *    bCompress:false,
         * };
         *
         * nxlib.transaction(this, oDatas, function() {
         *     //nexacro request callback function
         * });
         * @memberOf nxlib
         */
		transaction: function(form, oData, callback)
		{
			if (Eco.isEmpty(form) || Eco.isEmpty(oData))
            {
                trace("[nxlib.transaction error] arguments를 확인하세요.");
                return;
            }

            var pThis = form;
            var oSvc = {
                oForm: pThis,
                svcid: oData.svcid,
                callback: callback
            };

            var sUrl = Eco.isEmpty(oData.url) ? "" : oData.url; //URL
            var inputDataset = Eco.isEmpty(oData.inds) ? "" : oData.inds.join(" "); //input dataset
            var outputDataset = Eco.isEmpty(oData.outds) ? "" : oData.outds.join(" "); //output dataset
            var strArgument = Eco.isEmpty(oData.args) ? "" : oData.args.join(" "); // argument  변환
            var bAsync = Eco.isEmpty(oData.bAsync) ? true : oData.bAsync; //비동기여부 (true: async  false: sync)
            var nDataType = Eco.isEmpty(oData.nDataType) ? 2 : oData.nDataType; //(0: XML타입, 1: 이진 타입, 2: SSV 타입, 4: JSON 타입)
            var bCompress = Eco.isEmpty(oData.bCompress) ? false : oData.bCompress;

            sUrl = (nDataType == 4 ? "jsonsvc::" : "svc::") + sUrl;

            if (!Eco.isFunction(pThis._transactionCallback))
            {
                //callback 함수 추가
                nexacro.Form.prototype._transactionCallback = function(oSvc, nErrorcode, strErrorMsg, elapsedtime)
                {
                    var strSvcId = oSvc.svcid; // service id
                    var svcCallback = oSvc.callback; //callback 함수 또는 함수명

                    if (Eco.isEmpty(svcCallback)) return;

                    //callback 함수
                    if (typeof svcCallback == "function")
                    {
                        svcCallback.call(this, strSvcId, nErrorcode, strErrorMsg, elapsedtime);
                    }
                    //callback 함수명
                    else if (typeof svcCallback == "string")
                    {
                        if (!Eco.isFunction(this[svcCallback])) return;
                        this[svcCallback].call(this, strSvcId, nErrorcode, strErrorMsg, elapsedtime);
                    }
                    else
                    {
                        trace("[nxlib.transaction error] callback 함수 또는 함수명을 지정하세요.");
                    }
					
					if (typeof(CollectGarbage) == "function") CollectGarbage();
                };
            }

			if (typeof(CollectGarbage) == "function") CollectGarbage();
			
            pThis.transaction(oSvc, sUrl, inputDataset, outputDataset, strArgument, "_transactionCallback", bAsync, nDataType, bCompress);
		},

		openPopup: function(form, frameId, formUrl, objArgList, options, sPopupCallback, bModeless)
		{
			var nLeft = -1;
			var nTop = -1;
			var nWidth = 1;
			var nHeight = 1;
			var bShowTitle = true;
			var bShowStatus = false;
			var bLayered = false;
			var nOpacity = 100;
			var bAutoSize = true;
			var bResizable = true;
			var bRound = false;
			var bReload = false; //열려진 화면 일 때 reload 처리 유무
			var sDragMoveType = "all";
			var sTitleText = "";
			var objParentFrame = null;

			if (form)
			{
				objParentFrame = form.getOwnerFrame();
			}
			else
			{
				objParentFrame = nexacro.getApplication().mainframe;
			}

			//2016.05.10.    	sPopupCallback = (Eco.isEmpty(sPopupCallback)) ? "popupAfter" : sPopupCallback;
			options += "";
			var aVal = options.trim().split(" ");
			for (var i = 0; i < aVal.length; i++)
			{
				var aVal2 = aVal[i].trim().split("=");
				switch (aVal2[0])
				{
					case "top":
						nTop = parseInt(aVal2[1]);
						break;
					case "left":
						nLeft = parseInt(aVal2[1]);
						break;
					case "width":
						nWidth = parseInt(aVal2[1]);
						break;
					case "height":
						nHeight = parseInt(aVal2[1]);
						break;
					case "title":
					case "titlebar":
					case "showtitlebar":
						bShowTitle = aVal2[1];
						break;
					case "titletext":
						sTitleText = aVal2[1];
						break;
					case "status":
					case "statusbar":
					case "showstatusbar":
						bShowStatus = aVal2[1];
						break;
					case "layered":
						bLayered = aVal2[1];
						break;
					case "opacity":
						nOpacity = aVal2[1];
						break;
					case "autosize":
						bAutoSize = aVal2[1];
						break;
					case "resizable":
						bResizable = aVal2[1];
						break;
					case "round":
						bRound = aVal2[1];
						break;
					case "reload":
						bReload = aVal2[1];
						break;
				}
			}
			var sOpenalign = "";
			sOpenalign = "center middle";

			if (nWidth == 1) nWidth = 600;
			if (nHeight == 1) nHeight = 500;

			if (nLeft == -1)
			{
				nLeft = (nexacro.getApplication().mainframe.width - nWidth) / 2;
				if (bModeless) nLeft += system.clientToScreenX(nexacro.getApplication().mainframe, 0);
			}
			if (nTop == -1)
			{
				nTop = (nexacro.getApplication().mainframe.height - nHeight) / 2;
				if (bModeless) nTop += system.clientToScreenY(nexacro.getApplication().mainframe, 0);
			}

			if (bModeless)
			{
				//열린 modeless 팝업 화면이 존재하면 focus 처리 후 리턴.
				var objPopFrams = nexacro.getApplication().popupframes;

				var objPopFrame = objPopFrams[frameId];
				if (objPopFrame)
				{
					objPopFrame.setFocus();
					if (bReload == "true")
					{
						//arguments 셋팅
						if (!Eco.isEmpty(objArgList))
						{
							if (!objPopFrame.arguments) objPopFrame.arguments = {};

							for (var key in objArgList)
							{
								if (objArgList.hasOwnProperty(key))
								{
									objPopFrame.arguments[key] = objArgList[key];
								}
							}
						}
						objPopFrame.form.reload();
					}
					return;
				}

				//modeless callback 값 setting
				objArgList._close_callback = sPopupCallback;

				var sOpenStyle = "cssclass=Popup";

				if (bShowTitle == "false") sOpenStyle += "showtitlebar=false";
				if (bShowStatus == "true") sOpenStyle += " showstatusbar=true";
				if (bAutoSize == "false") sOpenStyle += " autosize=false";
				if (bResizable == "false")
				{
					sOpenStyle += " resizable=false";
				}
				else
				{
					sOpenStyle += " resizable=true";
				}
				nexacro.open(frameId, formUrl, objParentFrame, objArgList, sOpenStyle, nLeft, nTop, nWidth, nHeight, form);

			}
			else
			{
				newChild = new nexacro.ChildFrame;

				//trace( 'UI공통 newChild.init( '+frameId+', '+nLeft+', '+nTop+', '+nWidth+', '+nHeight+', null, null, '+formUrl+' )' );

				newChild.init(frameId, nLeft, nTop, nWidth, nHeight, null, null, formUrl);

				newChild.set_background("transparent");
				newChild.set_dragmovetype(sDragMoveType);
				newChild.set_showtitlebar(bShowTitle);
				newChild.set_autosize(bAutoSize);
				newChild.set_resizable(bResizable);
				newChild.set_titletext(sTitleText);
				newChild.set_showstatusbar(bShowStatus);
				newChild.set_openalign(sOpenalign);
				newChild.set_layered(bLayered);
				//newChild.set_cssclass("Popup");

				//		if(bRound) newChild.set_bordertype( "round 10 10" );
				newChild.set_opacity(nOpacity);

				//arguments 셋팅
				if (!Eco.isEmpty(objArgList))
				{
					if (!newChild.arguments) newChild.arguments = {};
					for (var key in objArgList)
					{
						if (objArgList.hasOwnProperty(key)) newChild.arguments[key] = objArgList[key];
					}
				}

				newChild.showModal(objParentFrame, objArgList, form, sPopupCallback);
			}
		},

		/**
         * 주어진 대상을 포함한 상위 범위로 지정된 이름에 최초로 일치하는 component, object 반환
         * @public
         * @param {object} p 부모 컨테이너
         * @param {string} name 찾을 대상 이름
         * @return {object} 검색된 component, object
         * @memberOf nxlib
         */
        lookup: function(p, name)
        {
            var o;
            while (p)
            {
                o = p.components;
                if (o && o[name]) return o[name];

                o = p.objects;
                if (o && o[name]) return o[name];

                p = p.parent;
            }
            return null;
        },

		getNowAddDate: function(offset, sFormat)
		{
			if (Eco.isEmpty(sFormat)) sFormat = "yyyyMMdd";
			var dt = Eco.date.addDate(new Date(), offset);

			return Eco.date.getMaskFormatString(dt, sFormat);
		},

		getNowDate: function(sFormat)
		{
			if (Eco.isEmpty(sFormat)) sFormat = "yyyyMMdd";
			var dt = new Date();

			return Eco.date.getMaskFormatString(dt, sFormat);
		}
	});
}