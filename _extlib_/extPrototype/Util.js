/**
*  컨설팅 표준화 작업
*  @FileName 	Util.js 
*  @Creator 	consulting
*  @CreateDate 	2017.03.08
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2017.03.08     	consulting 	                최초 생성 
*  2017.10.17     	consulting       	        주석 정비
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
 * @class 실행되는 서버 url 가져오기 <br>
 * @return String
 */
pForm.gfnGetServerUrl = function()
{
	var urlPath = "";
 //    if (system.navigatorname == "nexacro") 
	// {
	//     var objEnv = nexacro.getEnvironment();
	// 	urlPath = objEnv.services["svcUrl"].url;
	// }else{
	// 	urlPath = window.location.protocol + "//" + window.location.host;
	// 	urlPath+="/nexacro/";
	// }
	urlPath = nexacro.getProjectPath();
	trace("urlPath : " + urlPath);
	return urlPath;
};

/**
 * @class 값이 존재하는지 여부 체크 <br>
 * @param {String} sValue	
 * @return {Boolean} true/false
 * @example
 * var bNull = this.gfnIsNull("aaa");	// false
 */
pForm.gfnIsNull = function(sValue)
{
    if (new String(sValue).valueOf() == "undefined") return true;
    if (sValue == null) return true;
    
    var ChkStr = new String(sValue);

    if (ChkStr == null) return true;
    if (ChkStr.toString().length == 0 ) return true;
    return false;
};

/**
 * @class 정규식을 이용한 trim 구현 - 문자열 양 옆의 공백 제거 <br>
 * @param {String} sValue - 변경하려는 값
 * @return {String} 문자열
 */
pForm.gfnTrim = function(sValue)
{
    if (this.gfnIsNull(sValue)) return "";
	return nexacro.trim(sValue);
};

/**
 * @class  지정된 속성의 값이 처음으로 일치하는 객체의 배열 위치를 뒤에서부터 찾아 반환한다.<br>
 * 배열의 각 항목은 하나 이상의 속성을 가진 객체이다.<br> 
 * @param {Array} array 대상 Array.
 * @param {String} prop 기준 속성.
 * @param {String} item 기준 값.
 * @param {Number} from 검색 시작 위치(default: 0).
 * @param {Boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * @return {Number} 검색된 배열 위치. 없다면 -1 리턴.
 * @example
 * var users = [];
 * users[0] = {id:"milk", name:"park", age:33};
 * users[1] = {id:"apple", name:"kim"};
 * users[2] = {id:"oops", name:"joo", age:44};
 * users[3] = {id:"beans", name:"lee", age:50};
 * users[4] = {id:"zoo", age:65};
 * users[5] = {id:"milk", name:"", age:33};
 * users[6] = {id:"milk", name:"lee", age:33};
 * var index = this.gfnLastIndexOfProp(users, "name", "lee");
 * trace("index==>" + index);	// output : index==>6
 * var index = this.gfnLastIndexOfProp(users, "name", "lee", 5);
 * trace("index==>" + index);	// output : index==>3
*/
pForm.gfnLastIndexOfProp = function(array, prop, item, from, strict)
{
	var i, obj, 
		propValue;
	
	if (from == null)
	{
		from = array.length - 1;
	}
	else if (from < 0)
	{
		from = Math.max(0, array.length + from);
	}
	
	var strict = strict || false;
	
	if (strict)
	{
		for (i=from; i>=0; i--)
		{
			if (i in array && array[i])
			{
				obj = array[i],
				propValue = obj[prop];
				
				if (propValue === item)
				{
					return i;
				}
			}
		}
	}
	else
	{
		for (i=from; i>=0; i--)
		{
			if (i in array && array[i])
			{
				obj = array[i],
				propValue = obj[prop];
				
				if (propValue == item)
				{
					return i;
				}
			}
		}
	}
	
	return -1;
};


