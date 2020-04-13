/**
 * @fileoverview nexacro Components의 Style과 관련된 함수.
 */

if ( !JsNamespace.exist("Eco.XComp.Style") )
{
	/**
	 * <pre>
	 * [참고사항]
	 * text-overflow (div 속성)의 ellipsis는 single line 만 지원함.
	 * Static에 줄바꿈이 존재할 때 &lt;br&gt;&lt;/br&gt; 태그가 들어감(크롬은 &lt;br&gt;).
	 * 크롬은 어떤이유인지는 모르겠으나 위의 경우도 처리가 되는듯 하나 IE에서는 불가함.
	 * </code>
	 * @namespace
	 * @name Eco.XComp.Style
	 * @memberof! <global>
	 */
	JsNamespace.declare("Eco.XComp.Style", {
		
		/**
		* Runtime 지원 Style 목록.
		* @private 
		* @memberOf Eco.XComp.Style
		*/
		_runtimeStyleList : [
		    "background",
		    "border",
		    "border-radius",
		    "box-shadow",
		    "color",
			"edge",
		    "font",
		    "icon",
			"icon-position ",
		    "letter-spacing",
		    "line-height",
		    "opacity",
		    "padding",
		    "text-align",
		    "text-decoration",
		    "text-padding",
		    "vertical-align",
		    "word-wrap",
		    "word-spacing"
		],
		
		 /**
		 * nexacro Component의 border width(px)를 반환한다.
		 * @param {XComp} xComp nexacro Component
		 * @return {array.<number>} [ leftWdith, topWdith, rightWdith, bottomWdith ]
		 * @example
		 * trace(Eco.XComp.Style.getBorderWidth("border style이 none이거나 width가 0일 경우")); //output: [0,0,0,0] 
		 * trace(Eco.XComp.Style.getBorderWidth("border가 1인 component")); //output: [1,1,1,1]
		 *
		 * @memberOf Eco.XComp.Style
		 */
		getBorderWidth: function(xComp)	
		{
			var border = xComp._getCurrentStyleBorder();
			var leftWidth = 0,topWidth = 0,rightWidth = 0,bottomWidth = 0;
			
			if (border)
			{
				leftWidth   = border.left.width;
				topWidth    = border.top.width;
				rightWidth  = border.right.width;
				bottomWidth = border.bottom.width;
				
				leftWidth   = nexacro.toNumber(leftWidth.replace("px",""), 0);
				topWidth    = nexacro.toNumber(topWidth.replace("px",""), 0);
				rightWidth  = nexacro.toNumber(rightWidth.replace("px",""), 0);
				bottomWidth = nexacro.toNumber(bottomWidth.replace("px",""), 0);
				
				return [leftWidth, topWidth, rightWidth, bottomWidth];
			}

			return [0, 0, 0, 0];

		},	
	
	
		 /**
		 * nexacro Component의 Padding Size를 반환한다.
		 * @param {XComp} xComp nexacro Component
		 * @return {array.<number>} [ leftSize, topSize, rightSize, bottomSize ]
		 * @example
		 * trace(Eco.XComp.Style.getPadding("전체 padding = 0")); //output: [0,0,0,0] 
		 * trace(Eco.XComp.Style.getPadding("left padding = 20")); //output: [20,0,0,0] 
		 *
		 * @memberOf Eco.XComp.Style
		 */
		getPadding: function(xComp)	
		{
			var padding = xComp._getCurrentStylePadding();
			var leftSize = 0, topSize = 0, rightSize = 0, bottomSize = 0;

			if ( padding )
			{
				topSize    = (isNaN(padding.top) ? 0 : padding.top);
				bottomSize = (isNaN(padding.bottom) ? 0 : padding.bottom);
				leftSize   = (isNaN(padding.left) ? 0 : padding.left);
				rightSize  = (isNaN(padding.right) ? 0 : padding.right);
			}
			
			return [leftSize, topSize, rightSize, bottomSize];
		},	
	
		 /**
		 * Deprecated. nexacro Component의 Margin Size를 반환한다.
		 * @deprecated nexacro component 는 margin 이 없습니다.
		 * @param {XComp} xComp nexacro Component
		 * @return {array.<number>} [ leftSize, topSize, rightSize, bottomSize ]
		 * @example
		 * trace(Eco.XComp.Style.getMargin("전체 padding = 0")); //output: [0,0,0,0] 
		 * trace(Eco.XComp.Style.getMargin("left padding = 20")); //output: [20,0,0,0] 
		 *
		 * @memberOf Eco.XComp.Style
		 */
		getMargin: function(xComp)	
		{
			return [0, 0, 0, 0];
		},	
		
		 /**
		 * Deprecated. nexacro Component의 Current Style을 반환한다.
		 * @deprecated nexacro17 component 는 Current Style 이 없습니다.
		 * @param {XComp} xComp nexacro Component
		 * @return {object} 
		 * @example
		 * trace(Eco.XComp.Style.getCurrentStyle(xComp));
		 * // output:
		 * //  {background: "left middle"
		 * //   ,border: "1 solid #808080ff"
		 * //   ,color: "#333333ff"
		 * //   ,padding: "0 0 0 0"
		 * //   ,bordertype: "normal 0 0"
		 * //   ,align: "center middle"
		 * //   ,font: "Dotum,11,bold"}
		 *
		 * @memberOf Eco.XComp.Style
     	 */
		getCurrentStyle: function(xComp)	
		{
			return {};
		},				
	
	
		 /**
		 * nexacro Component의 Style을 반환한다.<br>
		 * <pre>
		 * ※ Runtime인 경우 component에 직접 적용된 style만 반환됨.<br>
		 *    (Computed Style에 적용되어 있는 값은 알 수 없음: 2017.04월 기준)
		 * ※ 속성명은 CSS 속성명을 사용한다.
		 *    (e.g. background-image, background-color, Runtime: textAlign( X ) ->  text-align ( O )
		 * ※ 사용가능한 속성은 Runtime(nexacro Component 속성 참고)과 HTML5(CSS 속성)가 다르다.
		 *    (e.g. HTML5: border-top-color ( O ), Runtime: border-top-color( X ))
		 * </pre>
		 * @param {XComp} xComp nexacro Component
		 * @param {string=} pseudoElt  (HTML5 Only) A string specifying the pseudo-element(e.g. ::after, ::before, ::marker) to match. Must be omitted (or null) for regular elements. - from MDN.
		 * @return {object} 
		 * @example
		 * trace(Eco.XComp.Style.getStyle(xComp));
         * // output[Runtime]:
		 * //  { text-align: "left"
		 * //    background: 'URL("./images/smiley.gif") no-repeat center center #ffffaa;'
		 * //   ,border: "1px solid #999999, 1px solid #999999, 1px solid #999999, 1px solid #999999"
		 * //   ,font: "Dotum,11,bold"}
         *
         * @memberOf Eco.XComp.Style
		 */
		getStyle: function(xComp, pseudoElt)	
		{
			if(Eco.isXComponent(xComp)) {
				var elem;
				var cellElem;
				var ctrlElem;
				var cellElemStyle;
				var rtn = {};
				
				if (nexacro._Browser != "Runtime") {
					elem = this._getElements(xComp);
					
					cellElem = elem.cell;
					ctrlElem = elem.control;
					
					if(!ctrlElem) {
						trace(xComp.name + "에 element가 존재하지 않습니다!!!");
						return;
					}
					
					if(cellElem) {
						cellElemStyle = cellElem.style;
					}
					
					pseudoElt = (pseudoElt)? pseudoElt : null;
					
					var style = window.getComputedStyle(ctrlElem, pseudoElt);
					var i=0;
					var value;
					
					if(style.getPropertyValue) {
						while(style[i]) {
							var prop = style[i];
							value = style.getPropertyValue(prop);
							rtn[prop] = value;
							
							i++;
						}
						
					} else { //ie 8 이하
						while(style[i]) {
							var prop = style[i];
							value = style.getAttribute(prop);
							rtn[prop] = value;
							
							i++;
						}					
					
					}
					
					return rtn;
					
				} else {
				    var styleList = this._runtimeStyleList;
					var i=0;
					var value;
					var runtimeName;
					while(styleList[i]) {
						var prop = styleList[i];
						runtimeName = Eco.string.camelize(prop);
						value = xComp[runtimeName];
						
						rtn[prop] = value;
						i++;
					}
					
					return rtn;
					
				}
			}
			
		},
	

		/**
		* [only HTML5] CSS selector 동적생성. IE8 지원<br>
		* ※ 2017.04 set_cssclass()가 적용되지 않아 추후 사용가능.
		* <pre>
		* ※ CSS selector 동적생성에 따른 성능확인 필요!!
		*    되도록 theme에 적용 후 사용할 것!
		* </pre>
		* @param {string} selector CSS selector name.
		* @param {json} styleValue style설정 value.
        * @example
		* createCSSSelector(this.static00, '.mycssclass', {overflow: "hidden", text-overflow: "ellipsis"});
		* @memberOf Eco.XComp.Style
		*/			
		createCSSSelector: function(selector, styleValue) 
		{
			if (nexacro._Browser != "Runtime") {
				if(!selector || !styleValue) return;
				
				if(!Eco.isString(selector)) return;
				
				if(!Eco.isObject(styleValue)) return;
				
				if(selector.substr(0,1) != ".") {
					trace("selector 첫시작은 '.'이 되어야 합니다");
					return;
				}
				
				
				var style;
				var prevStyleValue, value;
				var styleStr = "";
				var newValue = {};
				
				for(var name in styleValue) {
					if(styleValue[name] && styleValue.hasOwnProperty(name)) {
						styleStr += name + ":" + styleValue[name] + ";";
						newValue[name] = styleValue[name];
					}
				}
				
				
				this._createCSSSelector(selector, styleStr); 
			} 
        },


		/**
		* [only HTML5] CSS selector 지정<br>
		* ※ 2017.04 set_cssclass()가 적용되지 않아 추후 사용가능.
		* <pre>
		* ※ CSS selector 동적생성에 따른 성능확인 필요!!
		*    되도록 theme에 적용 후 사용할 것!
		* </pre>
		* @param {array.<XComp>} xComp Array of nexacro Component.
		* @param {string} selector CSS selector name.
		* @param {string} type [※※※임시] CSS selector 적용 타입
		* @private 
		* @example
		* createCSSSelector(this.static00, '.mycssclass', {overflow: "hidden", text-overflow: "ellipsis"});
		* @memberOf Eco.XComp.Style
		*/			
		_setCSSSelector: function(xComp, selector, type) 
		{
			if(!Eco.isArray(xComp) || xComp.length == 0) return;
			
			
			var elem;
			var cellElem;
			var ctrlElem;
				
			var i = 0 ;
			while(xComp[i]) {
				var item = xComp[i];
				elem = this._getElements(item);
				
				cellElem = elem.cell;
				ctrlElem = elem.control;
				
				if(!ctrlElem) {
					trace(xComp.name + "에 element가 존재하지 않습니다!!!");
					return;
				}				
				
				//2017.04 아래 기능이 적용되지 않아 임시처리
				//var className = selector.substr(1);
				//xComp.set_cssclass(className);

				
				//임시테스트용
				//if(cellElem && styleStr.indexOf("text") > -1) {
				if(type == "text" && cellElem) {
					cellElem.className = selector;
					
				} else {
					ctrlElem.className = selector;
				}
				
				i++;
			}

        },		
	
		/**
		* [only HTML5] CSS selector 동적생성. IE8 지원
		* <pre>
		* ※ CSS selector 동적생성에 따른 성능확인 필요!!
		*    되도록 theme에 적용 후 사용할 것!
		* </pre>
		* Found here http://www.happycode.info/create-css-classes-with-javascript/
		* @param {string} selector CSS selector.
		* @param {string} style CSS style.
		* @private
		* @example
		* _createCSSSelector('.mycssclass', 'display:none');
		* @memberOf Eco.XComp.Style
		*/			
		_createCSSSelector: function(selector, style) 
		{
		  if (!document.styleSheets) return;
		  if (document.getElementsByTagName('head').length == 0) return;

		  var styleSheet,mediaType;
		  var styleSheetList= document.styleSheets;
		  var styleSheetLen = document.styleSheets.length;	
		  
		  if (styleSheetLen > 0) {
			for (var i = 0, l = styleSheetLen; i < l; i++) {
			  if (styleSheetList[i].disabled) 
				continue;
			  var media = styleSheetList[i].media;
			  mediaType = typeof media;

			  if (mediaType === 'string') {
				if (media === '' || (media.indexOf('screen') !== -1)) {
				  styleSheet = styleSheetList[i];
				}
			  }
			  else if (mediaType=='object') {
				if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
				  styleSheet = styleSheetList[i];
				}
			  }

			  if (typeof styleSheet !== 'undefined') 
				break;
			}
		  }

		  if (typeof styleSheet === 'undefined') {
			var styleSheetElement = document.createElement('style');
			styleSheetElement.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

			for (i = 0; i < styleSheetLen; i++) {
			  if (styleSheetList[i].disabled) {
				continue;
			  }
			  styleSheet = styleSheetList[i];
			}

			mediaType = typeof styleSheet.media;
		  }

		  if (mediaType === 'string') {
			for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
			  var styleSheetRule = styleSheet.rules[i];	
			  if(styleSheetRule.selectorText && styleSheetRule.selectorText.toLowerCase()==selector.toLowerCase()) {
				styleSheetRule.style.cssText = style;
				return;
			  }
			}
			styleSheet.addRule(selector,style);
		  }
		  else if (mediaType === 'object') {
			var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
			for (var i = 0; i < styleSheetLength; i++) {
			  var styleSheetCssRule = styleSheet.cssRules[i]; 	
			  if (styleSheetCssRule.selectorText && styleSheetCssRule.selectorText.toLowerCase() == selector.toLowerCase()) {
				styleSheetCssRule.style.cssText = style;
				return;
			  }
			}
			styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
		  }
		},	
	
	
		/**
		* xComp의 element 반환.<br>
		* Static, Button의 text 관련 _cell_elem 과
		* Edit의 _input_element를 cell key값과 같이 사용한다.
		* @param {XComp} xComp nexacro Component.
		* @return {object} elements object(e.g. {cell: "_cell_elem", control: "_control_element"}).
		* @private
		* @memberOf Eco.XComp.Style
		*/		
	    _getElements: function(xComp)
		{
			var elem    = {};
			var control;
			var cell;
			
			//현재 Div에 직접 스타일 적용되지 않아 적용함.2017.04
			if(xComp instanceof nexacro.Div) {
				xComp = xComp.form;
			}	
				
				
			control = xComp._control_element.handle;
			
			if(xComp._cell_elem) { //Static, Button
				cell = xComp._cell_elem.handle;
				
			} else if(xComp._input_element) { //Edit
				cell = xComp._input_element.handle;
			}

			elem.control = control;
			elem.cell    = cell;
					
			return elem;
		},
	
		 /**
		 * nexacro Component의 style을 설정한다.<br>
		 * <pre>
		 * ※ 속성명은 CSS 속성명을 사용한다.
		 *    (e.g. background-image, background-color, Runtime: textAlign( X ) -> text-align ( O )
		 * ※ 사용가능한 속성은 Runtime(nexacro Component 속성 참고)과 HTML5(CSS 속성)가 다르다.
		 *    (e.g. HTML5: border-top-color ( O ), Runtime: border-top-color( X ))
		 * </pre>
		 * @param {XComp} xComp nexacro Component.
		 * @param {json} styleValue style설정 value.
		 * @param {string=} pseudoElt  (HTML5 Only) A string specifying the pseudo-element(e.g. ::after, ::before, ::marker) to match. Must be omitted (or null) for regular elements. - from MDN.
		 * @param {string=} priority (HTML5 Only) CSS priority.
		 * @example
		 * var styleValue = {text-align: "left", vertical-align: "top", border: "2px solid yellow", color: "red"};
         * Eco.XComp.Style.setStyle(st_sample9, styleValue);
		 *
         * @memberOf Eco.XComp.Style
		 */
		setStyle: function(xComp, styleValue, pseudoElt, priority)	
		{
			if(Eco.isXComponent(xComp)) {
				
				var elem;
				var cellElem;
				var ctrlElem;
				var cellElemStyle;
				
				if (nexacro._Browser != "Runtime") {
					
					elem = this._getElements(xComp);
					
					cellElem = elem.cell;
					ctrlElem = elem.control;
					
					if(!ctrlElem) {
						trace(xComp.name + "에 element가 존재하지 않습니다!!!");
						return;
					}
					
					if(cellElem) {
						cellElemStyle = cellElem.style;
					}
					
					
					priority = (priority)? priority : null;
					
					var applyStyle = {};
					var ctrlElemStyle = ctrlElem.style;
					
					if(ctrlElemStyle.setProperty) {
						var style = window.getComputedStyle(ctrlElem, pseudoElt);
						var isEmpty = Eco.isEmpty;
						var isFunction = Eco.isFunction;
						var prevStyleValue, value;
						var newValue = {};
						
						for(var name in styleValue) {
							//if(style[name] && style.hasOwnProperty(name)) {
							//if(style[name] !== undefined) {		
							//IE11에서 동작하지 않아 주석처리
							
							newValue[name] = styleValue[name];
						}
						
						for( var name in newValue ) {
							if ( newValue.hasOwnProperty(name) ) {
								value = newValue[name];
								
					            //if ( cellElemStyle && (name == "text-align" || name == "vertical-align") ) {
								if ( cellElemStyle && ( name.substr(0,4) == "text" || name == "vertical-align" ) ) {
									cellElemStyle.setProperty(name, value, priority);
									
								} else {
									ctrlElemStyle.setProperty(name, value, priority);
								} 	

							}
							
						}
						
						
						
					} else { //ie 8 이하
						var style = window.getComputedStyle(ctrlElem, pseudoElt);
						var isEmpty = Eco.isEmpty;
						var isFunction = Eco.isFunction;
						var prevStyleValue, value;
						var newValue = {};
						
						for(var name in styleValue) {
							var camelName =  Eco.string.camelize(name);
							//if(style[camelName] && style.hasOwnProperty(camelName)) {
							//IE11에서 동작하지 않아 위 라인 수정
							//if(style[camelName] !== undefined) {	
								newValue[camelName] = styleValue[name];
							//}
						}
						
						for( var name in newValue ) {
							if ( newValue.hasOwnProperty(name) ) {
								value = newValue[name];
								
					            if ( cellElemStyle && ( name.substr(0,4) == "text" || name == "vertical-align" ) ) {
									cellElemStyle.setAttribute(name, value);
									
								} else {
									ctrlElemStyle.setAttribute(name, value);
								} 	
								
							}
							
						}					
					}
					
					
					
				} else {
					//Runtime
					//component에 직접(테마적용X) 설정하지 않은 속성은 hasOwnProperty() 결과값은 false로 반환됨.
					var styleList = this._runtimeStyleList;
					for(var name in styleValue) {
						var propertyName = Eco.string.camelize(name);

						if(xComp[propertyName] !== undefined) {
							var value = styleValue[name];
							xComp["set_" + propertyName].call(xComp, value);
						}
					}		
				
				}
			}			

		},
		
		/**
		* nexacro Component에 argument로 주어진 styleValue를 condition에 따라 적용한다.<br><br>
		* - condition이 string일 때:<br>
		*    styleValue의 속성과 동일한 xComp의 속성값이 condition과 같을 때 적용한다.<br>
		* - condition이 function일 때:<br>
		*    condition의 실행값이 true일 경우에만 적용한다.<br>
		*    ※ 이 때 condition 함수를 호출 시 xComp, 속성명, 속성값이 arguments로 전달된다.<br>
		* - condition이 ""(빈문자열) 또는 null, undefined 일 때:<br>
		*    styleValue의 속성명과 동일한 xComp의 속성값이 없을 경우에만 적용한다.<br><br>
		* ※component의 style에 지정된 속성이 없어서 테마의 기본값이 표시되는 것은<br>
		*   속성값이 없는 것으로 본다.
		* @param {XComp} xComp target 객체 
		* @param {object} styleValue source 객체
		* @param {function|string|undefined} condition 적용조건
		* @param {object} scope callback 함수에 대한 수행 scope(this) 
		* @example
		* //btn_result_01의 color속성이 'red'일 경우에 이 속성값을 "blue"로 적용
		* var styleValue = {color:"blue"};
		* Eco.XComp.Style.setStyleIf(btn_result_01, styleValue, "red", this);
        *
        * //btn_result_02의 enable속성이 true일 경우에만 boder,color 적용
        * var styleValue = {border:"3px double red", color: "red"};
        * Eco.XComp.Style.setStyleIf(btn_result_02, styleValue, function(xComp, name, value) {
        *         if (xComp.enable == true)
        *         {
        *             return true;
        *         }
        *         return false;
        *     }
        * , this);
        *
        * //btn_result_03의 background와 align이 설정되지 않은 경우 
        * //아래의 styleValue 값으로 적용된다.
        * var styleValue = {background:"orange", align:"right middle"};
        * Eco.XComp.Style.setStyleIf(btn_result_03, styleValue, "" , this, false);
        *
		* @memberOf Eco.XComp.Style
		*/
		setStyleIf: function(xComp, styleValue, condition, scope)
		{
			if(condition === null || condition === undefined) condition = "";
			
			var pThis = Eco.XComp.Style;
			var elem;
			var cellElem;
			var ctrlElem;
			var cellElemStyle;
				
			if (xComp && styleValue) 
			{
				var value, ret,
					isFunc = false;

				
				if (condition && Eco.isFunction(condition))
				{
					isFunc = true;
				}
				
				if (nexacro._Browser != "Runtime") {
					elem = this._getElements(xComp);
					cellElem = elem.cell;
					ctrlElem = elem.control;
					
					if(!ctrlElem) {
						trace(xComp.name + "에 element가 존재하지 않습니다!!!");
						return;
					}
					
					if(cellElem) {
						cellElemStyle = cellElem.style;
					}
					
					if(!elem) return;
					
					//priority = (priority)? priority : null;		
                    //추후 clearFlag 적용여부에 따라 pseudoElt, priority parameter 위치 결정필요.
                    //현재(2017.04.03)는 내부에서 처리!					
					var priority = null;
					var pseudoElt;
					var ctrlElemStyle = ctrlElem.style;
					
					if(ctrlElemStyle.setProperty) {
						var style = window.getComputedStyle(ctrlElem, pseudoElt);
						var isEmpty = Eco.isEmpty;
						var isFunction = Eco.isFunction;
						var prevStyleValue, value;
						var newValue = {};
						
						for(var name in styleValue) {
							//if(style[name] && style.hasOwnProperty(name)) {
							//IE11에서 동작하지 않아 위 라인 수정
							//if(style[name] !== undefined) {
								newValue[name] = styleValue[name];
							//}
						}
						
						for( var name in newValue ) {
							if ( newValue.hasOwnProperty(name) ) {
								value = newValue[name];
								
					            if ( cellElemStyle && ( name.substr(0,4) == "text" || name == "vertical-align" ) ) {
									cellElemStyle.setProperty(name, value, priority);
									
								} else {
									ctrlElemStyle.setProperty(name, value, priority);
								} 								
							}
							
						}
						
						
						
					} else { //ie 8 이하
						var style = window.getComputedStyle(ctrlElem, pseudoElt);
						var isEmpty = Eco.isEmpty;
						var isFunction = Eco.isFunction;
						var prevStyleValue, value;
						var newValue = {};
						
						for(var name in styleValue) {
							var camelName =  Eco.string.camelize(name);
							
							//if(style[camelName] && style.hasOwnProperty(camelName)) {
							//IE11에서 동작하지 않아 위 라인 수정
							//if(style[camelName] !== undefined) {
								newValue[camelName] = styleValue[name];
							//}
						}
						
						for( var name in newValue ) {
							if ( newValue.hasOwnProperty(name) ) {
								value = newValue[name];
								
					            if ( cellElemStyle && ( name.substr(0,4) == "text" || name == "vertical-align" ) ) {
									cellElemStyle.setAttribute(name, value);
									
								} else {
									ctrlElemStyle.setAttribute(name, value);
								} 									
							}
							
						}					
					}					

					
				} else {
					for (var name in styleValue) {
						if(name.substr(0,1) == "_") continue;
						
						if (styleValue.hasOwnProperty(name)) {
							var runtimeName = Eco.string.camelize(name);	
							value = styleValue[name];
							
							if (isFunc)
							{
								if(condition.call(scope, xComp, name, value))
								{
									xComp["set_" + runtimeName](value);
								}
							}
							else if (condition == "" && Eco.isEmpty(xComp[name]))
							{
								xComp["set_" + runtimeName](value);
							}						
							else if (xComp[name] == condition)
							{
								xComp["set_" + runtimeName](value);
							}						
						}
					}
					
				}
				

			}
		}		
	

	});

}
