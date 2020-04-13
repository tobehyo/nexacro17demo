/**
 * @fileoverview util 함수.
 */
//isArray polyfill. Eco.util.convertColIdToIndex에서 사용.
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if ( !JsNamespace.exist("Eco.util") )
{
	/**
	 * @namespace
	 * @name Eco.util
	 * @memberof! <global>
	 */
	JsNamespace.declare("Eco.util", {
		
		/**
		 * TypeDefinition에 정의된 가상경로를 실제경로로 반환한다.
		 * @param {string} url 실제경로를 얻고 싶은 service url( 예 : "Image::log_top.png" );
		 * @return {string} 실제경로 ( 예 : "http://www.playnexacro.com/image/frame/logo_top.png" );
		 * @example
		 * var img_url = "Image::log_top.png";
		 * var real_url = Eco.util.indexOfIgnoreCase(img_url);
		 * trace(real_url); // output : "http://www.playnexacro.com/image/frame/logo_top.png";
		 * @memberOf Eco.util
		 */
		getRealUrl: function(url)
		{
			var uri = nexacro._getURIValue(url);
			return nexacro._getServiceLocation(uri);
		},
		
		/**
		 * Dataset의 column id를 배열로 받아 해당 id에 매칭되는 index값들을 배열로 반환.
		 * @param {array.<string>} colList column id 배열( 예 : ['address', 'age'] 또는 [['address', 'age'], 'name'] );
		 * @return {array.<number>} column id에 해당하는 column index 배열 ( 예 : [0, 1] 또는 [[0, 1] , 2] );
		 * @memberOf Eco.util
		 */
		convertColIdToIndex: function (colList) {
			var len = colList.length;
			var indexList = [];
			var key;
			var idx;
			for(var i=0; i<len; i++){
				if(Array.isArray(colList[i])) {	
					var temp = [];
					
					for(var j=0, len2=colList[i].length; j<len2; j++){
						idx = idxMap[colList[i][j]];
						temp.push(idx);
					}
					
					indexList.push(temp);
					continue;
				}
				
				idx = idxMap[colList[i]];
				indexList.push(idx);
			}
			
			return indexList;			
		},
		
		performMark: function(name){
		  if (performance.mark === undefined) {
			trace("performance.mark Not supported");
			return;
		  }		
		  
		  performance.mark(name);
		},
		
		performMeasure: function(name, startMark, endMark){
		  if (performance.measure === undefined) {
			trace("performance.measure Not supported");
			return;
		  }		
		  performance.measure(name, startMark, endMark);
		},		
		
		clear_mark: function(name){
		  if (performance.clearMarks === undefined) {
			trace("performance.clearMarks Not supported");
			return;
		  }
		  performance.clearMarks(name);
		},
		
		clear_measure: function(name){
		  if (performance.clearMeasures === undefined) {
			trace("performance.clearMeasures Not supported");
			return;
		  }
		  performance.clearMeasures(name);
		},		
		
		clear_performance: function(){
		  this.clear_marks();
		  this.clear_measures();
		},	
		
		performPrint: function(){
		  if (performance.clearMarks === undefined) {
			trace("performance Not supported");
			return;
		  }	
		  
			 trace('\n--------  Print performance-marks   ---');	
			 // Print marks
			  var perfMarks = performance.getEntriesByType("mark");
			  for (var i = 0, len = perfMarks.length; i < len; i++) {
				trace("Name: " + perfMarks[i].name + " - " + "Start Time: " + perfMarks[i].startTime);
			  }
				
			  trace('\n--------  Print performance-measures   ---');	
			  // Print measures
			  var perfMeasures = performance.getEntriesByType("measure");
			  for(var i = 0, len = perfMeasures.length; i < len; i++) {
				  trace("Name: " + perfMeasures[i].name + " - " + "Duration: " + perfMeasures[i].duration);
			  }	
		}		
		
	});
}
