(()=>{var C=Object.defineProperty;var b=Object.getOwnPropertySymbols;var E=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var p=(l,e,t)=>e in l?C(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t,D=(l,e)=>{for(var t in e||(e={}))E.call(e,t)&&p(l,t,e[t]);if(b)for(var t of b(e))S.call(e,t)&&p(l,t,e[t]);return l};var d=class{constructor(e,t,n){if(!e)throw new Error("Element argument is empty. Please add DOM element | selector as first arg");if(typeof e=="string"){let o=document.querySelector(e);if(!o)throw new Error(`Selector could not be found [${e}]`);this.element=o}e instanceof Element&&(this.element=e),this.options=D({labelCount:5,zoomSpeed:.025,dragSpeed:.003,startDate:"-100y",endDate:"10y",timelineStartDate:"-1000y",timelineEndDate:"1000y",minZoom:1,maxZoom:1e11,position:"bottom"},t),this.timelineStart=this.parseDate(this.options.timelineStartDate),this.timelineEnd=this.parseDate(this.options.timelineEndDate);let r=this.parseDate(this.options.startDate),a=this.parseDate(this.options.endDate);r.getTime()<this.timelineStart.getTime()&&(this.timelineStart=r),a.getTime()>this.timelineEnd.getTime()&&(this.timelineEnd=a);let i=a.getTime()-r.getTime();this.ratio=this.timelineDuration/i,this.pivot=(this.timelineStart.getTime()-r.getTime())/i,this.setupHTML(),this.registerListeners(this.element),this.callback=n,this.update()}get timelineDuration(){return this.timelineEnd.getTime()-this.timelineStart.getTime()}get viewWidth(){var e;return((e=this.element)==null?void 0:e.offsetWidth)||0}get start(){return this.timelineStart.getTime()-this.duration*this.pivot}get end(){return this.start+this.duration}get duration(){return this.timelineDuration/this.ratio}get startDate(){return new Date(this.start)}get endDate(){return new Date(this.end)}view2TimeRatio(e){return(e-this.start)/this.duration}setRatio(e,t){let n=this.ratio-t;return e===1&&n<=this.options.minZoom||e===-1&&n>=this.options.maxZoom?!1:(this.ratio=n,!0)}setPivot(e){let t=this.pivot+e;t>=0&&(t=0),t+this.ratio<=1&&(t=1-this.ratio),this.pivot=t}zoom(e,t){let n=this.options.zoomSpeed*this.ratio,r=e*n,o=((t||0)/this.viewWidth-this.pivot)/this.ratio*r;this.setRatio(e,r)&&this.setPivot(o),this.update()}move(e){this.setPivot(e),this.update()}registerListeners(e){let t=this;window.addEventListener("resize",function(){t.update()},{passive:!0}),e.addEventListener("wheel",function(i){i.preventDefault();var o=Math.sign(i.deltaY);t.zoom(o,i.offsetX)},{passive:!1});let n,r,a=!1;e.addEventListener("mousedown",function(i){a=!0,n=i.pageX,r=i.pageY},{passive:!1}),e.addEventListener("mousemove",function(i){if(!a)return;let o=(i.pageX-n)*t.options.dragSpeed;t.move(o),n=i.pageX,r=i.pageY},{passive:!1}),document.addEventListener("mouseup",function(){a=!1},{passive:!1})}setupHTML(){switch(this.element.innerHTML="",this.element.style.position="relative",this.element.style.overflow="hidden",this.element.style.minHeight="3rem",this.labelContainer=document.createElement("div"),this.labelContainer.className="timelineLabelContainer",this.labelContainer.style.width="100%",this.labelContainer.style.height="3rem",this.labelContainer.style.textAlign="center",this.labelContainer.style.position="absolute",this.labelContainer.style.zIndex="-1",this.options.position){case"top":this.labelContainer.style.top="0";break;case"center":this.labelContainer.style.top="50%",this.labelContainer.style.transform="translate(0, calc(-50%))";break;default:this.labelContainer.style.bottom="0"}this.element.appendChild(this.labelContainer),this.dividerContainer=document.createElement("div"),this.dividerContainer.className="timelineDividerContainer",this.dividerContainer.style.width="100%",this.dividerContainer.style.height="100%",this.dividerContainer.style.position="absolute",this.dividerContainer.style.zIndex="-10",this.element.appendChild(this.dividerContainer)}format(e){let t=new Date(e);return this.duration<1440*6e5*4?Intl.DateTimeFormat(void 0,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric"}).format(t):this.duration<10080*6e5*6?Intl.DateTimeFormat(void 0,{year:"numeric",month:"short",day:"numeric"}).format(t):this.duration<43829.0639*6e5*18?Intl.DateTimeFormat(void 0,{year:"numeric",month:"short"}).format(t):t.getFullYear().toString()}update(){if(!this.element)return;let e=Math.floor(this.ratio),t=Math.pow(2,Math.floor(Math.log2(e))),n=1/(this.options.labelCount+1),r=this.start-this.timelineStart.getTime(),i=this.timelineDuration*n/t,v=Math.floor(r/i)*i,c=document.createDocumentFragment(),f=document.createDocumentFragment();for(let u=0;u<this.options.labelCount+2;u++){let h=(u+1)*i+this.timelineStart.getTime()+v-i,y=h+i/2,w=this.view2TimeRatio(h)*100,T=this.view2TimeRatio(y)*100,s=document.createElement("div");s.className="timelineLabel",s.style.left=w+"%",s.style.top="50%",s.style.transform="translate(calc(-50%), calc(-50%))",s.style.textAlign="center",s.style.position="absolute",s.style.zIndex="-1",s.style.width=n*100+"%",s.innerHTML=this.format(h),c.appendChild(s);let m=document.createElement("div");m.className="timelineDivider",m.style.left=T+"%",m.style.textAlign="center",m.style.position="absolute",m.style.height="100%",m.style.zIndex="-10",m.innerHTML="",f.appendChild(m)}this.labelContainer.innerHTML="",this.labelContainer.appendChild(c),this.dividerContainer.innerHTML="",this.dividerContainer.appendChild(f);let g=new CustomEvent("update",{detail:{timeline:this.toJSON()},bubbles:!0,cancelable:!0,composed:!1});this.element.dispatchEvent(g),this.callback&&this.callback(this)}parseDate(e){if(e===void 0)return new Date;if(Array.isArray(e)){let t=e;if(t.length===0)throw new Error("argument Array cannot be empty");if(!t.every(r=>typeof r=="number"))throw new Error("input Array must contain only numbers");return this.parseDateArray(t)}if(typeof e=="object"&&e.constructor.name==="Date")return e;if(typeof e=="string")return this.parseDateString(e);if(typeof e=="number")return new Date(e)}parseDateArray(e){let t=new Date;return t.setFullYear(e[0]||t.getFullYear()),t.setMonth(e[1]?e[1]-1:0),t.setDate(e[2]?e[2]:1),t.setHours(e[3]?e[3]:0),t.setMinutes(e[4]?e[4]:0),t}parseDateString(e){switch(e){case"now":return new Date;case"max":return new Date(864e13);case"min":return new Date(-864e13);default:let t=Number(e.replace(/y$/,""));if(!isNaN(t))return new Date(Date.now()+31556926*1e3*t);let n=new Date("0001-01-01"),r=Number(e.replace(/bc$/,""));if(!isNaN(r))return new Date(n.getTime()-31556926*1e3*r);let a=Number(e.replace(/ad$/,""));if(!isNaN(a))return new Date(n.getTime()+31556926*1e3*a);throw new Error(`'[${e}]' could not be parsed as a date`)}}toJSON(){return{options:this.options,startDate:this.startDate,endDate:this.endDate,ratio:this.ratio,pivot:this.pivot}}};window.Timeline=d;})();
