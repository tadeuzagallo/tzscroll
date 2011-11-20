this.tz = {
	"each": function(obj, func){
		for(var x in obj)
			func(obj[x], x, obj);
		return obj;
	}
	,"extend": function(to, from){
		for(var x in from){
			to[x] = from[x];
		}
	}
	,"wrap": function(obj, fn){
		return function(){
			fn.apply(obj, arguments);
		}
	}
	,"bind": function(obj){
		fns = Array.prototype.slice.call(arguments, 1);
		
		tz.each(fns, function(f){
			obj[f] = tz.wrap(obj, obj[f]);
		});
		
		return obj;
	}
	,"inherits": function(parent, data){
		var child;
		parent = parent();
	
		if(data && data.hasOwnProperty("constructor")){
			child = data.constructor;
		}else{
			child = function(){ return parent.apply(this, arguments); };
		}
		
		function F(){}
		
		F.prototype = parent.prototype;
		child.prototype = new F();
		
		
		child.prototype.constructor = child;
		
		if(data) tz.extend(child.prototype, data);
		
		return new child;
	}
	,"$": function(id){
		return document.getElementById(id);
	}
	,"$$": function(id){
		return document.createElement(id);
	}
	,"_": function(fn){
		return function(e){
			if(!e){
				e = window.event || {};
			}
			
			if(!e.target){
				e.target = e.srcElement;
			}else{
				e.srcElement = e.target;
			}
			
			fn.apply(this, Array.prototype.concat.call([e], arguments));
		};
	}
	,"template": function(templateID){
		var templateText = $('#'+templateID).html();
		return this._template.init(templateText);
	}
	,"_template": {
		"toPrint": /<%=[\s]*([^%]*)[\s]*%>/g
		,"toEval": /<%[\s]*([^%]*)[\s]*%>/g
		,"init": function(templateText, templateObject){
			
			var template = this.formatTemplate(templateText);
			
			var templateFunction = new Function('templateObject', template);
			
			return templateObject ? templateFunction(templateObject) : templateFunction;
		}
		,"formatTemplate": function(templateText){
			
			return 'var template = [];'
			+ 'with(templateObject || {}){'
				+ 'template.push(\''
				+ templateText
				.replace(/'/g, "\\'")
				
				.replace(this.toPrint, function(match, code, all){
					return '\',' + code.trim().replace(/\\'/g, '\'') + ',\'';
				})
				
				.replace(this.toEval, function(match, code, all){
					return '\');'
					+ code.trim()
					.replace(/\\'/g, '\'')
					+ 'template.push(\'';
				})
				.replace(/\n/g, '\\n')
			+ '\');};'
			+ 'return template.join(\'\')';
		}
	}
	,'ac': function(){
		var t = arguments[0];
		var z = Array.prototype.slice.call(arguments, 1);
		for(var x in z){
			t.appendChild(z[x]);
		}
	}
	,'attach': function(){
		
	}
	,'isObject': function(el){
		return el ? el.toString().indexOf('object Object') != -1 : false;
	}
	,'isFunction': function(el){
		return el ? el.toString().indexOf('function') != -1 : false;
	}
	,'set': function(){
		var what = arguments[0];
		var who = Array.prototype.slice.call(arguments, 1);
		
		var __x = [];

		var __set = function(who, what){
			for(var x in who){
				for(var y in what){
					if(tz.isObject(what[y]) && !tz.isFunction(what[y])){
						__x.push(y);
						__set(who, what[y]);
					}else{
						for(var z in __x){
							if(Object.prototype.hasOwnProperty.call(what, __x[z])){
								__x.splice(z);
							}
						}
						
						eval('who[x][\''+Array.prototype.join.call(Array.prototype.concat.call(__x, y), '\'][\'')+'\'] = what[y]');
					}
				}
			}
			__x = [];
		};
		
		__set(who, what);
	}
};
