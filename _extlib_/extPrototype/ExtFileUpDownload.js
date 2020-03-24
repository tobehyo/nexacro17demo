/**
*  컨설팅 표준화 작업
*  @FileName 	ExtFileUpDownload.js 
*  @Creator 	consulting
*  @CreateDate 	2017.11.23
*  @Desction   		
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2017.11.23     		consulting 	      		최초 생성 
*******************************************************************************
*/

/**
 * @class  Event Info 생성
 */
if(!nexacro.ExtFileUploadChangeEventInfo) 
{
    nexacro.ExtFileUploadChangeEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onchange";
        this.fromobject = this.fromreferenceobject = obj;

        this.index;
		this.files;
    };
    var _pEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ExtFileUploadChangeEventInfo);
    nexacro.ExtFileUploadChangeEventInfo.prototype = _pEventInfo;
    _pEventInfo._type_name = "ExtFileUploadChangeEventInfo";

    delete _pEventInfo;
    
    
    nexacro.ExtFileLoadEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onsuccess";
        this.fromobject = this.fromreferenceobject = obj;

        this.datasets; //RUNTIME Only	
        this.type;
        this.errorcode;
        this.errormsg;
        this.url;
    };
    
    var _pExtFileLoadEventInfo = nexacro._createPrototype(nexacro.Event);
    nexacro.ExtFileLoadEventInfo.prototype = _pExtFileLoadEventInfo;
    _pExtFileLoadEventInfo._type = "ExtFileLoadEventInfo";
    _pExtFileLoadEventInfo._type_name = "ExtFileLoadEventInfo";

    delete _pExtFileLoadEventInfo;    
    
    
    nexacro.ExtFileErrorEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onerror";
        this.fromobject = this.fromreferenceobject = obj;

        this.errorcode;
        this.errormsg;
        this.errorobj;
        
        this.errortype;
        
        this.statuscode;
        this.requesturi;
        this.locationuri;
        
        this.index = -1; //RUNTIME Only	
    };
    var _pExtFileErrorEventInfo = nexacro._createPrototype(nexacro.Event);
    nexacro.ExtFileErrorEventInfo.prototype = _pExtFileErrorEventInfo;
    _pExtFileErrorEventInfo._type = "ExtFileErrorEventInfo";
    _pExtFileErrorEventInfo._type_name = "ExtFileErrorEventInfo";

    delete _pExtFileErrorEventInfo;    
}