/**
 * @class  원하는 위치의 항목을 배열에서 삭제 처리한다.
 * @param {Array} array remove 대상 Array.
 * @param {Number} index remove하고자 하는 item index.
 * @example
 * var mon = ["Jan","Feb","Mar","Apr"];
 * trace("mon==>" + mon);	// output : mon==>["Jan","Mar","Apr"]
*/
pForm.gfnRemoveAt = function(array, index) 
{
	array.splice(index, 1);
};

/**
 * @class  alphabet character code.
 * charvalue값 => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f]
*/
pForm._ALPHA_CHAR_CODES = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102]

/**
 * @class  유일한 ID 를 반환
 * @param {String} prefix id 앞에 붙일 문자열
 * @param {String} separator id 생성시 구분용 문자(default: '-' ).
 * @return {String} id
 * @example
 * trace(this.gfnGetUniqueI()); 
 * // output : 3e52d1f6-f0d2-4970-a590-ba7656b07859
 * 
 * trace(this.gfnGetUniqueI("Button_")); 
 * // output : Button_4e601da1-63f4-4cfa-849b-01b8a7f14d40
 * 
 * trace(this.gfnGetUniqueI("", "_")); 
 * // output : 4e601da1_63f4_4cfa_849b_01b8a7f14d40
 * 
 * trace(this.gfnGetUniqueId("Button_", "_")); 
 * // output : Button_4e601da1_63f4_4cfa_849b_01b8a7f14d40
*/
pForm.gfnGetUniqueId = function(prefix, separator)
{
	if ( this.gfnIsNull(prefix) ) prefix = "";
	if ( this.gfnIsNull(separator) ) {
		separator = 45;
	} else {
		separator = separator.charCodeAt(0);
	}
	
	var pThis = this,
		charcode = this._ALPHA_CHAR_CODES,
		math = Math;
	var seq = 0;
	var seq0;
	var tmpArray = new Array(36);
	var idx = -1;
	
	while (seq < 8) 
	{
		tmpArray[++idx] = charcode[math.random() * 16 | 0];
		seq++;
	}
	seq = 0;
	while (seq < 3) 
	{
		tmpArray[++idx] = separator;//45 => "-", 95=> "_"
		seq0 = 0;
		while (seq0 < 4) 
		{
			tmpArray[++idx] = charcode[math.random() * 16  | 0];
			seq0++;
		}
		seq++;
	}
	tmpArray[++idx] = separator; //45 => "-", 95=> "_"
	
	var tmpStr = (new Date()).getTime();
	tmpStr = ("0000000" + tmpStr.toString(16)).substr(-8);
	seq = 0;
	while (seq < 8) 
	{
		tmpArray[++idx] = tmpStr.charCodeAt(seq);
		seq++;
	}
	seq = 0;
	while (seq < 4) 
	{
		tmpArray[++idx] = charcode[math.random() * 16 | 0];
		seq++;
	}
	return prefix + String.fromCharCode.apply(null, tmpArray);
};

/**
 * @class Component 기준의 XY좌표를 XCompA 기준의 XY좌표로 변환.
 * @param {Object} Component.
 * @param {Array} xy XCompB기준의 XY좌표.
 * @param {Object} XCompB XComponent.
 * @return {Array} XCompA기준의 좌표. [ x좌표, y좌표]
 * @example
 * Form에 아래와 같이 Button00이 존재 할 경우
 *
 * |---------------------------------------------------------|  ^
 * |  Form                                                   |  |
 * |                                                         |  |
 * |                                                         | 300
 * |                                                         |  |
 * |                                     //(0,0)             |  v
 * |                                       *-----------      | 
 * |                                       | Button00 |      | 
 * |                                       ------------      | 
 * |                                                         | 
 * |---------------------------------------------------------| 
 * <--------------- 900 ------------------>	
 *		 
 * trace(this.gfnConvertXY(this,[0,0], Button00)); //output: [900,300]
 * //Button00을 기준으로 한 0,0 좌표는
 * //form 기준으로 했을 때 900, 300이 된다.
*/				
pForm.gfnConvertXY = function(XCompA, xy, XCompB)
{
	var tempX, tempY;
	var x, y;
	if ( XCompB )
	{
		tempX = system.clientToScreenX(XCompB, xy[0]);
		tempY = system.clientToScreenY(XCompB, xy[1]);
		x = system.screenToClientX(XCompA, tempX) + this.gfnGetScrollLeft(XCompA);
		y = system.screenToClientY(XCompA, tempY) + this.gfnGetScrollTop(XCompA);				
	}
	else
	{
		x = xy[0];
		y = xy[1];
	}
	
	return [x, y];
};

