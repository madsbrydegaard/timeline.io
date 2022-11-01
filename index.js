var E=Object.defineProperty,S=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var y=Object.getOwnPropertySymbols;var H=Object.prototype.hasOwnProperty,N=Object.prototype.propertyIsEnumerable;var T=(d,e,t)=>e in d?E(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t,b=(d,e)=>{for(var t in e||(e={}))H.call(e,t)&&T(d,t,e[t]);if(y)for(var t of y(e))N.call(e,t)&&T(d,t,e[t]);return d},D=(d,e)=>S(d,M(e));var C=class{constructor(e,t,i,r){if(!e)throw new Error("Events argument is empty. Please add Array of events | DOM element | selector as first arg");if(typeof e=="string"){let m=document.querySelector(e);if(!m)throw new Error(`Selector could not be found [${e}]`);this.element=m}e instanceof HTMLElement&&(this.element=e);let a=[...Array.isArray(t)?t:[],...this.parseTimelineHTML(this.element)];this.events=[...this.parseEvents(a)],this.options=b({labelCount:5,zoomSpeed:.025,dragSpeed:.001,startDate:"-100y",endDate:"10y",timelineStartDate:"-1000y",timelineEndDate:"1000y",minZoom:1,maxZoom:1e11,position:"bottom"},i),this.timelineStart=this.parseDate(this.options.timelineStartDate),this.timelineEnd=this.parseDate(this.options.timelineEndDate);let n=this.parseDate(this.options.startDate),s=this.parseDate(this.options.endDate);n.getTime()<this.timelineStart.getTime()&&(this.timelineStart=n),s.getTime()>this.timelineEnd.getTime()&&(this.timelineEnd=s);let o=s.getTime()-n.getTime();this.ratio=this.timelineDuration/o,this.pivot=(this.timelineStart.getTime()-n.getTime())/o,console.log(this.events),this.setupContainerHTML(),this.registerListeners(this.element),this.callback=r,this.update()}get timelineDuration(){return this.timelineEnd.getTime()-this.timelineStart.getTime()}get viewWidth(){var e;return((e=this.element)==null?void 0:e.offsetWidth)||0}get start(){return this.timelineStart.getTime()-this.duration*this.pivot}get end(){return this.start+this.duration}get duration(){return this.timelineDuration/this.ratio}get startDate(){return new Date(this.start)}get endDate(){return new Date(this.end)}setRatio(e,t){let i=this.ratio-t;return e===1&&i<=this.options.minZoom||e===-1&&i>=this.options.maxZoom?!1:(this.ratio=i,!0)}setPivot(e){let t=this.pivot+e;t>=0&&(t=0),t+this.ratio<=1&&(t=1-this.ratio),this.pivot=t}zoom(e,t){let i=this.options.zoomSpeed*this.ratio,r=e*i,s=((t||0)/this.viewWidth-this.pivot)/this.ratio*r;this.setRatio(e,r)&&this.setPivot(s),this.update()}move(e){this.setPivot(e),this.update()}registerListeners(e){let t=this;window.addEventListener("resize",function(){t.update()},{passive:!0}),e.addEventListener("wheel",function(s){s.preventDefault();var o=Math.sign(s.deltaY);t.zoom(o,s.offsetX)},{passive:!1});let i,r,a=!1,n=!0;e.addEventListener("mousedown",function(s){a=!0,i=s.pageX,r=s.pageY},{passive:!1}),e.addEventListener("mousemove",function(s){if(!a||!n)return;n=!1;let o=(s.pageX-i)*t.options.dragSpeed;t.move(o),i=s.pageX,r=s.pageY,setTimeout(()=>n=!0,10)},{passive:!1}),document.addEventListener("mouseup",function(){a=!1},{passive:!1})}setupEventsHTML(e,t=1){let i={0:0},r=(n,s)=>{let o=0;for(let m in i)if(n<0||n>i[m])return o=Number(m),i[o.toString()]=s,o;return o++,i[o.toString()]=s,o},a=document.createDocumentFragment();e.forEach((n,s)=>{try{let o=n.startdate.getTime(),m=n.enddate.getTime(),c=(o-this.startDate.getTime())/this.duration,p=(m-this.startDate.getTime())/this.duration;if(!(p>0&&c<1))return;let l=document.createElement("div");l.className="timelineGeneratedEvent";let f=r(c,p),g=Number(n.duration)*6e4;l.style.position="absolute",l.style.left=c*100+"%",l.style.width=g/this.duration*100+"%",l.style.height="5px",l.style.border="solid 1px black",l.style.bottom=`${f}rem`,l.style.zIndex="0",l.title=n.title,a.appendChild(l)}catch(o){console.error(o,"timelineEvent",n)}}),this.eventsContainer.innerHTML="",this.eventsContainer.appendChild(a)}setupContainerHTML(){this.element.style.position="relative",this.element.style.overflow="hidden",this.element.style.minHeight="3rem",this.addCSS(`
			.timeline{position: absolute; z-index: -1}
			.timeline.hidden{display:none}
			.timeline.collapsed{border: solid 1px red; width: 5px; height: 5px}
			.timeline.collapsed *{display: none}
		`);let e=this.element.querySelector(".timelineLabelContainer");switch(this.labelContainer=e||document.createElement("div"),e||this.element.appendChild(this.labelContainer),this.labelContainer.className="timelineLabelContainer",this.labelContainer.style.width="100%",this.labelContainer.style.height="3rem",this.labelContainer.style.textAlign="center",this.labelContainer.style.position="absolute",this.labelContainer.style.zIndex="-9",this.options.position){case"top":this.labelContainer.style.top="0";break;case"center":this.labelContainer.style.top="50%",this.labelContainer.style.transform="translate(0, calc(-50%))";break;default:this.labelContainer.style.bottom="0"}let t=this.element.querySelector(".timelineDividerContainer");this.dividerContainer=t||document.createElement("div"),t||this.element.appendChild(this.dividerContainer),this.dividerContainer.className="timelineDividerContainer",this.dividerContainer.style.width="100%",this.dividerContainer.style.height="100%",this.dividerContainer.style.position="absolute",this.dividerContainer.style.zIndex="-10";let i=this.element.querySelector(".timelineEventsContainer");this.eventsContainer=i||document.createElement("div"),i||this.element.appendChild(this.eventsContainer),this.eventsContainer.className="timelineEventsContainer",this.eventsContainer.style.position="absolute",this.eventsContainer.style.bottom="4rem",this.eventsContainer.style.height="7rem",this.eventsContainer.style.width="100%",this.eventsContainer.style.zIndex="0"}format(e){let t=new Date(e);return this.duration<1440*6e5*4?Intl.DateTimeFormat(void 0,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric"}).format(t):this.duration<10080*6e5*6?Intl.DateTimeFormat(void 0,{year:"numeric",month:"short",day:"numeric"}).format(t):this.duration<43829.0639*6e5*18?Intl.DateTimeFormat(void 0,{year:"numeric",month:"short"}).format(t):t.getFullYear().toString()}update(){if(!this.element)return;let e=Math.floor(this.ratio),t=Math.pow(2,Math.floor(Math.log2(e))),i=1/(this.options.labelCount+1),r=this.start-this.timelineStart.getTime(),n=this.timelineDuration*i/t,o=Math.floor(r/n)*n,m=document.createDocumentFragment(),c=document.createDocumentFragment();for(let v=0;v<this.options.labelCount+2;v++){let l=(v+1)*n+this.timelineStart.getTime()+o-n,f=l+n/2,w=this.toJSON().getLeftRatio(l)*100,L=this.toJSON().getLeftRatio(f)*100,u=document.createElement("div");u.className="timelineLabel",u.style.left=w+"%",u.style.top="50%",u.style.transform="translate(calc(-50%), calc(-50%))",u.style.textAlign="center",u.style.position="absolute",u.style.zIndex="-1",u.style.width=i*100+"%",u.innerHTML=this.format(l),m.appendChild(u);let h=document.createElement("div");h.className="timelineDivider",h.style.left=L+"%",h.style.textAlign="center",h.style.position="absolute",h.style.height="100%",h.style.zIndex="-10",h.innerHTML="",c.appendChild(h)}this.labelContainer.innerHTML="",this.labelContainer.appendChild(m),this.dividerContainer.innerHTML="",this.dividerContainer.appendChild(c),this.setupEventsHTML(this.events);let p=new CustomEvent("update",{detail:this.toJSON(),bubbles:!0,cancelable:!0,composed:!1});this.element.dispatchEvent(p),this.callback&&this.callback(this)}parseDate(e){if(e===void 0)return new Date;if(Array.isArray(e)){let t=e;if(t.length===0)throw new Error("argument Array cannot be empty");if(!t.every(r=>typeof r=="number"))throw new Error("input Array must contain only numbers");return this.parseDateArray(t)}if(typeof e=="object"&&e.constructor.name==="Date")return e;if(typeof e=="string")return this.parseDateString(e);if(typeof e=="number")return new Date(e)}parseDateArray(e){let t=new Date;return t.setFullYear(e[0]||t.getFullYear()),t.setDate(e[2]?e[2]:1),t.setMonth(e[1]?e[1]-1:0),t.setHours(e[3]?e[3]:0),t.setMinutes(e[4]?e[4]:0),t.setSeconds(0),t}parseDateString(e){switch(e){case"now":return new Date;case"max":return new Date(864e13);case"min":return new Date(-864e13);default:let t=Number(e.replace(/y$/,""));if(!isNaN(t))return new Date(Date.now()+31556926*1e3*t);let i=new Date("0001-01-01"),r=Number(e.replace(/bc$/,""));if(!isNaN(r))return new Date(i.getTime()-31556926*1e3*r);let a=Number(e.replace(/ad$/,""));return isNaN(a)?new Date(e):new Date(i.getTime()+31556926*1e3*a)}}parseEvents(e){return Array.isArray(e)?e.reduce((t,i)=>{let r=i.events?[...this.parseEvents(i.events)]:[];if(!i.startdate&&!r.length)return console.warn("Missing startdate on event",i,e),t;let a=i.startdate?this.parseDate(i.startdate):r[0].startdate,n=i.enddate?this.parseDate(i.enddate):i.duration&&!isNaN(Number(i.duration))?new Date(a.getTime()+Number(i.duration)*6e4):r.length?r[r.length-1].enddate:a,s=a.getTime(),m=(n.getTime()-s)/6e4;return t.push(D(b({duration:m},i),{startdate:a,enddate:n,events:r})),t},[]).sort((t,i)=>t.startdate-i.startdate):(console.warn("Events object is not an array",e),[])}parseTimelineHTML(e){let t=[],i=e.querySelectorAll(".timelineEvent");return i&&i.forEach(r=>{try{t.push(D(b({},r.attributes),{events:this.parseTimelineHTML(r)}))}catch(a){console.error(a,"timelineEvent")}}),t}addCSS(e){document.head.appendChild(document.createElement("style")).innerHTML=e}toJSON(){return{options:this.options,startDate:this.startDate,endDate:this.endDate,duration:this.duration,ratio:this.ratio,pivot:this.pivot,getLeftRatio:e=>(e-this.startDate.getTime())/this.duration}}};export{C as Timeline};