// ==============================================================================
//  파일처리 관련 API 지원 여부해당기능은 HTML5만 지원합니다.
// ==============================================================================
if( system.navigatorname != "nexacro DesignMode" && system.navigatorname != "nexacro"){
	/**
	 * @class  file up/download support여부 설정
	*/
	nexacro._ExtFileUpDownloadSupport = {
		
		FileAPI : (window.File && window.FileList && window.Blob && window.FileReader) ? true : false,  
		//fileReader : (window.FileReader) ? true : false,
		XHR2 : (
				((function () {
					try 
					{
						var xhr = new XMLHttpRequest();
						return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
					} 
					catch(e)
					{
						return false;
					}
				})())
				&& (('max' in document.createElement("progress")) ? true : false)
				&& ((window.FormData) ? true : false)
			   ) ? true : false,
		MultipleInput : ('multiple' in document.createElement("input")) ? true : false,
		Download : ('download' in document.createElement("a")) ? true : false,
		MSSave : (window.navigator.msSaveOrOpenBlob) ? true : false,
		Draggable : (function () {
						var div = document.createElement("div");
						return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
					})(),
		SelectorsAPI : (system.navigatorname == "IE") ? ((system.navigatorversion >= 9) && !!document.querySelector) : !!document.querySelector
	};

	/**
	 * @class  상태변화 이벤트생성
	*/
	nexacro.ExtFileReadystateChangEventInfo = function (obj, id, readyState, status)
	{
		this.id = this.eventid = id || "onreadystatechange";
		this.fromobject = this.fromreferenceobject = obj;

		this.readyState = readyState;
		this.status = status;
	};

	var _pExtFileLoadEventInfo = nexacro._createPrototype(nexacro.Event);
	nexacro.ExtFileLoadEventInfo.prototype = _pExtFileLoadEventInfo;
	_pExtFileLoadEventInfo._type = "ExtFileLoadEventInfo";
	_pExtFileLoadEventInfo._type_name = "ExtFileLoadEventInfo";

	delete _pExtFileLoadEventInfo;
	
	/**
	 * @class  onchange이벤트생성
	*/
	nexacro.ExtFileUpDownloadChangeEventInfo = function (obj, id, type, files)
	{
		this.id = this.eventid = id || "onchange";
		this.fromobject = this.fromreferenceobject = obj;

		this.type = type;
		this.files = files;
	};
	var _pExtFileUploadChangeEventInfo = nexacro._createPrototype(nexacro.Event);
	nexacro.ExtFileUpDownloadChangeEventInfo.prototype = _pExtFileUploadChangeEventInfo;
	_pExtFileUploadChangeEventInfo._type = "ExtFileUploadChangeEventInfo";
	_pExtFileUploadChangeEventInfo._type_name = "ExtFileUploadChangeEventInfo";

	delete _pExtFileUploadChangeEventInfo;

	/**
	 * @class  fileupload progress 이벤트생성
	*/
	nexacro.Event.ExtFileProgress = function(obj, id, type, lengthComputable, loaded, total, fileId) 
	{
		this.id = this.eventid = id || "onuploadprogress";
		this.fileId = fileId;
		this.fromobject = this.fromreferenceobject = obj;

		this.type = type;
		this.lengthComputable = lengthComputable;
		this.loaded = loaded;
		this.total = total;
	};

	var _pEventExtFileProgress = nexacro._createPrototype(nexacro.Event);
	nexacro.Event.ExtFileProgress.prototype = _pEventExtFileProgress;
	_pEventExtFileProgress._type = "ExtFileProgress";
	_pEventExtFileProgress._type_name = "ExtFileProgress";

	delete _pEventExtFileProgress;
	
	/**
	 * @class  UPLOAD컴포넌트 생성 START
	*/
	if (!nexacro.ExtFileUpload)
	{
		/**
		 * @class nexacro.ExtFileUpload
		*/
		nexacro.ExtFileUpload = function (id, parent)
		{
			//UserObject 생성시 처리용
			if (arguments.length == 9) {
				parent = arguments[8];
			}		
		
			//var position = "absolute";
			nexacro.Component.call(this, id, 0,0,0,0, null, null, parent);
			
			// SubControl
			this.filebutton = null;
			
			// User Property
			//this.multipleinput = true;
			this.multiselect = false;
			this.uploadurl = "";
			this.downloadurl = "";
			this.helpMessage  = undefined; //drag & drop 메시지를 표시하는 component
			this.guideComp    = undefined; //drag & drop zone 안내를 담당하는 component
			this.fileListComp = undefined; //file 목록을 표시하는 component
			
			this.support = nexacro._ExtFileUpDownloadSupport;	
			
			this._autoDeleteItem = true; //Auto deleteItem property when onsuccess event fire.
			
			// internal variable  
			this._form = parent;
			this._inputfiles = [];		// input
			this._addedfiles = [];		// add file item
			this._pExtFileItem;
			//this._accessibility_role = "fileupload";
			
			this._event_list = {
				"onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
				"onkillfocus": 1, "onsetfocus": 1, "onmove": 1, "onsize": 1,
				"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
				"onlbuttondown": 1, "onlbuttonup": 1, "onmouseenter": 1, "onmouseleave": 1, 
				"onmousemove": 1, "onrbuttondown": 1, "onrbuttonup": 1,
				"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
				"ontap": 1, "ondbltap": 1, "onpinchstart": 1, "onpinch": 1, "onpinchend": 1,
				"onflingstart": 1, "onfling": 1, "onflingend": 1,
				"onlongpress": 1, "onslidestart": 1, "onslide": 1, "onslideend": 1,
				
				// added event
				"onloadstart": 1, "onprogress": 1, "onload": 1, 
				"onloadend": 1, "onsuccess": 1, "onerror": 1, "onchange": 1,
				"onreadystatechange": 1 // <== XMLHttpRequest readystatechange
			};
		};

		var _pExtFileUpload = nexacro._createPrototype(nexacro.Component);
		nexacro.ExtFileUpload.prototype = _pExtFileUpload;
		
		_pExtFileUpload._type = "ExtFileUpload";
		_pExtFileUpload._type_name = "ExtFileUpload";

		//엔진업데이트 20150305
		_pExtFileUpload._changeFiles = function(){};

		//addEventHandler overriding(origin nexacro.EventSinkObject)
		//event명 통일을 위한 처리.
		_pExtFileUpload.addEventHandler = function (evt_id, func, target)
		{
			//event명 통일을 위한 처리.
			if(evt_id == "onsuccess") evt_id = "onload";
			
			if (this._is_loading)
			{
				if (!this._loading_event_list)
				{
					this._loading_event_list = [];
				}
				this._loading_event_list.push({ id: evt_id, func: func, target: target });
			}

			var listener = this[evt_id];
			var idx = -1;
			if (listener)
			{
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			else if (evt_id in this._event_list)
			{
				listener = new nexacro.EventListener(evt_id);
				this[evt_id] = listener;
				if (this._created_event_list)
				{
					this._created_event_list.push(evt_id);
				}
				else
				{
					this._created_event_list = [];
					this._created_event_list.push(evt_id);
				}
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			return idx;
		};		
		
		/**
		 * @class nexacro.ExtFileUpload : Create & Update & destroy
		*/
		_pExtFileUpload.on_create_contents = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				this.filebutton = new nexacro.ExtFileButtonCtrl("ExtFileButtonCtrl", 0, 0, 0, 0, null, null, this);
				this.filebutton.createComponent();
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Create contents & Update & destroy
		*/
		_pExtFileUpload.on_created_contents = function ()
		{
			this.addResponseZone();
			
			var ranid = new Date().valueOf().toString();
			nexacro._create_hidden_frame(this._unique_id, ranid, this.on_load, this);
			
			
			//단건 처리용
			var callback_fn = this.on_fileinput_onchange;

			//다건 처리용
			if (this.support.MultipleInput)
			{
				callback_fn = this.on_filesinput_onchange;  
			}        
			
			
			var name = this._unique_id + "_" + ranid + "_inputFile";
			
			//엔진업데이트로 소스 수정..리턴이 사라짐.
			nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);
			var infile = this._input_node; 

			infile._inputname = name;
			this._inputfiles.push(infile);
			
			this.on_apply_multiselect();
			this.filebutton._setEventHandler("onclick", this.on_notify_filebutton_onclick, this);
			
			this.filebutton.set_visible(false);
			this.filebutton.on_created();
			
			
			this.on_apply_prop_enable(this._isEnable());
		};
		
		/**
		 * @class nexacro.ExtFileUpload : destroy contents & Update & destroy
		*/
		_pExtFileUpload.on_destroy_contents = function ()
		{
			if (this.filebutton)
			{
				this.filebutton.destroy();
				this.filebutton = null;
			}
			
			nexacro._destroy_hidden_frame(this._unique_id, this);
		};

		/**
		 * @class nexacro.ExtFileUpload : on_change_containerRect
		*/
		_pExtFileUpload.on_change_containerRect = function ()
		{
			var filebutton = this.filebutton;
			var btn_size = 0;
			var client_width = this._client_width;
			var client_height = this._client_height;
			var client_left = this._client_left;
			var client_top = this._client_top;
			
			var style_btnsize = this.on_find_CurrentStyle_buttonsize("normal");
			if (!style_btnsize || style_btnsize._is_empty)
			{
				btn_size = client_height;
			}
			else if (parseInt(style_btnsize._value, 10) > client_width)
			{
				btn_size = client_width;
			}
			else
			{
				btn_size = parseInt(style_btnsize._value, 10) | 0;
				if (btn_size < 0)
				{
					btn_size = client_height;
				}
			}
			
			if (filebutton)
			{
				var btn_left = client_left;
				var btn_top = client_top;
				var btn_width = btn_size;
				var btn_height = client_height;

				var btn_margin = filebutton.on_find_CurrentStyle_margin("normal");
				if (btn_margin && !btn_margin._is_empty)
				{
					btn_left = btn_left + btn_margin.left;
					btn_top = btn_margin.top;
					btn_width = btn_size - btn_margin.left - btn_margin.right;
					btn_height = client_height - btn_margin.top - btn_margin.bottom;
				}
				filebutton.move(btn_left, btn_top, btn_width, btn_height, null, null);
			}
		};
	
		/**
		 * @class nexacro.ExtFileUpload : Override 
		*/
		_pExtFileUpload.on_apply_prop_enable = function (v)
		{
			nexacro.Component.prototype.on_apply_prop_enable.call(this, v);

			var enable = v;
			if (v == undefined) enable = this.enable;

			if (this.filebutton)
			{
				this.filebutton._setEnable(enable);
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpload :  Properties [addFiles]
		*/
		_pExtFileUpload.addFiles = function ()
		{
			//※HTML5에서 똑같은 1개 파일을 연속해서 선택시 중복선택 메시지를 표시하길 원할 때는
			this._input_node.value = null;
			this.filebutton.click();		
		};    
		
		/**
		 * @class nexacro.ExtFileUpload :  Properties [set_multiselect]
		*/
		_pExtFileUpload.set_multiselect = function (v)
		{
			v = nexacro._toBoolean(v);

			if (v != this.multiselect)
			{
				this.multiselect = v;
			}
			
			return this.multiselect;
		};
		
		/**
		 * @class nexacro.ExtFileUpload :  Properties [on_apply_multiselect]
		*/
		_pExtFileUpload.on_apply_multiselect = function ()
		{
			if (this._inputfiles)
			{         
				if (this.support.MultipleInput)
				{				
					if (this.multiselect)
					{
						this._inputfiles[this._inputfiles.length-1].multiple = this.multiselect;
					}
					else
					{
						if (this._inputfiles[this._inputfiles.length-1].hasAttribute("multiple"))
						{
							this._inputfiles[this._inputfiles.length-1].removeAttribute("multiple");
						}
					}
				}
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpload :  Properties [set_uploadurl]
		*/
		_pExtFileUpload.set_uploadurl = function (v)
		{
			if (v != this.uploadurl)
			{
				this.uploadurl = v;
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpload :  Properties [set_downloadurl]
		*/
		_pExtFileUpload.set_downloadurl = function (v)
		{
			if (v != this.downloadurl)
			{
				this.downloadurl = v;
			}
		};
	
		/**
		 * @class nexacro.ExtFileUpload :  Properties [setAutoDeleteItem]
		 * file upload 성공시 onsuccess event에서 자동으로 등록된 file item 삭제 여부 설정.
		*/
		_pExtFileUpload.setAutoDeleteItem = function(value) {
			this._autoDeleteItem = value;	
		};				
	  
		/**
		 * @class nexacro.ExtFileUpload : Methods
		*/

		/**
		 * @class nexacro.ExtFileUpload : Methods [upload]
		 * @param {=string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 *                 ※ Output Dataset 정보는 RUNTIME & HTML5 모두 extUpload_onsuccess 이벤트의 e.datasets 배열객체로 수신한다.
		 * @param {string} transferType 전송유형.(all: 대상파일을 한번에 전송(defalut), each: 개별 전송)
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부
		*/
		_pExtFileUpload.upload = function (path, inDatasetsParam, outDatasetsParam, transferType, datatype)
		{
			transferType = transferType || "all";
			this.set_uploadurl(path);
			
			if(transferType == "all"){
				return this.uploadAll(path, inDatasetsParam, outDatasetsParam, datatype);
				
			} else if(transferType == "each"){
				if (this.support.XHR2) {
					return this.uploadEach(path, inDatasetsParam, outDatasetsParam, datatype);
					
				} else {
					return this.uploadAll(path, inDatasetsParam, outDatasetsParam, datatype);
				}

			}
			
			return false;
		};    

		/**
		 * @class nexacro.ExtFileUpload : Methods [uploadAll]
		 * 그룹전송(하나의 XMLHttpRequest에 파일을 모두 담아 전송한다).
		 * @param {string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부  
		*/ 
		_pExtFileUpload.uploadAll = function (path, inDatasetsParam, outDatasetsParam, datatype)
		{
			var uploadurl;
			var rtn = false;

			if (!path)
			{
				uploadurl = nexacro._getServiceLocation(this.uploadurl);
			}
			else
			{
				uploadurl = nexacro._getServiceLocation(path);
			}
			
			if (uploadurl)
			{
				var loadItem = new nexacro.ExtFileTransaction(uploadurl, "upload", this._form, inDatasetsParam, outDatasetsParam, datatype); 
		
				//신규 추가
				loadItem.scope = this.parent;
				loadItem.parent = this;
				//loadItem.on_start();
				
				if (this.support.XHR2)
				{
					var formData = this._appendFormData();

					if (formData)
					{
						loadItem.appendCallback(this, this.on_load_filemodule);
						
						//input dataset 추가
						this._appendInputDatasetsToFormData(loadItem, "inputDatasets", formData);                    
						this._startCommunication(loadItem, uploadurl, formData);
						rtn = true;
					}				
				}
				else
				{
					loadItem.appendCallback(this, this.on_loadframe_filemodule);
					this._pExtFileItem = loadItem;
					nexacro._submit(this._unique_id, uploadurl);
					rtn = true;
				}
			}
			
			return rtn;
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [uploadEach]
		 * 개별전송(업로드 시킬 파일개수와 같은 수의 XMLHttpRequest를 생성한다).
		 * @param {string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부 
		*/  
		_pExtFileUpload.uploadEach = function (path, inDatasetsParam, outDatasetsParam, datatype)
		{
			var uploadurl;
			var rtn = false;

			if (!path)
			{
				uploadurl = nexacro._getServiceLocation(this.uploadurl);
			}
			else
			{
				uploadurl = nexacro._getServiceLocation(path);
			}
			
			if (uploadurl)
			{
				//업로드할 파일 개수 확인
				var formDataList = this._getFormDataList();
				var formDataCount = formDataList.length;
				
				for(var i = 0; i < formDataCount; i++) {
					var loadItem = new nexacro.ExtFileTransaction(uploadurl, "upload", this._form, inDatasetsParam, outDatasetsParam, datatype);
					//신규 추가
					loadItem.scope = this.parent;
					loadItem.parent = this;					
					//loadItem.on_start();
					
					if (this.support.XHR2)
					{
						var formData = formDataList[i];
						if (formData)
						{	
							loadItem.appendCallback(this, this._makeLoadFileModule(this, formData.fileName));

							//input dataset 추가
							this._appendInputDatasetsToFormData(loadItem, "inputDatasets", formData);
							
							this._startCommunication(loadItem, uploadurl, formData, formData.fileName);
							rtn = true;
						}
							
					}
					else
					{
						loadItem.appendCallback(this, this.on_loadframe_filemodule);
						this._pExtFileItem = loadItem;
						nexacro._submit(this._unique_id, uploadurl);
						rtn = true;
					}        		
					
				}
			}
			
			return rtn;
		};    

		/**
		 * @class nexacro.ExtFileUpload : Methods [_getFormDataList]
    	 * @return {array} formData List
		*/  
		_pExtFileUpload._getFormDataList = function() {
			var formData,
			transferLen = 0,
			i = 0,  
			file, fileName,
			transferFiles,
			formDataList = [];
		
			transferFiles = this._addedfiles;
			
			if (transferFiles)
			{
				transferLen = transferFiles.length;
				
				for (i = 0; i < transferLen; i++) 
				{
					formData = new FormData();
					
					file = transferFiles[i].file;

					if (file)
					{
						fileName = file.name;
						formData.append(fileName, file);
						formData["fileName"] = fileName;
						formDataList.push(formData);
					}
				}
			}

			return formDataList;    	
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [_appendInputDatasetsToFormData]
    	 * @param {FileTransaction} loadItem FileTransaction
		 * @param {string} name
		 * @param {FormData} formData
		*/  
		_pExtFileUpload._appendInputDatasetsToFormData = function(loadItem, name, formData) {
			return formData.append(name, loadItem._sendData);
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [addDropZone]
    	 * @param {Object} comp 컴포넌트 
		*/  
		_pExtFileUpload.addDropZone = function (comp)
		{
			var rtn = false;
			if (this.support.XHR2 && this.isDraggable())
			{
				var node = comp._control_element._client_element._handle;
				if (node)
				{   
					node._pExtFileUploadTarget = this;
					rtn = true;
				}
			}
			
			return rtn;
		};
		 
		/**
		 * @class nexacro.ExtFileUpload : Methods [setResponseZone]
    	 * Drag & Drop(이하 DnD)를 적용하기 위해
		 * 특정 컴포넌트(guideComp)에 Drag 중인 마우스가 들어왔을 때 
		 * Drop 가능영역을 표시하기 위한 컴포넌트(helpMessageComp) 정보를 property에 등록하는 함수.
		 * @param {Object} responseComp Drag 중인 마우스가 들어왔을 때 이를 감지할 컴포넌트.
		 * @param {Object} helpMessageComp Drop 가능 영역을 표시하기 위한 컴포넌트.
		 * @param {Object} fileListComp file 목록을 표시하는 컴포넌트.
		*/   
		_pExtFileUpload.setResponseZone = function (guideComp, helpMessageComp, fileListComp)
		{
			this.guideComp    = guideComp;
			this.helpMessage  = helpMessageComp;
			this.fileListComp = fileListComp;
		};    
 
		/**
		 * @class nexacro.ExtFileUpload : Methods [addResponseZone]
    	 * setResponseZone()에서 등록된 컴포넌트에 Drag & Drop 관련 event를 추가한다.
		 * addResponseZone()이 호출되는 시점은 _pExtFileUpload 객체의 on_created_contents 발생시점이다.
		 * 이는 생성시점(div나 tabpage 링크등)에 따른 오동작을 막기위함.
		 * @return {boolean} 설정 성공여부.
		*/    
		_pExtFileUpload.addResponseZone = function ()
		{
			var guideComp = this.guideComp;
			var helpMessageComp = this.helpMessage;
			 
			if(this.parent.gfnIsNull(guideComp) || this.parent.gfnIsNull(helpMessageComp)) {
				return;
			}
			
			var rtn = false;
			var node = guideComp._control_element.handle//nexacro._getCloneNode(guideComp._control_element.handle)
			var helpNode = helpMessageComp._control_element.handle;//nexacro._getCloneNode(helpMessageComp._control_element.handle)

			if (this.support.XHR2 && this.isDraggable())
			{
				if (node)
				{   
					node._pExtFileUploadTarget = this;
					nexacro._observeSysEvent(node, "dragover", "ondragover", this._dragOverGuide);
					nexacro._observeSysEvent(node, "dragleave", "ondragleave", this._dragLeaveGuide);
					nexacro._observeSysEvent(node, "drop", "ondrop", this._dropGuide);
					//IE처리를 위한 추가 logic. 테스트 후 if문 분기처리 할 것.
					// IE에서는 guide 컴포넌트에 drop을 발생시켜도 화면전환이 일어나지 않는다.....
					// 이러면 help message가 남아 있는다....
					// 이를 위해서 아래 event 추가.
					if(helpNode){
						helpNode._pExtFileUploadTarget = this;
						nexacro._observeSysEvent(helpNode, "dragover", "ondragover", this._dragOverHelpMessage);
						nexacro._observeSysEvent(helpNode, "drop", "ondrop", this._dropFiles);
					}
					rtn = true;
				}
			}
			return rtn;
		};     
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [isProgressbar]
		 * @return progressbar 사용가능여부
		*/ 
		_pExtFileUpload.isProgressbar = function ()
		{
			return this.support.XHR2;
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [isDraggable]
		 * @return 드래그 사용가능여부
		*/
		_pExtFileUpload.isDraggable = function ()
		{
			return (this.support.Draggable && this.support.FileAPI);
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [isMultipleInput]
		 * @return 멀티인풋 사용가능여부
		*/
		_pExtFileUpload.isMultipleInput = function ()
		{
			return this.support.MultipleInput;
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [getAddedFile]
		 * @return 파일정보들
		*/
		_pExtFileUpload.getAddedFile = function ()
		{
			if (this._addedfiles)
			{
				return this._addedfiles;
			}
		}
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [getAddedFileLength]
		 * @return 파일길이들
		*/
		_pExtFileUpload.getAddedFileLength = function ()
		{
			if (this._addedfiles)
			{
				return this._addedfiles.length;
			}
		}
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [resetAddedFile]
		 * @return 업로드파일초기화
		*/
		_pExtFileUpload.resetAddedFile = function ()
		{
			this._addedfiles = [];
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [addFile]
		 * @param {Object} file
		*/
		_pExtFileUpload.addFile = function (file)
		{
			if (this._addedfiles)
			{
				var info = {"id": file.id, "file": file};
				this._addedfiles.push(info);
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpload : Methods [removeFile]
		 * @param {String} fileid
		*/
		_pExtFileUpload.removeFile = function (fileid)
		{
			var index = this.parent.gfnLastIndexOfProp(this._addedfiles, "id", fileid);
			if (index > -1)
			{
				this._addedfiles[index] = null;
				this.parent.gfnRemoveAt(this._addedfiles, index);
			}
			
			if (!this.support.XHR2 || !this.support.FileAPI)
			{
				if (index > -1)
				{
					fileid = this._inputfiles[index]["_inputname"];
					index = this.parent.gfnLastIndexOfProp(this._inputfiles, "name", fileid);

					nexacro._remove_hidden_item(this._unique_id, fileid);
					this._inputfiles[index] = null;
					this.parent.gfnRemoveAt(this._inputfiles, index);
				}
			} else {
				this._resetInputFile();
			}
		};

		/**
		 * @class nexacro.ExtFileUpload : Methods [removeAll]
		 */
		_pExtFileUpload.removeAll = function ()
		{
			var addFiles = this._addedfiles;
			var count = addFiles.length;
			var fileId;
			var fileList = [];

			for(var i=0; i<count; i++)
			{
				fileId = addFiles[0]["id"];
				fileList.push(fileId);
				
				index = this.parent.gfnLastIndexOfProp(this._addedfiles, "id", fileId);
			
				if (index > -1)
				{
					addFiles[index] = null;
					this.parent.gfnRemoveAt(addFiles, index);
					
				}			
			}
			
		
			this._addedfiles = [];
			
			
			if (!this.support.XHR2 || !this.support.FileAPI)
			{
				var inputFiles = this._inputfiles;
				var count = fileList.length;

				for(var i=count-1; i>-1; i--)
				{
					fileId = this._inputfiles[i]["_inputname"];
					index = this.parent.gfnLastIndexOfProp(this._inputfiles, "name", fileId);
					
					if (index > -1)
					{
						nexacro._remove_hidden_item(this._unique_id, fileId);
						this._inputfiles[index] = null;
						this.parent.gfnRemoveAt(this._inputfiles, index);					
					}				
				}					
			}
			else 
			{
				this._resetInputFile();
			}
			
		};	

		/**
		 * @class nexacro.ExtFileUpload : Methods [_resetInputFile]
		 * input file 재생성(기존에 선택된 파일을 다시 선택 할 수 있도록 하기 위함)
		 */
		_pExtFileUpload._resetInputFile = function ()
		{
			var tempInputFileName = this._inputfiles[0]._inputname ;
			nexacro._remove_hidden_item(this._unique_id, tempInputFileName);
			
			this._inputfiles = [];
			
					
			var ranid = new Date().valueOf().toString();
			var name = this._unique_id + "_" + ranid + "_inputFile";
			
			//단건 처리용
			var callback_fn = this.on_fileinput_onchange;

			//다건 처리용
			if (this.support.MultipleInput)
			{
				callback_fn = this.on_filesinput_onchange;
			}        
			
			nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);

			var infile = this._input_node; 
			infile._inputname = name;
			this._inputfiles.push(infile);
			
			this.on_apply_multiselect();
			this.filebutton._setEventHandler("onclick", this.on_notify_filebutton_onclick, this);
			this.filebutton.on_created();    	
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers
		 */

		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onreadystatechange]
		 * XMLHttpRequest readystatechange event
		 * @param {string} type "upload" or "download"
		 */ 
		_pExtFileUpload.on_fire_onreadystatechange = function (obj, readyState, status, fileId, type) 
		{

			if (this.onreadystatechange && this.onreadystatechange._has_handlers)
			{   
				var evt = new nexacro.ExtFileReadystateChangEventInfo(obj, "readystatechange", readyState, status);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				this.onreadystatechange._fireEvent(this, evt);
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onerror]
		 * @param {Object} 대상
		 * @param {string} 에러코드
		 * @param {string} 에러메세지
		 * @param {Object} 에러오브젝트
		 * @param {string} 파일ID
		 * @param {string} type "upload" or "download"
		 */
		_pExtFileUpload.on_fire_onerror = function (obj, errorcode, errormsg, errorobj, fileId, type)
		{
			var errormsg = nexacro._GetSystemErrorMsg(this, errorcode);
			if(this.parent.gfnIsNull(errormsg)) {
				errorcode = errorobj.status;
				errormsg = errorobj.statusText;
			}  
			
			if (this.onerror && this.onerror._has_handlers)
			{
				var evt = new nexacro.ExtFileErrorEventInfo(obj, "onerror", errorcode, errormsg, errorobj);
				evt["fileId"] = fileId;
				evt["type"] = type;      
				return this.onerror._fireEvent(this, evt);
			}
			
			return true;
			
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onchange]
		 * @param {Object} 대상
		 * @param {string} type "upload" or "download"
		 * @param {Object} files
		 */
		_pExtFileUpload.on_fire_onchange = function (obj, type, files)
		{
			if (this.onchange && this.onchange._has_handlers)
			{
				var evt = new nexacro.ExtFileUploadChangeEventInfo(obj, "onchange");
				evt["index"] = -1;
				evt["files"] = this.convertFileInfo(files);
				  
				return this.onchange._fireEvent(this, evt);
			}
		};

		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [convertFileInfo]
		 * 파일정보 객체 반환
		 * @param {Object} files
		 */
		_pExtFileUpload.convertFileInfo = function (files)
		{
			var fileCount = files.length;
			var fileInfoList = [];
			var fileName, fileId, fileSize, fileType;
			
			//iOS 6.0버그(이미지선택시 image.jpg로만 반환하는 버그대응용. 20150312)
			//if(nexacro.OS != "iOS") {
			for(var i=0; i<fileCount; i++)
			{
				var file = files[i];
				fileName = file.name;
				fileSize = file.size;
				fileType = file.type;
				fileId   = this.parent.gfnGetUniqueId("file_");
				var info = {id: fileId, fullpath: "", name: fileName, size: fileSize, type: fileType};
				fileInfoList.push(info);
				
				file.id = fileId;
				this.addFile(file);
			}			
			//}
			return fileInfoList;
		};		
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fileinput_onchange]
		 * @param {string} value 
		 */
		_pExtFileUpload.on_fileinput_onchange = function (value)
		{     

			var filePath = value;
			if (filePath)
			{
				var ranid = new Date().valueOf().toString();
				var name = this._unique_id + "_" + ranid + "_inputFile";
				
				
				var callback_fn = this.on_fileinput_onchange;
				
				//엔진업데이트로 소스 수정..리턴이 사라짐.
				//var infile = nexacro._append_hidden_item(this._unique_id, name, this.on_fileinput_onchange, this);
				//infile._inputname = name;
				nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);
				var infile = this._input_node; 
				infile._inputname = name;            
				
				this._inputfiles.push(infile);
				
				var fileTemp = filePath.split('\\');
				var fileName = fileTemp[fileTemp.length-1];
				
				
				var files = [];
				files.push({"id": this._inputfiles[this._inputfiles.length - 2]._inputname, "name": fileName});
				this.on_fire_onchange(this, "HtmlInputElement", files);
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_filesinput_onchange]
		 * @param {string} value
		 */
		_pExtFileUpload.on_filesinput_onchange = function (value)
		{
			if (this._inputfiles)
			{
				var infile = this._inputfiles[this._inputfiles.length - 1];
				this.on_fire_onchange(this, infile.type, infile.files);
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_notify_filebutton_onclick]
		 * @param {Object} 대상오브젝트
		 * @param {Event} 버튼클릭이벤트
		 */
		_pExtFileUpload.on_notify_filebutton_onclick = function (obj, e)
		{
			if (this._inputfiles && this.visible && this._isEnable() && this.enableevent)
			{
				try
				{
					var infile = this._inputfiles[this._inputfiles.length - 1];
					var name = infile._inputname;
					
					nexacro._findclick(this._unique_id, name, obj);
				}
				catch (e)
				{
					var errormsg = nexacro._GetSystemErrorMsg(this, "0x8100000E");
					this.on_fire_onerror(this, "0x8100000E", errormsg, obj);
				}
			}
			return false;
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onloadstart]
		 * @param {Object} 대상오브젝트
		 * @param {string} 업/다운 타입
		 * @param {string} 이벤트
		 * @param {string} 파일아이디
		 */
	  _pExtFileUpload.on_fire_onloadstart = function (obj, type, evt, fileId)
	  {
		  if (this.onloadstart && this.onloadstart._has_handlers)
		  {   
			  var evt = new nexacro.Event.ExtFileProgress(obj, "onloadstart", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
			  this.onloadstart._fireEvent(this, evt);
		  }
	  };
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onprogress]
		 * @param {Object} 대상오브젝트
		 * @param {string} 업/다운 타입
		 * @param {string} 이벤트
		 * @param {string} 파일아이디
		 */
		_pExtFileUpload.on_fire_onprogress = function (obj, type, evt, fileId)
		{
			if (this.onprogress && this.onprogress._has_handlers)
			{
				var evt = new nexacro.Event.ExtFileProgress(obj, "onprogress", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onprogress", this.fileComp_onprogress, this);
				this.onprogress._fireEvent(this, evt);
			}
		};    
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onload]
		 * @param {string} 업/다운 타입
		 * @param {string} 코드
		 * @param {string} 메세지
		 * @param {string} URL
		 * @param {string} 파일아이디
		 * @param {Object} 데이터셋
		 */
		_pExtFileUpload.on_fire_onload = function (type, code, msg, url, fileId, datasets)
		{
			if (this.onload && this.onload._has_handlers && url != "about:blank")
			{
				 
				 if(this._autoDeleteItem && code > -1)
				 {
					 //성공적으로 파일 업로드시 업로드대상 파일 정보 제거.
					 this.removeAll();				 
				 }

				 //var evt = new nexacro.ExtFileLoadEventInfo(this, "onload", type, code, msg, url);
				 var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess", type, code, msg, url);
				 evt["fileId"] = fileId;
				 evt["type"] = "upload";
				 evt["errorcode"] = code;
				 evt["errormsg"] = msg;
				 evt["url"] = url;
				 evt["datasets"] = datasets || []; //output dataset
				 
				 return this.onload._fireEvent(this, evt);
			}
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Event Handlers [on_fire_onloadend]
		 * @param {Object} 대상오브젝트
		 * @param {string} 업/다운 타입
		 * @param {string} 이벤트
		 * @param {string} 파일아이디
		 */
		_pExtFileUpload.on_fire_onloadend = function (obj, type, evt, fileId)
		{
			if (this.onloadend && this.onloadend._has_handlers)
			{   
				var evt = new nexacro.Event.ExtFileProgress(obj, "onloadend", type, evt.lengthComputable, evt.loaded, evt.total);
				evt["fileId"] = fileId;
				this.onloadend._fireEvent(this, evt);
			}
		};
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) 
		 */
		 
		 /**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_appendFormData]
		 */
		_pExtFileUpload._appendFormData = function ()
		{
			var formData,
				transferLen = 0,
				i = 0,  
				file, fileName,
				transferFiles;
			
			if (this._addedfiles)
			{
				transferFiles = this._addedfiles;
				formData = new FormData();
				transferLen = transferFiles.length;
				
				for (i = 0; i < transferLen; i++) 
				{
					file = transferFiles[i].file;
					
					if (file)
					{
						fileName = file.name;
						formData.append(fileName, file);
					}
				}
			}
			
			return formData;
		};
		
		 /**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_startCommunication]
		 * @param {Object} 트랜젝션오브젝트
		 * @param {String} URL
		 * @param {Object} DATA OBJECT
		 * @param {String} 파일아이디
		 */
		_pExtFileUpload._startCommunication = function (loadItem, url, data, fileId)
		{    
			var path = url;
			var senddata = data;
			
			if (loadItem._protocol < 0 || loadItem._protocol == "undefined" || loadItem._protocol == null)
			{  
				var createadaptor = false;
				var protocoladp = nexacro._getProtocol(loadItem._protocol);
				if (!protocoladp)
				{
					var adptorclass = nexacro._executeEvalStr(loadItem._protocol);            
					
					// adptorclass.
					if (adptorclass)
					{
						protocoladp = new adptorclass;
						createadaptor = true;
					}
				}

				if (protocoladp)
				{
					if (createadaptor && protocoladp.initialize)
					{
						protocoladp.initialize(url);
						nexacro.getApplication()._addProtocol(loadItem.protocol, protocoladp);
					}

					var protocol = protocoladp.getUsingProtocol(url);
					var sep = path.split("://");
					if (sep)
					{
						path = protocol + "://" + sep[1];
					}

					// encode             
					if (data && protocoladp.encrypt)
					{
						senddata = loadItem.on_encrypt(data);
					}

					// extra header 정보 
					if (protocoladp.getCommunicationHeaders)
					{
						var headers = protocoladp.getCommunicationHeaders(url);
						if (headers)
							loadItem._addCookieFromVariables(headers);
					}
				}
			}

			this.__startCommunication(loadItem, path, senddata, fileId);
		};
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [__startCommunication]
		 * @param {Object} 트랜젝션오브젝트
		 * @param {String} URL
		 * @param {Object} DATA OBJECT
		 * @param {String} 파일아이디
		 */
		_pExtFileUpload.__startCommunication = function (loadItem, path, senddata, fileId)
		{   
			var _ajax = nexacro.__createHttpRequest();
			var ajax_handle = _ajax.handle;

			// parse protocol       
			if (path.indexOf("://") > -1)
			{
				var ar = path.split("://");
				var protocol = ar[0];
				switch (protocol)
				{
					case "http": _ajax._protocol = 0; break;
					case "https": _ajax._protocol = 1; break;
					case "file": _ajax._protocol = 2; break;
					default: _ajax._protocol = -1; break;
				}
			}
			
			var method = "GET";        
			var mime_xml = false;

			ajax_handle._pExtFileTarget = this;
			ajax_handle._pExtFileItem = loadItem;
			
			
			/*
			readystatechange : The readyState attribute changes value
			
				type    :           Description         :     Times     :               When
			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			loadstart   :   Progress has begun.         :  Once.        :   First.
			progress    :   In progress.                :  Zero or more.:   After loadstart has been dispatched.
			error       :   Progression failed.         :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			abort       :   Progression is terminated.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			load        :   Progression is successful.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			loadend     :   Progress has stopped.       :  Once.        :   After one of error, abort, or load has been dispatched.
			*/
	// 		if (loadItem.type == "upload")
	// 		{
				ajax_handle.upload._pExtFileTarget = this;
				ajax_handle.upload._pExtFileItem = loadItem;
				
				
				nexacro._observeSysEvent(ajax_handle, "loadstart", "onloadstart", this._makeLoadstartHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle.upload, "progress", "onprogress", this._makeProcessHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "load", "onload", this._makeLoadHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "loadend", "onloadend", this._makeLoadendHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "error", "onerror", this._makeErrorHandler(this, fileId, loadItem));
				
				
				//XHR 에러처리용.
				//신규추가. 2014.10.20 
				nexacro._observeSysEvent(ajax_handle, "readystatechange", "onreadystatechange", this._makeReadystateChangeHandler(this, fileId, loadItem.type));
				nexacro._observeSysEvent(ajax_handle, "abort", "onabort", this._makeTransferCanceledHandler(this, fileId));

				method = "POST";            
				mime_xml = true;    
	//		}

			
			try 
			{            
				ajax_handle.open(method, path, true);

			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}
			
			if (mime_xml)
			{
				ajax_handle.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax_handle.setRequestHeader("Accept", "application/xml, text/xml, */*");
			}
			
			try 
			{
				ajax_handle.send(senddata ? senddata : null);
			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}       

			_ajax = null;
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeLoadFileModule]
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @return {function} closure of on_load_filemodule
		 */
		_pExtFileUpload._makeLoadFileModule = function (pThis, pFileId) {
			return function(type, code, msg, url, datasets) {
				pThis.on_fire_onload(type, code, msg, url, pFileId, datasets);
			};
		};
		
		 /**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeProcessHandler]
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onprogress
		 */
		_pExtFileUpload._makeProcessHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onprogress(pThis, pLoadItem.type, evt, pFileId);
			};
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeLoadstartHandler]
		 * 전송 시작시 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadstart
		 */ 
		_pExtFileUpload._makeLoadstartHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onloadstart(pThis, pLoadItem.type, evt, pFileId);
			};
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeLoadstartHandler]
		 * 전송이 성공 했을 때 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onload
		 */ 
		_pExtFileUpload._makeLoadHandler = function (pThis, pFileId, pLoadItem) {

			return function(evt) {
				var itemType = pLoadItem.type;
				if (this.readyState == 4 && this.status == 200) 
				{
					var cookie = "";
					if (pLoadItem.context)
					{
						cookie = pLoadItem.context._getWindow()._doc.cookie;
					}
					
					var data;
					if (itemType == "upload")
					{
						data = this.responseText || "";

						if(pThis.parent.gfnIsNull(data))
						{
							var errormsg = "response data is empty!";
							pThis.on_fire_onerror(pThis, "ObjectError", errormsg, this, 9901, null, null, -1);
							return;
						}
						pLoadItem.on_load_file(data, cookie, this.status, this.statusText);
					}
					else if (itemType == "download")
					{
						if (this.responseType == "blob")
						{
							data = this.response;
							pLoadItem.on_down_file(data, pThis._unique_id, cookie, this.status, this.statusText);
						}
						else
						{
							var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
							pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
						}
					}
				}
				else
				{
					var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
					pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
				} 
			};
	   
		};    
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeLoadendHandler]
		 * 전송 완료 체크용(성공과 실패에 무관하게 발생함!) closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadend
		 */  
		_pExtFileUpload._makeLoadendHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				
				var itemType = pLoadItem.type;
				
				if (itemType == "download")
				{
					if (this.responseType == "blob")
					{
						pLoadItem.on_downend_file();
					}
				}
				
				pThis.on_fire_onloadend(pThis, itemType, evt, pFileId);
				
				pLoadItem = null;
				pthis = null;
				
				if (this.upload._pExtFileTarget) this.upload._pExtFileTarget = null;
				if (this.upload._pExtFileItem) this.upload._pExtFileItem = null;    		
			};

		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeErrorHandler]
		 * 통신에러 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @param {string} type "upload","download"
		 * @return {function} closure of error
		 */  
		_pExtFileUpload._makeErrorHandler = function (pThis, pFileId, pLoadItem, type)
		{
			return function(evt) {
				
				if (pLoadItem._usewaitcursor)
					pLoadItem._hideWaitCursor();
				
				pThis.on_fire_onerror(pThis, -1, "File transfer was failure.", pThis, pFileId, pLoadItem.type);    		
			};

		};    
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeReadystateChangeHandler]
		 * XHR 통신상태 체크용 closure.  2014.10.20 신규추가
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of error
		  
			  Holds the status of the XMLHttpRequest. Changes from 0 to 4: 
				0: request not initialized 
				1: server connection established
				2: request received 
				3: processing request 
				4: request finished and response is ready
			 
			  status
					  　200: "OK"
					  　404: Page not found
						   
					  참고사항: tomcat에서 jsp를 호출하던 중  java.lang.ClassNotFoundException 발생시 
					   500: internal server error 발생!!!  
		 */   
		_pExtFileUpload._makeReadystateChangeHandler = function (pThis, pFileId, pType)
		{
			return function(evt) {
				var xhrUpload = evt.target;
				pThis.on_fire_onreadystatechange(pThis, xhrUpload.readyState, xhrUpload.status, pFileId, pType);    		
			};
		};       

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_makeTransferCanceledHandler]
		 * 전송취소 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of TransferCanceled
		 */  
		_pExtFileUpload._makeTransferCanceledHandler = function (pThis, pFileId)
		{
			return function(evt) {
				alert(pFileId + ". 사용자에 의해 전송이 취소되었습니다.");
			};
		};    
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [on_load_filemodule]
		 * XHR2 지원시 호출
		 * @param {string} type
		 * @param {string} code
		 * @param {string} message
		 * @param {string} url
		 * @param {Object} dataset
		 */
		_pExtFileUpload.on_load_filemodule = function (type, code, msg, url, datasets)
		{
			trace("\n★ on_load_filemodule type:" + type + ",code:" + code + ",msg:" + msg + ",url:" + url +  ",datasets:" + datasets);
			var fileId = "";
			this.on_fire_onload(type, code, msg, url, fileId, datasets);
		};
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [on_loadframe_filemodule]
		 * XHR2 미지원시 호출: _pFileTransaction.on_loadframe_file에서 호출됨.
		 * @param {string} type
		 * @param {string} code
		 * @param {string} message
		 * @param {string} url
		 * @param {Object} dataset
		 */  
		_pExtFileUpload.on_loadframe_filemodule = function (type, code, msg, url, datasets)
		{
			trace("\n\n★★on_loadframe_filemodule type:" + type + ",code:" + code + ",msg:" + msg + ",url:" + url +  ",datasets:" + datasets);
			this.on_fire_onload(type, code, msg, url, "", datasets);
		};
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [on_load]
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 */ 
		_pExtFileUpload.on_load = function (target)
		{
			var pLoadItem = this._pExtFileItem;    
			if (pLoadItem)
			{
				pLoadItem.on_loadframe_file(this._unique_id, target);
				pLoadItem = null;
			}
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dropGuide]
		 * guide 컴포넌트에 drop event발생시 호출 
		 * @param {Event} 
		 */  
		_pExtFileUpload._dropGuide = function (evt)
		{
			var pThis = this._pExtFileUploadTarget;
			pThis.helpMessage.set_visible(false);
			evt.stopPropagation();
			evt.preventDefault();
			
			return false;
		};    

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dropFiles]
		 * drop-zone 컴포넌트에 drop event발생시 호출  
		 * @param {Event} 
		 */ 
		_pExtFileUpload._dropFiles = function (evt)
		{
			var files = evt.dataTransfer.files;
			evt.stopPropagation();
			evt.preventDefault();
			
			if (evt.dataTransfer)
			{
				var pThis = this._pExtFileUploadTarget;
				if(pThis)
				{
					pThis.helpMessage.set_visible(false);
					pThis.on_fire_onchange(pThis, evt.type, files);
				}
			}
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dragOverGuide]
		 * drop 도움말을 표시/숨기기를 위한 컴포넌트에 dragover event발생시 호출 
		 * @param {Event} 
		 */  
		_pExtFileUpload._dragOverGuide = function (evt) 
		{
			var pThis = this._pExtFileUploadTarget;
			pThis.helpMessage.set_visible(true);

			
			evt.stopPropagation();
			evt.preventDefault();
			
			evt.dataTransfer.dropEffect = "none";
			return false;
		};
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dragOverHelpMessage]
		 * drop 도움말을 표시/숨기기를 위한 컴포넌트에 dragover event발생시 호출
		 * @param {Event} 
		 */   
		_pExtFileUpload._dragOverHelpMessage = function (evt) 
		{
			evt.stopPropagation();
			evt.preventDefault();
			
			evt.dataTransfer.dropEffect = "move";
			return false;
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dragLeaveGuide]
		 * guide 컴포넌트에 dragleave event발생시 호출 
		 * @param {Event} 
		 */    
		_pExtFileUpload._dragLeaveGuide = function (evt) 
		{
			//guideComp 보다 z-order가 상위인 컴포넌트에 마우스가 이동하면 dragleave 이벤트가 발생한다.
			//이를 제어하기 위해서 guideComp의 clientX, clientY영역 내부일 경우에는 동작을 중지 시킨다.
			var cx = evt.clientX;
			var cy = evt.clientY;
			var pThis = this._pExtFileUploadTarget;
			var guideComp = pThis.guideComp;
			//showmodal과 같은 상황에서 좌표를 계산하기 위한 처리.
			var convertXY = pThis.parent.gfnConvertXY(nexacro.getApplication().mainframe,[0,0], guideComp);
			var convertX   = convertXY[0];
			var convertY    = convertXY[1];			
			
			//trace("\n★★ 숨기기 시작  _dragLeaveGuide guideComp > " + guideComp.name + " ---convertX="+convertX +", convertY="+convertY);
			var leftWidth = 0,topWidth = 0,rightWidth = 0,bottomWidth = 0;
			
			var maxWidth = guideComp.getOffsetWidth() + convertX;
			var maxHeight = guideComp.getOffsetHeight() + convertY;
			
			var vscrollbarWidth = 0;
			var hscrollbarHeight = 0;
			var vscrollbar = guideComp["vscrollbar"];
			var hscrollbar = guideComp["hscrollbar"];
			if(vscrollbar && vscrollbar.visible) {
				vscrollbarWidth = vscrollbar.width; 
			}
			
			if(hscrollbar && hscrollbar.visible) {
				hscrollbarHeight = hscrollbar.height; 
			}    
			
			if( ((cx - leftWidth) <= convertX || (cx + rightWidth + vscrollbarWidth) >= maxWidth ) 
					|| (cy <= (convertY + topWidth) || (cy + bottomWidth + hscrollbarHeight) >= maxHeight) ) {
				
				evt.stopPropagation();
				evt.preventDefault();  
				
				pThis.helpMessage.set_visible(false);
				
				return;
			}
			
			evt.stopPropagation();
			evt.preventDefault();
		};    
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dragEnterAddFiles]
		 * @param {Event} 
		 */    
		_pExtFileUpload._dragEnterAddFiles = function (evt) 
		{
			evt.stopPropagation();
			evt.preventDefault();
		};
		
		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dragLeaveAddFiles]
		 * @param {Event} 
		 */    
		_pExtFileUpload._dragLeaveAddFiles = function (evt) 
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		/**
		 * @class exacro.ExtFileUpDownload : Logical Part ( Internal Function Part ) [_dropAddFiles]
		 * @param {Event} 
		 */ 
		_pExtFileUpload._dropAddFiles = function (evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
			
			if (evt.dataTransfer)
			{
				var pThis = this._pExtFileUploadTarget;
				if(pThis)
				{
					pThis.on_fire_onchange(pThis, evt.type, evt.dataTransfer.files);
				}
			}
		};
		delete _pExtFileUpload;
	};

	/**
	 * @class  DOWNLOAD컴포넌트 생성 START
	*/
	if (!nexacro.ExtFileDownload)
	{
		/**
		 * @class nexacro.ExtFileDownload
		 */  
		nexacro.ExtFileDownload = function (id, parent)
		{
			//UserObject 생성시 처리용
			if (arguments.length == 9) {
				parent = arguments[8];
			}
			
			//var position = "absolute";
			nexacro.Component.call(this, id, 0,0,0,0, null, null, parent);
			
			// User Property
			this.downloadurl = "";
			this.support = {};
			this.downloadfilename = ""; //09.03.2015
			parent.gfnCopyProperties(this.support, nexacro._ExtFileUpDownloadSupport);			
			
			// internal variable  
			this._form = parent;
			this._pExtFileItem;
			//this._accessibility_role = "fileupload";
			
			this._event_list = {
				"onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
				"onkillfocus": 1, "onsetfocus": 1, "onmove": 1, "onsize": 1,
				"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
				"onlbuttondown": 1, "onlbuttonup": 1, "onmouseenter": 1, "onmouseleave": 1, 
				"onmousemove": 1, "onrbuttondown": 1, "onrbuttonup": 1,
				"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
				"ontap": 1, "ondbltap": 1, "onpinchstart": 1, "onpinch": 1, "onpinchend": 1,
				"onflingstart": 1, "onfling": 1, "onflingend": 1,
				"onlongpress": 1, "onslidestart": 1, "onslide": 1, "onslideend": 1,
				
				// added event
				"onloadstart": 1, "onprogress": 1, "onload": 1, 
				"onloadend": 1, "onsuccess": 1, "onerror": 1, "onchange": 1,
				"onreadystatechange": 1 // <== XMLHttpRequest readystatechange
			};
		};

		var _pExtFileDownload = nexacro._createPrototype(nexacro.Component);
		nexacro.ExtFileDownload.prototype = _pExtFileDownload;    
		

		_pExtFileDownload._type = "ExtFileDownload";
		_pExtFileDownload._type_name = "ExtFileDownload";    
		
		/**
		 * @class nexacro.ExtFileUpDownload : Create & Update & destroy
		 */  
		 
		 /**
		 * @class nexacro.ExtFileUpDownload : Create & Update & destroy [on_create_contents]
		 */  
		_pExtFileDownload.on_create_contents = function ()
		{
			//trace(">> ExtFileDownload on_create_contents ");
		};
		
		 /**
		 * @class nexacro.ExtFileUpDownload : Create & Update & destroy [on_created_contents]
		 */
		_pExtFileDownload.on_created_contents = function ()
		{
			//trace(">> ExtFileDownload on_created_contents ");
			var ranid = new Date().valueOf().toString();
			nexacro._create_hidden_frame(this._unique_id, ranid, this.on_load, this);    	
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Create & Update & destroy [on_destroy_contents]
		 */
		_pExtFileDownload.on_destroy_contents = function ()
		{
			nexacro._destroy_hidden_frame(this._unique_id, this);
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload : Create & Update & destroy [set_downloadurl]
		 */
		_pExtFileDownload.set_downloadurl = function (v)
		{
			if (v != this.downloadurl)
			{
				this.downloadurl = v;
			}
		};   
		
		/**
		 * @class nexacro.ExtFileUpDownload : Create & Update & destroy [set_downloadfilename]
		 */
		_pExtFileDownload.set_downloadfilename = function (v)
		{
			if (v != this.downloadfilename)
			{
				this.downloadfilename = v;
			}
		};
		 
		/**
		 * @class nexacro.ExtFileUpDownload :  [download]
		 * download file
		 * @param {=string} url 다운로드 fullPath url
		 * @param {string} filename 파일저장시 적용할 file name. 지원가능한 브라우저만 적용됨.
		 * @return {boolean} 다운로드 성공여부
		 */ 
		_pExtFileDownload.download = function (url, filename)
		{
		
			if(this.parent.gfnIsNull(filename))
			{
				alert("file name required.");
				return false;
			}
				
			//09.03.2015	
			this.set_downloadfilename(filename);
				
					
			var downloadurl;
			var rtn = false;
			if (!url)
			{
				downloadurl = nexacro._getServiceLocation(this.downloadurl);
			}
			else
			{
				downloadurl = nexacro._getServiceLocation(url);
			}
			
			if (downloadurl)
			{
				trace("\n다운로드 시작");
				var loadItem = new nexacro.ExtFileTransaction(downloadurl, "download", this._form);
				
				loadItem._downfilename = filename;
				//loadItem.on_start();
				
				if (this.support.XHR2 && (this.support.Download || this.support.MSSave))
				{
					trace("ExtFileUploadSupport.XHR2 지원");		
					
					loadItem.appendCallback(this, this.on_load_filemodule);
					
					this._startCommunication(loadItem, downloadurl, "", filename);
					rtn = true;
				}
				else
				{
					trace("ExtFileUploadSupport.XHR2 미지원");
					nexacro._download(downloadurl);
					rtn = true;
					
					if (loadItem._usewaitcursor)
						loadItem._hideWaitCursor();
				}
			}
			
			return rtn;
		};    
		
		/**
		 * @class nexacro.ExtFileUpDownload :  [_startCommunication]
		 * @param {Object} 트랜젝션오브젝트
		 * @param {string} url
		 * @param {Object} data
		 * @param {string} 파일아이디
		 */ 
		_pExtFileDownload._startCommunication = function (loadItem, url, data, fileId)
		{
			//user protocol        
			var path = url;
			var senddata = data;
			//trace("_startCommunication > loadItem._protocol=" + loadItem._protocol);
			
			if (loadItem._protocol < 0)
			{  
				var createadaptor = false;
				var protocoladp = nexacro._getProtocol(loadItem.protocol);
				if (!protocoladp)
				{
					var adptorclass = nexacro._executeEvalStr(loadItem.protocol);
					// adptorclass.
					if (adptorclass)
					{
						protocoladp = new adptorclass;
						createadaptor = true;
					}
				}

				if (protocoladp)
				{
					if (createadaptor && protocoladp.initialize)
					{
						protocoladp.initialize(url);
						nexacro._addProtocol(loadItem.protocol, protocoladp);
					}

					var protocol = protocoladp.getUsingProtocol(url);
					var sep = path.split("://");
					if (sep)
					{
						path = protocol + "://" + sep[1];
					}

					// encode             
					if (data && protocoladp.encrypt)
					{
						senddata = loadItem.on_encrypt(data);
					}

					// extra header 정보 
					if (protocoladp.getCommunicationHeaders)
					{
						var headers = protocoladp.getCommunicationHeaders(url);
						if (headers)
							loadItem._addCookieFromVariables(headers);
					}
				}
			}

			this.__startCommunication(loadItem, path, senddata, fileId);
		};
		
		/**
		 * @class nexacro.ExtFileUpDownload :  [__startCommunication]
		 * @param {Object} 트랜젝션오브젝트
		 * @param {string} url
		 * @param {Object} data
		 * @param {string} 파일아이디
		 */
		_pExtFileDownload.__startCommunication = function (loadItem, path, senddata, fileId)
		{   
			var _ajax = nexacro.__createHttpRequest();
			var ajax_handle = _ajax.handle;
			// parse protocol       
			if (path.indexOf("://") > -1)
			{
				var ar = path.split("://");
				var protocol = ar[0];
				switch (protocol)
				{
					case "http": _ajax._protocol = 0; break;
					case "https": _ajax._protocol = 1; break;
					case "file": _ajax._protocol = 2; break;
					default: _ajax._protocol = -1; break;
				}
			}
			
			var method = "GET";        
			var mime_xml = false;

			ajax_handle._pExtFileTarget = this;
			ajax_handle._pExtFileItem = loadItem;
			
			
			/*
			readystatechange : The readyState attribute changes value
			
				type    :           Description         :     Times     :               When
			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			loadstart   :   Progress has begun.         :  Once.        :   First.
			progress    :   In progress.                :  Zero or more.:   After loadstart has been dispatched.
			error       :   Progression failed.         :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			abort       :   Progression is terminated.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			load        :   Progression is successful.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			loadend     :   Progress has stopped.       :  Once.        :   After one of error, abort, or load has been dispatched.
			*/
				nexacro._observeSysEvent(ajax_handle, "loadstart", "onloadstart", this._makeLoadstartHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "progress", "onprogress", this._makeProcessHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "load", "onload", this._makeLoadHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "loadend", "onloadend", this._makeLoadendHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "error", "onerror", this._makeErrorHandler(this, fileId, loadItem));
				
				//XHR 에러처리용.
				//신규추가. 2014.10.20 
				nexacro._observeSysEvent(ajax_handle, "readystatechange", "onreadystatechange", this._makeReadystateChangeHandler(this, fileId, loadItem.type));
				nexacro._observeSysEvent(ajax_handle, "abort", "onabort", this._makeTransferCanceledHandler(this, fileId));
				
			
			try 
			{            
				ajax_handle.open(method, path, true);
				ajax_handle.responseType = "blob";
				
			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}
			
			if (mime_xml)
			{
				ajax_handle.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax_handle.setRequestHeader("Accept", "application/xml, text/xml, */*");
			}
			
			try 
			{
				ajax_handle.send(senddata ? senddata : null);
			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}       

			_ajax = null;
		};

		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeLoadFileModule]
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @return {function} closure of on_load_filemodule
		 */
		_pExtFileDownload._makeLoadFileModule = function (pThis, pFileId) {
			return function(type, code, msg, url) {
				pThis.on_fire_onload(type, code, msg, url, pFileId);
			};
		};    

		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeProcessHandler]
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onprogress
		 */
		_pExtFileDownload._makeProcessHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onprogress(pThis, pLoadItem.type, evt, pFileId);
			};
		};

		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeProcessHandler]
		 * 전송 시작시 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadstart
		 */ 
		_pExtFileDownload._makeLoadstartHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onloadstart(pThis, pLoadItem.type, evt, pFileId);
			};
		};

		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeLoadHandler]
		 * 전송이 성공 했을 때 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onload
		 */  
		_pExtFileDownload._makeLoadHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				var itemType = pLoadItem.type;
				if (this.readyState == 4 && this.status == 200) 
					{
						var cookie = "";
						if (pLoadItem.context)
						{
							cookie = pLoadItem.context._getWindow()._doc.cookie;
						}
						
						var data;
						if (itemType == "upload")
						{
							data = this.responseText || "";
							pLoadItem.on_load_file(data, cookie, this.status, this.statusText);
						}
						else if (itemType == "download")
						{
							if (this.responseType == "blob")
							{
								data = this.response;
								pLoadItem.on_down_file(data, pThis._unique_id, cookie, this.status, this.statusText);
							}
							else
							{
								var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
								pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
							}
						}
					}
					else
					{
						var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
						pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
					} 		
			};
	   
		};    

		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeLoadendHandler]
		 * 전송 완료 체크용(성공과 실패에 무관하게 발생함!) closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadend
		 */   
		_pExtFileDownload._makeLoadendHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				var itemType = pLoadItem.type;
				if (itemType == "download")
				{
					if (this.responseType == "blob")
					{
						pLoadItem.on_downend_file();
					}
				}
				
				pThis.on_fire_onloadend(pThis, itemType, evt, pFileId);
				
				pLoadItem = null;
				pthis = null;
				
				if (this.upload._pExtFileTarget) this.upload._pExtFileTarget = null;
				if (this.upload._pExtFileItem) this.upload._pExtFileItem = null;    
			};
		};
 
		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeErrorHandler]
		 * 통신에러 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @param {string} type "upload","download"
		 * @return {function} closure of error
		 */   
		_pExtFileDownload._makeErrorHandler = function (pThis, pFileId, pLoadItem, type)
		{
			return function(evt) {
				
				if (pLoadItem._usewaitcursor)
					pLoadItem._hideWaitCursor();
				pThis.on_fire_onerror(pThis, -1, "File transfer was failure.", pThis, pFileId, pLoadItem.type);    		
			};

		};    

		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeReadystateChangeHandler]
		 * XHR 통신상태 체크용 closure.  2014.10.20 신규추가
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of error
		  
			  Holds the status of the XMLHttpRequest. Changes from 0 to 4: 
				0: request not initialized 
				1: server connection established
				2: request received 
				3: processing request 
				4: request finished and response is ready
			 
			  status
					  　200: "OK"
					  　404: Page not found
						   
					  참고사항: tomcat에서 jsp를 호출하던 중  java.lang.ClassNotFoundException 발생시 
					   500: internal server error 발생!!!  
		 */  
		_pExtFileDownload._makeReadystateChangeHandler = function (pThis, pFileId, pType)
		{
			//trace("ccc _makeReadystateChangeHandler pFileId="+pFileId + ",pType="+pType);
			return function(evt) {
				var xhrUpload = evt.target;
				//trace("readyState=" + xhrUpload.readyState + ", status=" + xhrUpload.status);
				//trace("ddd  _makeReadystateChangeHandler pFileId="+pFileId + ",pType="+pType);
				
				pThis.on_fire_onreadystatechange(pThis, xhrUpload.readyState, xhrUpload.status, pFileId, pType);    		
			};
		};      
 
		/**
		 * @class nexacro.ExtFileUpDownload :  [_makeTransferCanceledHandler]
		 * 전송취소 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of TransferCanceled
		 */  
		_pExtFileDownload._makeTransferCanceledHandler = function (pThis, pFileId)
		{
			return function(evt) {
				alert(pFileId + ". 사용자에 의해 전송이 취소되었습니다.");
			};
		};        
		
		/**
		 * @class nexacro.ExtFileUpDownload :  [on_load_filemodule]
		 * @param {string} type
		 * @param {string} code
		 * @param {string} msg
		 * @param {string} url
		 */  
		_pExtFileDownload.on_load_filemodule = function (type, code, msg, url)
		{
			this.on_fire_onload(type, code, msg, url);
		};    
		
		/**
		 * @class nexacro.ExtFileUpDownload :  [on_loadframe_filemodule]
		 * @param {string} type
		 * @param {string} code
		 * @param {string} msg
		 * @param {string} url
		 */  
		_pExtFileDownload.on_loadframe_filemodule = function (type, code, msg, url)
		{
			this.on_fire_onload(type, code, msg, url);
		};    
		
		/**
		 * @class nexacro.ExtFileUpDownload :  [on_load]
		 * @param {Object} target
		 */ 
		_pExtFileDownload.on_load = function (target)
		{
			var pLoadItem = this._pExtFileItem;    
			if (pLoadItem)
			{
				pLoadItem.on_loadframe_file(this._unique_id, target);
				pLoadItem = null;
			}
		};
		
		/**
		 * @class _pExtFileDownload : Event Handlers
		 */ 

		/**
		 * @class _pExtFileDownload [on_fire_onreadystatechange]
		 * XMLHttpRequest readystatechange event
		 * @param {string} type "upload" or "download"
		 */ 
		_pExtFileDownload.on_fire_onreadystatechange = function (obj, readyState, status, fileId, type) 
		{

			if (this.onreadystatechange && this.onreadystatechange._has_handlers)
			{   
				var evt = new nexacro.ExtFileReadystateChangEventInfo(obj, "readystatechange", readyState, status);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				this.onreadystatechange._fireEvent(this, evt);
			}
		};    
		
		/**
		 * @class _pExtFileDownload [on_fire_onloadstart]
		 * UI에서 아래 소스로 정의된 function이 실행된다.
		 * @param {Object} obj
		 * @param {String} type
		 * @param {Event} evt
		 * @param {Object} fileId
		 */
		_pExtFileDownload.on_fire_onloadstart = function (obj, type, evt, fileId)
		{
			if (this.onloadstart && this.onloadstart._has_handlers)
			{   
				var evt = new nexacro.Event.ExtFileProgress(obj, "onloadstart", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onloadstart", this.fileComp_onloadstart, this);
				this.onloadstart._fireEvent(this, evt);
			}
		};    
		
		/**
		 * @class _pExtFileDownload [on_fire_onerror]
		 * 에러발생
		 * @param {Object} obj
		 * @param {String} errorcode
		 * @param {String} errormsg
		 * @param {Object} errorobj
		 * @param {String} fileId
		 * @param {String} type
		 */
		_pExtFileDownload.on_fire_onerror = function (obj, errorcode, errormsg, errorobj, fileId, type)
		{
			var errormsg = nexacro._GetSystemErrorMsg(this, errorcode);
			if(this.parent.gfnIsNull(errormsg)) {
				errorcode = errorobj.status;
				errormsg = errorobj.statusText;
			}  
			
			if (this.onerror && this.onerror._has_handlers)
			{
				var evt = new nexacro.ExtFileErrorEventInfo(obj, "onerror", errorcode, errormsg, errorobj);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onerror", this.fileComp_onerror, this);            
				return this.onerror._fireEvent(this, evt);
			}
			
			return true;
			
		};  
		
		/**
		 * @class _pExtFileDownload [on_fire_onprogress]
		 * @param {Object} obj
		 * @param {String} type
		 * @param {Evnet} evt
		 * @param {String} fileId
		 */
		_pExtFileDownload.on_fire_onprogress = function (obj, type, evt, fileId)
		{
			if (this.onprogress && this.onprogress._has_handlers)
			{
				var evt = new nexacro.Event.ExtFileProgress(obj, "onprogress", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onprogress", this.fileComp_onprogress, this);
				this.onprogress._fireEvent(this, evt);
			}
		};    
		
		/**
		 * @class _pExtFileDownload [on_fire_onload]
		 * @param {String} type
		 * @param {String} code
		 * @param {String} msg
		 * @param {String} url
		 * @param {String} fileId
		 */
		_pExtFileDownload.on_fire_onload = function (type, code, msg, url, fileId)
		{
			if (this.onload && this.onload._has_handlers && url != "about:blank")
			{
				 //var evt = new nexacro.ExtFileLoadEventInfo(this, "onload", type, code, msg, url);
				var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess");
				evt["fileId"] = fileId;
				evt["type"] = "download";
				evt["errorcode"] = code;
				evt["errormsg"] = msg;
				evt["url"] = url;				 
				 return this.onload._fireEvent(this, evt);
			}
		};
		
		/**
		 * @class _pExtFileDownload [on_fire_onloadend]
		 * @param {Object} obj
		 * @param {String} type
		 * @param {Evnet} evt
		 * @param {String} fileId
		 */
		_pExtFileDownload.on_fire_onloadend = function (obj, type, evt, fileId)
		{
			if (this.onloadend && this.onloadend._has_handlers)
			{   
				var evt = new nexacro.Event.ExtFileProgress(obj, "onloadend", type, evt.lengthComputable, evt.loaded, evt.total);
				evt["fileId"] = fileId;
				this.onloadend._fireEvent(this, evt);
			}
		};    
		
		delete _pExtFileDownload;

	};

	/**
	 * @class file 전송용 transaction item 생성 START
	 */

	/**
	 * @class nexacro.ExtFileTransaction
	 * file 전송용 transaction item
	 * @param {string} path upload url
	 * @param {string} type "upload" or "download"
	 * @param {object} context context
	 * @param {string} inDatasetsParam input datasets string. ex) ds_input=ds_input....
	 * @param {string} outDatasetsParam output datasets string. ex) ds_output=ds_output.... 
	 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
	 */ 
	nexacro.ExtFileTransaction = function (path, type, context, inDatasetsParam, outDatasetsParam, datatype)
	{
		//nexacro._CommunicationItem.call(this, path, "module", false);
		nexacro._CommunicationItem.call(this, path, type, false);
		//ExtFileTransaction = new nexacro._CommunicationItem(path, type, false);
		
		this.context = context;
		this.inputDatasets = this._parseDSParam(inDatasetsParam);
		this.outputDatasets = this._parseDSParam(outDatasetsParam);
		//this.parameters = this._parseVarParam(argsParam);
		
		this.datatype = (!datatype ? 0 : datatype); // datatype => 0:XML, 1:Binary(Runtime only), 2:SSV
		this._sendData = this._serializeData();
		this.callbackList = [];
		this._usewaitcursor = nexacro._usewaitcursor;
		
		this._remain_data = null;
		if (system.navigatorname == "IE" && system.navigatorversion < 9)
		{
			this._check_responseXML = true; // read responseXML.
		}
		else
		{
			this._check_responseXML = false; // do not read responseXML.
		}        
		
	};

	var _pFileTransaction = nexacro._createPrototype(nexacro._CommunicationItem, nexacro.ExtFileTransaction);
	nexacro.ExtFileTransaction.prototype = _pFileTransaction;

	_pFileTransaction._type = "ExtFileTransaction";
	_pFileTransaction._type_name = "ExtFileTransaction";

	/**
	 * @class nexacro.ExtFileTransaction [_serializeData]
	 */ 
	_pFileTransaction._serializeData = function ()
	{
		if (this.datatype == 1) // BIN (Runtime Only)
		{
			return this.__serializeBIN();
		}
		else if (this.datatype == 2) // SSV
		{
			return this.__serializeSSV();
		}
		else
		{
			return this.__serializeXML();
		}
		
	};    

	_pFileTransaction._TABS = ["", "\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t"];
	_pFileTransaction._writeData = function (list, str, depth) 
	{
		list[list.length] = this._TABS[depth] + str;
	};

	/**
	 * @class nexacro.ExtFileTransaction [__serializeXML]
	 */ 
	_pFileTransaction.__serializeXML = function () 
	{
		var depth = 0;
		var list = [];
		var cookievar = nexacro.getApplication()._cookie_variables;
		
		//[START] xml 통신시 아래의 특수문자가 서버쪽 SAX parser 에러가 발생해서 임시 추가함.
		this._writeData(list, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>", depth);
		this._writeData(list, "<!DOCTYPE p_nexacro [ <!ENTITY nbsp '&#160;'> <!ENTITY quot '&#34;'>" +
				" <!ENTITY amp '&#38;'> <!ENTITY lt '&#60;'> <!ENTITY gt '&#62;'> ]>", depth);
		//[END] xml 통신시 아래의 특수문자가 서버쪽 SAX parser 에러가 발생해서 임시 추가함.
		
		this._writeData(list, "<Root xmlns=\"http://www.nexacroplatform.com/platform/dataset\">", depth++);
		
		var argParamsCnt = 0;
		var cookievarCnt = 0;
		
		var argParams = this.parameters;
		if (argParams)
		{
			argParamsCnt = argParams.length;
		}
		if (cookievar)
		{
			cookievarCnt = cookievar.length;
		}

		if (argParamsCnt > 0 || cookievarCnt > 0) 
		{
			this._writeData(list, "<Parameters>", depth++);
			if (argParamsCnt > 0)
			{
				for (var i = 0; i < argParamsCnt; i++)
				{
					var id = argParams[i].lval;
					var val = argParams[i].rval;

					if (val && val.length) 
					{
						val = nexacro._encodeXml(val);
						this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
					} 
					else 
					{
						this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
					}
				}
			}
			this._writeData(list, "</Parameters>", --depth);
		} 
		else 
		{
			this._writeData(list, "<Parameters />", depth);
		}
		
		var datasetParams = this.inputDatasets;
		if (datasetParams && datasetParams.length) 
		{
			var datasetCnt = datasetParams.length;
			for (i = 0; i < datasetCnt; i++)
			{
				var id = datasetParams[i].rval;
				var ds = this.context._getDatasetObject(id);
				if (ds) 
				{
					list.push(ds._saveXML(datasetParams[i].lval, datasetParams[i].saveType, depth, false));
				}
			}
		}		
		this._writeData(list, "</Root>", --depth);

		var rntVal;

		if (argParamsCnt == 0 && cookievarCnt == 0 && (!datasetParams || datasetParams.length == 0))
		{
			rntVal = "";
		}
		else
		{
			rntVal = list.join("\n");
		}
		
		return rntVal;
	};    

	/**
	 * @class nexacro.ExtFileTransaction [__serializeSSV]
	 */ 
	_pFileTransaction.__serializeSSV = function ()
	{
		var _rs_ = String.fromCharCode(30);
		var _cs_ = String.fromCharCode(31);

		var depth = 0;
		var list = [];
		var cookievar = nexacro.getApplication()._cookie_variables;
		var id, val, ds;
		
		var listLength = 0;
		list.push("SSV:utf-8" + _rs_);
		
		// Variables
		var argParamsCnt = 0;
		var cookievarCnt = 0;
		
		var argParams = this.parameters;
		if (argParams)
		{
			argParamsCnt = argParams.length;
		}
		if (cookievar)
		{
			cookievarCnt = cookievar.length;
		}
			
		if (cookievarCnt > 0)
		{
			for (i = 0; i < cookievarCnt; i++) 
			{
				id = cookievar[i];
				val = application[id];

				if (val && val.length) 
				{
					val = val;
					list.push(id + "=" + val + _rs_);
				} 
				else 
				{
					list.push(id + "=" + _rs_);
				}
			}
		}
		if (argParamsCnt > 0)
		{
			for (i = 0; i < argParamsCnt; i++) 
			{
				id = argParams[i].lval;
				val = argParams[i].rval;

				if (val) 
				{
					val = val;
					list.push(id + "=" + val + _rs_);
				} 
				else 
				{
					list.push(id + "=" + _rs_);
				}
			}
		}
		
		// Dataset
		var datasetParams = this.inputDatasets;
		if (datasetParams && datasetParams.length) 
		{
			var datasetCnt = datasetParams.length;
			for (var i = 0; i < datasetCnt; i++) 
			{
				var id = datasetParams[i].rval;
				var ds = this.context._getDatasetObject(id);   
				if (ds) 
				{
					list.push(ds.saveSSV(datasetParams[i].lval, datasetParams[i].saveType));
				}
			}	
		}
		
		var rtnVal = list.join("");
		return rtnVal;
	};

	/**
	 * @class nexacro.ExtFileTransaction [__serializeBIN]
	 */ 
	_pFileTransaction.__serializeBIN = function ()
	{
		var ssvdata = this.__serializeSSV();
		if (ssvdata)
		{
			return nexacro._convertStreamSSVToBIN(ssvdata);
		}
		return "";
	};	
	
	/**
	 * @class nexacro.ExtFileTransaction [on_start]
	 */ 
	_pFileTransaction.on_start = function ()
	{
		if (this._usewaitcursor)
		{
			this._showWaitCursor();
		}
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [on_load_file]
	 */ 
	_pFileTransaction.on_load_file = function (data, cookie, status, statusText)
	{
		if (this._usewaitcursor)
		{
			this._hideWaitCursor();
		}
		
		if (!data)
		{
			return [-1, "Stream Data is null!"];
		}

		data = data.trim();
		var fstr = data.substring(0, 3);
		
		var result, i, 
			id, val,
			code = 0, msg = "";

		//신규 추가	
		var scope = this.scope;
		if(!scope["_extFileDsPool"]) {
			scope["_extFileDsPool"] = [];
		}
				
		var datasetPool = scope["_extFileDsPool"];
		
		
		if (fstr == "SSV") // SSV Type (HEX:53,53,56)
		{ 
			//trace("\n\n\t==== HTML5 SSV 처리 시작 ===");
			
			result = this.__deserializeSSV(data);			
			code = result[0];
			msg = result[1] + "[" + status + "," + statusText + "]";
		} 
		else //XML Type
		{
			//trace("\n\n\t==== HTML5 XML 처리 시작 ===");
			result = this._deserializeXMLFromStr(data);
			code = result[0];
			msg = result[1] + "[" + status + "," + statusText + "]";			
		}		

		//신규추가
		var datasets = [];
		var len = datasetPool.length;
		var ds;
		for(var i=0; i<len; i++) {
			ds = datasetPool[i];
			if(ds["_used"]) {
				datasets.push(ds);
			}
		}		
		
		
		delete nexacro._CommunicationManager[this.path];
		
		
		
		
		if (this._protocol < 0)
			data = this.on_decrypt(data);  

		this._addCookieToCookieVariable(cookie);

		var callbackList = this.callbackList;
		var n = callbackList.length;
		if (n > 0)
		{
			for (var i = 0; i < n; i++)
			{
				var item = callbackList[i];
				var target = item.target;
				if (target._is_alive != false) {
					item.callback.call(target, this.type, code, msg, this.path, datasets);
				}
			}
			
			callbackList.splice(0, n);
			
			this.releaseResponseDataset(scope);
		}
		//this._handle = null;       
	};

	/**
	 * @class nexacro.ExtFileTransaction [on_loadframe_file]
	 */ 
	_pFileTransaction.on_loadframe_file = function (unique_id, target)
	{
		if (this._usewaitcursor)
		{
			this._hideWaitCursor();
		}
		
		var i, id, 
			val, xmldoc,
			result, variables,
			datasets, form,
			code = 0, msg = "";
		
		form = this.context;
		xmldoc = nexacro._getXMLDocument(unique_id);
		result = nexacro._getDataFromDOM(xmldoc, this);
		
		variables = result[0];
		for (i = 0; i < variables.length; i++)
		{
			id = variables[i]["id"];
			if (id && id.length)
			{
				val = variables[i]["val"];
				if (id == "ErrorCode")
				{
					code = parseInt(val, 10);
					if (!isFinite(code))
					{
						code = -1;
					}
				}
				else if (id == "ErrorMsg")
				{
					msg = val;
				}
			}
		}
		
		
		delete nexacro._CommunicationManager[this.path];

		var callbackList = this.callbackList;
		var n = callbackList.length;
		if (n > 0)
		{
			for (var i = 0; i < n; i++)
			{
				var item = callbackList[i];
				var target = item.target;
				if (target._is_alive != false)
					//IE 8,9에서 onsuccess event의 e.datasets에서 수신하기 위해 별도 추가. 2015.03.16
					item.callback.call(target, this.type, code, msg, this.path, result[1]);
			}
			callbackList.splice(0, n);
		}
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [on_down_file]
	 */ 
	_pFileTransaction.on_down_file = function (data, unique_id, cookie, status, statusText)
	{
		
		var url,
			saveFilename = this._downfilename;

		if (nexacro._ExtFileUpDownloadSupport.Download)
		{
			url = this._createObjectURL(data); // response is a blob
			this._downfileblob = url;
			
			var manager = nexacro._IframeManager;
			var form = manager.search_form(unique_id);
			if (form && form.node)
			{
				var node = form.node;
				var doc = nexacro._managerFrameDoc;
				var ahref = doc.createElement("a");
				ahref.href = url;
				ahref.download = saveFilename;
				//ahref.style.display = "none";
				
				//node.appendChild(ahref);
				nexacro.__appendDOMNode(node, ahref);
				ahref.click();
				
				nexacro.__removeDOMNode(node, ahref);
				ahref = null;
			}
		}
		else if (nexacro._ExtFileUpDownloadSupport.MSSave)
		{
			window.navigator.msSaveOrOpenBlob(data, saveFilename);
		}
		else
		{
			nexacro._download(this.path);
		}
		
		delete nexacro._CommunicationManager[this.path];
		
		if (this._protocol < 0)
			data = this.on_decrypt(data);   

		this._addCookieToCookieVariable(cookie);

		var callbackList = this.callbackList;
		var n = callbackList.length;
		if (n > 0)
		{
			for (var i = 0; i < n; i++)
			{
				var item = callbackList[i];
				var target = item.target;
				if (target._is_alive != false)
					item.callback.call(target, this.type, status, statusText, this.path);
			}
			callbackList.splice(0, n);
		}
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [on_downend_file]
	 */ 
	_pFileTransaction.on_downend_file = function ()
	{	
		var url = this._downfileblob,
			pThis = this;
		
		if (nexacro._ExtFileUpDownloadSupport.Download && url)
		{
			setTimeout( function () {
				pThis._revokeObjectURL(url);
			}, 250);
		}
		
		if (this._usewaitcursor)
		{
			this._hideWaitCursor();
		}
		
		this._downfileblob = null;
		this._downfilename = null;
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [_createObjectURL]
	 */ 
	_pFileTransaction._createObjectURL = function (blob)
	{
		return window.URL.createObjectURL(blob);
	};

	/**
	 * @class nexacro.ExtFileTransaction [_revokeObjectURL]
	 */ 
	_pFileTransaction._revokeObjectURL = function (url)
	{
		if (window.webkitURL)
		{
			window.webkitURL.revokeObjectURL(url);
		} 
		else if (window.URL && window.URL.revokeObjectURL) 
		{
			window.URL.revokeObjectURL(url);
		}
	};

	/**
	 * @class nexacro.ExtFileTransaction [__deserializeSSV]
	 */ 
	_pFileTransaction.__deserializeSSV = function (strRecvData) 
	{
		//trace("HTML5__deserializeSSV 호출");
		var _rs_ = String.fromCharCode(30);
		var _cs_ = String.fromCharCode(31);
		
		var code = 0;
		var message = "SUCCESS";

		if (!strRecvData)
		{
			return [-1, "Stream Data is null!"];
		}
		
		var form = this.context;

		var ssvLines = strRecvData.split(_rs_);
		var lineCnt = ssvLines.length;
		var curIdx = 0;	    
		curIdx++;

		var curStr;

		// parse parameters		
		for (; curIdx < lineCnt; curIdx++)
		{
			curStr = ssvLines[curIdx];
			if (curStr.substring(0, 7) != "Dataset")
			{
				var paramArr = curStr.split(_cs_);
				var paramCnt = paramArr.length;
				for (var i = 0; i < paramCnt; i++)
				{
					var paramStr = paramArr[i];
					var varInfo = paramStr;
					var val = undefined;
					var sep_pos = paramStr.indexOf("="); 
					if (sep_pos >= 0)
					{
						varInfo = paramStr.substring(0, sep_pos);
						val = paramStr.substring(sep_pos + 1);
					}

					if (varInfo)
					{
						var id = varInfo;
						var sep_pos = varInfo.indexOf(":");
						if (sep_pos >= 0)
						{
							id = varInfo.substring(0, sep_pos);
						}

						if (id == "ErrorCode")
						{		                    
							code = parseInt(val) | 0;
							if (isFinite(code) == false)
							{
								code = -1;
							}
						}
						else if (id == "ErrorMsg")
						{
							message = val;
						}
						else if (id in form)  //1.form(application) variable 
						{
							if (typeof (form[id]) != "object")
							{
								form[id] = val;
							}
						}
						else //application globalvariable 
						{
							if (nexacro.getApplication()._existVariable(id))
							{
								application[id] = val;
							}
						}
					}
				}
			}
			else
			{
				break;
			}
		}

		if (code <= -1)
		{
			return [code, message];
		}

		var inDatasets = this.inputDatasets;
		if (inDatasets && inDatasets.length) 
		{
			var inDataCnt = inDatasets.length;
			for (var i = 0; i < inDataCnt; i++)
			{
				var param = inDatasets[i];
				var ds = form._getDatasetObject(param.rval);  
				if (ds) 
				{
					ds.applyChange();					
				}
			}
		}

		var dsIds = {};
		var outDatasets = this.outputDatasets;
		if (outDatasets && outDatasets.length) 
		{
			var outDataCnt = outDatasets.length;
			//trace("@step 3-3 outDataCnt="+outDataCnt);
			for (var i = 0; i < outDataCnt; i++)
			{
				var param = outDatasets[i];
				if (dsIds[param.rval] == undefined)
				{
					//trace("@step 3-5 param.rval="+param.rval + ",param.lval="+param.lval );
					dsIds[param.rval] = param.lval;
				}
			}
		}

		function find_next_dataset_loop()
		{
			if (curIdx < lineCnt)
			{
				curStr = ssvLines[curIdx];
				if (curStr.substring(0, 7) == "Dataset")
				{
					return true;
				}
				curIdx++;
				return false;
			}
			return true;
		}

		while (curIdx < lineCnt)
		{
			while (true)
			{
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;				

			}
			
			if (curIdx < lineCnt)
			{
				var sep_pos = curStr.indexOf(":");
				if (sep_pos >= 0)
				{
					var remoteId = curStr.substring(sep_pos + 1);
					if (remoteId && remoteId.length) 
					{
						//var localId = dsIds[remoteId];
						//var ds = form._getDatasetObject(localId);	 			
						
						var ds = this.getResponseDataset(form);
						
						if (ds)
						{
							ds.rowposition = -1;
							curIdx = ds.loadFromSSVArray(ssvLines, lineCnt, curIdx, true);
						}
						else
						{
							curIdx++;
						}
					}
					else
					{
						curIdx++;
					}
				}
				else
				{
					curIdx++;
				}
			}
		}

		return [code, message];
	};	

	 /**
	 * @class nexacro.ExtFileTransaction [getResponseDataset]
	 * 엑셀 sheet 갯수에 해당하는 output dataset 개수 만큼
	 * 동적생성 후 반환한다.
	 */ 
	_pFileTransaction.getResponseDataset = function (scope) {
		var datasetPool = scope["_extFileDsPool"];
		var size = datasetPool.length;
		var ds;
		var tempDs;
		var isUsed;
		var uidPrefix = "_ds_extResponse_"; 
		
		for(var i=0; i<size; i++)
		{		
			tempDs = datasetPool[i];
			isUsed = tempDs["_used"];
			
			if(!isUsed)
			{
				ds = tempDs;
				ds["_used"] = true;
				break;
			}			
		}
		
		
		if(!ds)
		{
			var uid = this.context.gfnGetSequenceId(scope, uidPrefix);
			ds = new Dataset(uid);
			
			ds["_used"] = true;
			datasetPool.push(ds);
		}

		return ds;			

	};	

	/**
	 * @class nexacro.ExtFileTransaction [releaseResponseDataset]
	 */ 
	_pFileTransaction.releaseResponseDataset = function (scope) {
		var datasetPool = scope["_extFileDsPool"];
		var size = datasetPool.length;
		var tempDs;
		var isUsed;
		
		for(var i=0; i<size; i++)
		{
			tempDs = datasetPool[i];
			tempDs.clear();
			tempDs["_used"] = false;
		}	

	};	
	
	/**
	 * @class nexacro.ExtFileTransaction [_deserializeXMLFromStr]
	 */
	_pFileTransaction._deserializeXMLFromStr = function (strRecvData)
	{
		var code = 0;
		var message = "SUCCESS";

		if (!strRecvData)
		{
			return [-1, "Stream Data is null!"];
		}

		var form = this.context;

		// parse params
		var xml_parse_pos = strRecvData.indexOf("<Dataset ");
		var headerData;
		if (xml_parse_pos > -1)
		{
			headerData = strRecvData.substring(0, xml_parse_pos);
		}
		else
		{
			headerData = strRecvData;
		}

		var head_parse_pos = 0;
		var paramsInfo = nexacro._getXMLTagData(headerData, head_parse_pos, "<Parameters>", "</Parameters>");
		if (paramsInfo)
		{
			var paramsData = paramsInfo[0];
			head_parse_pos = paramsInfo[3];

			var param_parse_pos = 0;
			var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
			while (varInfo)
			{
				param_parse_pos = varInfo[3];
				var attrStr = varInfo[1];
				var id = nexacro._getXMLAttributeID(attrStr);
				if (id && id.length)
				{
					var val = varInfo[0];

					if (id == "ErrorCode")
					{
						//code = parseInt(val) | -1;
						code = parseInt(val) | 0;
						if (isFinite(code) == false)
						{
							code = -1;
						}
					}
					else if (id == "ErrorMsg")
					{
						message = val;
					}
					else
					{
						this._setParamter(id, val);
					}
				}
				
				// for Next
				varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
			}
		}

		if (code <= -1)
		{
			return [code, message];
		}
		
		
		//outDatasets 처리
		var dsIds = {};
		var outDatasets = this.outputDatasets;
		//trace("\n\noutDatasets="+outDatasets);
		if (outDatasets && outDatasets.length)
		{
			var outDataCnt = outDatasets.length;
			for (var i = 0; i < outDataCnt; i++)
			{
				var param = outDatasets[i];
				//trace(" >>>>> param.lval="+param.lval + ", param.rval="+param.rval);
				if (dsIds[param.rval] == undefined){
					dsIds[param.rval] = param.lval;
				}
			}
		}

		// data set parse
		if (xml_parse_pos >= -1)
		{
			var datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
			while (datasetInfo)
			{
				xml_parse_pos = datasetInfo[3];
				var attrStr = datasetInfo[1];
				var remoteId = nexacro._getXMLAttributeID(attrStr);
				if (remoteId && remoteId.length)
				{
					//var localId = dsIds[remoteId];
					//var ds = form._getDatasetObject(localId);
					
					var ds = this.getResponseDataset(form);
					if (ds)
					{
						ds.loadFromXMLStr(datasetInfo[0]);
					}
				}
				
				// for Next
				datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
			}
		}

		dsIds = null;
		return [code, message];
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [_parseVarParam]
	 */
	_pFileTransaction._parseVarParam = function (paramStr) 
	{
		if (!paramStr)
		{
			return;
		}

		paramStr = paramStr.replace(/^\s*|\s*$/g, '');
		if (paramStr.length == 0)
		{
			return undefined;
		}

		var list = [];
		var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*="([^"]*)"|([a-zA-Z_][a-zA-Z0-9_]*)\s*='([^']*)'|([a-zA-Z_][a-zA-Z0-9_]*)\s*=([^ ]*)/g;
		
		var splitedParams = paramStr.match(expr);
		var splitedParamCnt = splitedParams.length;
		
		for (var i = 0; i < splitedParamCnt; i++)
		{
			var param = splitedParams[i].split("=");
			var len = param.length;
			var key = param[0].trim();
			var value = param[1].trim();			
			
			for (var j = 2; j < len; j++) 
			{
				value = value + "="+ param[j].trim();
			}
				
			var type = "N";

			var len = value.length;
			if (len > 0) 
			{
				if ((value.charAt(0) == "\"" && value.charAt(len - 1) == "\"") || (value.charAt(0) == "\'" && value.charAt(len - 1) == "\'"))
				{
					value = value.substring(1, len - 1);
				}
			}

			var paramObj =
			{
				lval: key,
				rval: value,
				saveType: type
			};

			list.push(paramObj);
		}
		return list;
	};	

	/**
	 * @class nexacro.ExtFileTransaction [_parseDSParam]
	 */
	_pFileTransaction._parseDSParam = function (paramStr) 
	{
		if (!paramStr) 
		{
			return undefined;
		}

		var list = [];
		var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\:[aAuUnN])?)/g;
		var splitedParams = paramStr.match(expr);//expr.test(paramStr);
		
		// output ds가 명시되지 않은 경우 리턴
		if (!splitedParams || splitedParams.length == 0)
		{
			return undefined;
		}

		var splitedParamCnt = splitedParams.length;
		var listLength = 0;
		
		// TODO 정규표현식의 캡처값 사용, RegExp.exec 사용시 처음 값만 반환됨, 정규식 확인 ?
		for (var i = 0; i < splitedParamCnt; i++)
		{
			var param = splitedParams[i].split("=");
			var key = param[0].trim();
			var value = param[1].trim();            
			
			//동일한 dataset id가 들어오면 무시한다. 
			var bduplicate = false;
			for (var j = 0; j < i; j++) 
			{
				var checkparam = splitedParams[j].split("=");
				var checkkey = checkparam[0].trim();
				 if (key == checkkey)
					 bduplicate = true;
			}           
			if (bduplicate) 
			{
				//continue;
				i++;
				return false;
			}
			
			var type = "N";

			var index = value.indexOf(":");
			if (index > -1) 
			{
				type = value.substring(index + 1);
				value = value.substring(0, index);
			}

			var paramObj = 
			{
				lval: key,
				rval: value,
				saveType: type
			};
			list.push(paramObj);
		}
		return list;
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [_setParamter]
	 */
	_pFileTransaction._setParamter = function (id, val)
	{
		var form = this.context;
		//trace("_setParamter form:" + form.name);
		
		// form(application) variable 
		if (id in form) 
		{
			if (typeof (form[id]) != "object")
			{
				form[id] = val;
			}
		}
		else //	application globalvariable 
		{
			if (nexacro.getApplication()._existVariable(id))
			{
				application[id] = val;
			}
		}
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [_getDataset]
	 */
	_pFileTransaction._getDataset = function (id)
	{
		var form = this.context;
		var outDatasets = this.outputDatasets;
		if (outDatasets && outDatasets.length)
		{
			var outDataCnt = outDatasets.length;
			for (var i = 0; i < outDataCnt; i++)
			{
				var param = outDatasets[i];
				if (param.rval == id)
				{
					return form._getDatasetObject(param.lval);
				}
			}
		}
	};

	/**
	 * @class nexacro.ExtFileTransaction [_showWaitCursor]
	 */
	_pFileTransaction._showWaitCursor = function ()
	{
		// zoo - 확인
		return;
		
		var form = this.context;
		if (form)
		{
			form._waitCursor(true, form);
		}
	};
	
	/**
	 * @class nexacro.ExtFileTransaction [_hideWaitCursor]
	 */
	_pFileTransaction._hideWaitCursor = function ()
	{
		// zoo - 확인
		return;
		
		var form = this.context;
		if (form)
		{
			form._waitCursor(false, form);
		}
	};

	delete _pFileTransaction;

	/**
	 * @class nexacro.ExtFileButtonCtrl생성
	 */
	nexacro.ExtFileButtonCtrl = function (id, position, left, top, width, height, right, bottom, parent)
	{
		//trace("ExtFileButtonCtrl : " + width + "," + height);
		nexacro.Button.call(this, id, position, left, top, width, height, right, bottom, parent);
		this._is_subcontrol = true;
	};

	var _pExtFileButtonCtrl = nexacro._createPrototype(nexacro.Button);

	nexacro.ExtFileButtonCtrl.prototype = _pExtFileButtonCtrl

	_pExtFileButtonCtrl._type = "ExtFileButtonCtrl";
	_pExtFileButtonCtrl._type_name = "ExtFileButtonCtrl";

	/**
	 * @class nexacro.ExtFileButtonCtrl : Event Handler
	 */
	 
	/**
	 * @class nexacro.ExtFileButtonCtrl : Event Handler [_isPopupFrame]
	 */ 
	_pExtFileButtonCtrl._isPopupFrame = function ()
	{
		return false;
	};

	delete _pExtFileButtonCtrl;
}