/**
 * @class  수평스크롤바의 trackbar 위치를 반환한다.
 * @param  {Object} Component.
 * @return {Number} 수평스크롤바의 trackbar 위치(수평스크롤바가 없을때는 0).
 * @example
 * trace(this.gfnGetScrollLeft(Div01)); //output: 10
 * trace(this.gfnGetScrollLeft(Div01)); //output: 0
*/
pForm.gfnGetScrollLeft = function(XComp)
{
	if(XComp instanceof nexacro.Div){
		XComp = XComp.form;
	}
	return (XComp.hscrollbar && XComp.hscrollbar.visible ? XComp.hscrollbar.pos : 0);
};

/**
 * @class  수직스크롤바의 trackbar 위치를 반환한다.
 * @param  {Object} Component.
 * @return {Number} 수직스크롤바의 trackbar 위치(수직스크롤바가 없을때는 0).
 * @example
 * trace(this.gfnGetScrollTop(Div01)); //output: 20
 * trace(this.gfnGetScrollTop(Div01)); //output: 0
 */
pForm.gfnGetScrollTop = function(XComp)
{
	if(XComp instanceof nexacro.Div){
		XComp = XComp.form;
	}
	return (XComp.vscrollbar && XComp.vscrollbar.visible ? XComp.vscrollbar.pos : 0);
};

/**
 * @class object에 argument로 주어진 object의 모든 속성값을 복사한다.<br>
 * object, function, date, array Type은 reference가 복사된다.
 * @param {Object} tarobject target 객체.
 * @param {Object} srcobject source 객체.
 * @example
 * var target = {};
 * this.gfnCopyProperties(target, {a: 1, b: "2", c: {"A": "3", "B": 4}});
 * for(var p in target)
 * {
 * 	trace(p + ":" + target[p]);
 *	// output : a:1
 *	// output : b:2
 *	// output : c:[object Object]
 * }
*/
pForm.gfnCopyProperties = function(tarobject, srcobject)
{
	if (tarobject && srcobject) 
	{
		var p, value;
		
		for (p in srcobject)
		{
			if (srcobject.hasOwnProperty(p))
			{
				value = srcobject[p];
				tarobject[p] = value;
			}
		}
	}
};	


/**
 * @class  Form 내에서 지정된 접두문자열에 순번이 붙여진 ID 를 반환
 * @param {Object} prefix 순번 앞에 붙일 문자열
 * @param {String} prefix 순번 앞에 붙일 문자열
 * @return {String} id
 * @example
 * // this = Form
 * trace(this.gfnGetSequenceId(this, "Button")); // output : Button0
 * trace(this.gfnGetSequenceId(this, "Button")); // output : Button1
 * // this = Form
 * trace(this.gfnGetSequenceId(this, "chk_")); // output : chk_0
 * trace(this.gfnGetSequenceId(this, "chk_")); // output : chk_1
*/		
pForm.gfnGetSequenceId = function(form, prefix)
{
	if ( this.gfnIsNull(form) ) 
	{
		trace("getSequenceId :: 1st argument doesn't exist !!");
		return null;
	}
	
	if ( this.gfnIsNull(prefix) ) 
	{
		trace("getSequenceId :: 2nd argument doesn't exist !!");
		return null;
	}
	
	if ( !(form instanceof Form) ) 
	{				
		trace("getSequenceId :: 1st argument must be a Form !!");
		return null;
	}
	
	var cache = form._sequenceIdCache;
	if ( this.gfnIsNull(cache) )
	{
		cache = form._sequenceIdCache = {};
	}
	
	var sequence = cache[prefix];
	if ( this.gfnIsNull(sequence) )
	{
		sequence = -1;
	}
	sequence++;
	
	cache[prefix] = sequence;
	
	return prefix + sequence;
};

/**
 * @class object 속성값들을 주어진 함수로 처리한다.<br>
 * 주어진 함수에서 return false를 하면 반복이 멈춘다.
 * @param {Object} object 대상 object.
 * @param {Function} func callback 함수. 
 * @param {String} func.prop object property name.
 * @param {Object} func.val object property value.
 * @param {Object} func.object object 그 자체.
 * @param {Object} scope callback 함수에 대한 수행 scope.
 * @example
 * var datas = {code: "001", userId: "", name: "pete"};
 * this.gfnEach(datas, function(prop, val, object) {
 * 	var result = "";
 * 	if ( !val )
 * 	{
 * 		result = prop + " must have not a non-empty value!"
 * 		st_result03.text += result;
 * 		trace(result);	// output : userId must have not a non-empty value!
 * 		return false;
 * 	}
 * 	result = prop + ":" + val;
 * 	st_result03.text += result + "  ";
 * 	trace(result);	// output : code:001
 * }, this);
*/
pForm.gfnEach = function(object, func, scope)
{
	var p,
		scope = scope || object;
	for (p in object)
	{
		if (object.hasOwnProperty(p))
		{
			if (func.call(scope, p, object[p], object) === false)
			{
				return;
			}
		}
	}
};

/**
 * @class 주어진 Form 을 포함하는 최상위 Form을 찾는다.
 * @param  {Object} curForm 검색 시작 Form.
 * @return {Object} 최상위 Form.
 * @example
 * trace(this.gfnGetTopLevelForm(this));	// output : [object Form]
*/		
pForm.gfnGetTopLevelForm = function(curForm)
{
	var p = curForm;
	while (p && !(p instanceof ChildFrame))
	{
		p = p.parent;
	}
	return p.form;
};

/**
 * @class 지정된 항목이 배열에 포함되어 있는지 확인한다.
 * @param {Array} array 검색 대상 Array.
 * @param {Object} item 찾고자 하는 Item.
 * @param {Boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * @return {Boolean} 포함되어 있다면 true, 없다면 false를 리턴.
 * @example
 * var mon = ["Jan","Feb","Mar","Apr"];
 * var contain = this.gfnContains(mon, "Mar");
 * trace("contain==>" + contain);	// output : contain==>true
 * var contain = this.gfnContains(mon, "May");
 * trace("contain==>" + contain);	// output : contain==>false
*/
pForm.gfnContains = function(array, item, strict) 
{
	if (this.gfnIndexOf(array, item, null, strict) === -1) 
	{
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * @class 지정된 항목이 처음 나오는 배열 위치를 반환한다. 
 * @param {Array} array 검색 대상 Array.
 * @param {Object} item 찾고자 하는 Item.
 * @param {Number} from 검색의 시작 위치 (default: 0).
 * @param {Booleans} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * @return {Number} 검색된 배열 위치. 없다면 -1 리턴.
 * @example
 * var mon = ["Jan","Feb","Mar","Apr"];
 * var index = this.gfnIndexOf(mon, "Mar");
 * trace("index==>" + index);	// output : index==>2
 * var index = this.gfnIndexOf(mon, "May");
 * trace("index==>" + index);	// output : index==>-1
*/
pForm.gfnIndexOf = function(array, item, from, strict) 
{
	var len = array.length;
	if ( from == null ) from = 0;;
	strict == !!strict;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0)
	{
		from += len;
	}
	
	if (strict)
	{
		for (; from < len; from++) 
		{
			if ( array[from] === item)
			{
				return from;
			}
		}
	}
	else
	{
		for (; from < len; from++) 
		{
			if ( array[from] == item)
			{
				return from;
			}
		}
	}
	
	return -1;
};